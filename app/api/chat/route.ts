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

    const messageData = await request.json()

    const message = await DatabaseService.saveChatMessage({
      streamId: messageData.streamId,
      userId: session.user.id,
      username: session.user.name || "Anonymous",
      message: messageData.message,
      timestamp: new Date(),
      platform: messageData.platform || "runash",
      type: messageData.type || "message",
      metadata: messageData.metadata || {},
    })

    return NextResponse.json({
      success: true,
      message,
    })
  } catch (error) {
    console.error("Save chat message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
