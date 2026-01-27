/**
 * Agent State Manager
 * Manages agent execution state, reasoning steps, and tool invocations
 */

import { Database } from "@/lib/database";

export interface AgentThought {
  id: string;
  messageId: string;
  stepNumber: number;
  content: string;
  reasoning: string;
  confidence: number;
  timestamp: Date;
}

export interface ToolCall {
  id: string;
  messageId: string;
  toolName: string;
  parameters: Record<string, unknown>;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  result?: ToolResult;
  error?: string;
  executionTime: number;
  timestamp: Date;
}

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
  metadata?: {
    itemCount?: number;
    processingTime?: number;
    sourceConfidence?: number;
  };
}

export interface AgentAction {
  id: string;
  messageId: string;
  type: "recommendation" | "insight" | "suggestion" | "warning";
  description: string;
  data: Record<string, unknown>;
  status: "pending" | "executed" | "failed";
  timestamp: Date;
}

export interface AgentExecutionState {
  sessionId: string;
  messageId: string;
  agentType: string;
  status: "thinking" | "executing" | "completed" | "error";
  thoughts: AgentThought[];
  toolCalls: ToolCall[];
  actions: AgentAction[];
  startTime: Date;
  endTime?: Date;
  totalTokens: number;
  error?: string;
}

export class AgentStateManager {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  /**
   * Initialize a new agent execution
   */
  async initializeExecution(
    sessionId: string,
    messageId: string,
    agentType: string
  ): Promise<AgentExecutionState> {
    const state: AgentExecutionState = {
      sessionId,
      messageId,
      agentType,
      status: "thinking",
      thoughts: [],
      toolCalls: [],
      actions: [],
      startTime: new Date(),
      totalTokens: 0
    };

    // Store initial state
    await this.db.query(
      `INSERT INTO agent_executions (session_id, message_id, agent_type, status, created_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [sessionId, messageId, agentType, state.status, state.startTime]
    );

    return state;
  }

  /**
   * Add a thought to the agent's reasoning chain
   */
  async addThought(
    messageId: string,
    stepNumber: number,
    content: string,
    reasoning: string,
    confidence: number
  ): Promise<AgentThought> {
    const thought: AgentThought = {
      id: `thought_${Date.now()}_${Math.random()}`,
      messageId,
      stepNumber,
      content,
      reasoning,
      confidence,
      timestamp: new Date()
    };

    await this.db.query(
      `INSERT INTO agent_thoughts (id, message_id, step_number, content, reasoning, confidence, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        thought.id,
        messageId,
        stepNumber,
        content,
        reasoning,
        confidence,
        thought.timestamp
      ]
    );

    return thought;
  }

  /**
   * Track a tool invocation
   */
  async logToolCall(
    messageId: string,
    toolName: string,
    parameters: Record<string, unknown>,
    description: string
  ): Promise<ToolCall> {
    const toolCall: ToolCall = {
      id: `tool_${Date.now()}_${Math.random()}`,
      messageId,
      toolName,
      parameters,
      description,
      status: "pending",
      executionTime: 0,
      timestamp: new Date()
    };

    await this.db.query(
      `INSERT INTO tool_invocations (id, message_id, tool_name, parameters, description, status, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        toolCall.id,
        messageId,
        toolName,
        JSON.stringify(parameters),
        description,
        toolCall.status,
        toolCall.timestamp
      ]
    );

    return toolCall;
  }

  /**
   * Update tool execution result
   */
  async updateToolResult(
    toolCallId: string,
    result: ToolResult,
    executionTime: number
  ): Promise<void> {
    await this.db.query(
      `UPDATE tool_invocations 
       SET status = $1, result = $2, execution_time_ms = $3
       WHERE id = $4`,
      [
        result.success ? "completed" : "failed",
        JSON.stringify(result),
        executionTime,
        toolCallId
      ]
    );
  }

  /**
   * Record an agent action
   */
  async recordAction(
    messageId: string,
    type: AgentAction["type"],
    description: string,
    data: Record<string, unknown>
  ): Promise<AgentAction> {
    const action: AgentAction = {
      id: `action_${Date.now()}_${Math.random()}`,
      messageId,
      type,
      description,
      data,
      status: "pending",
      timestamp: new Date()
    };

    await this.db.query(
      `INSERT INTO agent_actions (id, message_id, action_type, description, data, status, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        action.id,
        messageId,
        type,
        description,
        JSON.stringify(data),
        action.status,
        action.timestamp
      ]
    );

    return action;
  }

