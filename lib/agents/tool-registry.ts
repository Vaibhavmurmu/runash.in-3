/**
 * Tool Registry
 * Manages all available tools and their assignments to agents
 */

import { z } from "zod";
import { Database } from "@/lib/database";
import type { AgentType } from "./agent-config";

export interface ToolMetadata {
  name: string;
  description: string;
  category: string;
  version: string;
  schema: z.ZodSchema;
  costEstimate: number;
  timeoutMs: number;
  cacheable: boolean;
  requiresAuth: boolean;
}

export interface ToolDefinition {
  tool: {
    execute: (params: unknown) => Promise<{ success: boolean; data?: unknown; error?: string }>;
  };
  metadata: ToolMetadata;
}

export class ToolRegistry {
  private db: Database;
  private tools: Map<string, ToolDefinition> = new Map();
  private agentToolAssignments: Map<AgentType, string[]> = new Map();

  constructor() {
    this.db = new Database();
    this.initializeTools();
  }

  /**
   * Initialize all available tools
   */
  private initializeTools(): void {
    // Product Search Tool
    this.registerTool("searchProducts", {
      tool: {
        execute: async (params: unknown) => {
          const { query, filters, limit } = params as {
            query: string;
            filters?: Record<string, unknown>;
            limit?: number;
          };

          try {
            const products = await this.db.query(
              `SELECT id, name, price, sustainability_score, organic, certifications
               FROM products
               WHERE LOWER(name) LIKE LOWER($1)
               LIMIT $2`,
              [`%${query}%`, limit || 10]
            );

            return {
              success: true,
              data: products.rows || []
            };
          } catch (error) {
            return {
              success: false,
              error: error instanceof Error ? error.message : "Unknown error"
            };
          }
        }
      },
      metadata: {
        name: "searchProducts",
        description: "Search for products in the catalog with optional filters",
        category: "product",
        version: "1.0.0",
        schema: z.object({
          query: z.string().describe("Search query for products"),
          filters: z
            .object({
              priceMin: z.number().optional(),
              priceMax: z.number().optional(),
              organicOnly: z.boolean().optional(),
              minSustainabilityScore: z.number().optional()
            })
            .optional(),
          limit: z.number().max(50).default(10)
        }),
        costEstimate: 0.001,
        timeoutMs: 5000,
        cacheable: true,
        requiresAuth: true
      }
    });

    // Sustainability Calculator Tool
    this.registerTool("calculateSustainability", {
      tool: {
        execute: async (params: unknown) => {
          const { productIds, transportMethod, quantity } = params as {
            productIds: string[];
            transportMethod: string;
            quantity: number;
          };

          try {
            // Fetch product sustainability data
            const products = await this.db.query(
              `SELECT id, carbon_footprint, water_usage, waste_produced
               FROM products
               WHERE id = ANY($1)`,
              [productIds]
            );

            // Calculate totals
            let totalCarbon = 0;
            let totalWater = 0;
            let totalWaste = 0;

            const rows = products.rows || [];
            for (const product of rows) {
              totalCarbon += (product.carbon_footprint || 0) * quantity;
              totalWater += (product.water_usage || 0) * quantity;
              totalWaste += (product.waste_produced || 0) * quantity;
            }

            // Add transport emissions
            const transportEmissions = this.calculateTransportEmissions(
              transportMethod,
              quantity
            );

            return {
              success: true,
              data: {
                productCarbon: totalCarbon,
                productWater: totalWater,
                productWaste: totalWaste,
                transportEmissions,
                totalCarbon: totalCarbon + transportEmissions,
                carbonOffset: this.calculateOffsetOptions(totalCarbon + transportEmissions)
              }
            };
          } catch (error) {
            return {
              success: false,
              error: error instanceof Error ? error.message : "Unknown error"
            };
          }
        }
      },
      metadata: {
        name: "calculateSustainability",
        description: "Calculate carbon footprint and environmental impact",
        category: "sustainability",
        version: "1.0.0",
        schema: z.object({
          productIds: z.array(z.string()),
          transportMethod: z
            .enum(["shipping", "local", "carbon-neutral"])
            .default("shipping"),
          quantity: z.number().positive()
        }),
        costEstimate: 0.002,
        timeoutMs: 3000,
        cacheable: true,
        requiresAuth: true
      }
    });

    // Generate Recipe Tool
    this.registerTool("generateRecipe", {
      tool: {
        execute: async (params: unknown) => {
          const { ingredients, dietaryRestrictions, cookingTime } = params as {
            ingredients: string[];
            dietaryRestrictions?: string[];
            cookingTime?: number;
          };

          try {
            const recipes = await this.db.query(
              `SELECT * FROM recipes
               WHERE (ingredients && $1)
               AND cooking_time <= $2
               LIMIT 5`,
              [ingredients, cookingTime || 60]
            );

            return {
              success: true,
              data: recipes.rows || []
            };
          } catch (error) {
            return {
              success: false,
              error: error instanceof Error ? error.message : "Unknown error"
            };
          }
        }
      },
      metadata: {
        name: "generateRecipe",
        description: "Generate or retrieve recipes based on ingredients",
        category: "recipe",
        version: "1.0.0",
        schema: z.object({
          ingredients: z.array(z.string()),
          dietaryRestrictions: z.array(z.string()).optional(),
          cookingTime: z.number().optional()
        }),
        costEstimate: 0.001,
        timeoutMs: 5000,
        cacheable: true,
        requiresAuth: true
      }
    });

    // Check Inventory Tool
    this.registerTool("checkInventory", {
      tool: {
        execute: async (params: unknown) => {
          const { productId } = params as { productId: string };

          try {
            const inventory = await this.db.query(
              `SELECT id, product_id, quantity, last_updated
               FROM inventory
               WHERE product_id = $1`,
              [productId]
            );

            const row = (inventory.rows || [])[0];
            return {
              success: true,
              data: {
                productId,
                inStock: row && row.quantity > 0,
                quantity: row?.quantity || 0,
                lastUpdated: row?.last_updated
              }
            };
          } catch (error) {
            return {
              success: false,
              error: error instanceof Error ? error.message : "Unknown error"
            };
          }
        }
      },
      metadata: {
        name: "checkInventory",
        description: "Check product availability and inventory levels",
        category: "product",
        version: "1.0.0",
        schema: z.object({
          productId: z.string()
        }),
        costEstimate: 0.0005,
        timeoutMs: 2000,
        cacheable: true,
        requiresAuth: true
      }
    });

    // Set tool assignments to agents
    this.assignToolsToAgent("product", [
      "searchProducts",
      "calculateSustainability",
      "checkInventory"
    ]);
    this.assignToolsToAgent("sustainability", ["calculateSustainability"]);
    this.assignToolsToAgent("recipe", ["generateRecipe", "calculateSustainability"]);
    this.assignToolsToAgent("automation", [
      "searchProducts",
      "checkInventory",
      "calculateSustainability"
    ]);
  }

