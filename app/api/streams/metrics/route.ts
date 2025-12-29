import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const streamId = searchParams.get("streamId")

    if (!streamId) {
      return NextResponse.json({ error: "Stream ID required" }, { status: 400 })
    }

    // For now, return simulated metrics
    const metrics = {
      viewerCount: Math.floor(Math.random() * 100) + 10,
      streamHealth: ["Excellent", "Good", "Fair", "Poor"][Math.floor(Math.random() * 4)],
      bitrate: 2500 + Math.floor(Math.random() * 500),
      fps: 30 + Math.floor(Math.random() * 5),
      droppedFrames: Math.floor(Math.random() * 5),
      bandwidth: 3000 + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error("Get stream metrics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
