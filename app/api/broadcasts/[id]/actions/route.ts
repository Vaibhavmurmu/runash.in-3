import { type NextRequest, NextResponse } from "next/server"
import { broadcastScheduler } from "@/lib/broadcast-scheduler"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const broadcastId = params.id
    const body = await request.json()
    const { action } = body

    switch (action) {
      case "start":
        await broadcastScheduler.startBroadcast(broadcastId, true)
        return NextResponse.json({ success: true, message: "Broadcast started" })

      case "end":
        const analytics = await broadcastScheduler.endBroadcast(broadcastId, false)
        return NextResponse.json({ success: true, message: "Broadcast ended", analytics })

      case "cancel":
        const { reason } = body
        await broadcastScheduler.cancelBroadcast(broadcastId, reason)
        return NextResponse.json({ success: true, message: "Broadcast cancelled" })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error performing broadcast action:", error)
    return NextResponse.json({ error: "Failed to perform action" }, { status: 500 })
  }
}
