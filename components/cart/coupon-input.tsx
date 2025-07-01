"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tag, X, Check } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import type { Coupon } from "@/types/cart"

export default function CouponInput() {
  const { state, applyCoupon, removeCoupon } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState("")

  // Mock coupons for demo
  const availableCoupons: Coupon[] = [
    {
      id: "1",
      code: "ORGANIC10",
      type: "percentage",
      value: 10,
      description: "10% off organic products",
      minOrderAmount: 25,
    },
    {
      id: "2",
      code: "FREESHIP",
      type: "free_shipping",
      value: 0,
      description: "Free shipping on orders over $50",
      minOrderAmount: 50,
    },
    {
      id: "3",
      code: "SAVE5",
      type: "fixed",
      value: 5,
      description: "$5 off your order",
      minOrderAmount: 30,
    },
  ]

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    setIsApplying(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      const coupon = availableCoupons.find((c) => c.code.toLowerCase() === couponCode.toLowerCase())

      if (!coupon) {
        setError("Invalid coupon code")
        setIsApplying(false)
        return
      }

      // Check if already applied
      if (state.cart.appliedCoupons.some((c) => c.id === coupon.id)) {
        setError("Coupon already applied")
        setIsApplying(false)
        return
      }

      // Check minimum order amount
      if (coupon.minOrderAmount && state.totals.subtotal < coupon.minOrderAmount) {
        setError(`Minimum order amount: $${coupon.minOrderAmount}`)
        setIsApplying(false)
        return
      }

      applyCoupon(coupon)
      setCouponCode("")
      setIsApplying(false)
    }, 1000)
  }

  const handleRemoveCoupon = (couponId: string) => {
    removeCoupon(couponId)
  }

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <div className="flex-1">
          <Input
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value)
              setError("")
            }}
            onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <Button
          variant="outline"
          onClick={handleApplyCoupon}
          disabled={!couponCode.trim() || isApplying}
          className="shrink-0"
        >
          <Tag className="h-4 w-4 mr-1" />
          {isApplying ? "Applying..." : "Apply"}
        </Button>
      </div>

      {/* Applied Coupons */}
      {state.cart.appliedCoupons.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Applied Coupons:</p>
          {state.cart.appliedCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center space-x-2">
                <Check className="h-3 w-3 text-green-600" />
                <div>
                  <span className="text-xs font-medium text-green-800 dark:text-green-200">{coupon.code}</span>
                  <p className="text-xs text-green-600 dark:text-green-400">{coupon.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleRemoveCoupon(coupon.id)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
