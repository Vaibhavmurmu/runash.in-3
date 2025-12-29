import type { NextApiRequest, NextApiResponse } from "next"
import { getDashboardData } from "@/lib/data-source"

/**
 * GET /api/analytics/dashboard
 *
 * Returns aggregated / historical analytics data for the frontend charts.
 * This uses the server-side data source (lib/data-source) so you can replace
 * the data-source implementation to integrate with your real analytics provider.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getDashboardData()
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120")
    res.status(200).json(data)
  } catch (err) {
    console.error("dashboard error", err)
    res.status(500).json({ error: "failed to load dashboard data" })
  }
}
