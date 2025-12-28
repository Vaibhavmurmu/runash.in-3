import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

if (!process.env.runash_KV_REST_API_URL || !process.env.runash_KV_REST_API_TOKEN) {
  throw new Error("Redis environment variables are not set")
}

export const redis = new Redis({
  url: process.env.runash_KV_REST_API_URL,
  token: process.env.runash_KV_REST_API_TOKEN,
})

export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
})
