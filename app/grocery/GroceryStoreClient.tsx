"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Leaf, Truck, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"
import CurrencySelector from "@/components/grocery/currency-selector"
import CategorySidebar from "@/components/grocery/category-sidebar"
import ProductFilters from "@/components/grocery/product-filters"
import CartDrawer from "@/components/cart/cart-drawer"
import FloatingLiveShoppingButton from "@/components/grocery/floating-live-shopping-button"
import type { Product } from "@/lib/grocery-products"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

type Props = {
  products: Product[]
  categories: string[]
}

function FeaturedCarousel({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0)
  const length = products.length

  useEffect(() => {
    if (length <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % length), 4000)
    return () => clearInterval(t)
  }, [length])

  if (length === 0) return null

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-sm">
      <div className="relative h-56 md:h-72 lg:h-80">
        {products.map((p, i) => {
          // safe image access: use single `image` field with fallback
          const bg = p.image ?? "/placeholder.svg?height=600&width=1200"
          return (
            <div
              key={p.id}
              className={`absolute inset-0 transition-transform duration-500 ${
                i === index ? "translate-x-0 z-10" : i < index ? "-translate-x-full" : "translate-x-full"
              }`}
              aria-hidden={i !== index}
            >
              <div
                className="h-full w-full bg-cover bg-center flex items-end"
                style={{ backgroundImage: `url(${bg})` }}
              >
                <div className="bg-gradient-to-t from-black/60 to-transparent text-white p-4 md:p-6 w-full">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg md:text-2xl font-semibold">{p.name}</h3>
                      <p className="text-xs md:text-sm text-white/90 line-clamp-2">{p.description}</p>
                    </div>

                    <div className="text-right">
                      {"originalPrice" in p && p.originalPrice ? (
                        <div>
                          <div className="text-sm line-through text-white/70">{p.originalPrice}</div>
                          <div className="text-lg font-bold text-emerald-300">{p.price}</div>
                        </div>
                      ) : (
                        <div className="text-lg font-bold">{p.price}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {length > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={() => setIndex((i) => (i - 1 + length) % length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow-md hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Next"
            onClick={() => setIndex((i) => (i + 1) % length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow-md hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 w-8 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function GroceryStoreClient({ products: initialProducts, categories }: Props) {
  const { formatPrice } = useCurrency()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all")
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [products] = useState<Product[]>(initialProducts) // immutable on client; server passed data
  const [loading] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Modal state
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const derivedCategories = useMemo(() => categories, [categories])

  const filteredProducts = products.filter((product) => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (selectedCategory !== "all" && product.category !== selectedCategory) return false
    if (filters.minPrice && product.price != null && product.price < Number(filters.minPrice)) return false
    if (filters.maxPrice && product.price != null && product.price > Number(filters.maxPrice)) return false
    if (filters.isOrganic && !(product as any).organic) return false
    if (filters.inStock && !product.inStock) return false
    return true
  })

  // featured products
  const featuredProducts = useMemo(() => {
    const f = products.filter((p) => (p as any).isFeatured || ("discount" in p && (p as any).discount))
    if (f.length > 0) return f.slice(0, 6)
    return [...products].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 6)
  }, [products])

  // Public helper to add to cart — dispatches event that CartDrawer (or other cart logic) can listen to.
  // This avoids coupling to a specific cart API; wire CartDrawer to listen for this event:
  // window.addEventListener('runash:add-to-cart', (e) => addToCartHandler(e.detail))
  function addToCart(product: Product, qty = 1) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("runash:add-to-cart", { detail: { product, qty } }))
    }
  }

  function openProductDialog(p: Product) {
    setActiveProduct(p)
    setIsDialogOpen(true)
  }

  function closeProductDialog() {
    setActiveProduct(null)
    setIsDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 p-2">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 text-transparent bg-clip-text">
                    RunAsh
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fresh • Organic </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <CurrencySelector />
              </div>

              <div className="hidden sm:block">
                <CartDrawer />
              </div>

              <div className="sm:hidden flex items-center">
                <Button variant="ghost" onClick={() => setShowMobileFilters(true)} className="mr-2">
                  <Filter className="h-4 w-4" />
                </Button>

                <CartDrawer />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for organic products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="hidden sm:flex">
              <Button variant="outline" onClick={() => setShowMobileFilters((s) => !s)} className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats + Featured */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Truck className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-sm font-medium">Free Delivery</div>
              <div className="text-xs text-muted-foreground">Orders over {formatPrice(50)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-sm font-medium">Same Day</div>
              <div className="text-xs text-muted-foreground">Delivery available</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Leaf className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-sm font-medium">100% Organic</div>
              <div className="text-xs text-muted-foreground">Certified products</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-sm font-medium">Local Farms</div>
              <div className="text-xs text-muted-foreground">Direct sourcing</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <FeaturedCarousel products={featuredProducts} />
        </div>

        <div className="flex gap-6">
          {/* Sidebar for large screens */}
          <aside className="hidden lg:block w-64 space-y-6">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm">
                <h4 className="font-semibold mb-2">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-2 py-1 rounded ${selectedCategory === "all" ? "bg-emerald-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                  >
                    All
                  </button>
                  {derivedCategories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`w-full text-left px-2 py-1 rounded ${selectedCategory === c ? "bg-emerald-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <ProductFilters filters={filters} onFiltersChange={(f) => setFilters(f)} />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {/* Mobile category scroller */}
            <div className="mb-4 block lg:hidden">
              <div className="flex gap-3 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1 rounded-full border ${selectedCategory === "all" ? "bg-emerald-500 text-white" : "bg-white dark:bg-gray-800"}`}
                >
                  All
                </button>
                {derivedCategories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3 py-1 rounded-full border ${selectedCategory === c ? "bg-emerald-500 text-white" : "bg-white dark:bg-gray-800"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <Tabs defaultValue="products" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="products">All Products</TabsTrigger>
                <TabsTrigger value="deals">Deals</TabsTrigger>
              </TabsList>

              <TabsContent value="featured">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Featured & Promotions</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featuredProducts.map((p) => {
                      const img = p.image ?? "/placeholder.svg?height=400&width=400"
                      return (
                        <article key={p.id} className="bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm">
                          <div
                            onClick={() => openProductDialog(p)}
                            role="button"
                            tabIndex={0}
                            className="h-40 bg-cover bg-center rounded-md mb-3 cursor-pointer"
                            style={{ backgroundImage: `url(${img})` }}
                          />
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold">{p.name}</div>
                              <div className="text-xs text-muted-foreground line-clamp-2">{p.description}</div>
                            </div>
                            <div className="text-right">
                              {"originalPrice" in p && p.originalPrice ? (
                                <>
                                  <div className="text-sm line-through text-muted-foreground">{p.originalPrice}</div>
                                  <div className="text-lg font-bold text-emerald-500">{p.price}</div>
                                </>
                              ) : (
                                <div className="text-lg font-bold">{p.price}</div>
                              )}
                            </div>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="products">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      {selectedCategory === "all" ? "All Products" : `${selectedCategory} Products`}
                    </h2>
                    <div className="text-sm text-muted-foreground">{filteredProducts.length} products found</div>
                  </div>

                  {/* Responsive product grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredProducts.map((p) => {
                      const img = p.image ?? "/placeholder.svg?height=400&width=400"
                      return (
                        <article key={p.id} className="bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm flex flex-col">
                          <div
                            onClick={() => openProductDialog(p)}
                            role="button"
                            tabIndex={0}
                            className="h-36 bg-cover bg-center rounded-md mb-3 cursor-pointer"
                            style={{ backgroundImage: `url(${img})` }}
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{p.name}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">{p.description}</div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-lg font-bold">{p.price}</div>
                            <Button size="sm" onClick={() => addToCart(p)}>
                              Add
                            </Button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="deals">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Special Deals</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredProducts
                      .filter((p) => ("discount" in p && (p as any).discount))
                      .map((p) => {
                        const img = p.image ?? "/placeholder.svg?height=400&width=400"
                        return (
                          <article key={p.id} className="bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm flex flex-col">
                            <div
                              onClick={() => openProductDialog(p)}
                              role="button"
                              tabIndex={0}
                              className="h-36 bg-cover bg-center rounded-md mb-3 cursor-pointer"
                              style={{ backgroundImage: `url(${img})` }}
                            />
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{p.name}</div>
                              <div className="text-xs text-muted-foreground line-clamp-2">{p.description}</div>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <div>
                                <div className="text-sm line-through text-muted-foreground">{p.originalPrice ?? ""}</div>
                                <div className="text-lg font-bold text-emerald-500">{p.price}</div>
                              </div>
                              <Button size="sm" onClick={() => addToCart(p)}>
                                Add
                              </Button>
                            </div>
                          </article>
                        )
                      })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Mobile filters dialog */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} aria-hidden />
          <div className="relative w-full bg-white dark:bg-gray-900 rounded-t-xl p-4 max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button onClick={() => setShowMobileFilters(false)}>Close</Button>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setSelectedCategory("all"); setShowMobileFilters(false) }} className="px-3 py-1 rounded-full border">All</button>
                {derivedCategories.map((c) => (
                  <button key={c} onClick={() => { setSelectedCategory(c); setShowMobileFilters(false) }} className="px-3 py-1 rounded-full border">{c}</button>
                ))}
              </div>
            </div>

            <ProductFilters filters={filters} onFiltersChange={(f) => setFilters(f)} />
          </div>
        </div>
      )}

      {/* Product detail dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) closeProductDialog(); setIsDialogOpen(open) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeProduct?.name}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64 bg-cover bg-center rounded-md" style={{ backgroundImage: `url(${activeProduct?.image ?? "/placeholder.svg?height=600&width=600"})` }} />
            <div>
              <p className="text-sm text-muted-foreground mb-2">{activeProduct?.description}</p>

              <div className="mb-2">
                <div className="text-2xl font-bold">{activeProduct?.price}</div>
                {activeProduct?.originalPrice && <div className="text-sm line-through text-muted-foreground">{activeProduct.originalPrice}</div>}
              </div>

              <div className="mb-4 text-sm text-muted-foreground">
                {activeProduct?.inStock ? "In stock" : "Out of stock"} • {activeProduct?.unit}
              </div>

              <div className="flex gap-2">
                <Button onClick={() => { if (activeProduct) addToCart(activeProduct); closeProductDialog() }}>Add to cart</Button>
                <Button variant="outline" onClick={closeProductDialog}>Close</Button>
              </div>
            </div>
          </div>

          <DialogFooter />
        </DialogContent>
      </Dialog>

      <FloatingLiveShoppingButton />
    </div>
  )
}
