"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/contexts/cart-context"

export function useCartSafe() {
  const [mounted, setMounted] = useState(false)
  const cart = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return {
      state: {
        cart: {
          id: "default",
          items: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          appliedCoupons: [],
          sustainabilityMetrics: {
            totalCarbonFootprint: 0,
            organicPercentage: 0,
            localProductsCount: 0,
            sustainabilityScore: 0,
            certificationCounts: {},
          },
        },
        isOpen: false,
        totals: {
          subtotal: 0,
          shipping: 0,
          tax: 0,
          discount: 0,
          total: 0,
          savings: 0,
        },
      },
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      toggleCart: () => {},
      applyCoupon: () => {},
      removeCoupon: () => {},
      setShipping: () => {},
      getItemCount: () => 0,
      getCartWeight: () => 0,
      mounted: false,
    }
  }

  return {
    ...cart,
    mounted: true,
  }
}
