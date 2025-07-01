import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { getCurrentUserId, isAuthenticated, isValidInteger } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    if (!isValidInteger(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "current"

    let periodStart: Date
    let periodEnd: Date

    if (period === "current") {
      periodStart = new Date()
      periodStart.setDate(1) // First day of current month
      periodStart.setHours(0, 0, 0, 0)

      periodEnd = new Date(periodStart)
      periodEnd.setMonth(periodEnd.getMonth() + 1)
      periodEnd.setDate(0) // Last day of current month
      periodEnd.setHours(23, 59, 59, 999)
    } else {
      // Handle other periods (last month, etc.)
      periodStart = new Date()
      periodStart.setMonth(periodStart.getMonth() - 1)
      periodStart.setDate(1)
      periodStart.setHours(0, 0, 0, 0)

      periodEnd = new Date(periodStart)
      periodEnd.setMonth(periodEnd.getMonth() + 1)
      periodEnd.setDate(0)
      periodEnd.setHours(23, 59, 59, 999)
    }

    const usage = await sql`
      SELECT * FROM usage_tracking 
      WHERE user_id = ${Number.parseInt(userId)}
      AND period_start >= ${periodStart}
      AND period_end <= ${periodEnd}
      ORDER BY metric_name, created_at DESC
    `

    // Get user's subscription limits
    const subscriptions = await sql`
      SELECT sp.limits
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE us.user_id = ${Number.parseInt(userId)}
      AND us.status = 'active'
      ORDER BY us.created_at DESC
      LIMIT 1
    `

    const limits = subscriptions.length > 0 ? subscriptions[0].limits : {}

    return NextResponse.json({ usage, limits, period: { start: periodStart, end: periodEnd } })
  } catch (error) {
    console.error("Error fetching usage:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
