import Stripe from "stripe"
import { promises as fs } from "fs"
import path from "path"

const stripeSecret = process.env.STRIPE_SECRET_KEY || ""
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""
const stripe = new Stripe(stripeSecret, { apiVersion: "2022-11-15" })

const DATA_DIR = path.join(process.cwd(), "data", "orders")

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || ""
  const buf = await req.text() // use raw body to validate signature

  if (!webhookSecret) {
    console.warn("STRIPE_WEBHOOK_SECRET not set — cannot verify events safely.")
  }

  let event: Stripe.Event
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
    } else {
      // When webhook secret is not configured (dev), parse body without verification
      event = JSON.parse(buf)
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err)
    return new Response(JSON.stringify({ error: "Webhook signature verification failed." }), { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.order_id

      if (orderId) {
        const filePath = path.join(DATA_DIR, `${orderId}.json`)
        try {
          const raw = await fs.readFile(filePath, "utf8")
          const order = JSON.parse(raw)
          order.status = "paid"
          order.payment = order.payment || {}
          order.payment.stripeSessionId = session.id
          order.payment.paymentStatus = session.payment_status || "paid"
          order.paidAt = new Date().toISOString()
          await fs.writeFile(filePath, JSON.stringify(order, null, 2), "utf8")
          console.log(`Order ${orderId} marked as paid.`)
        } catch (e) {
          console.error("Failed to update order file for webhook", e)
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err: any) {
    console.error("Webhook handling error:", err)
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500 })
  }
}
