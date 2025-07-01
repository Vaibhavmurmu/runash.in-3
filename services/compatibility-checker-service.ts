import type {
  CompatibilityCheckRequest,
  CompatibilityIssue,
  CompatibilityResult,
  PlatformRequirements,
} from "@/types/platform-requirements"
import { getAllPlatforms, getPlatformById } from "./platform-requirements-service"

// Check compatibility with a specific platform
export const checkCompatibility = (
  request: CompatibilityCheckRequest,
  platformId: string,
): CompatibilityResult | null => {
  const platform = getPlatformById(platformId)
  if (!platform) return null

  return checkCompatibilityWithPlatform(request, platform)
}

// Check compatibility with all platforms
export const checkCompatibilityWithAllPlatforms = (request: CompatibilityCheckRequest): CompatibilityResult[] => {
  const platforms = getAllPlatforms()
  return platforms
    .filter((platform) => platform.supportedMediaTypes.includes(request.mediaType))
    .map((platform) => checkCompatibilityWithPlatform(request, platform))
}

// Check compatibility with a specific platform
const checkCompatibilityWithPlatform = (
  request: CompatibilityCheckRequest,
  platform: PlatformRequirements,
): CompatibilityResult => {
  const issues: CompatibilityIssue[] = []

  // Check format compatibility
  const formatIssue = checkFormatCompatibility(request.format, platform)
  if (formatIssue) issues.push(formatIssue)

  // Check resolution compatibility
  if (request.resolution) {
    const resolutionIssue = checkResolutionCompatibility(request.resolution, platform)
    if (resolutionIssue) issues.push(resolutionIssue)
  }

  // Check video bitrate compatibility
  if (request.videoBitrate && platform.videoBitrate) {
    const videoBitrateIssue = checkVideoBitrateCompatibility(request.videoBitrate, platform)
    if (videoBitrateIssue) issues.push(videoBitrateIssue)
  }

  // Check audio bitrate compatibility
  if (request.audioBitrate && platform.audioBitrate) {
    const audioBitrateIssue = checkAudioBitrateCompatibility(request.audioBitrate, platform)
    if (audioBitrateIssue) issues.push(audioBitrateIssue)
  }

  // Check framerate compatibility
  if (request.framerate && platform.framerate) {
    const framerateIssue = checkFramerateCompatibility(request.framerate, platform)
    if (framerateIssue) issues.push(framerateIssue)
  }

  // Check duration compatibility
  if (request.duration && platform.duration) {
    const durationIssue = checkDurationCompatibility(request.duration, platform)
    if (durationIssue) issues.push(durationIssue)
  }

  // Check file size compatibility
  if (request.fileSize && platform.fileSize) {
    const fileSizeIssue = checkFileSizeCompatibility(request.fileSize, platform)
    if (fileSizeIssue) issues.push(fileSizeIssue)
  }

  // Separate warnings and errors
  const warnings = issues.filter((issue) => issue.severity === "warning")
  const errors = issues.filter((issue) => issue.severity === "error")

  // Calculate compatibility score
  const score = calculateCompatibilityScore(issues)

  return {
    platform,
    compatible: errors.length === 0,
    warnings,
    errors,
    score,
  }
}

// Check format compatibility
const checkFormatCompatibility = (format: string, platform: PlatformRequirements): CompatibilityIssue | null => {
  const supportedFormats = platform.formats
  const formatSupport = supportedFormats.find((f) => f.format.toLowerCase() === format.toLowerCase())

  if (!formatSupport) {
    return {
      type: "format",
      message: `Format ${format} is not supported by ${platform.name}`,
      severity: "error",
      recommendation: `Convert to one of these formats: ${supportedFormats
        .filter((f) => f.required)
        .map((f) => f.format)
        .join(", ")}`,
    }
  }

  if (!formatSupport.recommended) {
    return {
      type: "format",
      message: `Format ${format} is supported but not recommended by ${platform.name}`,
      severity: "warning",
      recommendation: `Consider using ${supportedFormats
        .filter((f) => f.recommended)
        .map((f) => f.format)
        .join(", ")} for optimal compatibility`,
    }
  }

  return null
}

