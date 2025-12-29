import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ ok: true, skipped: "No STRIPE_WEBHOOK_SECRET set" })

  const sig = req.headers.get("stripe-signature") || ""
  const raw = await req.text()
  const { default: Stripe } = await import("stripe")
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY || "", {
    apiVersion: "2024-06-20",
  })

  let event: any
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret)
  } catch (err: any) {
    return NextResponse.json({ error: `Invalid signature: ${err?.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "invoice.payment_succeeded":
        // TODO: grant entitlements, reset counters, send receipt
        break
      case "invoice.payment_failed":
        // TODO: dunning workflow, notify user
        break
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        // TODO: sync plan and limits to your DB
        break
      default:
        break
    }
  } catch (e) {
    return NextResponse.json({ error: "Processing error" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

export const dynamic = "force-dynamic"
