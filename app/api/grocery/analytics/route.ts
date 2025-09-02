import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

async function safeJson(url: string) {
  try {
    const r = await fetch(url, { cache: "no-store" })
    if (!r.ok) return null
    return await r.json()
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`

  const [streams, recordings, payments] = await Promise.all([
    safeJson(`${base}/api/streams`),
    safeJson(`${base}/api/recordings`),
    safeJson(`${base}/api/payment/analytics`),
  ])

  const sItems: any[] = streams?.items || []
  const rItems: any[] = recordings?.items || []
  const pStats = payments?.stats || {}

  const liveCount = sItems.filter((s) => s.status === "live").length
  const scheduledCount = sItems.filter((s) => s.status === "scheduled").length
  const endedCount = sItems.filter((s) => s.status === "ended").length

  const totalRecordings = rItems.length
  const totalRevenue = Number(pStats.totalRevenue || 0)
  const orders = Number(pStats.orders || 0)
  const aov = orders ? totalRevenue / orders : 0

  return NextResponse.json({
    streams: { liveCount, scheduledCount, endedCount, total: sItems.length },
    recordings: { total: totalRecordings },
    revenue: { totalRevenue, orders, aov },
    updatedAt: new Date().toISOString(),
  })
}
