export interface StorageProvider {
  id: number
  name: string
  type: "s3" | "gcs" | "azure" | "r2"
  config: Record<string, any>
  is_active: boolean
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface StorageBucket {
  id: number
  provider_id: number
  name: string
  region?: string
  purpose: "avatars" | "videos" | "thumbnails" | "documents" | "temporary"
  cdn_url?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface StoredFile {
  id: string
  user_id: string
  bucket_id: number
  original_name: string
  stored_name: string
  file_path: string
  file_size: number
  mime_type: string
  file_hash?: string
  metadata: Record<string, any>
  tags: string[]
  is_public: boolean
  is_processed: boolean
  processing_status: "pending" | "processing" | "completed" | "failed"
  cdn_url?: string
  thumbnail_url?: string
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface FileVersion {
  id: string
  file_id: string
  version_number: number
  stored_name: string
  file_path: string
  file_size: number
  file_hash?: string
  created_at: string
}

export interface StorageUsage {
  id: number
  user_id: string
  date: string
  total_files: number
  total_size: number
  bandwidth_used: number
  requests_count: number
  created_at: string
  updated_at: string
}

export interface FileAccessLog {
  id: number
  file_id: string
  user_id?: string
  ip_address?: string
  user_agent?: string
  referer?: string
  action: "upload" | "download" | "view" | "delete"
  status_code?: number
  bytes_transferred?: number
  created_at: string
}

export interface UploadOptions {
  bucket?: string
  isPublic?: boolean
  tags?: string[]
  metadata?: Record<string, any>
  expiresAt?: Date
  generateThumbnail?: boolean
}

export interface StorageStats {
  totalFiles: number
  totalSize: number
  bandwidthUsed: number
  requestsCount: number
  storageByType: Record<string, { files: number; size: number }>
  dailyUsage: Array<{
    date: string
    files: number
    size: number
    bandwidth: number
    requests: number
  }>
}
