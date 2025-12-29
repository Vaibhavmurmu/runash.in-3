import type { PlatformRequirements } from "@/types/platform-requirements"

type PlatformCategory = "video-sharing" | "streaming" | "social-media" | "messaging" | "conferencing"

export const platformRequirements: PlatformRequirements[] = [
  {
    id: "youtube",
    name: "YouTube",
    logo: "/platforms/youtube.png",
    category: "video-sharing",
    supportedMediaTypes: ["video", "audio"],
    formats: [
      { format: "mp4", required: true, recommended: true, notes: "H.264 codec recommended" },
      { format: "mov", required: true, recommended: false },
      { format: "avi", required: true, recommended: false },
      { format: "wmv", required: true, recommended: false },
      { format: "flv", required: true, recommended: false },
      { format: "webm", required: true, recommended: false, notes: "VP9 codec supported" },
    ],
    resolutions: [
      { width: 3840, height: 2160, required: false, recommended: true, notes: "4K" },
      { width: 2560, height: 1440, required: false, recommended: true, notes: "2K" },
      { width: 1920, height: 1080, required: false, recommended: true, notes: "1080p" },
      { width: 1280, height: 720, required: false, recommended: true, notes: "720p" },
      { width: 854, height: 480, required: false, recommended: false, notes: "480p" },
      { width: 640, height: 360, required: false, recommended: false, notes: "360p" },
      { width: 426, height: 240, required: false, recommended: false, notes: "240p" },
    ],
    videoBitrate: {
      max: 68000,
      recommended: 8000,
      notes: "8 Mbps for 1080p, 45-68 Mbps for 4K",
    },
    audioBitrate: {
      max: 384,
      recommended: 128,
      notes: "128 kbps for stereo, 384 kbps for 5.1 surround",
    },
    framerate: {
      max: 60,
      recommended: 30,
      notes: "24, 25, 30, 48, 50, 60 fps supported",
    },
    duration: {
      max: 43200, // 12 hours in seconds
      notes: "Maximum 12 hours for verified accounts",
    },
    fileSize: {
      max: 256000, // 256 GB in MB
      notes: "Maximum 256 GB for verified accounts",
    },
    additionalRequirements: ["16:9 aspect ratio recommended for standard player", "Stereo or 5.1 surround sound"],
    url: "https://support.google.com/youtube/answer/1722171",
  },
  {
    id: "twitch",
    name: "Twitch",
    logo: "/platforms/twitch.svg",
    category: "streaming",
    supportedMediaTypes: ["video"],
    formats: [{ format: "mp4", required: true, recommended: true, notes: "H.264 codec required" }],
    resolutions: [
      { width: 1920, height: 1080, required: false, recommended: true, notes: "1080p" },
      { width: 1280, height: 720, required: false, recommended: true, notes: "720p" },
      { width: 854, height: 480, required: false, recommended: false, notes: "480p" },
      { width: 640, height: 360, required: false, recommended: false, notes: "360p" },
    ],
    videoBitrate: {
      max: 6000,
      recommended: 4500,
      notes: "3500-5000 kbps for 1080p, 2500-4000 kbps for 720p",
    },
    audioBitrate: {
      max: 320,
      recommended: 160,
      notes: "128-160 kbps recommended",
    },
    framerate: {
      max: 60,
      recommended: 30,
      notes: "30 or 60 fps recommended",
    },
    additionalRequirements: ["Keyframe interval: 2 seconds", "CBR (Constant Bitrate) encoding recommended"],
    url: "https://help.twitch.tv/s/article/broadcast-guidelines",
  },
  {
    id: "instagram",
    name: "Instagram",
    logo: "/platforms/instagram.svg",
    category: "social-media",
    supportedMediaTypes: ["video", "image"],
    formats: [{ format: "mp4", required: true, recommended: true, notes: "H.264 codec required" }],
    resolutions: [
      { width: 1080, height: 1080, required: false, recommended: true, notes: "Square format" },
      { width: 1080, height: 1350, required: false, recommended: true, notes: "Portrait 4:5" },
      { width: 1080, height: 608, required: false, recommended: true, notes: "Landscape 16:9" },
      { width: 1080, height: 1920, required: false, recommended: true, notes: "Stories/Reels 9:16" },
    ],
    videoBitrate: {
      max: 5000,
      recommended: 3500,
      notes: "3500 kbps recommended",
    },
    audioBitrate: {
      max: 128,
      recommended: 128,
      notes: "AAC audio codec",
    },
    framerate: {
      max: 30,
      recommended: 30,
      notes: "30 fps recommended",
    },
    duration: {
      max: 60, // 60 seconds for feed videos
      notes:
        "60 seconds for feed videos, 15 seconds for stories, 90 seconds for IGTV previews, up to 60 minutes for IGTV",
    },
    fileSize: {
      max: 4000, // 4 GB in MB
      notes: "Maximum 4 GB for IGTV",
    },
    additionalRequirements: [
      "H.264 codec, AAC audio",
      "Square (1:1), portrait (4:5), or landscape (16:9) aspect ratio",
    ],
    url: "https://help.instagram.com/1631821640426723",
  },
  {
    id: "tiktok",
    name: "TikTok",
    logo: "/platforms/tiktok.svg",
    category: "social-media",
    supportedMediaTypes: ["video"],
    formats: [
      { format: "mp4", required: true, recommended: true },
      { format: "mov", required: true, recommended: false },
    ],
    resolutions: [{ width: 1080, height: 1920, required: false, recommended: true, notes: "9:16 aspect ratio" }],
    videoBitrate: {
      recommended: 5000,
      max: 8000,
      notes: "5-8 Mbps recommended",
    },
    audioBitrate: {
      recommended: 128,
      max: 192,
      notes: "128 kbps recommended",
    },
    framerate: {
      recommended: 30,
      max: 60,
      notes: "30 fps recommended",
    },
    duration: {
      max: 180, // 3 minutes in seconds
      notes: "15 seconds to 3 minutes",
    },
    fileSize: {
      max: 287, // 287 MB
      notes: "Maximum 287 MB for mobile uploads",
    },
    additionalRequirements: ["9:16 aspect ratio (vertical) recommended", "H.264 and H.265 codecs supported"],
    url: "https://www.tiktok.com/creators/creator-portal/",
  },
  {
    id: "facebook",
    name: "Facebook",
    logo: "/platforms/facebook.svg",
    category: "social-media",
    supportedMediaTypes: ["video", "image"],
    formats: [
      { format: "mp4", required: true, recommended: true, notes: "H.264 codec recommended" },
      { format: "mov", required: true, recommended: false },
    ],
    resolutions: [
      { width: 1280, height: 720, required: false, recommended: true, notes: "720p minimum recommended" },
      { width: 1920, height: 1080, required: false, recommended: true, notes: "1080p recommended" },
    ],
    videoBitrate: {
      recommended: 4000,
      max: 8000,
      notes: "4 Mbps recommended for 1080p",
    },
    audioBitrate: {
      recommended: 128,
      max: 256,
      notes: "128 kbps recommended",
    },
    framerate: {
      recommended: 30,
      max: 60,
      notes: "30 fps recommended",
    },
    duration: {
      max: 14400, // 4 hours in seconds
      notes: "Maximum 4 hours",
    },
    fileSize: {
      max: 10000, // 10 GB in MB
      notes: "Maximum 10 GB",
    },
    additionalRequirements: ["Aspect ratios between 9:16 and 16:9 supported", "H.264 codec, AAC audio"],
    url: "https://www.facebook.com/business/help/1738097009786294",
  },
  {
    id: "twitter",
    name: "Twitter",
    logo: "/platforms/twitter.svg",
    category: "social-media",
    supportedMediaTypes: ["video", "image"],
    formats: [
      { format: "mp4", required: true, recommended: true, notes: "H.264 codec required" },
      { format: "mov", required: true, recommended: false },
    ],
    resolutions: [{ width: 1920, height: 1080, required: false, recommended: true, notes: "1080p maximum" }],
    videoBitrate: {
      recommended: 5000,
      max: 25000,
      notes: "5 Mbps recommended",
    },
    audioBitrate: {
      recommended: 128,
      max: 128,
      notes: "AAC audio codec",
    },
    framerate: {
      recommended: 30,
      max: 60,
      notes: "30 fps recommended, 60 fps maximum",
    },
    duration: {
      max: 140, // 2 minutes 20 seconds
      notes: "Maximum 2 minutes 20 seconds for standard accounts",
    },
    fileSize: {
      max: 512, // 512 MB
      notes: "Maximum 512 MB for Twitter Blue subscribers, 15 MB for standard accounts",
    },
    additionalRequirements: ["Aspect ratios between 1:3 and 3:1 supported", "H.264 codec, AAC audio"],
    url: "https://help.twitter.com/en/using-twitter/twitter-videos",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    logo: "/platforms/linkedin.svg",
    category: "social-media",
    supportedMediaTypes: ["video", "image"],
    formats: [
      { format: "mp4", required: true, recommended: true },
      { format: "mov", required: false, recommended: false },
      { format: "wmv", required: false, recommended: false },
      { format: "flv", required: false, recommended: false },
    ],
    resolutions: [{ width: 1920, height: 1080, required: false, recommended: true, notes: "1080p maximum" }],
    videoBitrate: {
      recommended: 5000,
      max: 10000,
      notes: "5 Mbps recommended",
    },
    audioBitrate: {
      recommended: 128,
      max: 192,
      notes: "128 kbps recommended",
    },
    framerate: {
      recommended: 30,
      max: 60,
      notes: "30 fps recommended",
    },
    duration: {
      max: 900, // 15 minutes in seconds
      notes: "Maximum 15 minutes",
    },
    fileSize: {
      max: 5000, // 5 GB in MB
      notes: "Maximum 5 GB",
    },
    additionalRequirements: ["Aspect ratios between 1:2.4 and 2.4:1 supported"],
    url: "https://www.linkedin.com/help/linkedin/answer/a521928",
  },
  {
    id: "discord",
    name: "Discord",
    logo: "/platforms/discord.svg",
    category: "messaging",
    supportedMediaTypes: ["video", "audio", "image"],
    formats: [
      { format: "mp4", required: true, recommended: true },
      { format: "webm", required: true, recommended: false },
      { format: "mov", required: true, recommended: false },
    ],
    resolutions: [{ width: 1280, height: 720, required: false, recommended: true, notes: "720p recommended" }],
    videoBitrate: {
      recommended: 3000,
      max: 8000,
      notes: "3 Mbps recommended",
    },
    audioBitrate: {
      recommended: 128,
      max: 192,
      notes: "128 kbps recommended",
    },
    framerate: {
      recommended: 30,
      max: 60,
      notes: "30 fps recommended",
    },
    fileSize: {
      max: 100, // 100 MB for free users, 500 MB for Nitro subscribers
      notes: "Maximum 100 MB for free users, 500 MB for Nitro subscribers",
    },
    url: "https://support.discord.com/hc/en-us/articles/360028717192-File-Attachment-Limits",
  },
  {
    id: "zoom",
    name: "Zoom",
    logo: "/platforms/zoom.svg",
    category: "conferencing",
    supportedMediaTypes: ["video", "audio"],
    formats: [
      { format: "mp4", required: true, recommended: true },
      { format: "m4a", required: true, recommended: false, notes: "For audio only" },
      { format: "mp3", required: true, recommended: false, notes: "For audio only" },
    ],
    resolutions: [{ width: 1280, height: 720, required: false, recommended: true, notes: "720p recommended" }],
    videoBitrate: {
      recommended: 1800,
      max: 3000,
      notes: "1.8 Mbps recommended for 720p",
    },
    audioBitrate: {
      recommended: 128,
      max: 192,
      notes: "128 kbps recommended",
    },
    framerate: {
      recommended: 30,
      max: 30,
      notes: "30 fps maximum",
    },
    fileSize: {
      max: 512, // 512 MB
      notes: "Maximum 512 MB for shared videos",
    },
    url: "https://support.zoom.us/hc/en-us/articles/360037870291-Sharing-a-video-in-a-meeting",
  },
  {
    id: "vimeo",
    name: "Vimeo",
    logo: "/platforms/vimeo.svg",
    category: "video-sharing",
    supportedMediaTypes: ["video"],
    formats: [
      { format: "mp4", required: true, recommended: true, notes: "H.264 codec recommended" },
      { format: "mov", required: true, recommended: false },
      { format: "wmv", required: true, recommended: false },
      { format: "avi", required: true, recommended: false },
    ],
    resolutions: [
      { width: 3840, height: 2160, required: false, recommended: true, notes: "4K" },
      { width: 2560, height: 1440, required: false, recommended: true, notes: "2K" },
      { width: 1920, height: 1080, required: false, recommended: true, notes: "1080p" },
      { width: 1280, height: 720, required: false, recommended: true, notes: "720p" },
    ],
    videoBitrate: {
      recommended: 10000,
      max: 80000,
      notes: "10-20 Mbps for 1080p, 30-60 Mbps for 4K",
    },
    audioBitrate: {
      recommended: 320,
      max: 320,
      notes: "320 kbps maximum",
    },
    framerate: {
      recommended: 30,
      max: 60,
      notes: "24, 25, 30, 60 fps supported",
    },
    fileSize: {
      max: 256000, // 256 GB in MB for paid accounts
      notes: "Maximum 256 GB for paid accounts, weekly limits for free accounts",
    },
    additionalRequirements: ["H.264 codec, AAC audio", "Constant frame rate required"],
    url: "https://vimeo.com/help/video-compression-guidelines",
  },
]

// Get platform by ID
export const getPlatformById = (id: string): PlatformRequirements | undefined => {
  return platformRequirements.find((platform) => platform.id === id)
}

// Get platforms by category
export const getPlatformsByCategory = (category: PlatformCategory): PlatformRequirements[] => {
  return platformRequirements.filter((platform) => platform.category === category)
}

// Get all platforms
export const getAllPlatforms = (): PlatformRequirements[] => {
  return platformRequirements
}

// Get all platform categories
export const getAllPlatformCategories = (): PlatformCategory[] => {
  const categories = new Set<PlatformCategory>()
  platformRequirements.forEach((platform) => categories.add(platform.category))
  return Array.from(categories)
}
