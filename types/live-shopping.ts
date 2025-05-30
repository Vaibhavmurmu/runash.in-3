import type { GroceryProduct } from "./grocery-store"

export interface LiveStream {
  id: string
  title: string
  description: string
  hostName: string
  hostAvatar: string
  thumbnailUrl: string
  scheduledStartTime: Date
  actualStartTime?: Date
  endTime?: Date
  status: "scheduled" | "live" | "ended" | "cancelled"
  viewerCount: number
  peakViewerCount: number
  totalViews: number
  likeCount: number
  featuredProducts: FeaturedProduct[]
  currentFeaturedProductId?: string
  chatEnabled: boolean
  recordingAvailable: boolean
  recordingUrl?: string
  tags: string[]
}

export interface FeaturedProduct {
  id: string
  product: GroceryProduct
  discountPercentage?: number
  specialPrice?: number
  specialPriceINR?: number
  spotlight: boolean
  spotlightStartTime?: Date
  spotlightEndTime?: Date
  soldDuringStream: number
  viewsDuringStream: number
  addedToCartDuringStream: number
}

export interface LiveChatMessage {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  message: string
  timestamp: Date
  isHost: boolean
  isAdmin: boolean
  isPinned: boolean
  containsQuestion: boolean
  replyToMessageId?: string
  productReference?: {
    productId: string
    productName: string
  }
}

export interface LiveStreamEvent {
  id: string
  streamId: string
  eventType:
    | "stream_started"
    | "stream_ended"
    | "product_spotlight"
    | "flash_sale"
    | "question_answered"
    | "milestone_reached"
    | "special_announcement"
  timestamp: Date
  data: any
}

export interface LiveStreamMetrics {
  viewerCount: number
  peakViewerCount: number
  totalViews: number
  likeCount: number
  commentCount: number
  productViews: Record<string, number>
  productAddedToCart: Record<string, number>
  productPurchases: Record<string, number>
  averageWatchTime: number
  engagementRate: number
  conversionRate: number
}

export interface LiveStreamHost {
  id: string
  name: string
  avatar: string
  bio: string
  socialLinks: {
    instagram?: string
    twitter?: string
    youtube?: string
    tiktok?: string
  }
  expertise: string[]
  rating: number
  totalStreams: number
  followers: number
}
