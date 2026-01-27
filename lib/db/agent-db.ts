import { db } from './client';
import type { AgentConversation, AgentMessage, AgentAction, AgentSession, AgentAnalytics } from '@/lib/agents/types';

/**
 * Database service for agent persistence and retrieval
 */

// Conversations
export async function createConversation(userId: string, title: string, agentType: string) {
  const result = await db.query(
    `INSERT INTO agent_conversations (user_id, title, agent_type, status)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, title, agentType, 'active']
  );
  return result.rows[0] as AgentConversation;
}

export async function getConversation(conversationId: string) {
  const result = await db.query(
    `SELECT * FROM agent_conversations WHERE id = $1`,
    [conversationId]
  );
  return result.rows[0] as AgentConversation | undefined;
}

export async function getUserConversations(userId: string, limit = 50) {
  const result = await db.query(
    `SELECT * FROM agent_conversations 
     WHERE user_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows as AgentConversation[];
}

export async function updateConversation(conversationId: string, updates: Partial<AgentConversation>) {
  const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
  const values = [conversationId, ...Object.values(updates)];
  
  const result = await db.query(
    `UPDATE agent_conversations SET ${fields}, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    values
  );
  return result.rows[0] as AgentConversation;
}

// Messages
export async function createMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  metadata?: Record<string, unknown>
) {
  const result = await db.query(
    `INSERT INTO agent_messages (conversation_id, role, content, metadata)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [conversationId, role, content, JSON.stringify(metadata || {})]
  );
  return result.rows[0] as AgentMessage;
}

export async function getConversationMessages(conversationId: string, limit = 100) {
  const result = await db.query(
    `SELECT * FROM agent_messages 
     WHERE conversation_id = $1 
     ORDER BY created_at ASC 
     LIMIT $2`,
    [conversationId, limit]
  );
  return result.rows as AgentMessage[];
}

// Actions
export async function recordAction(
  conversationId: string,
  messageId: string,
  actionType: string,
  toolName: string,
  input: Record<string, unknown>,
  output?: Record<string, unknown>,
  status: 'pending' | 'success' | 'error' = 'pending'
) {
  const result = await db.query(
    `INSERT INTO agent_actions (conversation_id, message_id, action_type, tool_name, input, output, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [conversationId, messageId, actionType, toolName, JSON.stringify(input), JSON.stringify(output || {}), status]
  );
  return result.rows[0] as AgentAction;
}

export async function getActions(conversationId: string) {
  const result = await db.query(
    `SELECT * FROM agent_actions 
     WHERE conversation_id = $1 
     ORDER BY created_at ASC`,
    [conversationId]
  );
  return result.rows as AgentAction[];
}

export async function updateAction(actionId: string, updates: Partial<AgentAction>) {
  const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
  const values = [actionId, ...Object.values(updates)];
  
  const result = await db.query(
    `UPDATE agent_actions SET ${fields}, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    values
  );
  return result.rows[0] as AgentAction;
}

// Sessions
export async function createSession(userId: string, conversationId: string, agentType: string) {
  const result = await db.query(
    `INSERT INTO agent_sessions (user_id, conversation_id, agent_type, status)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, conversationId, agentType, 'active']
  );
  return result.rows[0] as AgentSession;
}

export async function getSession(sessionId: string) {
  const result = await db.query(
    `SELECT * FROM agent_sessions WHERE id = $1`,
    [sessionId]
  );
  return result.rows[0] as AgentSession | undefined;
}

export async function updateSession(sessionId: string, updates: Partial<AgentSession>) {
  const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
  const values = [sessionId, ...Object.values(updates)];
  
  const result = await db.query(
    `UPDATE agent_sessions SET ${fields}, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    values
  );
  return result.rows[0] as AgentSession;
}

// Analytics
export async function recordAnalytics(
  conversationId: string,
  sessionId: string,
  userId: string,
  metrics: Record<string, unknown>
) {
  const result = await db.query(
    `INSERT INTO agent_analytics (conversation_id, session_id, user_id, metrics)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [conversationId, sessionId, userId, JSON.stringify(metrics)]
  );
  return result.rows[0] as AgentAnalytics;
}

export async function getAnalytics(userId?: string, startDate?: Date, endDate?: Date) {
  let query = 'SELECT * FROM agent_analytics WHERE 1=1';
  const params: unknown[] = [];
  let paramCount = 1;

  if (userId) {
    query += ` AND user_id = $${paramCount}`;
    params.push(userId);
    paramCount++;
  }

  if (startDate) {
    query += ` AND created_at >= $${paramCount}`;
    params.push(startDate);
    paramCount++;
  }

  if (endDate) {
    query += ` AND created_at <= $${paramCount}`;
    params.push(endDate);
  }

  query += ' ORDER BY created_at DESC';

  const result = await db.query(query, params);
  return result.rows as AgentAnalytics[];
}

// Batch operations
export async function deleteConversation(conversationId: string) {
  await db.query('DELETE FROM agent_messages WHERE conversation_id = $1', [conversationId]);
  await db.query('DELETE FROM agent_actions WHERE conversation_id = $1', [conversationId]);
  await db.query('DELETE FROM agent_sessions WHERE conversation_id = $1', [conversationId]);
  await db.query('DELETE FROM agent_analytics WHERE conversation_id = $1', [conversationId]);
  await db.query('DELETE FROM agent_conversations WHERE id = $1', [conversationId]);
}
