import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId, isAuthenticated } from "@/lib/auth"
import { streamingService } from "@/lib/streaming-service"
import type { StreamConfig } from "@/lib/streaming-types"

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()
    const config: StreamConfig = await request.json()

    // Validate required fields
    if (!config.title || !config.category) {
      return NextResponse.json({ error: "Title and category are required" }, { status: 400 })
    }

    // Validate title length
    if (config.title.length > 255) {
      return NextResponse.json({ error: "Title must be less than 255 characters" }, { status: 400 })
    }

    // Validate tags
    if (config.tags && config.tags.length > 10) {
      return NextResponse.json({ error: "Maximum 10 tags allowed" }, { status: 400 })
    }

    const stream = await streamingService.createStream(userId, config)

    if (!stream) {
      return NextResponse.json({ error: "Failed to create stream" }, { status: 500 })
    }

    return NextResponse.json(stream)
  } catch (error) {
    console.error("Error creating stream:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
