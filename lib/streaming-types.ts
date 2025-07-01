export interface StreamConfig {
  id?: string
  title: string
  description: string
  category: string
  tags: string[]
  thumbnail?: string
  privacy: "public" | "unlisted" | "private"
  chatEnabled: boolean
  recordingEnabled: boolean
  quality: "720p" | "1080p" | "4K"
  bitrate: number
  frameRate: 30 | 60
  audioQuality: "standard" | "high" | "studio"
  scheduledFor?: Date
  maxDuration?: number
}

export interface StreamStatus {
  id: string
  status: "idle" | "starting" | "live" | "paused" | "ending" | "ended"
  viewerCount: number
  duration: number
  startTime?: Date
  endTime?: Date
  streamKey: string
  rtmpUrl: string
  hlsUrl?: string
  recordingUrl?: string
}

export interface StreamDevice {
  deviceId: string
  label: string
  kind: "videoinput" | "audioinput" | "audiooutput"
  groupId: string
}

export interface StreamQuality {
  width: number
  height: number
  frameRate: number
  bitrate: number
  label: string
}

export interface ChatMessage {
  id: string
  userId: string
  username: string
  message: string
  timestamp: Date
  type: "message" | "system" | "donation" | "follow"
  metadata?: {
    amount?: number
    currency?: string
    isSubscriber?: boolean
    isModerator?: boolean
  }
}

export interface StreamAnalytics {
  peakViewers: number
  averageViewers: number
  totalViews: number
  chatMessages: number
  likes: number
  shares: number
  donations: number
  newFollowers: number
  watchTime: number
  engagement: number
}
