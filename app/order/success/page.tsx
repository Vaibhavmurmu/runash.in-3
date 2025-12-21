"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams?.get("order_id")
  const [order, setOrder] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { clearCart } = useCart()

  useEffect(() => {
    if (!orderId) {
      setError("Missing order id")
      setLoading(false)
      return
    }

    let cancelled = false
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (!res.ok) {
          const err = await res.json().catch(() => null)
          throw new Error(err?.error || "Failed to fetch order")
        }
        const data = await res.json()
        if (!cancelled) {
          setOrder(data.order)
          setLoading(false)
          // If order is paid, clear cart
          if (data.order?.status === "paid") {
            try {
              clearCart()
            } catch (e) {
              console.warn("Failed to clear cart", e)
            }
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error(err)
          setError(err?.message || String(err))
          setLoading(false)
        }
      }
    }
    fetchOrder()
    return () => {
      cancelled = true
    }
  }, [orderId, clearCart])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finalizing your order...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl text-center">
          <h2 className="text-lg font-semibold text-red-600">Order status unavailable</h2>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <div className="mt-4">
            <Button onClick={() => router.push("/checkout")}>Back to Checkout</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-2">Thank you for your order!</h1>
          <p className="text-gray-600 mb-6">Order ID: <strong>{order?.id}</strong></p>

          {order?.status === "paid" ? (
            <>
              <p className="text-gray-700">We have received your payment and are preparing your items for shipment.</p>
              <div className="mt-6">
                <Link href="/orders">
                  <Button>View Order Details</Button>
                </Link>
                <Link href="/chat">
                  <Button variant="ghost" className="ml-2">Continue Shopping</Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-700">We are still processing your payment. You will receive a confirmation email shortly.</p>
              <div className="mt-6">
                <Button onClick={() => window.location.reload()}>Refresh status</Button>
                <Link href="/chat">
                  <Button variant="ghost" className="ml-2">Continue Shopping</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
