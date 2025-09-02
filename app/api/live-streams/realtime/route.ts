import type { NextRequest } from "next/server"
import { liveStreamingService } from "@/lib/live-streaming-service"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const streamId = searchParams.get("streamId")

  // Set up Server-Sent Events
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const data = `data: ${JSON.stringify({ type: "connected", timestamp: new Date() })}\n\n`
      controller.enqueue(encoder.encode(data))

      // Listen for real-time updates
      const handleUpdate = (data: any) => {
        if (!streamId || data.streamId === streamId) {
          const message = `data: ${JSON.stringify({ type: "metrics_update", data, timestamp: new Date() })}\n\n`
          controller.enqueue(encoder.encode(message))
        }
      }

      const handleStreamEvent = (event: any) => {
        if (!streamId || event.streamId === streamId) {
          const message = `data: ${JSON.stringify({ type: "stream_event", data: event, timestamp: new Date() })}\n\n`
          controller.enqueue(encoder.encode(message))
        }
      }

      liveStreamingService.on("real_time_update", handleUpdate)
      liveStreamingService.on("stream_event", handleStreamEvent)

      // Send periodic heartbeat
      const heartbeat = setInterval(() => {
        const message = `data: ${JSON.stringify({ type: "heartbeat", timestamp: new Date() })}\n\n`
        controller.enqueue(encoder.encode(message))
      }, 30000) // Every 30 seconds

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        liveStreamingService.off("real_time_update", handleUpdate)
        liveStreamingService.off("stream_event", handleStreamEvent)
        clearInterval(heartbeat)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  })
}