  /**
   * Finalize agent execution
   */
  async finalizeExecution(
    messageId: string,
    status: "completed" | "error",
    totalTokens: number,
    error?: string
  ): Promise<void> {
    const endTime = new Date();

    await this.db.query(
      `UPDATE agent_executions 
       SET status = $1, end_time = $2, total_tokens = $3, error_message = $4
       WHERE message_id = $5`,
      [status, endTime, totalTokens, error || null, messageId]
    );

    // Calculate and store performance metrics
    if (status === "completed") {
      await this.recordPerformanceMetrics(messageId, totalTokens);
    }
  }

  /**
   * Get execution history for a session
   */
  async getExecutionHistory(
    sessionId: string,
    limit: number = 50
  ): Promise<AgentExecutionState[]> {
    const executions = await this.db.query(
      `SELECT * FROM agent_executions 
       WHERE session_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [sessionId, limit]
    );

    // Enrich with thoughts, tools, and actions
    const enriched: AgentExecutionState[] = [];
    for (const exec of executions) {
      const thoughts = await this.db.query(
        `SELECT * FROM agent_thoughts WHERE message_id = $1 ORDER BY step_number`,
        [exec.message_id]
      );

      const toolCalls = await this.db.query(
        `SELECT * FROM tool_invocations WHERE message_id = $1 ORDER BY timestamp`,
        [exec.message_id]
      );

      const actions = await this.db.query(
        `SELECT * FROM agent_actions WHERE message_id = $1 ORDER BY timestamp`,
        [exec.message_id]
      );

      enriched.push({
        sessionId: exec.session_id,
        messageId: exec.message_id,
        agentType: exec.agent_type,
        status: exec.status as AgentExecutionState["status"],
        thoughts: thoughts.rows || [],
        toolCalls: toolCalls.rows || [],
        actions: actions.rows || [],
        startTime: new Date(exec.created_at),
        endTime: exec.end_time ? new Date(exec.end_time) : undefined,
        totalTokens: exec.total_tokens || 0,
        error: exec.error_message
      });
    }

    return enriched;
  }

  /**
   * Get detailed execution trace
   */
  async getExecutionTrace(messageId: string): Promise<AgentExecutionState | null> {
    const execution = await this.db.query(
      `SELECT * FROM agent_executions WHERE message_id = $1`,
      [messageId]
    );

    if (execution.rows.length === 0) return null;

    const exec = execution.rows[0];

    const thoughts = await this.db.query(
      `SELECT * FROM agent_thoughts WHERE message_id = $1 ORDER BY step_number`,
      [messageId]
    );

    const toolCalls = await this.db.query(
      `SELECT * FROM tool_invocations WHERE message_id = $1 ORDER BY timestamp`,
      [messageId]
    );

    const actions = await this.db.query(
      `SELECT * FROM agent_actions WHERE message_id = $1 ORDER BY timestamp`,
      [messageId]
    );

    return {
      sessionId: exec.session_id,
      messageId: exec.message_id,
      agentType: exec.agent_type,
      status: exec.status as AgentExecutionState["status"],
      thoughts: thoughts.rows || [],
      toolCalls: toolCalls.rows || [],
      actions: actions.rows || [],
      startTime: new Date(exec.created_at),
      endTime: exec.end_time ? new Date(exec.end_time) : undefined,
      totalTokens: exec.total_tokens || 0,
      error: exec.error_message
    };
  }

  /**
   * Record performance metrics
   */
  private async recordPerformanceMetrics(
    messageId: string,
    totalTokens: number
  ): Promise<void> {
    const execution = await this.db.query(
      `SELECT session_id, created_at, end_time FROM agent_executions WHERE message_id = $1`,
      [messageId]
    );

    if (execution.rows.length === 0) return;

    const exec = execution.rows[0];
    const responseTime =
      new Date(exec.end_time).getTime() - new Date(exec.created_at).getTime();

    await this.db.query(
      `INSERT INTO agent_performance_metrics (session_id, message_id, response_time_ms, tokens_used, timestamp)
       VALUES ($1, $2, $3, $4, $5)`,
      [exec.session_id, messageId, responseTime, totalTokens, new Date()]
    );
  }

  /**
   * Get session statistics
   */
  async getSessionStats(sessionId: string) {
    const result = await this.db.query(
      `SELECT 
         COUNT(*) as total_messages,
         AVG(response_time_ms) as avg_response_time,
         MAX(response_time_ms) as max_response_time,
         SUM(tokens_used) as total_tokens,
         COUNT(DISTINCT agent_type) as agent_count
       FROM agent_performance_metrics apm
       JOIN agent_executions ae ON apm.message_id = ae.message_id
       WHERE ae.session_id = $1`,
      [sessionId]
    );

    return result.rows[0] || null;
  }
}

// Export singleton instance
export const agentStateManager = new AgentStateManager();
