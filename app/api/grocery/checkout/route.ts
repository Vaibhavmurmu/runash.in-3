import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const items: { id: string; name: string; price: number; quantity: number }[] = body?.items || []
    if (!Array.isArray(items) || !items.length) {
      return NextResponse.json({ error: "No items" }, { status: 400 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" })
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: items.map((i) => ({
        quantity: i.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(i.price * 100),
          product_data: { name: i.name, metadata: { productId: i.id } },
        },
      })),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment?status=cancelled`,
    })
    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Checkout error" }, { status: 500 })
  }
}
