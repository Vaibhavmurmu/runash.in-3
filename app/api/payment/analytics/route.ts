import { type NextRequest, NextResponse } from "next/server"
import { PaymentService } from "@/lib/payment-service"

export async function GET(request: NextRequest) {
  try {
    const analytics = await PaymentService.getAnalytics()

    return NextResponse.json({
      success: true,
      data: analytics,
    })
  } catch (error) {
    console.error("Failed to fetch payment analytics:", error)
    return NextResponse.json({ error: "Failed to fetch payment analytics" }, { status: 500 })
  }
}
