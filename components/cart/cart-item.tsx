"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, Leaf, Star } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import type { CartItem as CartItemType } from "@/types/cart"

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()
  const { product, quantity } = item

  const itemPrice = item.selectedVariant?.price || product.price
  const totalPrice = itemPrice * quantity

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id)
    } else {
      updateQuantity(item.id, newQuantity)
    }
  }

  return (
    <div className="flex space-x-3 p-3 border rounded-lg">
      <div className="relative">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-md"
        />
        {product.isOrganic && (
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-green-600 text-white rounded-full flex items-center justify-center">
            <Leaf className="h-2 w-2" />
          </Badge>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-medium text-sm truncate">{product.name}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm font-medium text-green-600">${itemPrice.toFixed(2)}</span>
              {product.sustainabilityScore && (
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-600">{product.sustainabilityScore}/10</span>
                </div>
              )}
            </div>

            {/* Certifications */}
            <div className="flex flex-wrap gap-1 mt-1">
              {product.certifications.slice(0, 2).map((cert) => (
                <Badge key={cert} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
            </div>

            {/* Carbon Footprint */}
            {product.carbonFootprint && (
              <div className="flex items-center text-xs text-gray-600 mt-1">
                <Leaf className="h-3 w-3 mr-1 text-green-500" />
                {(product.carbonFootprint * quantity).toFixed(1)}kg CO₂
              </div>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <Button variant="outline" size="sm" onClick={() => handleQuantityChange(quantity + 1)}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-right">
            <div className="font-medium text-sm">${totalPrice.toFixed(2)}</div>
            {quantity > 1 && <div className="text-xs text-gray-500">${itemPrice.toFixed(2)} each</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
