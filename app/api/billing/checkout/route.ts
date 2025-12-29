// Create a Stripe Checkout Session for subscriptions
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { priceId, customerEmail, mode = "subscription", success_url, cancel_url } = await req.json()

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
    }
    if (!priceId || !success_url || !cancel_url) {
      return NextResponse.json({ error: "Missing required fields: priceId, success_url, cancel_url" }, { status: 400 })
    }

    const { default: Stripe } = await import("stripe")
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" })

    const session = await stripe.checkout.sessions.create({
      mode,
      success_url,
      cancel_url,
      customer_email: customerEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (e) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
