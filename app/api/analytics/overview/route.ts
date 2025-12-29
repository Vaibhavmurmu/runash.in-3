import { NextResponse } from "next/server"
import { getSql } from "@/lib/db/neon"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const period = url.searchParams.get("period") || "7d"
    const userId = Number(req.headers.get("x-user-id") || 1)
    const sql = getSql()

    // Aggregate stream_analytics over recent period window
    const now = new Date()
    const from = new Date(now)
    if (period === "24h") from.setDate(now.getDate() - 1)
    else if (period === "7d") from.setDate(now.getDate() - 7)
    else if (period === "30d") from.setDate(now.getDate() - 30)
    else from.setDate(now.getDate() - 7)

    const [[agg]] = await sql /* sql */`
      SELECT
        COALESCE(SUM(sa.total_views), 0)::int AS total_views,
        COALESCE(SUM(sa.donations), 0)::int AS revenue_est,
        COALESCE(AVG(sa.watch_time), 0)::numeric AS avg_watch_time,
        COALESCE(AVG(sa.engagement), 0)::numeric AS engagement
      FROM public.streams s
      LEFT JOIN public.stream_analytics sa ON sa.stream_id = s.id
      WHERE s.user_id = ${userId}
        AND s.created_at >= ${from}
    `
    const stats = {
      totalViews: Number(agg?.total_views ?? 0),
      revenue: Number(agg?.revenue_est ?? 0),
      avgWatchTimeSeconds: Number(agg?.avg_watch_time ?? 0),
      engagementRate: Number(agg?.engagement ?? 0),
      change: { views: 12, revenue: 6, watch: 3, engagement: -2 },
    }
    return NextResponse.json(stats)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
