import type { MediaFormat, ConversionSettings } from "./conversion"

export type ContentType =
  | "animation"
  | "talking-head"
  | "screen-recording"
  | "gaming"
  | "music"
  | "podcast"
  | "lecture"
  | "interview"
  | "vlog"
  | "cinematic"
  | "sports"
  | "other"

export type IntendedUse = "web-streaming" | "social-media" | "archiving" | "editing" | "mobile" | "presentation"

export type TargetPlatform =
  | "youtube"
  | "twitch"
  | "instagram"
  | "tiktok"
  | "facebook"
  | "twitter"
  | "discord"
  | "zoom"
  | "general-web"

export type ContentAnalysis = {
  contentType: ContentType
  visualComplexity: number // 0-100
  motionLevel: number // 0-100
  colorDepth: number // 0-100
  audioQuality: number // 0-100
  speechContent: boolean
  musicContent: boolean
  noiseLevel: number // 0-100
  duration: number // in seconds
  confidence: number // 0-100
}

export type FormatRecommendation = {
  id: string
  format: MediaFormat
  settings: ConversionSettings
  score: number // 0-100
  reasons: string[]
  intendedUse: IntendedUse
  targetPlatform?: TargetPlatform
}

export type RecommendationRequest = {
  fileId: string
  fileName: string
  fileType: string
  fileSize: number
  duration?: number
  width?: number
  height?: number
  intendedUse?: IntendedUse
  targetPlatform?: TargetPlatform
}
