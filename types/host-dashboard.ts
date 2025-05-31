export interface HostDashboardData {
  hostId: string
  hostName: string
  hostAvatar?: string
  totalStreams: number
  totalViewers: number
  totalRevenue: number
  averageRating: number
  followerCount: number
  activeStreams: LiveStream[]
  upcomingStreams: StreamSchedule[]
  recentStreams: LiveStream[]
  analytics: HostAnalytics
  notifications: HostNotification[]
}

export interface HostAnalytics {
  period: "today" | "week" | "month" | "year"
  viewerMetrics: {
    totalViews: number
    uniqueViewers: number
    averageWatchTime: number
    peakConcurrentViewers: number
    viewerGrowth: number
    retentionRate: number
  }
  engagementMetrics: {
    chatMessages: number
    pollParticipation: number
    quizParticipation: number
    averageEngagementRate: number
    topEngagementTimes: { hour: number; engagement: number }[]
  }
  revenueMetrics: {
    totalRevenue: number
    averageOrderValue: number
    conversionRate: number
    topSellingProducts: { productId: string; name: string; sales: number; revenue: number }[]
    revenueGrowth: number
  }
  contentMetrics: {
    totalStreamTime: number
    averageStreamDuration: number
    mostPopularCategories: { category: string; viewCount: number }[]
    bestPerformingStreams: { streamId: string; title: string; metrics: any }[]
  }
}

export interface HostNotification {
  id: string
  type: "stream_started" | "high_engagement" | "new_follower" | "revenue_milestone" | "technical_issue"
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionUrl?: string
  priority: "low" | "medium" | "high"
}

export interface StreamTemplate {
  id: string
  name: string
  title: string
  description: string
  category: string
  duration: number
  featuredProducts: string[]
  pollTemplates: string[]
  quizTemplates: string[]
  backgroundSettings: any
  streamSettings: any
}

export interface HostSettings {
  autoRecord: boolean
  chatModeration: boolean
  allowGuestHosts: boolean
  notificationPreferences: {
    email: boolean
    push: boolean
    sms: boolean
  }
  streamQuality: "720p" | "1080p" | "1440p" | "4K"
  defaultCategory: string
  monetizationEnabled: boolean
  subscriptionTier: "basic" | "pro" | "enterprise"
}

// Placeholder declarations to resolve linting errors.  These should be replaced with actual type definitions or imports.
declare var LiveStream: any
declare var StreamSchedule: any
