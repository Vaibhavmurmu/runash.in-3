import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId, isAuthenticated } from "@/lib/auth"
import { streamingService } from "@/lib/streaming-service"

export async function POST(request: NextRequest, { params }: { params: { streamId: string } }) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()
    const { streamId } = params

    const success = await streamingService.startStream(streamId, userId)

    if (!success) {
      return NextResponse.json({ error: "Failed to start stream" }, { status: 400 })
    }

    const status = await streamingService.getStreamStatus(streamId)

    return NextResponse.json(status)
  } catch (error) {
    console.error("Error starting stream:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
