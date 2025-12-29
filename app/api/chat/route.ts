import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { DatabaseService } from "@/lib/database"
import { authOptions } from "@/lib/auth"
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { messages, context } = await request.json()

    // Add context-aware system prompt based on the chat context
    let systemPrompt = `You are RunAsh AI, a helpful assistant for the RunAsh platform. You help users with live streaming, grocery shopping, and platform features.`

    if (context === "grocery") {
      systemPrompt += ` You specialize in helping users find organic products, providing nutritional information, suggesting recipes, and assisting with grocery shopping decisions. You can recommend products based on dietary preferences, sustainability goals, and health needs.`
    } else if (context === "streaming") {
      systemPrompt += ` You specialize in helping users with live streaming setup, technical issues, content creation tips, and platform features. You can assist with streaming software, hardware recommendations, and audience engagement strategies.`
    }

    const result = streamText({
      model: openai("gpt-4-turbo"),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toDataStreamResponse()
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
