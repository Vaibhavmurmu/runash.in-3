"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false)
  const { items } = useCart()

  async function checkout() {
    setLoading(true)
    try {
      const res = await fetch("/api/grocery/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        }),
      })
      const data = await res.json()
      if (data?.url) window.location.href = data.url
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={checkout} disabled={!items.length || loading}>
      {loading ? "Redirecting..." : "Checkout with Stripe"}
    </Button>
  )
}
