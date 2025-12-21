import Stripe from "stripe"

const stripeSecret = process.env.STRIPE_SECRET_KEY

if (!stripeSecret) {
  // runtime check - keeps file compiling on server but will return 500 at runtime
  console.warn("STRIPE_SECRET_KEY not set. Checkout session creation will fail without it.")
}

const stripe = new Stripe(stripeSecret || "", {
  apiVersion: "2022-11-15",
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { order, successUrl, cancelUrl } = body

    if (!order || !order.items || !Array.isArray(order.items)) {
      return new Response(JSON.stringify({ error: "Invalid order payload" }), { status: 400 })
    }

    if (!stripeSecret) {
      return new Response(
        JSON.stringify({ error: "Server misconfiguration: missing Stripe secret key" }),
        { status: 500 }
      )
    }

    // Map cart items to Stripe line_items
    const line_items = order.items.map((item: any) => {
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      customer_email: order.customer?.email || undefined,
      metadata: {
        order_id: order.id || undefined,
      },
      success_url:
        successUrl ||
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout`,
    })

    return new Response(JSON.stringify({ url: session.url }), { status: 200 })
  } catch (err: any) {
    console.error("Error creating checkout session:", err)
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500 })
  }
}
