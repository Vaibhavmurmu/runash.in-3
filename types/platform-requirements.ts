export type PlatformCategory = "social-media" | "streaming" | "video-sharing" | "conferencing" | "messaging" | "other"

export type MediaType = "video" | "audio" | "image"

export type FormatRequirement = {
  format: string
  required: boolean
  recommended: boolean
  notes?: string
}

export type ResolutionRequirement = {
  width: number
  height: number
  required: boolean
  recommended: boolean
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  aspectRatio?: string
  notes?: string
}

export type BitrateRequirement = {
  min?: number
  max: number
  recommended: number
  notes?: string
}

export type FramerateRequirement = {
  min?: number
  max?: number
  recommended: number
  notes?: string
}

export type DurationRequirement = {
  min?: number
  max?: number
  notes?: string
}

export type FileSizeRequirement = {
  max: number
  notes?: string
}

export type PlatformRequirements = {
  id: string
  name: string
  logo: string
  category: PlatformCategory
  supportedMediaTypes: MediaType[]
  formats: FormatRequirement[]
  resolutions: ResolutionRequirement[]
  videoBitrate?: BitrateRequirement
  audioBitrate?: BitrateRequirement
  framerate?: FramerateRequirement
  duration?: DurationRequirement
  fileSize?: FileSizeRequirement
  additionalRequirements?: string[]
  notes?: string
  url: string
}

export type CompatibilityResult = {
  platform: PlatformRequirements
  compatible: boolean
  warnings: CompatibilityIssue[]
  errors: CompatibilityIssue[]
  score: number // 0-100
}

export type CompatibilityIssue = {
  type: "format" | "resolution" | "videoBitrate" | "audioBitrate" | "framerate" | "duration" | "fileSize" | "other"
  message: string
  severity: "warning" | "error"
  recommendation?: string
}

export type CompatibilityCheckRequest = {
  format: string
  resolution?: {
    width: number
    height: number
  }
  videoBitrate?: number
  audioBitrate?: number
  framerate?: number
  duration?: number
  fileSize?: number
  mediaType: MediaType
}
