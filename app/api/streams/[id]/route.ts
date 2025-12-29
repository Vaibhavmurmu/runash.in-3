import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const streamId = Number.parseInt(params.id)
    const stream = await Database.getStreamById(streamId)

    if (!stream) {
      return NextResponse.json({ error: "Stream not found" }, { status: 404 })
    }

    return NextResponse.json({ stream })
  } catch (error) {
    console.error("Get stream error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const streamId = Number.parseInt(params.id)
    const stream = await Database.getStreamById(streamId)

    if (!stream || stream.user_id !== session.user.id) {
      return NextResponse.json({ error: "Stream not found or unauthorized" }, { status: 404 })
    }

    await Database.updateStream(streamId, { status: "deleted" })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete stream error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
