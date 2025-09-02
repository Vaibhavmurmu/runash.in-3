"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Heart, Star, Leaf, Truck, Eye } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/types/cart"

interface EnhancedProductGridProps {
  products: Product[]
  loading?: boolean
  onProductClick?: (product: Product) => void
  showAnalytics?: boolean
}

export default function EnhancedProductGrid({
  products,
  loading = false,
  onProductClick,
  showAnalytics = false,
}: EnhancedProductGridProps) {
  const { addToCart } = useCart()
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(product, 1)

    // Track add to cart event
    try {
      await fetch(`/api/products/${product.id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_to_cart" }),
      })
    } catch (error) {
      console.error("Failed to track add to cart:", error)
    }
  }

  const handleWishlistToggle = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId)
    } else {
      newWishlist.add(productId)
    }
    setWishlist(newWishlist)
  }

  const handleProductView = async (product: Product) => {
    if (onProductClick) {
      onProductClick(product)
    }

    // Track product view
    try {
      await fetch(`/api/products/${product.id}`)
    } catch (error) {
      console.error("Failed to track product view:", error)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6 w-24 h-24 mx-auto mb-4">
          <ShoppingCart className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => handleProductView(product)}
        >
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product.image || "/placeholder.svg?height=300&width=300"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isOrganic && (
                <Badge className="bg-green-600 text-white">
                  <Leaf className="h-3 w-3 mr-1" />
                  Organic
                </Badge>
              )}
              {product.isLocal && (
                <Badge className="bg-blue-600 text-white">
                  <Truck className="h-3 w-3 mr-1" />
                  Local
                </Badge>
              )}
              {product.discount && <Badge className="bg-red-600 text-white">{product.discount}% OFF</Badge>}
            </div>

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
              onClick={(e) => handleWishlistToggle(product.id, e)}
            >
              <Heart
                className={`h-4 w-4 ${wishlist.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
              />
            </Button>

            {/* Quick Add Button */}
            <Button
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              size="sm"
              onClick={(e) => handleAddToCart(product, e)}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>

            {/* Stock Status */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-green-600 transition-colors">
                {product.name}
              </h3>

              {/* Rating and Reviews */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">({product.reviewCount || 0})</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-green-600">${product.price.toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
                <span className="text-xs text-gray-600">/{product.unit}</span>
              </div>

              {/* Sustainability Score */}
              {product.sustainabilityScore && (
                <div className="flex items-center space-x-1">
                  <Leaf className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-gray-600">Sustainability: {product.sustainabilityScore}/10</span>
                </div>
              )}

              {/* Analytics (if enabled) */}
              {showAnalytics && product.analytics && (
                <div className="flex items-center space-x-3 text-xs text-gray-500 pt-2 border-t">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{product.analytics.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ShoppingCart className="h-3 w-3" />
                    <span>{product.analytics.addToCartCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>${product.analytics.revenue.toFixed(0)}</span>
                  </div>
                </div>
              )}

              {/* Certifications */}
              <div className="flex flex-wrap gap-1">
                {product.certifications?.slice(0, 2).map((cert) => (
                  <Badge key={cert} variant="outline" className="text-xs">
                    {cert}
                  </Badge>
                ))}
                {product.certifications && product.certifications.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.certifications.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
