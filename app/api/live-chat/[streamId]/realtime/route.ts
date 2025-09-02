import type { NextRequest } from "next/server"
import { liveChatService } from "@/lib/live-chat-service"

export async function GET(request: NextRequest, { params }: { params: { streamId: string } }) {
  const streamId = params.streamId
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const data = `data: ${JSON.stringify({ type: "connected", streamId, timestamp: new Date() })}\n\n`
      controller.enqueue(encoder.encode(data))

      // Listen for real-time chat events
      const handleMessage = (data: any) => {
        if (data.streamId === streamId) {
          const message = `data: ${JSON.stringify({ type: "message", data, timestamp: new Date() })}\n\n`
          controller.enqueue(encoder.encode(message))
        }
      }

      const handleUserJoined = (data: any) => {
        if (data.streamId === streamId) {
          const message = `data: ${JSON.stringify({ type: "user_joined", data, timestamp: new Date() })}\n\n`
          controller.enqueue(encoder.encode(message))
        }
      }

      const handleUserLeft = (data: any) => {
        if (data.streamId === streamId) {
          const message = `data: ${JSON.stringify({ type: "user_left", data, timestamp: new Date() })}\n\n`
          controller.enqueue(encoder.encode(message))
        }
      }

      const handleMessageDeleted = (data: any) => {
        if (data.streamId === streamId) {
          const message = `data: ${JSON.stringify({ type: "message_deleted", data, timestamp: new Date() })}\n\n`
          controller.enqueue(encoder.encode(message))
        }
      }

      const handleModerationAction = (data: any) => {
        if (data.streamId === streamId) {
          const message = `data: ${JSON.stringify({ type: "moderation_action", data, timestamp: new Date() })}\n\n`
          controller.enqueue(encoder.encode(message))
        }
      }

      const handleSettingsUpdated = (data: any) => {
        if (data.streamId === streamId) {
          const message = `data: ${JSON.stringify({ type: "settings_updated", data, timestamp: new Date() })}\n\n`
          controller.enqueue(encoder.encode(message))
        }
      }

      // Register event listeners
      liveChatService.on("message_sent", handleMessage)
      liveChatService.on("user_joined", handleUserJoined)
      liveChatService.on("user_left", handleUserLeft)
      liveChatService.on("message_deleted", handleMessageDeleted)
      liveChatService.on("moderation_action", handleModerationAction)
      liveChatService.on("settings_updated", handleSettingsUpdated)

      // Send periodic heartbeat
      const heartbeat = setInterval(() => {
        const message = `data: ${JSON.stringify({ type: "heartbeat", timestamp: new Date() })}\n\n`
        controller.enqueue(encoder.encode(message))
      }, 30000) // Every 30 seconds

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        liveChatService.off("message_sent", handleMessage)
        liveChatService.off("user_joined", handleUserJoined)
        liveChatService.off("user_left", handleUserLeft)
        liveChatService.off("message_deleted", handleMessageDeleted)
        liveChatService.off("moderation_action", handleModerationAction)
        liveChatService.off("settings_updated", handleSettingsUpdated)
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
