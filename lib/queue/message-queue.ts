import { Redis } from '@upstash/redis';

// Initialize Redis client with environment variables
const redis = new Redis({
  url: process.env.REDIS_URL || process.env.KV_URL || '',
  token: process.env.REDIS_TOKEN || process.env.KV_REST_API_TOKEN || '',
});

export type QueueMessage = {
  id: string;
  type: 'agent_request' | 'agent_response' | 'action_execution' | 'notification';
  payload: Record<string, unknown>;
  priority: 'low' | 'normal' | 'high';
  retries: number;
  maxRetries: number;
  createdAt: string;
  processedAt?: string;
};

const QUEUE_PREFIX = 'agent:queue:';
const STREAM_PREFIX = 'agent:stream:';
const DEFAULT_MAX_RETRIES = 3;

/**
 * Message Queue Service for agent operations
 * Handles async task processing and real-time updates
 */

// Queue operations
export async function enqueueMessage(
  queueName: string,
  message: Omit<QueueMessage, 'id' | 'createdAt'>
): Promise<string> {
  const id = `${queueName}:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
  const queueMessage: QueueMessage = {
    ...message,
    id,
    createdAt: new Date().toISOString(),
  };

  const queueKey = `${QUEUE_PREFIX}${queueName}`;
  
  // Store by priority for efficient retrieval
  const score = message.priority === 'high' ? 1 : message.priority === 'normal' ? 2 : 3;
  await redis.zadd(queueKey, { score, member: JSON.stringify(queueMessage) });

  return id;
}

export async function dequeueMessage(queueName: string): Promise<QueueMessage | null> {
  const queueKey = `${QUEUE_PREFIX}${queueName}`;
  
  // Get highest priority message (lowest score)
  const messages = await redis.zrange(queueKey, 0, 0);
  
  if (messages.length === 0) {
    return null;
  }

  const message = JSON.parse(messages[0] as string) as QueueMessage;
  
  // Remove from queue
  await redis.zrem(queueKey, messages[0] as string);

  return message;
}

export async function getQueueSize(queueName: string): Promise<number> {
  const queueKey = `${QUEUE_PREFIX}${queueName}`;
  return await redis.zcard(queueKey);
}

export async function clearQueue(queueName: string): Promise<void> {
  const queueKey = `${QUEUE_PREFIX}${queueName}`;
  await redis.del(queueKey);
}

// Real-time streaming operations
export async function publishToStream(
  streamName: string,
  data: Record<string, unknown>
): Promise<string> {
  const streamKey = `${STREAM_PREFIX}${streamName}`;
  const messageId = await redis.xadd(streamKey, '*', {
    data: JSON.stringify(data),
    timestamp: new Date().toISOString(),
  });
  
  return messageId as string;
}

export async function subscribeToStream(
  streamName: string,
  lastMessageId: string = '0',
  count: number = 10
) {
  const streamKey = `${STREAM_PREFIX}${streamName}`;
  
  try {
    const messages = await redis.xrange(streamKey, lastMessageId, '+', {
      count,
    });
    
    return messages.map((msg) => ({
      id: msg[0],
      data: JSON.parse((msg[1].data as string) || '{}'),
      timestamp: msg[1].timestamp,
    }));
  } catch (error) {
    console.error(`Error subscribing to stream ${streamName}:`, error);
    return [];
  }
}

// Session management for WebSocket connections
export async function createSession(
  sessionId: string,
  userId: string,
  conversationId: string,
  ttl = 3600 // 1 hour default
): Promise<void> {
  const sessionKey = `session:${sessionId}`;
  await redis.set(
    sessionKey,
    JSON.stringify({
      userId,
      conversationId,
      createdAt: new Date().toISOString(),
    }),
    { ex: ttl }
  );
}

export async function getSession(sessionId: string) {
  const sessionKey = `session:${sessionId}`;
  const data = await redis.get(sessionKey);
  
  if (!data) {
    return null;
  }

  return JSON.parse(data as string);
}

export async function deleteSession(sessionId: string): Promise<void> {
  const sessionKey = `session:${sessionId}`;
  await redis.del(sessionKey);
}

// Presence tracking
export async function setPresence(userId: string, status: 'online' | 'idle' | 'offline') {
  const presenceKey = `presence:${userId}`;
  if (status === 'offline') {
    await redis.del(presenceKey);
  } else {
    await redis.set(presenceKey, status, { ex: 300 }); // 5 minute TTL
  }
}

export async function getPresence(userId: string): Promise<string | null> {
  const presenceKey = `presence:${userId}`;
  const status = await redis.get(presenceKey);
  return status as string | null;
}

// Rate limiting
export async function checkRateLimit(
  identifier: string,
  limit: number,
  window: number // in seconds
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowStart = now - window * 1000;

  // Get current count
  const data = await redis.get(key);
  let count = 0;
  let createdAt = now;

  if (data) {
    const parsed = JSON.parse(data as string);
    createdAt = parsed.createdAt;
    
    // Reset if window has passed
    if (createdAt < windowStart) {
      count = 0;
      createdAt = now;
    } else {
      count = parsed.count;
    }
  }

  const allowed = count < limit;
  
  if (allowed || true) {
    // Always increment (for monitoring)
    await redis.set(key, JSON.stringify({ count: count + 1, createdAt }), {
      ex: window + 1,
    });
  }

  return {
    allowed,
    remaining: Math.max(0, limit - count - 1),
    resetAt: createdAt + window * 1000,
  };
}

export { redis };