  /**
   * Register a new tool
   */
  private registerTool(name: string, definition: ToolDefinition): void {
    this.tools.set(name, definition);
  }

  /**
   * Assign tools to an agent
   */
  private assignToolsToAgent(agentType: AgentType, toolNames: string[]): void {
    this.agentToolAssignments.set(agentType, toolNames);
  }

  /**
   * Get tools available to an agent
   */
  async getAgentTools(agentType: AgentType): Promise<ToolDefinition[]> {
    const toolNames = this.agentToolAssignments.get(agentType) || [];
    return toolNames
      .map((name) => this.tools.get(name))
      .filter((tool): tool is ToolDefinition => tool !== undefined);
  }

  /**
   * Get a specific tool
   */
  getTool(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  /**
   * Get all available tools
   */
  getAllTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  /**
   * Calculate transport emissions based on method
   */
  private calculateTransportEmissions(method: string, quantity: number): number {
    const emissionsPerUnit: Record<string, number> = {
      shipping: 0.5, // kg CO2 per unit
      local: 0.1,
      "carbon-neutral": 0
    };

    return (emissionsPerUnit[method] || 0.5) * quantity;
  }

  /**
   * Calculate offset options
   */
  private calculateOffsetOptions(carbonKg: number): Array<{ method: string; cost: number }> {
    return [
      { method: "Tree planting", cost: carbonKg * 0.1 },
      { method: "Renewable energy credits", cost: carbonKg * 0.15 },
      { method: "Carbon sequestration", cost: carbonKg * 0.2 }
    ];
  }
}

// Export singleton instance
export const toolRegistry = new ToolRegistry();
