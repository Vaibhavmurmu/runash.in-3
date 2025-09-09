"use client"

import { useState } from "react"
import { Grid, List, Search, SortAsc, ShoppingCart, Eye, Heart, Leaf, Star, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

interface LiveProduct {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  isOrganic: boolean
  streamTitle: string
  streamerName: string
  viewers: number
  category: string
  discount?: number
  isLive: boolean
  streamThumbnail: string
}

const showcaseProducts: LiveProduct[] = [
  {
    id: 1,
    name: "Organic Raw Manuka Honey",
    price: 34.99,
    originalPrice: 42.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    reviews: 234,
    isOrganic: true,
    streamTitle: "Morning Wellness Routine with Organic Honey",
    streamerName: "WellnessGuru",
    viewers: 1247,
    category: "Pantry",
    discount: 19,
    isLive: true,
    streamThumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: 2,
    name: "Cold-Pressed Coconut Oil",
    price: 18.99,
    originalPrice: 24.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviews: 189,
    isOrganic: true,
    streamTitle: "Healthy Cooking with Coconut Oil",
    streamerName: "ChefOrganic",
    viewers: 892,
    category: "Oils",
    discount: 24,
    isLive: true,
    streamThumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: 3,
    name: "Himalayan Pink Salt",
    price: 12.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviews: 156,
    isOrganic: true,
    streamTitle: "Salt Tasting & Mineral Benefits",
    streamerName: "MineralExpert",
    viewers: 634,
    category: "Seasonings",
    isLive: true,
    streamThumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: 4,
    name: "Organic Quinoa Blend",
    price: 16.99,
    originalPrice: 19.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    reviews: 98,
    isOrganic: true,
    streamTitle: "Protein-Rich Quinoa Recipes",
    streamerName: "PlantBasedChef",
    viewers: 445,
    category: "Grains",
    discount: 15,
    isLive: true,
    streamThumbnail: "/placeholder.svg?height=120&width=200",
  },
]

export function LiveProductsShowcase() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [favorites, setFavorites] = useState<number[]>([])

  const categories = ["all", "Pantry", "Oils", "Seasonings", "Grains"]

  const filteredProducts = showcaseProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              Live Product Showcase
            </h2>
            <p className="text-gray-600">Products featured in live streams right now</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search live products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-auto">
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SortAsc className="w-4 h-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
              <DropdownMenuItem>Most Viewers</DropdownMenuItem>
              <DropdownMenuItem>Highest Rated</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Products Grid/List */}
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          }
        >
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={`group overflow-hidden hover:shadow-lg transition-all duration-300 ${viewMode === "list" ? "flex" : ""}`}
            >
              <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : "aspect-square"}`}>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Live indicator */}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  LIVE
                </div>

                {/* Discount badge */}
                {product.discount && (
                  <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">-{product.discount}%</Badge>
                )}

                {/* Stream overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <Button
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-gray-900 hover:bg-white"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Watch Stream
                  </Button>
                </div>
              </div>

              <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                <div className="flex items-center gap-2 mb-2">
                  {product.isOrganic && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      <Leaf className="w-3 h-3 mr-1" />
                      Organic
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">{product.category}</span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                {/* Stream info */}
                <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-900 mb-1">{product.streamTitle}</p>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>by {product.streamerName}</span>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {product.viewers.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFavorite(product.id)}>
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                        }`}
                      />
                    </Button>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
