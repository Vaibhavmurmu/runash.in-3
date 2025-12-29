export interface MediaFile {
  id: string
  name: string
  type: "video" | "image" | "audio" | "document" | "other"
  size: number // in bytes
  url: string
  thumbnailUrl?: string
  duration?: number // for video/audio in seconds
  width?: number // for images/videos
  height?: number // for images/videos
  createdAt: string
  updatedAt: string
  tags: string[]
  description?: string
  isPublic: boolean
  folderId?: string
}

export interface MediaFolder {
  id: string
  name: string
  parentId?: string
  createdAt: string
  updatedAt: string
  fileCount: number
}

export interface UploadProgress {
  fileId: string
  fileName: string
  progress: number // 0-100
  status: "queued" | "uploading" | "processing" | "complete" | "error"
  error?: string
}

export interface UploadSettings {
  defaultPrivacy: "public" | "private"
  defaultFolder?: string
  autoTagging: boolean
  autoGenerateThumbnails: boolean
  compressionEnabled: boolean
  maxFileSize: number // in bytes
  allowedFileTypes: string[]
}

export interface StreamSettings {
  title: string
  description?: string
  scheduledStartTime?: string
  isPrivate: boolean
  category?: string
  tags: string[]
  thumbnailUrl?: string
  platforms: {
    platform: string
    enabled: boolean
    title?: string
    description?: string
  }[]
  chatSettings: {
    enabled: boolean
    moderationLevel: "low" | "medium" | "high"
    subscribersOnly: boolean
    slowMode: boolean
    slowModeInterval?: number
  }
}
