import { type NextRequest, NextResponse } from "next/server"
import { EmailDeliveryTracker } from "@/lib/email-delivery"
import { requirePermission } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    // Check admin permissions
    const authResult = await requirePermission(request, "view_email_analytics")
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { searchParams } = new URL(request.url)
    const campaign_id = searchParams.get("campaign_id") ? Number.parseInt(searchParams.get("campaign_id")!) : undefined
    const template_id = searchParams.get("template_id") ? Number.parseInt(searchParams.get("template_id")!) : undefined
    const date_from = searchParams.get("date_from") ? new Date(searchParams.get("date_from")!) : undefined
    const date_to = searchParams.get("date_to") ? new Date(searchParams.get("date_to")!) : undefined

    const stats = await EmailDeliveryTracker.getDeliveryStats({
      campaign_id,
      template_id,
      date_from,
      date_to,
    })

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Error fetching delivery stats:", error)
    return NextResponse.json({ error: "Failed to fetch delivery stats" }, { status: 500 })
  }
}
