export interface LiveStream {
  id: string
  title: string
  description: string
  hostId: string
  hostName: string
  hostAvatar: string
  status: "scheduled" | "live" | "ended"
  startTime: Date
  endTime?: Date
  viewerCount: number
  maxViewers: number
  category: string
  tags: string[]
  thumbnailUrl: string
  streamUrl?: string
  chatEnabled: boolean
  productsEnabled: boolean
  recordingEnabled: boolean
  featuredProducts: string[]
  totalSales: number
  totalRevenue: number
}

export interface LiveStreamMessage {
  id: string
  streamId: string
  userId: string
  username: string
  userAvatar?: string
  message: string
  timestamp: Date
  type: "message" | "product_highlight" | "purchase" | "system"
  metadata?: {
    productId?: string
    productName?: string
    price?: number
    emoji?: string
  }
}

export interface LiveStreamProduct {
  id: string
  streamId: string
  productId: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  inStock: boolean
  stockQuantity: number
  isHighlighted: boolean
  highlightedAt?: Date
  salesCount: number
  category: string
  tags: string[]
}

export interface LiveStreamViewer {
  id: string
  username: string
  avatar?: string
  joinedAt: Date
  isVip: boolean
  purchaseCount: number
  totalSpent: number
}

export interface LiveStreamStats {
  streamId: string
  viewerCount: number
  peakViewers: number
  totalViews: number
  chatMessages: number
  productViews: number
  purchases: number
  revenue: number
  averageWatchTime: number
  engagementRate: number
}

export interface StreamSchedule {
  id: string
  title: string
  description: string
  hostId: string
  hostName: string
  scheduledTime: Date
  duration: number
  category: string
  featuredProducts: string[]
  isRecurring: boolean
  recurrencePattern?: "daily" | "weekly" | "monthly"
  notificationsSent: boolean
  registeredViewers: string[]
}
