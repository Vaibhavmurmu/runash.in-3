import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { DatabaseService } from "@/lib/database"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const streamData = await request.json()

    const stream = await DatabaseService.createStream({
      userId: session.user.id,
      title: streamData.title,
      description: streamData.description,
      status: "scheduled",
      startTime: new Date(streamData.startTime),
      viewerCount: 0,
      platforms: streamData.platforms || ["runash"],
      metadata: streamData.metadata || {},
    })

    return NextResponse.json({
      success: true,
      stream,
    })
  } catch (error) {
    console.error("Create stream error:", error)
    return NextResponse.json({ error: "Failed to create stream" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const streamId = searchParams.get("streamId")

    if (streamId) {
      const stream = await DatabaseService.getStream(streamId)

      if (!stream) {
        return NextResponse.json({ error: "Stream not found" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        stream,
      })
    }

    if (userId) {
      const streams = await DatabaseService.getUserStreams(userId)

      return NextResponse.json({
        success: true,
        streams,
      })
    }

    return NextResponse.json({ error: "Stream ID or User ID required" }, { status: 400 })
  } catch (error) {
    console.error("Get streams error:", error)
    return NextResponse.json({ error: "Failed to get streams" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { streamId, ...updates } = await request.json()

    if (!streamId) {
      return NextResponse.json({ error: "Stream ID required" }, { status: 400 })
    }

    // Verify ownership
    const stream = await DatabaseService.getStream(streamId)

    if (!stream || stream.userId !== session.user.id) {
      return NextResponse.json({ error: "Stream not found or unauthorized" }, { status: 404 })
    }

    await DatabaseService.updateStream(streamId, updates)

    return NextResponse.json({
      success: true,
      message: "Stream updated successfully",
    })
  } catch (error) {
    console.error("Update stream error:", error)
    return NextResponse.json({ error: "Failed to update stream" }, { status: 500 })
  }
}
