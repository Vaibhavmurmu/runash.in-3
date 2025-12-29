// Usage metering via Upstash Redis with in-memory fallback

import { Redis } from "@upstash/redis"

let _redis: Redis | null = null
function redis() {
  if (_redis) return _redis
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.warn("[v0] Upstash KV env vars missing; usage metering will be in-memory only")
    return null
  }
  _redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  })
  return _redis
}

const mem = new Map<string, number>()

function ym() {
  const d = new Date()
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`
}

export type UsageMetric = "stream_minutes" | "uploads_gb" | "view_minutes" | "credits"
export type Plan = "free" | "starter" | "pro" | "business"

export type UsageSummary = {
  period: string
  userId: string
  totals: Record<UsageMetric, number>
  limits: Partial<Record<UsageMetric, number>>
  utilization: Partial<Record<UsageMetric, number>>
}

export function defaultPlanLimits(plan: Plan): Partial<Record<UsageMetric, number>> {
  switch (plan) {
    case "free":
      return { stream_minutes: 300, uploads_gb: 5, view_minutes: 500, credits: 100 }
    case "starter":
      return { stream_minutes: 2000, uploads_gb: 50, view_minutes: 5000, credits: 1000 }
    case "pro":
      return { stream_minutes: 10000, uploads_gb: 200, view_minutes: 25000, credits: 5000 }
    case "business":
      return { stream_minutes: 50000, uploads_gb: 1000, view_minutes: 100000, credits: 20000 }
    default:
      return {}
  }
}

function key(userId: string, metric: UsageMetric, period = ym()) {
  return `usage:${userId}:${period}:${metric}`
}

export async function incrementUsage(params: {
  userId: string
  metric: UsageMetric
  amount: number
  period?: string
}) {
  const { userId, metric, amount, period = ym() } = params
  const r = redis()
  const k = key(userId, metric, period)
  if (r) {
    await r.incrby(k, amount)
    const ttl = 60 * 60 * 24 * 30 * 18 // ~18 months
    await r.expire(k, ttl)
  } else {
    mem.set(k, (mem.get(k) ?? 0) + amount)
  }
  return true
}

export async function getUsageSummary(userId: string, plan: Plan = "free", period = ym()): Promise<UsageSummary> {
  const metrics: UsageMetric[] = ["stream_minutes", "uploads_gb", "view_minutes", "credits"]
  const r = redis()
  const totals: Record<UsageMetric, number> = {
    stream_minutes: 0,
    uploads_gb: 0,
    view_minutes: 0,
    credits: 0,
  }

  if (r) {
    const keys = metrics.map((m) => key(userId, m, period))
    const values = await r.mget<number[]>(...keys)
    metrics.forEach((m, i) => (totals[m] = Number(values?.[i] ?? 0)))
  } else {
    metrics.forEach((m) => (totals[m] = Number(mem.get(key(userId, m, period)) ?? 0)))
  }

  const limits = defaultPlanLimits(plan)
  const utilization: Partial<Record<UsageMetric, number>> = {}
  for (const m of metrics) {
    const lim = limits[m]
    if (typeof lim === "number" && lim > 0) utilization[m] = Math.min(1, totals[m] / lim)
  }

  return { period, userId, totals, limits, utilization }
}

export function isNearLimit(summary: UsageSummary, metric: UsageMetric, threshold = 0.8) {
  const u = summary.utilization[metric]
  return typeof u === "number" && u >= threshold
}
