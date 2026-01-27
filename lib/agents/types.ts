import type { z } from "zod";

export type AgentContext =
  | "grocery"
  | "streaming"
  | "commerce"
  | "support"
  | "general";

export interface AgentTool {
  description: string;
  parameters: z.ZodSchema;
  execute: (params: Record<string, unknown>) => Promise<unknown>;
}

export interface AgentState {
  agentId: string;
  userId: string;
  context: AgentContext;
  preferences: Record<string, unknown>;
  createdAt: Date;
  lastUpdated?: Date;
  metadata?: Record<string, unknown>;
}

export interface AgentExecution {
  executionId: string;
  agentId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  tokensUsed: number;
  toolsCalled: string[];
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  status: "pending" | "completed" | "failed";
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentConfig {
  name: string;
  description: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  capabilities: string[];
  constraints: string[];
  responseFormat?: "text" | "json" | "structured";
  retryPolicy?: {
    maxRetries: number;
    backoffMultiplier: number;
    initialDelayMs: number;
  };
}

export interface StreamingOptions {
  enableStreaming: boolean;
  streamChunkSize?: number;
  streamTimeout?: number;
}

export interface ToolExecutionContext {
  agentId: string;
  userId: string;
  context: AgentContext;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp: Date;
  metadata?: {
    toolsCalled?: string[];
    tokensUsed?: number;
    executionTime?: number;
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  agentId: string;
  context: AgentContext;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}
