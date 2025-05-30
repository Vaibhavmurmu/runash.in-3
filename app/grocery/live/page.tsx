"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  ShoppingBag,
  Calendar,
  Heart,
  Share2,
  Eye,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react"
import { CurrencyProvider } from "@/contexts/currency-context"
import LiveStreamPlayer from "@/components/grocery/live-shopping/live-stream-player"
import LiveStreamChat from "@/components/grocery/live-shopping/live-stream-chat"
import FeaturedProductCarousel from "@/components/grocery/live-shopping/featured-product-carousel"
import LiveStreamInfo from "@/components/grocery/live-shopping/live-stream-info"
import UpcomingStreams from "@/components/grocery/live-shopping/upcoming-streams"
import LiveStreamMetricsDisplay from "@/components/grocery/live-shopping/live-stream-metrics-display"
import type { LiveStream, FeaturedProduct } from "@/types/live-shopping"
import type { GroceryProduct } from "@/types/grocery-store"

// Mock data for the live stream
const mockLiveStream: LiveStream = {
  id: "ls-001",
  title: "Farm Fresh Organic Produce - Direct from Farmers",
  description:
    "Join us for a special showcase of this week's freshest organic produce. Our host Priya will be joined by local farmers to discuss sustainable farming practices and demonstrate delicious recipes using today's featured products.",
  hostName: "Priya Sharma",
  hostAvatar: "/placeholder.svg?height=100&width=100",
  thumbnailUrl: "/placeholder.svg?height=720&width=1280",
  scheduledStartTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 minutes ago
  actualStartTime: new Date(Date.now() - 28 * 60 * 1000),
  status: "live",
  viewerCount: 342,
  peakViewerCount: 450,
  totalViews: 1200,
  likeCount: 287,
  featuredProducts: [],
  chatEnabled: true,
  recordingAvailable: false,
  tags: ["organic", "farm-fresh", "seasonal", "recipes", "sustainable"],
}

