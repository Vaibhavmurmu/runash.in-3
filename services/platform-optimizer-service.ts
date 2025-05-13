import type { ConversionSettings } from "@/types/conversion"
import { getPlatformById } from "./platform-requirements-service"

// Optimize settings for a specific platform
export const optimizeForPlatform = (
  platformId: string,
  mediaType: "video" | "audio",
): { format: string; settings: ConversionSettings } => {
  const platform = getPlatformById(platformId)
  if (!platform) {
    return {
      format: mediaType === "video" ? "mp4" : "mp3",
      settings: getDefaultSettings(mediaType),
    }
  }

  // Get recommended format
  const recommendedFormat =
    platform.formats.find((f) => f.recommended)?.format ||
    platform.formats[0]?.format ||
    (mediaType === "video" ? "mp4" : "mp3")

  // Create optimized settings
  const settings: ConversionSettings = {
    preserveMetadata: true,
  }

  // Set resolution
  if (mediaType === "video") {
    const recommendedResolution = platform.resolutions.find((r) => r.recommended)
    if (recommendedResolution) {
      settings.resolution = {
        width: recommendedResolution.width,
        height: recommendedResolution.height,
      }
    }
  }

  // Set video bitrate
  if (platform.videoBitrate && mediaType === "video") {
    settings.videoBitrate = platform.videoBitrate.recommended
  }

  // Set audio bitrate
  if (platform.audioBitrate) {
    settings.audioBitrate = platform.audioBitrate.recommended
  }

  // Set framerate
  if (platform.framerate && mediaType === "video") {
    settings.framerate = platform.framerate.recommended
  }

  // Fill in any missing settings with defaults
  return {
    format: recommendedFormat,
    settings: {
      ...getDefaultSettings(mediaType),
      ...settings,
    },
  }
}

// Get default settings based on media type
const getDefaultSettings = (mediaType: "video" | "audio"): ConversionSettings => {
  if (mediaType === "audio") {
    return {
      audioBitrate: 192,
      quality: 85,
      preserveMetadata: true,
    }
  }

  return {
    resolution: { width: 1920, height: 1080 },
    videoBitrate: 5000,
    framerate: 30,
    audioBitrate: 192,
    quality: 85,
    preserveMetadata: true,
  }
}
