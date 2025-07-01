import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { getCurrentUserId, isAuthenticated, isValidInteger } from "@/lib/auth"
import { stripeService } from "@/lib/stripe"

export async function GET() {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    if (!isValidInteger(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    const paymentMethods = await sql`
      SELECT * FROM payment_methods 
      WHERE user_id = ${Number.parseInt(userId)}
      ORDER BY is_default DESC, created_at DESC
    `

    return NextResponse.json({ paymentMethods })
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    if (!isValidInteger(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    const body = await request.json()
    const { cardNumber, expMonth, expYear, cvc, isDefault = false } = body

    // Create payment method in Stripe (simulated)
    const stripePaymentMethod = await stripeService.createPaymentMethod({
      number: cardNumber,
      exp_month: expMonth,
      exp_year: expYear,
      cvc,
    })

    // If this is set as default, unset other default payment methods
    if (isDefault) {
      await sql`
        UPDATE payment_methods 
        SET is_default = false 
        WHERE user_id = ${Number.parseInt(userId)}
      `
    }

    // Save payment method to database
    const newPaymentMethods = await sql`
      INSERT INTO payment_methods (
        user_id, stripe_payment_method_id, type, card_brand, 
        card_last4, card_exp_month, card_exp_year, is_default
      ) VALUES (
        ${Number.parseInt(userId)}, ${stripePaymentMethod.id}, ${stripePaymentMethod.type},
        ${stripePaymentMethod.card?.brand}, ${stripePaymentMethod.card?.last4},
        ${stripePaymentMethod.card?.exp_month}, ${stripePaymentMethod.card?.exp_year}, ${isDefault}
      ) RETURNING *
    `

    return NextResponse.json({ paymentMethod: newPaymentMethods[0] })
  } catch (error) {
    console.error("Error creating payment method:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()
    const { searchParams } = new URL(request.url)
    const paymentMethodId = searchParams.get("id")

    if (!paymentMethodId || !isValidInteger(userId)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 })
    }

    // Delete payment method from database
    await sql`
      DELETE FROM payment_methods 
      WHERE id = ${Number.parseInt(paymentMethodId)} 
      AND user_id = ${Number.parseInt(userId)}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting payment method:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
