import { type NextRequest, NextResponse } from "next/server"
import { EmailAnalytics } from "@/lib/email-analytics"
import { requirePermission } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    // Check admin permissions
    const authResult = await requirePermission(request, "view_email_analytics")
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const metrics = await EmailAnalytics.getRealTimeMetrics()

    return NextResponse.json({
      success: true,
      data: metrics,
    })
  } catch (error) {
    console.error("Error fetching real-time email metrics:", error)
    return NextResponse.json({ error: "Failed to fetch real-time metrics" }, { status: 500 })
  }
}
