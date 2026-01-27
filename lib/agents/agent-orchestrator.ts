import type { CoreMessage, ToolResultBlockParam } from "ai";
import { streamText, tool, type StreamTextOptions } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { agentConfigs } from "./agent-config";
import { AgentStateManager } from "./agent-state-manager";
import type { AgentContext, AgentTool } from "./types";

export interface AgentOrchestrationOptions {
  userId: string;
  agentId: string;
  context: AgentContext;
  messages: CoreMessage[];
  preferences?: Record<string, unknown>;
}

export class AgentOrchestrator {
  private stateManager: AgentStateManager;
  private toolRegistry: Map<string, AgentTool>;

  constructor() {
    this.stateManager = new AgentStateManager();
    this.toolRegistry = new Map();
    this.initializeTools();
  }

  private initializeTools() {
    // Product search tool
    this.registerTool("searchProducts", {
      description: "Search for products in the catalog",
      parameters: z.object({
        query: z.string().describe("Search query for products"),
        limit: z.number().optional().default(10),
        filters: z.record(z.string()).optional(),
      }),
      execute: async (params) => this.executeProductSearch(params),
    });

    // Recommendations tool
    this.registerTool("getRecommendations", {
      description: "Get personalized recommendations based on user preferences",
      parameters: z.object({
        category: z.string().describe("Product category"),
        userPreferences: z.record(z.string()).optional(),
      }),
      execute: async (params) => this.executeRecommendations(params),
    });

    // Analytics tool
    this.registerTool("getAnalytics", {
      description: "Retrieve analytics and insights",
      parameters: z.object({
        metric: z.string().describe("The metric to retrieve"),
        timeRange: z.enum(["24h", "7d", "30d", "90d"]).optional().default("7d"),
      }),
      execute: async (params) => this.executeAnalytics(params),
    });

    // Action execution tool
    this.registerTool("executeAction", {
      description: "Execute an action or perform a task",
      parameters: z.object({
        actionType: z.string().describe("Type of action to execute"),
        actionData: z.record(z.unknown()).describe("Data for the action"),
      }),
      execute: async (params) => this.executeAction(params),
    });

    // Query knowledge base
    this.registerTool("queryKnowledgeBase", {
      description: "Query the knowledge base for information",
      parameters: z.object({
        query: z.string().describe("The query to search"),
        category: z.string().optional().describe("Knowledge category"),
      }),
      execute: async (params) => this.queryKnowledgeBase(params),
    });
  }

  private registerTool(name: string, tool: AgentTool) {
    this.toolRegistry.set(name, tool);
  }

  async orchestrate(
    options: AgentOrchestrationOptions
  ): Promise<AsyncIterable<string>> {
    const { userId, agentId, context, messages, preferences } = options;

    // Initialize agent state
    await this.stateManager.initializeAgent(agentId, {
      userId,
      context,
      preferences: preferences || {},
      createdAt: new Date(),
    });

    const agentConfig = agentConfigs[context];
    if (!agentConfig) {
      throw new Error(`Unknown agent context: ${context}`);
    }

    const systemPrompt = this.buildSystemPrompt(agentConfig, context);
    const tools = this.buildToolsMap(context);

    const streamOptions: StreamTextOptions = {
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
      tools,
      temperature: agentConfig.temperature,
      maxTokens: agentConfig.maxTokens,
      topP: 0.9,
      frequencyPenalty: 0,
      presencePenalty: 0,
    };

    const result = await streamText(streamOptions);

    // Track agent execution
    await this.stateManager.logExecution(agentId, {
      tokensUsed: 0,
      toolsCalled: [],
      completedAt: new Date(),
    });

    return result.toTextStreamResponse().body as AsyncIterable<string>;
  }

  private buildSystemPrompt(
    config: (typeof agentConfigs)[keyof typeof agentConfigs],
    context: AgentContext
  ): string {
    let prompt = config.systemPrompt;

    if (config.capabilities && config.capabilities.length > 0) {
      prompt += "\n\nCapabilities:\n";
      prompt += config.capabilities.map((cap) => `- ${cap}`).join("\n");
    }

    if (config.constraints && config.constraints.length > 0) {
      prompt += "\n\nConstraints:\n";
      prompt += config.constraints.map((constraint) => `- ${constraint}`).join("\n");
    }

    return prompt;
  }

  private buildToolsMap(context: AgentContext) {
    const toolsMap: Record<string, ReturnType<typeof tool>> = {};
    const contextTools = this.getContextTools(context);

    for (const toolName of contextTools) {
      const agentTool = this.toolRegistry.get(toolName);
      if (agentTool) {
        toolsMap[toolName] = tool({
          description: agentTool.description,
          parameters: agentTool.parameters,
          execute: agentTool.execute,
        });
      }
    }

    return toolsMap;
  }

  private getContextTools(context: AgentContext): string[] {
    const contextToolMap: Record<AgentContext, string[]> = {
      grocery: [
        "searchProducts",
        "getRecommendations",
        "queryKnowledgeBase",
        "executeAction",
      ],
      streaming: [
        "getAnalytics",
        "executeAction",
        "queryKnowledgeBase",
        "getRecommendations",
      ],
      commerce: [
        "searchProducts",
        "getRecommendations",
        "getAnalytics",
        "executeAction",
      ],
      support: ["queryKnowledgeBase", "executeAction", "getRecommendations"],
      general: [
        "queryKnowledgeBase",
        "getRecommendations",
        "executeAction",
        "getAnalytics",
      ],
    };

    return contextToolMap[context] || contextToolMap.general;
  }

  private async executeProductSearch(params: {
    query: string;
    limit?: number;
    filters?: Record<string, string>;
  }) {
    // Implement actual product search logic
    return {
      results: [],
      total: 0,
      query: params.query,
    };
  }

  private async executeRecommendations(params: {
    category: string;
    userPreferences?: Record<string, string>;
  }) {
    // Implement recommendation logic
    return {
      recommendations: [],
      score: 0,
      category: params.category,
    };
  }

  private async executeAnalytics(params: {
    metric: string;
    timeRange?: "24h" | "7d" | "30d" | "90d";
  }) {
    // Implement analytics retrieval
    return {
      metric: params.metric,
      data: [],
      timeRange: params.timeRange,
    };
  }

  private async executeAction(params: {
    actionType: string;
    actionData: Record<string, unknown>;
  }) {
    // Implement action execution
    return {
      success: true,
      actionType: params.actionType,
      result: {},
    };
  }

  private async queryKnowledgeBase(params: {
    query: string;
    category?: string;
  }) {
    // Implement knowledge base query
    return {
      results: [],
      query: params.query,
      category: params.category,
    };
  }

  async getAgentState(agentId: string) {
    return this.stateManager.getAgentState(agentId);
  }

  async updateAgentState(agentId: string, updates: Record<string, unknown>) {
    return this.stateManager.updateAgentState(agentId, updates);
  }
}

// Export singleton instance
export const agentOrchestrator = new AgentOrchestrator();
