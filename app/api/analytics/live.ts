import type { NextApiRequest, NextApiResponse } from "next"
import { streamEmitter } from "@/lib/stream-emitter"

/**
 * SSE endpoint: GET /api/analytics/live
 *
 * This endpoint keeps an open connection and streams JSON events to clients in
 * Server-Sent Events format. It relies on a singleton streamEmitter which is
 * started server-side and emits metrics periodically (or via integration).
 *
 * Important: SSE connections are long-lived. If you deploy to serverless
 * platforms with short-lived lambdas you should use a dedicated SSE / websocket
 * provider, or run this on a server / container that supports long-running processes.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only GET is supported
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    return res.status(405).end("Method Not Allowed")
  }

  // Set SSE headers
  res.writeHead(200, {
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  })

  // Add this response to the emitter's clients
  const clientId = streamEmitter.addClient(res)

  // Immediately send an initial event with current snapshot
  const snapshot = streamEmitter.getLatest()
  if (snapshot) {
    const payload = JSON.stringify(snapshot)
    res.write(`event: metrics\n`)
    res.write(`data: ${payload}\n\n`)
  }

  // heartbeat every 20s to keep the connection alive
  const ping = setInterval(() => {
    try {
      res.write(`event: ping\n`)
      res.write(`data: ${JSON.stringify({ t: Date.now() })}\n\n`)
    } catch {
      // ignore
    }
  }, 20_000)

  req.on("close", () => {
    clearInterval(ping)
    streamEmitter.removeClient(clientId)
  })
}
