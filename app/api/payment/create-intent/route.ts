import { type NextRequest, NextResponse } from "next/server"
import { PaymentService } from "@/lib/payment-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, paymentMethodId, metadata } = body

    // Validate required fields
    if (!amount || !currency || !paymentMethodId) {
      return NextResponse.json({ error: "Missing required fields: amount, currency, paymentMethodId" }, { status: 400 })
    }

    // Validate amount
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 })
    }

    // Validate payment method
    const isValidMethod = await PaymentService.validatePaymentMethod(paymentMethodId, currency)
    if (!isValidMethod) {
      return NextResponse.json({ error: "Invalid payment method for the specified currency" }, { status: 400 })
    }

    // Create payment intent
    const intent = await PaymentService.createPaymentIntent(amount, currency, paymentMethodId, metadata || {})

    return NextResponse.json({
      success: true,
      data: intent,
    })
  } catch (error) {
    console.error("Payment intent creation failed:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
