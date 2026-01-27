import { publishToStream, subscribeToStream, createSession, deleteSession, getSession } from '@/lib/queue/message-queue';

export type WebSocketMessage = {
  type: 'subscribe' | 'unsubscribe' | 'message' | 'ping' | 'auth' | 'action';
  channel?: string;
  payload?: Record<string, unknown>;
  sessionId?: string;
  timestamp?: string;
};

export type StreamEvent = {
  type: 'agent_thinking' | 'agent_action' | 'agent_response' | 'error' | 'status' | 'completion';
  conversationId: string;
  data: Record<string, unknown>;
  timestamp: string;
};

/**
 * WebSocket handler for real-time agent streaming
 * Manages connections, subscriptions, and message delivery
 */

// Active connections tracking
const connections = new Map<string, { userId: string; conversationId: string; channels: Set<string> }>();

export async function handleConnection(
  sessionId: string,
  userId: string,
  conversationId: string
): Promise<boolean> {
  try {
    await createSession(sessionId, userId, conversationId);
    connections.set(sessionId, {
      userId,
      conversationId,
      channels: new Set(),
    });
    return true;
  } catch (error) {
    console.error('Failed to handle connection:', error);
    return false;
  }
}

export async function handleDisconnection(sessionId: string): Promise<void> {
  try {
    connections.delete(sessionId);
    await deleteSession(sessionId);
  } catch (error) {
    console.error('Failed to handle disconnection:', error);
  }
}

export async function handleMessage(
  sessionId: string,
  message: WebSocketMessage
): Promise<WebSocketMessage | null> {
  const session = connections.get(sessionId);
  if (!session) {
    return {
      type: 'error',
      payload: { message: 'Session not found' },
      timestamp: new Date().toISOString(),
    };
  }

  switch (message.type) {
    case 'subscribe':
      return handleSubscribe(sessionId, message);
    case 'unsubscribe':
      return handleUnsubscribe(sessionId, message);
    case 'ping':
      return { type: 'ping', timestamp: new Date().toISOString() };
    case 'action':
      return handleAction(sessionId, message);
    default:
      return null;
  }
}

async function handleSubscribe(
  sessionId: string,
  message: WebSocketMessage
): Promise<WebSocketMessage | null> {
  const session = connections.get(sessionId);
  if (!session || !message.channel) {
    return null;
  }

  session.channels.add(message.channel);
  return {
    type: 'subscribe',
    channel: message.channel,
    payload: { status: 'subscribed' },
    timestamp: new Date().toISOString(),
  };
}

async function handleUnsubscribe(
  sessionId: string,
  message: WebSocketMessage
): Promise<WebSocketMessage | null> {
  const session = connections.get(sessionId);
  if (!session || !message.channel) {
    return null;
  }

  session.channels.delete(message.channel);
  return {
    type: 'unsubscribe',
    channel: message.channel,
    payload: { status: 'unsubscribed' },
    timestamp: new Date().toISOString(),
  };
}

async function handleAction(
  sessionId: string,
  message: WebSocketMessage
): Promise<WebSocketMessage | null> {
  const session = connections.get(sessionId);
  if (!session || !message.payload) {
    return null;
  }

  // Publish action to stream for processing
  try {
    const streamId = await publishToStream(
      `conversation:${session.conversationId}`,
      {
        type: 'user_action',
        action: message.payload,
        userId: session.userId,
        timestamp: new Date().toISOString(),
      }
    );

    return {
      type: 'action',
      payload: { status: 'received', streamId },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to handle action:', error);
    return {
      type: 'error',
      payload: { message: 'Failed to process action' },
      timestamp: new Date().toISOString(),
    };
  }
}

export async function broadcastToChannel(
  channel: string,
  event: StreamEvent
): Promise<void> {
  await publishToStream(channel, {
    ...event,
    timestamp: new Date().toISOString(),
  });
}

export async function broadcastToUser(
  userId: string,
  event: StreamEvent
): Promise<void> {
  const channel = `user:${userId}`;
  await broadcastToChannel(channel, event);
}

export async function broadcastToConversation(
  conversationId: string,
  event: Omit<StreamEvent, 'conversationId'>
): Promise<void> {
  const channel = `conversation:${conversationId}`;
  await broadcastToChannel(channel, {
    ...event,
    conversationId,
  });
}

export async function getStreamEvents(
  conversationId: string,
  fromId: string = '0',
  limit: number = 50
) {
  const channel = `conversation:${conversationId}`;
  const events = await subscribeToStream(channel, fromId, limit);
  return events;
}

export function getActiveConnections(): number {
  return connections.size;
}

export function getConnectionsByConversation(conversationId: string): string[] {
  const sessionIds: string[] = [];
  connections.forEach((session, sessionId) => {
    if (session.conversationId === conversationId) {
      sessionIds.push(sessionId);
    }
  });
  return sessionIds;
}

export function getConnectionsByUser(userId: string): string[] {
  const sessionIds: string[] = [];
  connections.forEach((session, sessionId) => {
    if (session.userId === userId) {
      sessionIds.push(sessionId);
    }
  });
  return sessionIds;
}
