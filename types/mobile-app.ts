export interface StreamStatus {
  isLive: boolean
  title: string
  description: string
  startTime?: string
  duration?: number
  viewerCount: number
  platforms: PlatformStatus[]
}

export interface PlatformStatus {
  id: string
  name: string
  platform: string
  isActive: boolean
  viewerCount: number
  chatCount: number
}

export interface ChatMessage {
  id: string
  platform: string
  username: string
  message: string
  timestamp: string
  isHighlighted?: boolean
  isModerator?: boolean
  isSubscriber?: boolean
}

export interface StreamAnalytics {
  viewerCount: number
  peakViewers: number
  chatMessages: number
  newFollowers: number
  watchTime: number
  platformBreakdown: {
    platform: string
    viewers: number
    percentage: number
  }[]
}

export interface NotificationSettings {
  streamStart: boolean
  highViewerCount: boolean
  chatMentions: boolean
  newFollowers: boolean
  scheduledStreams: boolean
}

export interface MobileSettings {
  darkMode: "system" | "light" | "dark"
  notifications: NotificationSettings
  dataUsage: "low" | "medium" | "high"
  chatDelay: number
  biometricAuth: boolean
}

export interface ScheduledStream {
  id: string
  title: string
  description: string
  scheduledDate: string // ISO date string
  duration: number // in minutes
  platforms: string[] // platform IDs
  isRecurring: boolean
  recurrencePattern?: {
    frequency: "daily" | "weekly" | "monthly"
    interval: number // every X days/weeks/months
    daysOfWeek?: number[] // 0-6, Sunday to Saturday
    endDate?: string // ISO date string
  }
  thumbnail?: string
  tags: string[]
  category: string
  isPublic: boolean
  notificationTime: number // minutes before stream to send notification
  templateId?: string
  createdAt: string
  updatedAt: string
}
