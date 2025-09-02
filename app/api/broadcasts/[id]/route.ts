import { type NextRequest, NextResponse } from "next/server"
import { broadcastScheduler } from "@/lib/broadcast-scheduler"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const broadcastId = params.id
    const broadcast = Array.from(broadcastScheduler["broadcasts"].values()).find((b) => b.id === broadcastId)

    if (!broadcast) {
      return NextResponse.json({ error: "Broadcast not found" }, { status: 404 })
    }

    const analytics = broadcastScheduler.getBroadcastAnalytics(broadcastId)

    return NextResponse.json({
      success: true,
      broadcast,
      analytics,
    })
  } catch (error) {
    console.error("Error fetching broadcast:", error)
    return NextResponse.json({ error: "Failed to fetch broadcast" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const broadcastId = params.id
    const body = await request.json()

    const updatedBroadcast = await broadcastScheduler.updateBroadcast(broadcastId, body)

    return NextResponse.json({ success: true, broadcast: updatedBroadcast })
  } catch (error) {
    console.error("Error updating broadcast:", error)
    return NextResponse.json({ error: "Failed to update broadcast" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const broadcastId = params.id
    const { searchParams } = new URL(request.url)
    const reason = searchParams.get("reason")

    await broadcastScheduler.cancelBroadcast(broadcastId, reason || undefined)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error cancelling broadcast:", error)
    return NextResponse.json({ error: "Failed to cancel broadcast" }, { status: 500 })
  }
}
