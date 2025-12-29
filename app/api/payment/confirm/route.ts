import { type NextRequest, NextResponse } from "next/server"
import { PaymentService } from "@/lib/payment-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { intentId } = body

    if (!intentId) {
      return NextResponse.json({ error: "Missing required field: intentId" }, { status: 400 })
    }

    // Process the payment
    const transaction = await PaymentService.processPayment(intentId)

    return NextResponse.json({
      success: true,
      data: transaction,
    })
  } catch (error) {
    console.error("Payment confirmation failed:", error)
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 })
  }
}
