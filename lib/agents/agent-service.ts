/**
 * Agent Service
 * Core service for executing agentic workflows with tool orchestration
 */

import { openai } from "@ai-sdk/openai";
import { streamText, tool, LanguageModel } from "ai";
import { z } from "zod";
import { agentStateManager } from "./agent-state-manager";
import { getAgentConfig, type AgentType } from "./agent-config";
import { ToolRegistry } from "./tool-registry";
import type { AgentContext } from "@/types/runash-chat";

export interface AgentStreamChunk {
  type:
    | "thinking"
    | "tool_call"
    | "tool_result"
    | "text"
    | "complete"
    | "error";
  content: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export interface AgentExecutionMetrics {
  startTime: Date;
  endTime: Date;
  responseTime: number;
  tokensUsed: number;
  toolsUsed: number;
  toolFailures: number;
  confidence: number;
}

export class AgentService {
  private toolRegistry: ToolRegistry;
  private model: LanguageModel;

  constructor() {
    this.toolRegistry = new ToolRegistry();
    this.model = openai("gpt-4-turbo");
  }

  /**
   * Execute agent with streaming responses
   */
  async executeAgentStream(
    agentType: AgentType,
    messages: Array<{ role: string; content: string }>,
    context: AgentContext,
    sessionId: string
  ): Promise<AsyncIterable<AgentStreamChunk>> {
    const config = getAgentConfig(agentType);
    const messageId = `msg_${Date.now()}_${Math.random()}`;

    // Initialize execution state
    await agentStateManager.initializeExecution(sessionId, messageId, agentType);

    // Get tools for this agent
    const tools = await this.toolRegistry.getAgentTools(agentType);

    // Build tool definitions for the model
    const toolDefinitions = Object.fromEntries(
      tools.map(({ tool: toolDef, metadata }) => [
        metadata.name,
        {
          description: metadata.description,
          parameters: metadata.schema,
          execute: async (params: unknown) => {
            const toolCall = await agentStateManager.logToolCall(
              messageId,
              metadata.name,
              params as Record<string, unknown>,
              metadata.description
            );

            const startTime = Date.now();
            try {
              const result = await toolDef.execute(params);
              const executionTime = Date.now() - startTime;

              await agentStateManager.updateToolResult(
                toolCall.id,
                result,
                executionTime
              );

              return result;
            } catch (error) {
              const executionTime = Date.now() - startTime;

              await agentStateManager.updateToolResult(
                toolCall.id,
                {
                  success: false,
                  error: error instanceof Error ? error.message : String(error)
                },
                executionTime
              );

              throw error;
            }
          }
        }
      ])
    );

    // Create streaming response generator
    async function* generateStream() {
      let totalTokens = 0;
      let toolCount = 0;

      try {
        // Stream the response
        const stream = await streamText({
          model: this.model,
          system: config.systemPrompt,
          messages: messages.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content
          })),
          tools: toolDefinitions,
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          onStepFinish: async ({ usage }) => {
            totalTokens = usage.totalTokens || 0;
          }
        });

        // Handle text generation
        for await (const chunk of stream.textStream) {
          yield {
            type: "text" as const,
            content: chunk,
            timestamp: new Date()
          };
        }

        // Handle tool calls and results
        for await (const event of stream) {
          if (event.type === "step-finish" && event.stepResult?.toolUseBlocks) {
            toolCount += event.stepResult.toolUseBlocks.length;
          }
        }

        // Finalize execution
        await agentStateManager.finalizeExecution(
          messageId,
          "completed",
          totalTokens
        );

        yield {
          type: "complete" as const,
          content: "Agent execution completed",
          metadata: {
            messageId,
            tokensUsed: totalTokens,
            toolsUsed: toolCount
          },
          timestamp: new Date()
        };
      } catch (error) {
        await agentStateManager.finalizeExecution(
          messageId,
          "error",
          totalTokens,
          error instanceof Error ? error.message : String(error)
        );

        yield {
          type: "error" as const,
          content:
            error instanceof Error ? error.message : "Unknown error occurred",
          timestamp: new Date()
        };
      }
    }

    return generateStream.call(this);
  }

  /**
   * Execute agent without streaming (for non-realtime use cases)
   */
  async executeAgent(
    agentType: AgentType,
    messages: Array<{ role: string; content: string }>,
    context: AgentContext,
    sessionId: string
  ): Promise<{
    response: string;
    metrics: AgentExecutionMetrics;
    thoughts: string[];
    actions: Array<{ type: string; description: string }>;
  }> {
    const config = getAgentConfig(agentType);
    const messageId = `msg_${Date.now()}_${Math.random()}`;
    const startTime = new Date();

    // Initialize execution state
    await agentStateManager.initializeExecution(sessionId, messageId, agentType);

    // Get tools for this agent
    const tools = await this.toolRegistry.getAgentTools(agentType);

    // Build tool definitions for the model
    const toolDefinitions = Object.fromEntries(
      tools.map(({ tool: toolDef, metadata }) => [
        metadata.name,
        {
          description: metadata.description,
          parameters: metadata.schema
        }
      ])
    );

    try {
      const result = await streamText({
        model: this.model,
        system: config.systemPrompt,
        messages: messages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content
        })),
        tools: toolDefinitions,
        temperature: config.temperature,
        maxTokens: config.maxTokens
      });

      const responseText = await result.text;
      const endTime = new Date();

      // Finalize execution
      await agentStateManager.finalizeExecution(
        messageId,
        "completed",
        result.usage.totalTokens || 0
      );

      return {
        response: responseText,
        metrics: {
          startTime,
          endTime,
          responseTime: endTime.getTime() - startTime.getTime(),
          tokensUsed: result.usage.totalTokens || 0,
          toolsUsed: 0,
          toolFailures: 0,
          confidence: 0.85
        },
        thoughts: [],
        actions: []
      };
    } catch (error) {
      const endTime = new Date();

      await agentStateManager.finalizeExecution(
        messageId,
        "error",
        0,
        error instanceof Error ? error.message : String(error)
      );

      throw error;
    }
  }

  /**
   * Validate agent request
   */
  validateRequest(agentType: string, messages: unknown[]): boolean {
    // Check if agent type is valid
    const validTypes: AgentType[] = [
      "product",
      "sustainability",
      "recipe",
      "automation"
    ];
    if (!validTypes.includes(agentType as AgentType)) {
      return false;
    }

    // Check if messages is array
    if (!Array.isArray(messages)) {
      return false;
    }

    // Check if messages have required fields
    return messages.every(
      (msg) =>
        typeof msg === "object" &&
        msg !== null &&
        "role" in msg &&
        "content" in msg &&
        typeof (msg as Record<string, unknown>).role === "string" &&
        typeof (msg as Record<string, unknown>).content === "string"
    );
  }

  /**
   * Get agent capabilities
   */
  getAgentCapabilities(agentType: AgentType) {
    const config = getAgentConfig(agentType);
    return {
      name: config.name,
      description: config.description,
      tools: config.tools,
      capabilities: config.capabilities,
      reasoningStyle: config.reasoningStyle
    };
  }

  /**
   * Get execution trace for debugging
   */
  async getExecutionTrace(messageId: string) {
    return agentStateManager.getExecutionTrace(messageId);
  }

  /**
   * Get session statistics
   */
  async getSessionStats(sessionId: string) {
    return agentStateManager.getSessionStats(sessionId);
  }
}

// Export singleton instance
export const agentService = new AgentService();
