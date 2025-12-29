import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, platform } = await req.json()

    if (!title || !platform) {
      return NextResponse.json({ error: "Title and platform are required" }, { status: 400 })
    }

    // Generate stream key
    const streamKey = `sk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const stream = await Database.createStream({
      title,
      description: description || "",
      user_id: session.user.id,
      status: "scheduled",
      platform,
      stream_key: streamKey,
      viewer_count: 0,
    })

    return NextResponse.json({ stream })
  } catch (error) {
    console.error("Create stream error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const streams = await Database.getUserStreams(session.user.id)
    return NextResponse.json({ streams })
  } catch (error) {
    console.error("Get streams error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, ...updateData } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Stream ID required" }, { status: 400 })
    }

    const stream = await Database.updateStream(id, updateData)
    return NextResponse.json({ stream })
  } catch (error) {
    console.error("Update stream error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
