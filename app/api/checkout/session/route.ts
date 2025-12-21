import Stripe from "stripe"
import { promises as fs } from "fs"
import path from "path"

const stripeSecret = process.env.STRIPE_SECRET_KEY || ""
const stripe = new Stripe(stripeSecret, { apiVersion: "2022-11-15" })

const DATA_DIR = path.join(process.cwd(), "data", "orders")

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Accept either orderId or order object
    const { orderId, order, successUrl, cancelUrl } = body

    let orderData = order
    if (!orderData && orderId) {
      const filePath = path.join(DATA_DIR, `${orderId}.json`)
      const raw = await fs.readFile(filePath, "utf8")
      orderData = JSON.parse(raw)
    }

    if (!orderData || !orderData.items) {
      return new Response(JSON.stringify({ error: "Invalid order" }), { status: 400 })
    }

    if (!stripeSecret) {
      return new Response(JSON.stringify({ error: "Server misconfiguration: missing Stripe secret key" }), { status: 500 })
    }

    const line_items = orderData.items.map((item: any) => {
      const price = Number(item.selectedVariant?.price ?? item.product?.price ?? 0) || 0
      const unit_amount = Math.round(price * 100)
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product?.name || "Product",
            images: item.product?.image ? [item.product.image] : undefined,
          },
          unit_amount,
        },
        quantity: item.quantity || 1,
      }
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      customer_email: orderData.customer?.email || undefined,
      metadata: {
        order_id: orderData.id || undefined,
      },
      success_url: successUrl || `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderData.id}`,
      cancel_url: cancelUrl || `${baseUrl}/checkout`,
    })

    return new Response(JSON.stringify({ url: session.url, id: session.id }), { status: 200 })
  } catch (err: any) {
    console.error("Error creating checkout session:", err)
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500 })
  }
}
