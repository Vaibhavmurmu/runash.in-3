import { type NextRequest, NextResponse } from "next/server"
import { streamingService } from "@/lib/streaming-service"

export async function GET(request: NextRequest, { params }: { params: { streamId: string } }) {
  try {
    const { streamId } = params

    const status = await streamingService.getStreamStatus(streamId)

    if (!status) {
      return NextResponse.json({ error: "Stream not found" }, { status: 404 })
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error("Error getting stream status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
