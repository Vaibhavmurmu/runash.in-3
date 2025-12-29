"use client"

import { Separator } from "@/components/ui/separator"
import type { CartTotals } from "@/types/cart"

interface CartSummaryProps {
  totals: CartTotals
}

export default function CartSummary({ totals }: CartSummaryProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>${totals.subtotal.toFixed(2)}</span>
      </div>

      {totals.discount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Discount</span>
          <span>-${totals.discount.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between text-sm">
        <span>Shipping</span>
        <span>{totals.shipping === 0 ? "Free" : `$${totals.shipping.toFixed(2)}`}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Tax</span>
        <span>${totals.tax.toFixed(2)}</span>
      </div>

      <Separator />

      <div className="flex justify-between font-medium">
        <span>Total</span>
        <span className="text-lg">${totals.total.toFixed(2)}</span>
      </div>

      {totals.savings > 0 && (
        <div className="text-center text-sm text-green-600">You saved ${totals.savings.toFixed(2)}!</div>
      )}
    </div>
  )
}
