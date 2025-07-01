"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Clock } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import type { ShippingMethod } from "@/types/cart"

export default function ShippingOptions() {
  const { state, setShipping } = useCart()

  const shippingMethods: ShippingMethod[] = [
    {
      id: "standard",
      name: "Standard Shipping",
      description: "5-7 business days",
      price: 5.99,
      estimatedDays: 6,
      carbonNeutral: false,
    },
    {
      id: "express",
      name: "Express Shipping",
      description: "2-3 business days",
      price: 12.99,
      estimatedDays: 2,
      carbonNeutral: false,
    },
    {
      id: "eco",
      name: "Eco-Friendly Shipping",
      description: "7-10 business days",
      price: 3.99,
      estimatedDays: 8,
      carbonNeutral: true,
    },
    {
      id: "free",
      name: "Free Shipping",
      description: "10-14 business days",
      price: 0,
      estimatedDays: 12,
      carbonNeutral: false,
    },
  ]

  const selectedShipping = state.cart.shippingMethod

  const handleShippingSelect = (method: ShippingMethod) => {
    setShipping(method)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Shipping Options</h3>
      <div className="space-y-2">
        {shippingMethods.map((method) => (
          <Card
            key={method.id}
            className={`cursor-pointer transition-colors ${
              selectedShipping?.id === method.id
                ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30"
                : "hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
            onClick={() => handleShippingSelect(method)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedShipping?.id === method.id ? "border-orange-500 bg-orange-500" : "border-gray-300"
                    }`}
                  >
                    {selectedShipping?.id === method.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{method.name}</span>
                      {method.carbonNeutral && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <Leaf className="h-2 w-2 mr-1" />
                          Carbon Neutral
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{method.description}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">
                    {method.price === 0 ? "Free" : `$${method.price.toFixed(2)}`}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
