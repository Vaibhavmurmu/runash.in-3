import type { ConversionJob, ConversionSettings, MediaFormat } from "@/types/conversion"
import type { MediaFile } from "@/types/upload"

// Available formats for conversion
export const availableFormats: MediaFormat[] = [
  // Video formats
  {
    id: "mp4",
    name: "MP4",
    extension: ".mp4",
    mimeType: "video/mp4",
    category: "video",
    description: "Most compatible video format for web and mobile",
  },
  {
    id: "webm",
    name: "WebM",
    extension: ".webm",
    mimeType: "video/webm",
    category: "video",
    description: "Optimized for web streaming with better compression",
  },
  {
    id: "mov",
    name: "QuickTime",
    extension: ".mov",
    mimeType: "video/quicktime",
    category: "video",
    description: "Apple QuickTime format with high quality",
  },
  {
    id: "avi",
    name: "AVI",
    extension: ".avi",
    mimeType: "video/x-msvideo",
    category: "video",
    description: "Classic video format with wide compatibility",
  },
  {
    id: "mkv",
    name: "MKV",
    extension: ".mkv",
    mimeType: "video/x-matroska",
    category: "video",
    description: "Container format that can hold multiple audio/video tracks",
  },

  // Audio formats
  {
    id: "mp3",
    name: "MP3",
    extension: ".mp3",
    mimeType: "audio/mpeg",
    category: "audio",
    description: "Standard compressed audio format with good quality",
  },
  {
    id: "wav",
    name: "WAV",
    extension: ".wav",
    mimeType: "audio/wav",
    category: "audio",
    description: "Uncompressed audio format with highest quality",
  },
  {
    id: "aac",
    name: "AAC",
    extension: ".aac",
    mimeType: "audio/aac",
    category: "audio",
    description: "Advanced audio coding with better compression than MP3",
  },
  {
    id: "ogg",
    name: "OGG",
    extension: ".ogg",
    mimeType: "audio/ogg",
    category: "audio",
    description: "Free, open container format for audio",
  },
  {
    id: "flac",
    name: "FLAC",
    extension: ".flac",
    mimeType: "audio/flac",
    category: "audio",
    description: "Lossless audio compression format",
  },
]

// Conversion presets
export const conversionPresets = [
  {
    id: "web-optimized",
    name: "Web Optimized",
    description: "Optimized for web streaming with good quality and file size balance",
    targetFormat: "mp4",
    settings: {
      resolution: { width: 1280, height: 720 },
      videoBitrate: 2500,
      framerate: 30,
      videoCodec: "h264",
      audioBitrate: 128,
      audioCodec: "aac",
      sampleRate: 44100,
      channels: 2,
      quality: 80,
      preserveMetadata: true,
    },
  },
  {
    id: "high-quality",
    name: "High Quality",
    description: "Maximum quality with larger file size",
    targetFormat: "mp4",
    settings: {
      resolution: { width: 1920, height: 1080 },
      videoBitrate: 8000,
      framerate: 60,
      videoCodec: "h264",
      audioBitrate: 320,
      audioCodec: "aac",
      sampleRate: 48000,
      channels: 2,
      quality: 95,
      preserveMetadata: true,
    },
  },
  {
    id: "mobile-friendly",
    name: "Mobile Friendly",
    description: "Optimized for mobile devices with smaller file size",
    targetFormat: "mp4",
    settings: {
      resolution: { width: 854, height: 480 },
      videoBitrate: 1200,
      framerate: 30,
      videoCodec: "h264",
      audioBitrate: 96,
      audioCodec: "aac",
      sampleRate: 44100,
      channels: 2,
      quality: 70,
      preserveMetadata: true,
    },
  },
  {
    id: "audio-only",
    name: "Audio Only",
    description: "Extract audio track from video",
    targetFormat: "mp3",
    settings: {
      audioBitrate: 192,
      audioCodec: "mp3",
      sampleRate: 44100,
      channels: 2,
      quality: 85,
      preserveMetadata: true,
      stripVideo: true,
    },
  },
  {
    id: "high-quality-audio",
    name: "High Quality Audio",
    description: "Maximum audio quality",
    targetFormat: "flac",
    settings: {
      audioBitrate: 1411,
      audioCodec: "flac",
      sampleRate: 48000,
      channels: 2,
      quality: 100,
      preserveMetadata: true,
    },
  },
]

