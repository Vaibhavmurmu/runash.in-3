import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const streamId = searchParams.get("streamId")

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      // Send initial data
      const sendUpdate = async () => {
        try {
          // Fetch current analytics data (reuse logic from realtime route)
          const analyticsData = {
            totalViews: Math.floor(Math.random() * 10000) + 1000,
            currentViewers: Math.floor(Math.random() * 500) + 50,
            peakViewers: Math.floor(Math.random() * 1000) + 100,
            averageViewers: Math.floor(Math.random() * 300) + 75,
            watchTime: Math.floor(Math.random() * 3600) + 1800,
            chatMessages: Math.floor(Math.random() * 200) + 50,
            newFollowers: Math.floor(Math.random() * 50) + 5,
            donations: Math.floor(Math.random() * 100),
            engagement: Math.random() * 100,
            streamHealth: "Good" as const,
            revenue: Math.floor(Math.random() * 1000) + 100,
            subscriptions: Math.floor(Math.random() * 20) + 2,
          }

          const data = `data: ${JSON.stringify(analyticsData)}\n\n`
          controller.enqueue(encoder.encode(data))
        } catch (error) {
          console.error("Error sending analytics update:", error)
        }
      }

      // Send updates every 5 seconds
      const interval = setInterval(sendUpdate, 5000)
      sendUpdate() // Send initial data

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
