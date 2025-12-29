export interface ChatUser {
  id: string
  username: string
  displayName: string
  avatarUrl?: string
  platform: StreamingPlatform
  roles: UserRole[]
  badges: UserBadge[]
  color?: string
}

export interface ChatMessage {
  id: string
  user: ChatUser
  content: string
  timestamp: Date
  platform: StreamingPlatform
  isDeleted: boolean
  isHighlighted: boolean
  isPinned: boolean
  isAction: boolean
  emotes: Emote[]
  mentions: string[]
  replyTo?: {
    id: string
    username: string
    content: string
  }
}

export interface Emote {
  id: string
  code: string
  url: string
  platform: StreamingPlatform
  isAnimated: boolean
  positions: [number, number][]
}

export interface UserBadge {
  id: string
  name: string
  description: string
  imageUrl: string
  platform: StreamingPlatform
}

export type UserRole = "viewer" | "subscriber" | "moderator" | "vip" | "broadcaster" | "owner"

export type StreamingPlatform = "twitch" | "youtube" | "facebook" | "tiktok" | "instagram" | "custom"

export interface ChatSettings {
  showTimestamps: boolean
  showBadges: boolean
  showAvatars: boolean
  fontSize: "small" | "medium" | "large"
  chatDelay: number
  highlightMentions: boolean
  showDeletedMessages: boolean
  enableChatCommands: boolean
  enableEmotes: boolean
  enableAutoMod: boolean
  platformSettings: {
    [key in StreamingPlatform]?: {
      enabled: boolean
      color: string
      showPlatformIcon: boolean
    }
  }
}

export interface ChatCommand {
  name: string
  description: string
  usage: string
  platforms: StreamingPlatform[]
  handler: (args: string[], message: ChatMessage) => void
}

export interface ChatStatistics {
  platform: StreamingPlatform
  messageCount: number
  userCount: number
  newUserCount: number
  messageRate: number // messages per minute
  topChatters: {
    username: string
    messageCount: number
  }[]
  engagement: number // 0-100 score
}

export interface ChatFilter {
  type: "keyword" | "regex" | "user"
  value: string
  action: "highlight" | "hide" | "delete" | "timeout" | "ban"
  platforms: StreamingPlatform[]
  isEnabled: boolean
  id: string
}
