import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { DatabaseService } from "@/lib/database"
import { authOptions } from "@/lib/auth"
import { openai } from "@ai-sdk/openai"
import { streamText, tool } from "ai"
import { z } from "zod"

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { messages, context, preferences } = await request.json()

    let systemPrompt = `You are RunAsh AI, an advanced agentic assistant for the RunAsh platform. 
    Your goal is to be proactive and helpful. 
    Always think through your reasoning before responding.
    Use tools to provide accurate, data-driven answers.
    Prioritize sustainability and health in your recommendations.`

    if (context === "grocery") {
      systemPrompt += ` You are a grocery expert. Help users find organic products, recipes, and sustainability tips. Use the available tools to search the product catalog and retrieve environmental data.`
    } else if (context === "streaming") {
      systemPrompt += ` You specialize in helping users with live streaming setup, technical issues, content creation tips, and platform features. You can assist with streaming software, hardware recommendations, and audience engagement strategies.`
    }

    const result = streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 1500,
      tools: {
        searchProducts: tool({
          description: "Search for grocery products in the catalog",
          parameters: z.object({
            query: z.string().describe("The search query for products"),
            limit: z.number().optional().default(5),
          }),
          execute: async ({ query, limit }) => {
            const products = await DatabaseService.searchProducts(query, limit)
            return products
          },
        }),
        getRecipes: tool({
          description: "Generate or retrieve recipes based on ingredients or dietary needs",
          parameters: z.object({
            query: z.string().describe("The type of recipe or ingredients"),
            dietaryRestrictions: z.array(z.string()).optional(),
          }),
          execute: async ({ query, dietaryRestrictions }) => {
            // Simulated recipe generation for now
            return [
              {
                id: "r1",
                name: `Sustainable ${query}`,
                description: `A delicious and eco-friendly ${query} recipe.`,
                difficulty: "medium",
                prepTime: 15,
                cookTime: 20,
                servings: 4,
                ingredients: [],
                instructions: [],
                image: "/placeholder.svg",
                tags: ["sustainable", "healthy"],
                sustainabilityScore: 9,
                nutritionalInfo: { calories: 350, protein: 15, carbs: 40, fat: 12, fiber: 8, sugar: 5, sodium: 300 },
              },
            ]
          },
        }),
        getSustainabilityAudit: tool({
          description: "Perform a sustainability audit on a list of items or a category",
          parameters: z.object({
            category: z.string().describe("The category to audit"),
          }),
          execute: async ({ category }) => {
            const tips = await DatabaseService.getSustainabilityTips(category)
            return {
              score: 8.5,
              tips,
              analysis: `The ${category} category shows good sustainability metrics, but there's room for improvement in waste management.`,
            }
          },
        }),
      },
      onFinish: ({ text, toolCalls, toolResults }) => {
        console.log("[v0] Agentic flow finished", { toolCalls: toolCalls?.length })
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const streamId = searchParams.get("streamId")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    if (!streamId) {
      return NextResponse.json({ error: "Stream ID required" }, { status: 400 })
    }

    const messages = await DatabaseService.getChatMessages(streamId, limit, offset)

    return NextResponse.json({
      success: true,
      messages,
    })
  } catch (error) {
    console.error("Get chat messages error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