// Check resolution compatibility
const checkResolutionCompatibility = (
  resolution: { width: number; height: number },
  platform: PlatformRequirements,
): CompatibilityIssue | null => {
  const { width, height } = resolution
  const supportedResolutions = platform.resolutions

  // Check if resolution is supported
  const exactMatch = supportedResolutions.find((r) => r.width === width && r.height === height)

  if (exactMatch) {
    if (!exactMatch.recommended) {
      return {
        type: "resolution",
        message: `Resolution ${width}x${height} is supported but not recommended by ${platform.name}`,
        severity: "warning",
        recommendation: `Consider using ${supportedResolutions
          .filter((r) => r.recommended)
          .map((r) => `${r.width}x${r.height}`)
          .join(", ")} for optimal quality`,
      }
    }
    return null
  }

  // Check if resolution is within min/max bounds
  const withinBounds = supportedResolutions.some((r) => {
    const minWidth = r.minWidth || 0
    const minHeight = r.minHeight || 0
    const maxWidth = r.maxWidth || Number.POSITIVE_INFINITY
    const maxHeight = r.maxHeight || Number.POSITIVE_INFINITY

    return width >= minWidth && width <= maxWidth && height >= minHeight && height <= maxHeight
  })

  if (withinBounds) {
    return {
      type: "resolution",
      message: `Resolution ${width}x${height} is not standard for ${platform.name}`,
      severity: "warning",
      recommendation: `Consider using ${supportedResolutions
        .filter((r) => r.recommended)
        .map((r) => `${r.width}x${r.height}`)
        .join(", ")} for optimal quality`,
    }
  }

  // Check if any resolution is higher
  const anyHigherResolution = supportedResolutions.some((r) => r.width >= width && r.height >= height)

  if (anyHigherResolution) {
    return {
      type: "resolution",
      message: `Resolution ${width}x${height} is lower than recommended for ${platform.name}`,
      severity: "warning",
      recommendation: `Consider using a higher resolution for better quality`,
    }
  }

  // Check if resolution is too high
  const allLowerResolution = supportedResolutions.every((r) => r.width < width || r.height < height)

  if (allLowerResolution) {
    return {
      type: "resolution",
      message: `Resolution ${width}x${height} exceeds the maximum supported by ${platform.name}`,
      severity: "warning",
      recommendation: `Consider downscaling to ${Math.max(...supportedResolutions.map((r) => r.width))}x${Math.max(
        ...supportedResolutions.map((r) => r.height),
      )} or lower`,
    }
  }

  return {
    type: "resolution",
    message: `Resolution ${width}x${height} may not be optimal for ${platform.name}`,
    severity: "warning",
    recommendation: `Consider using ${supportedResolutions
      .filter((r) => r.recommended)
      .map((r) => `${r.width}x${r.height}`)
      .join(", ")} for optimal quality`,
  }
}

// Check video bitrate compatibility
const checkVideoBitrateCompatibility = (bitrate: number, platform: PlatformRequirements): CompatibilityIssue | null => {
  if (!platform.videoBitrate) return null

  const { min = 0, max, recommended } = platform.videoBitrate

  if (bitrate < min) {
    return {
      type: "videoBitrate",
      message: `Video bitrate ${bitrate} kbps is below the minimum ${min} kbps required by ${platform.name}`,
      severity: "warning",
      recommendation: `Increase video bitrate to at least ${min} kbps`,
    }
  }

  if (bitrate > max) {
    return {
      type: "videoBitrate",
      message: `Video bitrate ${bitrate} kbps exceeds the maximum ${max} kbps supported by ${platform.name}`,
      severity: "warning",
      recommendation: `Reduce video bitrate to ${max} kbps or lower`,
    }
  }

  if (bitrate < recommended * 0.7) {
    return {
      type: "videoBitrate",
      message: `Video bitrate ${bitrate} kbps is significantly lower than the recommended ${recommended} kbps for ${platform.name}`,
      severity: "warning",
      recommendation: `Consider increasing video bitrate to ${recommended} kbps for better quality`,
    }
  }

  return null
}

