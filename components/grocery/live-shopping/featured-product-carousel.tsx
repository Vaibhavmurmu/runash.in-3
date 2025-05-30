"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCurrencyContext } from "@/contexts/currency-context"
import type { Product } from "@/types/grocery-store"
import type { LiveFeaturedProduct } from "@/types/live-shopping"

interface FeaturedProductCarouselProps {
  products: LiveFeaturedProduct[]
  onAddToCart?: (product: Product) => void
  currentlyFeatured?: string | null
}

export default function FeaturedProductCarousel({
  products,
  onAddToCart,
  currentlyFeatured = null,
}: FeaturedProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { currency, formatPrice } = useCurrencyContext()

  // Auto-scroll to featured product when highlighted by host
  useEffect(() => {
    if (currentlyFeatured) {
      const index = products.findIndex((p) => p.id === currentlyFeatured)
      if (index !== -1) {
        setCurrentIndex(index)
      }
    }
  }, [currentlyFeatured, products])

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Featured Products</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevProduct} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextProduct} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-full px-1">
              <Card className={`overflow-hidden ${product.id === currentlyFeatured ? "ring-2 ring-primary" : ""}`}>
                <div className="relative aspect-video bg-muted">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                  {product.discount > 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-500">{product.discount}% OFF</Badge>
                  )}
                  {product.id === currentlyFeatured && (
                    <Badge className="absolute top-2 left-2 bg-primary animate-pulse">Currently Featured</Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium line-clamp-1">{product.name}</h4>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-xs">{product.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-semibold">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <Button size="sm" onClick={() => onAddToCart?.(product)} className="h-8">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        {products.map((_, i) => (
          <Button
            key={i}
            variant="ghost"
            size="icon"
            className={`h-2 w-2 rounded-full mx-1 p-0 ${i === currentIndex ? "bg-primary" : "bg-muted"}`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}
