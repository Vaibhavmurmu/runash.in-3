// Merges base catalog from existing API with KV overrides/additions, without editing the base implementation.
import { type NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`

  // fetch base list from existing endpoint
  const base = await fetch(`${baseUrl}/api/grocery/products`, { cache: "no-store" }).then(async (r) => {
    if (!r.ok) return { items: [] as any[] }
    return r.json()
  })

  // fetch KV overlay
  const keys = (await redis.keys<string[]>("grocery:product:*")) || []
  const kvItems: any[] = []
  if (Array.isArray(keys) && keys.length) {
    const values = await redis.mget<any[]>(...keys)
    for (const val of values) if (val) kvItems.push(val)
  }

  // merge: kv overrides base by id; kv new items appended
  const map = new Map<string, any>()
  const all = [...(base.items || []), ...kvItems]
  for (const p of all) {
    if (!p?.id) continue
    map.set(p.id, { ...p })
  }

  return NextResponse.json({ items: Array.from(map.values()) })
}
