// Simple chat storage with Upstash Redis (fallback in-memory)
import { Redis } from "@upstash/redis"

type ChatMessage = {
  id: string
  streamId: string
  userId: string
  username: string
  text: string
  createdAt: number
}

let _redis: Redis | null = null
function redis() {
  if (_redis) return _redis
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  _redis = new Redis({ url: process.env.KV_REST_API_URL!, token: process.env.KV_REST_API_TOKEN! })
  return _redis
}

const mem = new Map<string, ChatMessage[]>()

function listKey(streamId: string) {
  return `chat:${streamId}:messages`
}

export async function addMessage(msg: Omit<ChatMessage, "id" | "createdAt">) {
  const m: ChatMessage = {
    ...msg,
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  }
  const r = redis()
  if (r) {
    await r.lpush(listKey(m.streamId), JSON.stringify(m))
    await r.ltrim(listKey(m.streamId), 0, 999) // keep last 1000
  } else {
    const arr = mem.get(m.streamId) ?? []
    arr.unshift(m)
    mem.set(m.streamId, arr.slice(0, 1000))
  }
  return m
}

export async function getMessages(streamId: string, limit = 100) {
  const r = redis()
  if (r) {
    const raw = await r.lrange(listKey(streamId), 0, limit - 1)
    return raw.map((s) => JSON.parse(s) as ChatMessage).sort((a, b) => a.createdAt - b.createdAt)
  }
  const arr = mem.get(streamId) ?? []
  return [...arr].reverse().slice(Math.max(0, arr.length - limit))
}
