"use server"

import { stripe } from "@/lib/stripe"
import { PRODUCTS } from "@/lib/products"
import { getSession } from "@/lib/auth"

export async function createCheckoutSession(productId: string) {
  const { user } = await getSession()
  if (!user) {
    throw new Error("Authentication required")
  }

  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product ${productId} not found`)
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    ui_mode: "embedded",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          recurring: product.category === "subscription" ? { interval: "month" } : undefined,
        },
        quantity: 1,
      },
    ],
    mode: product.category === "subscription" ? "subscription" : "payment",
    redirect_on_completion: "never",
  })

  return { clientSecret: session.client_secret }
}