// Mock grocery products
const mockProducts: GroceryProduct[] = [
  {
    id: "1",
    name: "Organic Basmati Rice",
    description: "Premium aged organic basmati rice from the foothills of Himalayas",
    price: 8.99,
    priceINR: 749,
    category: "grains-cereals",
    subcategory: "rice",
    brand: "Himalayan Harvest",
    images: ["/placeholder.svg?height=300&width=300"],
    inStock: true,
    stockQuantity: 50,
    unit: "kg",
    minOrderQuantity: 1,
    maxOrderQuantity: 10,
    isOrganic: true,
    isFreshProduce: false,
    origin: "India",
    certifications: ["USDA Organic", "India Organic", "Fair Trade"],
    sustainabilityScore: 9.2,
    carbonFootprint: 1.8,
    farmInfo: {
      farmName: "Green Valley Farms",
      location: "Punjab, India",
      farmerName: "Rajesh Kumar",
      farmingMethod: "Organic",
      certifications: ["Organic", "Sustainable"],
      distance: 1200,
    },
    reviews: [],
    averageRating: 4.8,
    totalReviews: 156,
    tags: ["gluten-free", "vegan", "premium"],
    isOnSale: true,
    salePrice: 7.99,
    saleEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    name: "Fresh Organic Mangoes",
    description: "Sweet and juicy Alphonso mangoes, hand-picked at perfect ripeness",
    price: 12.99,
    priceINR: 1080,
    category: "fruits",
    subcategory: "tropical",
    brand: "Farm Fresh",
    images: ["/placeholder.svg?height=300&width=300"],
    inStock: true,
    stockQuantity: 25,
    unit: "kg",
    minOrderQuantity: 1,
    maxOrderQuantity: 5,
    isOrganic: true,
    isFreshProduce: true,
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    harvestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    origin: "India",
    certifications: ["USDA Organic", "India Organic"],
    sustainabilityScore: 8.9,
    carbonFootprint: 0.8,
    farmInfo: {
      farmName: "Sunshine Orchards",
      location: "Maharashtra, India",
      farmerName: "Priya Sharma",
      farmingMethod: "Organic",
      certifications: ["Organic"],
      distance: 800,
    },
    reviews: [],
    averageRating: 4.9,
    totalReviews: 89,
    tags: ["seasonal", "premium", "vitamin-c"],
    isOnSale: false,
  },
  {
    id: "3",
    name: "Organic Quinoa",
    description: "Protein-rich superfood quinoa, perfect for healthy meals",
    price: 15.99,
    priceINR: 1330,
    category: "grains-cereals",
    subcategory: "quinoa",
    brand: "Superfood Co",
    images: ["/placeholder.svg?height=300&width=300"],
    inStock: true,
    stockQuantity: 30,
    unit: "kg",
    minOrderQuantity: 1,
    maxOrderQuantity: 5,
    isOrganic: true,
    isFreshProduce: false,
    origin: "Peru",
    certifications: ["USDA Organic", "Fair Trade"],
    sustainabilityScore: 9.5,
    carbonFootprint: 2.1,
    reviews: [],
    averageRating: 4.7,
    totalReviews: 234,
    tags: ["superfood", "protein", "gluten-free", "vegan"],
    isOnSale: false,
  },
  {
    id: "4",
    name: "Fresh Organic Spinach",
    description: "Nutrient-rich organic spinach, locally grown and freshly harvested",
    price: 3.99,
    priceINR: 330,
    category: "vegetables",
    subcategory: "leafy-greens",
    brand: "Local Harvest",
    images: ["/placeholder.svg?height=300&width=300"],
    inStock: true,
    stockQuantity: 40,
    unit: "bunch",
    minOrderQuantity: 1,
    maxOrderQuantity: 10,
    isOrganic: true,
    isFreshProduce: true,
    expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    harvestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    origin: "Local",
    certifications: ["USDA Organic", "Local Grown"],
    sustainabilityScore: 9.8,
    carbonFootprint: 0.3,
    farmInfo: {
      farmName: "Green Acres Farm",
      location: "Karnataka, India",
      farmerName: "Amit Patel",
      farmingMethod: "Organic",
      certifications: ["Organic", "Sustainable"],
      distance: 30,
    },
    reviews: [],
    averageRating: 4.6,
    totalReviews: 78,
    tags: ["fresh", "local", "iron-rich", "vitamin-rich"],
    isOnSale: false,
  },
  {
    id: "5",
    name: "Organic Turmeric Powder",
    description: "Premium organic turmeric powder with high curcumin content",
    price: 6.99,
    priceINR: 580,
    category: "spices-herbs",
    subcategory: "turmeric",
    brand: "Spice Haven",
    images: ["/placeholder.svg?height=300&width=300"],
    inStock: true,
    stockQuantity: 60,
    unit: "100g",
    minOrderQuantity: 1,
    maxOrderQuantity: 10,
    isOrganic: true,
    isFreshProduce: false,
    origin: "India",
    certifications: ["USDA Organic", "India Organic"],
    sustainabilityScore: 8.7,
    carbonFootprint: 1.2,
    farmInfo: {
      farmName: "Spice Gardens",
      location: "Kerala, India",
      farmerName: "Maya Thomas",
      farmingMethod: "Organic",
      certifications: ["Organic"],
      distance: 950,
    },
    reviews: [],
    averageRating: 4.9,
    totalReviews: 203,
    tags: ["anti-inflammatory", "antioxidant", "premium"],
    isOnSale: true,
    salePrice: 5.99,
    saleEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
]

// Create featured products from mock products
const mockFeaturedProducts: FeaturedProduct[] = mockProducts.map((product, index) => ({
  id: `fp-${product.id}`,
  product,
  discountPercentage: index === 0 || index === 4 ? 15 : undefined,
  specialPrice: index === 0 || index === 4 ? product.price * 0.85 : undefined,
  specialPriceINR: index === 0 || (index === 4 && product.priceINR) ? product.priceINR * 0.85 : undefined,
  spotlight: index === 0,
  spotlightStartTime: index === 0 ? new Date(Date.now() - 5 * 60 * 1000) : undefined,
  spotlightEndTime: index === 0 ? new Date(Date.now() + 10 * 60 * 1000) : undefined,
  soldDuringStream: Math.floor(Math.random() * 50),
  viewsDuringStream: Math.floor(Math.random() * 300) + 100,
  addedToCartDuringStream: Math.floor(Math.random() * 80) + 20,
}))

// Add featured products to the live stream
mockLiveStream.featuredProducts = mockFeaturedProducts
mockLiveStream.currentFeaturedProductId = mockFeaturedProducts[0].id

function LiveShoppingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const streamId = searchParams.get("id") || "ls-001"

  const [liveStream, setLiveStream] = useState<LiveStream>(mockLiveStream)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("featured")
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [isJoined, setIsJoined] = useState(false)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Simulate joining the stream
  const handleJoinStream = () => {
    setIsJoined(true)
  }

  // Navigate to product carousel
  const handlePrevProduct = () => {
    setCurrentProductIndex((prev) => (prev === 0 ? liveStream.featuredProducts.length - 1 : prev - 1))
  }

  const handleNextProduct = () => {
    setCurrentProductIndex((prev) => (prev === liveStream.featuredProducts.length - 1 ? 0 : prev + 1))
  }

  // Get current featured product
  const currentFeaturedProduct = liveStream.featuredProducts[currentProductIndex]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header with back button */}
      <div className="border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="flex items-center space-x-2" onClick={() => router.push("/grocery")}>
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Store</span>
            </Button>

            <div className="flex items-center space-x-4">
              <Badge
                variant="outline"
                className="flex items-center space-x-1 bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
              >
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                <span>LIVE</span>
              </Badge>

              <Badge variant="outline" className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{liveStream.viewerCount.toLocaleString()}</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - Video and Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            {!isJoined ? (
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <img
                  src={liveStream.thumbnailUrl || "/placeholder.svg"}
                  alt={liveStream.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h2 className="text-2xl font-bold mb-4 text-center px-4">{liveStream.title}</h2>
                  <div className="flex items-center space-x-3 mb-6">
                    <img
                      src={liveStream.hostAvatar || "/placeholder.svg"}
                      alt={liveStream.hostName}
                      className="h-10 w-10 rounded-full border-2 border-white"
                    />
                    <div>
                      <div className="text-sm opacity-80">Hosted by</div>
                      <div className="font-medium">{liveStream.hostName}</div>
                    </div>
                  </div>
                  <Button
                    onClick={handleJoinStream}
                    className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
                    size="lg"
                  >
                    <Play className="h-5 w-5" />
                    <span>Join Live Stream</span>
                  </Button>
                  <div className="flex items-center space-x-4 mt-6">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4 opacity-80" />
                      <span>{liveStream.viewerCount.toLocaleString()} watching</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 opacity-80" />
                      <span>Started {getTimeAgo(liveStream.actualStartTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <LiveStreamPlayer stream={liveStream} onLeave={() => setIsJoined(false)} />
            )}

            {/* Featured Products Carousel */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Featured Products</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={handlePrevProduct} className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleNextProduct} className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <FeaturedProductCarousel
                featuredProducts={liveStream.featuredProducts}
                currentIndex={currentProductIndex}
                onIndexChange={setCurrentProductIndex}
              />
            </div>

            {/* Stream Info Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="details">Stream Details</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="featured" className="space-y-4 pt-4">
                <LiveStreamInfo stream={liveStream} />
              </TabsContent>

              <TabsContent value="details" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">About this Stream</h3>
                    <p className="text-sm text-muted-foreground">{liveStream.description}</p>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {liveStream.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Started</h4>
                        <p className="text-sm text-muted-foreground">{liveStream.actualStartTime?.toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Host</h4>
                        <p className="text-sm text-muted-foreground">{liveStream.hostName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <LiveStreamMetricsDisplay stream={liveStream} />
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4 pt-4">
                <UpcomingStreams currentStreamId={liveStream.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Chat */}
          <div className="space-y-4">
            <LiveStreamChat
              streamId={liveStream.id}
              isJoined={isJoined}
              featuredProducts={liveStream.featuredProducts}
              currentProductId={currentFeaturedProduct?.id}
            />

            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold">Stream Actions</h3>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="flex items-center justify-center space-x-2">
                    <Heart className="h-4 w-4" />
                    <span>Like</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2">
                    <ShoppingBag className="h-4 w-4" />
                    <span>View Cart</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Schedule</span>
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>Report inappropriate content</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to format time ago
function getTimeAgo(date?: Date): string {
  if (!date) return "recently"

  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + " years ago"

  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + " months ago"

  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + " days ago"

  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + " hours ago"

  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + " minutes ago"

  return Math.floor(seconds) + " seconds ago"
}

export default function LiveShoppingPageWrapper() {
  return (
    <CurrencyProvider>
      <LiveShoppingPage />
    </CurrencyProvider>
  )
}
