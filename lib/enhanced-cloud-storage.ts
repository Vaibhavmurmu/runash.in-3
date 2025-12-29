import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET!

export interface StorageFile {
  key: string
  name: string
  size: number
  lastModified: Date
  contentType: string
  url: string
  folder: string
  tags?: string[]
  metadata?: Record<string, string>
}

export interface StorageFolder {
  name: string
  path: string
  fileCount: number
  totalSize: number
  lastModified: Date
}

export interface StorageStats {
  totalFiles: number
  totalSize: number
  usedStorage: number
  storageLimit: number
  filesByType: Record<string, number>
  sizeByType: Record<string, number>
  recentActivity: StorageActivity[]
}

export interface StorageActivity {
  id: string
  action: "upload" | "delete" | "move" | "copy"
  fileName: string
  timestamp: Date
  size?: number
  userId: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export class EnhancedCloudStorage {
  private static instance: EnhancedCloudStorage
  private uploadListeners: Map<string, (progress: UploadProgress) => void> = new Map()

  private constructor() {}

  public static getInstance(): EnhancedCloudStorage {
    if (!EnhancedCloudStorage.instance) {
      EnhancedCloudStorage.instance = new EnhancedCloudStorage()
    }
    return EnhancedCloudStorage.instance
  }

  // Enhanced file upload with progress tracking
  public async uploadFile(
    key: string,
    buffer: Buffer,
    contentType: string,
    metadata?: Record<string, string>,
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<string> {
    const uploadId = `upload-${Date.now()}`

    if (onProgress) {
      this.uploadListeners.set(uploadId, onProgress)
    }

    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        Metadata: metadata,
        ServerSideEncryption: "AES256",
      })

      // Simulate progress for demo (in production, use multipart upload for large files)
      if (onProgress) {
        const total = buffer.length
        let loaded = 0
        const interval = setInterval(() => {
          loaded += Math.min(total * 0.1, total - loaded)
          onProgress({
            loaded,
            total,
            percentage: Math.round((loaded / total) * 100),
          })

          if (loaded >= total) {
            clearInterval(interval)
          }
        }, 100)
      }

      await s3Client.send(command)

      this.uploadListeners.delete(uploadId)
      return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    } catch (error) {
      this.uploadListeners.delete(uploadId)
      throw error
    }
  }

  // List files with pagination and filtering
  public async listFiles(
    prefix?: string,
    maxKeys = 100,
    continuationToken?: string,
  ): Promise<{ files: StorageFile[]; nextToken?: string; folders: StorageFolder[] }> {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: maxKeys,
      ContinuationToken: continuationToken,
      Delimiter: "/",
    })

    const response = await s3Client.send(command)

    const files: StorageFile[] = (response.Contents || []).map((obj) => ({
      key: obj.Key!,
      name: obj.Key!.split("/").pop()!,
      size: obj.Size || 0,
      lastModified: obj.LastModified || new Date(),
      contentType: this.getContentTypeFromKey(obj.Key!),
      url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${obj.Key}`,
      folder: obj.Key!.includes("/") ? obj.Key!.substring(0, obj.Key!.lastIndexOf("/")) : "",
    }))

    const folders: StorageFolder[] = (response.CommonPrefixes || []).map((prefix) => ({
      name: prefix.Prefix!.split("/").filter(Boolean).pop()!,
      path: prefix.Prefix!,
      fileCount: 0, // Would need separate call to get accurate count
      totalSize: 0, // Would need separate call to get accurate size
      lastModified: new Date(),
    }))

    return {
      files,
      folders,
      nextToken: response.NextContinuationToken,
    }
  }

  // Get file metadata
  public async getFileMetadata(key: string): Promise<StorageFile | null> {
    try {
      const command = new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })

      const response = await s3Client.send(command)

      return {
        key,
        name: key.split("/").pop()!,
        size: response.ContentLength || 0,
        lastModified: response.LastModified || new Date(),
        contentType: response.ContentType || "application/octet-stream",
        url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        folder: key.includes("/") ? key.substring(0, key.lastIndexOf("/")) : "",
        metadata: response.Metadata,
      }
    } catch (error) {
      return null
    }
  }

  // Move/rename file
  public async moveFile(sourceKey: string, destinationKey: string): Promise<void> {
    // Copy to new location
    const copyCommand = new CopyObjectCommand({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${sourceKey}`,
      Key: destinationKey,
    })

    await s3Client.send(copyCommand)

    // Delete original
    await this.deleteFile(sourceKey)
  }

  // Copy file
  public async copyFile(sourceKey: string, destinationKey: string): Promise<void> {
    const command = new CopyObjectCommand({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${sourceKey}`,
      Key: destinationKey,
    })

    await s3Client.send(command)
  }

  // Bulk operations
  public async deleteFiles(keys: string[]): Promise<{ success: string[]; failed: string[] }> {
    const success: string[] = []
    const failed: string[] = []

    for (const key of keys) {
      try {
        await this.deleteFile(key)
        success.push(key)
      } catch (error) {
        failed.push(key)
      }
    }

    return { success, failed }
  }

  // Get storage statistics
  public async getStorageStats(userId?: string): Promise<StorageStats> {
    const prefix = userId ? `users/${userId}/` : undefined
    const { files } = await this.listFiles(prefix, 1000)

    const totalFiles = files.length
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)

    const filesByType: Record<string, number> = {}
    const sizeByType: Record<string, number> = {}

    files.forEach((file) => {
      const type = file.contentType.split("/")[0] || "other"
      filesByType[type] = (filesByType[type] || 0) + 1
      sizeByType[type] = (sizeByType[type] || 0) + file.size
    })

    return {
      totalFiles,
      totalSize,
      usedStorage: totalSize,
      storageLimit: 10 * 1024 * 1024 * 1024, // 10GB default limit
      filesByType,
      sizeByType,
      recentActivity: [], // Would come from database activity log
    }
  }

  // Generate presigned URLs for direct upload
  public async generatePresignedUploadUrl(key: string, contentType: string, expiresIn = 3600): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    })

    return await getSignedUrl(s3Client, command, { expiresIn })
  }

  // Existing methods enhanced
  public async getSignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    return await getSignedUrl(s3Client, command, { expiresIn })
  }

  public async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await s3Client.send(command)
  }

  // Specialized upload methods
  public async uploadRecording(
    streamId: string,
    buffer: Buffer,
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<string> {
    const key = `recordings/${streamId}/${Date.now()}.mp4`
    return await this.uploadFile(
      key,
      buffer,
      "video/mp4",
      {
        streamId,
        type: "recording",
        uploadedAt: new Date().toISOString(),
      },
      onProgress,
    )
  }

  public async uploadThumbnail(streamId: string, buffer: Buffer): Promise<string> {
    const key = `thumbnails/${streamId}/${Date.now()}.jpg`
    return await this.uploadFile(key, buffer, "image/jpeg", {
      streamId,
      type: "thumbnail",
      uploadedAt: new Date().toISOString(),
    })
  }

  public async uploadBackground(userId: string, buffer: Buffer, name: string): Promise<string> {
    const key = `backgrounds/${userId}/${Date.now()}-${name}`
    return await this.uploadFile(key, buffer, "image/jpeg", {
      userId,
      type: "background",
      uploadedAt: new Date().toISOString(),
    })
  }

  public async uploadTemplate(userId: string, buffer: Buffer, templateId: string): Promise<string> {
    const key = `templates/${userId}/${templateId}/${Date.now()}.zip`
    return await this.uploadFile(key, buffer, "application/zip", {
      userId,
      templateId,
      type: "template",
      uploadedAt: new Date().toISOString(),
    })
  }

  // Utility methods
  private getContentTypeFromKey(key: string): string {
    const extension = key.split(".").pop()?.toLowerCase()

    const mimeTypes: Record<string, string> = {
      mp4: "video/mp4",
      webm: "video/webm",
      avi: "video/avi",
      mov: "video/quicktime",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      mp3: "audio/mpeg",
      wav: "audio/wav",
      ogg: "audio/ogg",
      pdf: "application/pdf",
      zip: "application/zip",
      json: "application/json",
      txt: "text/plain",
      html: "text/html",
      css: "text/css",
      js: "application/javascript",
    }

    return mimeTypes[extension || ""] || "application/octet-stream"
  }

  public formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
}
