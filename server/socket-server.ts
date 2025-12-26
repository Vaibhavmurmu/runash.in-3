/**
 * Socket.IO server that listens to Postgres NOTIFY channel "live_events"
 * and broadcasts messages to connected clients.
 *
 * Usage:
 *   NODE_ENV=development DATABASE_URL=... JWT_SECRET=... PORT=4000 node server/socket-server.js
 *
 * This server also exposes chat:message events to be stored in DB (optional).
 */

const http = require("http")
const { Server } = require("socket.io")
const { Pool } = require("pg")
const jwt = require("jsonwebtoken")

const PORT = process.env.SOCKET_PORT || process.env.PORT || 4000
const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
const JWT_SECRET = process.env.JWT_SECRET || "change-me"

if (!DATABASE_URL) {
  console.error("Please set DATABASE_URL for socket server to connect to your Neon DB")
  process.exit(1)
}

const pool = new Pool({ connectionString: DATABASE_URL })

async function start() {
  const server = http.createServer()
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  })

  // Authentication middleware for sockets (optional)
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || (socket.handshake.headers?.authorization || "").replace(/^Bearer\s+/, "")
      if (!token) return next(new Error("Unauthorized"))
      const payload = jwt.verify(token, JWT_SECRET)
      socket.user = payload
      return next()
    } catch (err) {
      return next(new Error("Unauthorized"))
    }
  })

  io.on("connection", (socket) => {
    console.log("socket connected", socket.id, "user:", socket.user && socket.user.sub)
    // join rooms for streams
    socket.on("join:stream", (streamId) => {
      socket.join(`stream:${streamId}`)
      console.log(`${socket.id} joined stream:${streamId}`)
    })

    socket.on("leave:stream", (streamId) => {
      socket.leave(`stream:${streamId}`)
    })

    // chat message from client -> broadcast & optionally insert into db
    socket.on("chat:message", async (payload) => {
      try {
        // payload: { streamId, message, meta }
        const { streamId, message } = payload
        // Optionally persist: INSERT INTO chat_messages (stream_id, user_id, message, created_at) VALUES (...)
        // Broadcast to room
        io.to(`stream:${streamId}`).emit("chat:message", {
          streamId,
          message,
          user: socket.user ? { id: socket.user.sub, name: socket.user.name || socket.user.email } : null,
          createdAt: new Date().toISOString(),
        })
      } catch (err) {
        console.error("chat:message error", err)
      }
    })
  })

  // Postgres LISTEN/NOTIFY integration - forward NOTIFY payloads to sockets
  const client = await pool.connect()
  await client.query("LISTEN live_events")
  client.on("notification", (msg) => {
    try {
      const payload = JSON.parse(msg.payload || "{}")
      // Expect payload to contain { type, streamId, data }
      const { type, streamId, data } = payload
      if (streamId) {
        // broadcast to stream room
        io.to(`stream:${streamId}`).emit(type, data)
      } else {
        io.emit(type, data)
      }
    } catch (err) {
      console.error("Failed to handle NOTIFY payload", err)
    }
  })

  server.listen(PORT, () => {
    console.log(`Socket server listening on port ${PORT}`)
  })

  // graceful shutdown
  process.on("SIGINT", async () => {
    console.log("Shutting down socket server")
    await client.release()
    io.close()
    server.close(() => process.exit(0))
  })
}

start().catch((err) => {
  console.error("Failed to start socket server", err)
  process.exit(1)
})
