import type { StreamingPlatform } from "@/types/platform-chat"
import { TwitchIcon, YouTubeIcon, FacebookIcon, TikTokIcon, InstagramIcon, CustomRTMPIcon } from "../platform-icons"

export function getPlatformColor(platform: StreamingPlatform): string {
  switch (platform) {
    case "twitch":
      return "#9146FF"
    case "youtube":
      return "#FF0000"
    case "facebook":
      return "#1877F2"
    case "tiktok":
      return "#000000"
    case "instagram":
      return "#E1306C"
    case "custom":
      return "#0078D7"
    default:
      return "#888888"
  }
}

export function getPlatformIcon(platform: StreamingPlatform) {
  switch (platform) {
    case "twitch":
      return TwitchIcon
    case "youtube":
      return YouTubeIcon
    case "facebook":
      return FacebookIcon
    case "tiktok":
      return TikTokIcon
    case "instagram":
      return InstagramIcon
    case "custom":
      return CustomRTMPIcon
    default:
      return CustomRTMPIcon
  }
}

export function getPlatformName(platform: StreamingPlatform): string {
  switch (platform) {
    case "twitch":
      return "Twitch"
    case "youtube":
      return "YouTube"
    case "facebook":
      return "Facebook"
    case "tiktok":
      return "TikTok"
    case "instagram":
      return "Instagram"
    case "custom":
      return "Custom RTMP"
    default:
      return platform
  }
}

export function getPlatformChatFeatures(platform: StreamingPlatform): string[] {
  switch (platform) {
    case "twitch":
      return ["Emotes", "Badges", "Cheers", "Predictions", "Polls", "Raids", "Subscriptions"]
    case "youtube":
      return ["Super Chats", "Memberships", "Emotes", "Polls"]
    case "facebook":
      return ["Reactions", "Stars", "Subscriptions", "Polls"]
    case "tiktok":
      return ["Gifts", "Follows", "Comments", "Shares"]
    case "instagram":
      return ["Comments", "Likes", "Follows"]
    case "custom":
      return ["Basic Chat"]
    default:
      return ["Basic Chat"]
  }
}
