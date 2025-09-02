import { type NextRequest, NextResponse } from "next/server"
import { liveStreamingService } from "@/lib/live-streaming-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const streamId = params.id
    const stream = liveStreamingService.getStream(streamId)

    if (!stream) {
      return NextResponse.json({ error: "Stream not found" }, { status: 404 })
    }

    const metrics = liveStreamingService.getStreamMetrics(streamId)
    const hlsUrl = liveStreamingService.getHlsUrl(streamId)

    return NextResponse.json({
      stream: {
        ...stream,
        metrics,
        hlsUrl,
      },
    })
  } catch (error) {
    console.error("Error fetching stream:", error)
    return NextResponse.json({ error: "Failed to fetch stream" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const streamId = params.id
    const body = await request.json()
    const { action, userId, productId, amount } = body

    switch (action) {
      case "start":
        await liveStreamingService.startStream(streamId)
        break
      case "stop":
        const finalMetrics = await liveStreamingService.stopStream(streamId)
        return NextResponse.json({ success: true, metrics: finalMetrics })
      case "join":
        if (!userId) {
          return NextResponse.json({ error: "userId required for join action" }, { status: 400 })
        }
        await liveStreamingService.addViewer(streamId, userId)
        break
      case "leave":
        if (!userId) {
          return NextResponse.json({ error: "userId required for leave action" }, { status: 400 })
        }
        await liveStreamingService.removeViewer(streamId, userId)
        break
      case "purchase":
        if (!productId || !amount) {
          return NextResponse.json({ error: "productId and amount required for purchase action" }, { status: 400 })
        }
        await liveStreamingService.recordPurchase(streamId, productId, amount)
        break
      case "product_view":
        if (!productId) {
          return NextResponse.json({ error: "productId required for product_view action" }, { status: 400 })
        }
        await liveStreamingService.recordProductView(streamId, productId)
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const updatedMetrics = liveStreamingService.getStreamMetrics(streamId)
    return NextResponse.json({ success: true, metrics: updatedMetrics })
  } catch (error) {
    console.error("Error updating stream:", error)
    return NextResponse.json({ error: "Failed to update stream" }, { status: 500 })
  }
}