// Simulate a conversion process
export const startConversion = (
  job: ConversionJob,
  onProgress: (progress: number) => void,
  onComplete: (outputFileId: string) => void,
  onError: (error: string) => void,
) => {
  let progress = 0
  const interval = setInterval(() => {
    progress += Math.random() * 5

    if (progress >= 100) {
      progress = 100
      clearInterval(interval)

      // Simulate occasional errors
      if (Math.random() < 0.05) {
        onError("Conversion failed: Unexpected error during processing")
        return
      }

      // Generate a fake output file ID
      const outputFileId = `converted-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      onComplete(outputFileId)
    } else {
      onProgress(progress)
    }
  }, 500)

  // Return a function to cancel the conversion
  return () => {
    clearInterval(interval)
  }
}

// Get compatible target formats for a given file
export const getCompatibleFormats = (file: MediaFile): MediaFormat[] => {
  if (file.type === "video") {
    return availableFormats.filter((format) => format.category === "video" || format.category === "audio")
  } else if (file.type === "audio") {
    return availableFormats.filter((format) => format.category === "audio")
  } else if (file.type === "image") {
    return availableFormats.filter((format) => format.category === "image")
  }

  return []
}

// Get file extension from mime type
export const getExtensionFromMimeType = (mimeType: string): string => {
  const format = availableFormats.find((f) => f.mimeType === mimeType)
  return format?.extension || ""
}

// Get format from extension
export const getFormatFromExtension = (extension: string): MediaFormat | undefined => {
  return availableFormats.find((f) => f.extension === extension)
}

// Create a new conversion job
export const createConversionJob = (
  file: MediaFile,
  targetFormat: string,
  settings: ConversionSettings,
): ConversionJob => {
  return {
    id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    fileId: file.id,
    fileName: file.name,
    sourceFormat: file.type,
    targetFormat,
    settings,
    status: "queued",
    progress: 0,
    startTime: new Date().toISOString(),
  }
}

// Estimate output file size based on settings and input file
export const estimateOutputSize = (
  inputSize: number,
  sourceFormat: string,
  targetFormat: string,
  settings: ConversionSettings,
): number => {
  // This is a very simplified estimation
  let compressionFactor = 1.0

  // Video formats
  if (targetFormat === "mp4") compressionFactor = 0.8
  else if (targetFormat === "webm") compressionFactor = 0.6
  else if (targetFormat === "mov") compressionFactor = 1.2
  else if (targetFormat === "avi") compressionFactor = 1.5
  // Audio formats
  else if (targetFormat === "mp3") compressionFactor = 0.1
  else if (targetFormat === "aac") compressionFactor = 0.08
  else if (targetFormat === "ogg") compressionFactor = 0.09
  else if (targetFormat === "flac") compressionFactor = 0.5
  else if (targetFormat === "wav") compressionFactor = 0.7

  // Adjust for quality settings
  if (settings.quality) {
    compressionFactor *= settings.quality / 80
  }

  // Adjust for resolution
  if (settings.resolution && sourceFormat === "video") {
    const resolutionFactor = (settings.resolution.width * settings.resolution.height) / (1280 * 720)
    compressionFactor *= resolutionFactor
  }

  // Adjust for bitrate
  if (settings.videoBitrate && sourceFormat === "video") {
    compressionFactor *= settings.videoBitrate / 2500
  }

  // Audio only conversion from video
  if (sourceFormat === "video" && settings.stripVideo) {
    compressionFactor = 0.1
  }

  return Math.round(inputSize * compressionFactor)
}