// Check audio bitrate compatibility
const checkAudioBitrateCompatibility = (bitrate: number, platform: PlatformRequirements): CompatibilityIssue | null => {
  if (!platform.audioBitrate) return null

  const { min = 0, max, recommended } = platform.audioBitrate

  if (bitrate < min) {
    return {
      type: "audioBitrate",
      message: `Audio bitrate ${bitrate} kbps is below the minimum ${min} kbps required by ${platform.name}`,
      severity: "warning",
      recommendation: `Increase audio bitrate to at least ${min} kbps`,
    }
  }

  if (bitrate > max) {
    return {
      type: "audioBitrate",
      message: `Audio bitrate ${bitrate} kbps exceeds the maximum ${max} kbps supported by ${platform.name}`,
      severity: "warning",
      recommendation: `Reduce audio bitrate to ${max} kbps or lower`,
    }
  }

  if (bitrate < recommended * 0.7) {
    return {
      type: "audioBitrate",
      message: `Audio bitrate ${bitrate} kbps is lower than the recommended ${recommended} kbps for ${platform.name}`,
      severity: "warning",
      recommendation: `Consider increasing audio bitrate to ${recommended} kbps for better quality`,
    }
  }

  return null
}

// Check framerate compatibility
const checkFramerateCompatibility = (framerate: number, platform: PlatformRequirements): CompatibilityIssue | null => {
  if (!platform.framerate) return null

  const { min = 0, max = Number.POSITIVE_INFINITY, recommended } = platform.framerate

  if (framerate < min) {
    return {
      type: "framerate",
      message: `Framerate ${framerate} fps is below the minimum ${min} fps required by ${platform.name}`,
      severity: "warning",
      recommendation: `Increase framerate to at least ${min} fps`,
    }
  }

  if (framerate > max) {
    return {
      type: "framerate",
      message: `Framerate ${framerate} fps exceeds the maximum ${max} fps supported by ${platform.name}`,
      severity: "error",
      recommendation: `Reduce framerate to ${max} fps or lower`,
    }
  }

  if (framerate !== recommended && max >= recommended) {
    return {
      type: "framerate",
      message: `Framerate ${framerate} fps is different from the recommended ${recommended} fps for ${platform.name}`,
      severity: "warning",
      recommendation: `Consider using ${recommended} fps for optimal playback`,
    }
  }

  return null
}

// Check duration compatibility
const checkDurationCompatibility = (duration: number, platform: PlatformRequirements): CompatibilityIssue | null => {
  if (!platform.duration) return null

  const { min = 0, max = Number.POSITIVE_INFINITY } = platform.duration

  if (duration < min) {
    return {
      type: "duration",
      message: `Duration ${formatDuration(duration)} is below the minimum ${formatDuration(min)} required by ${
        platform.name
      }`,
      severity: "warning",
      recommendation: `Increase duration to at least ${formatDuration(min)}`,
    }
  }

  if (duration > max) {
    return {
      type: "duration",
      message: `Duration ${formatDuration(duration)} exceeds the maximum ${formatDuration(max)} supported by ${
        platform.name
      }`,
      severity: "error",
      recommendation: `Reduce duration to ${formatDuration(max)} or lower`,
    }
  }

  return null
}

// Check file size compatibility
const checkFileSizeCompatibility = (fileSize: number, platform: PlatformRequirements): CompatibilityIssue | null => {
  if (!platform.fileSize) return null

  const { max } = platform.fileSize

  if (fileSize > max) {
    return {
      type: "fileSize",
      message: `File size ${formatFileSize(fileSize)} exceeds the maximum ${formatFileSize(max)} supported by ${
        platform.name
      }`,
      severity: "error",
      recommendation: `Reduce file size to ${formatFileSize(max)} or lower by using a lower bitrate or resolution`,
    }
  }

  return null
}

// Calculate compatibility score (0-100)
const calculateCompatibilityScore = (issues: CompatibilityIssue[]): number => {
  if (issues.length === 0) return 100

  const errorPenalty = 25
  const warningPenalty = 10

  const errors = issues.filter((issue) => issue.severity === "error").length
  const warnings = issues.filter((issue) => issue.severity === "warning").length

  const score = 100 - errors * errorPenalty - warnings * warningPenalty
  return Math.max(0, score)
}

// Format duration in seconds to human-readable format
const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds} seconds`
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`
  return `${Math.floor(seconds / 3600)} hours ${Math.floor((seconds % 3600) / 60)} minutes`
}

// Format file size in MB to human-readable format
const formatFileSize = (mb: number): string => {
  if (mb < 1000) return `${mb} MB`
  return `${(mb / 1000).toFixed(1)} GB`
}
