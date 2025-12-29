// Create a Stripe Billing Portal Session
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { customerId, return_url } = await req.json()
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
    }
    if (!customerId || !return_url) {
      return NextResponse.json({ error: "Missing required fields: customerId, return_url" }, { status: 400 })
    }

    const { default: Stripe } = await import("stripe")
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" })

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url,
    })

    return NextResponse.json({ url: portal.url })
  } catch (e) {
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
