import { sql } from "@/lib/database"
import type { StoredFile, StorageBucket, UploadOptions, StorageStats } from "./storage-types"

export class StorageService {
  private static instance: StorageService

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }
    return StorageService.instance
  }

  async getBucketByPurpose(purpose: string): Promise<StorageBucket | null> {
    try {
      const buckets = await sql`
        SELECT * FROM storage_buckets 
        WHERE purpose = ${purpose} AND provider_id IN (
          SELECT id FROM storage_providers WHERE is_active = true
        )
        ORDER BY id
        LIMIT 1
      `
      return buckets[0] || null
    } catch (error) {
      console.error("Error getting bucket:", error)
      return null
    }
  }

  async uploadFile(userId: string, file: File, options: UploadOptions = {}): Promise<StoredFile | null> {
    try {
      const bucket = await this.getBucketByPurpose(options.bucket || "documents")
      if (!bucket) {
        throw new Error("No active storage bucket found")
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split(".").pop()
      const storedName = `${timestamp}_${randomString}.${extension}`
      const filePath = `${userId}/${storedName}`

      // In a real implementation, you would upload to your cloud provider here
      // For now, we'll simulate the upload and store metadata

      const fileData = {
        user_id: userId,
        bucket_id: bucket.id,
        original_name: file.name,
        stored_name: storedName,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        metadata: options.metadata || {},
        tags: options.tags || [],
        is_public: options.isPublic || false,
        expires_at: options.expiresAt?.toISOString() || null,
        cdn_url: bucket.cdn_url ? `${bucket.cdn_url}/${filePath}` : null,
      }

      const result = await sql`
        INSERT INTO stored_files ${sql(fileData)}
        RETURNING *
      `

      // Log the upload
      await this.logFileAccess(result[0].id, userId, "upload", 200, file.size)

      // Update storage usage
      await this.updateStorageUsage(userId)

      return result[0]
    } catch (error) {
      console.error("Error uploading file:", error)
      return null
    }
  }

  async getFile(fileId: string, userId?: string): Promise<StoredFile | null> {
    try {
      const files = await sql`
        SELECT sf.*, sb.cdn_url as bucket_cdn_url, sb.name as bucket_name
        FROM stored_files sf
        JOIN storage_buckets sb ON sf.bucket_id = sb.id
        WHERE sf.id = ${fileId}
        ${userId ? sql`AND sf.user_id = ${userId}` : sql``}
      `

      if (files.length === 0) return null

      // Log the access
      if (userId) {
        await this.logFileAccess(fileId, userId, "view")
      }

      return files[0]
    } catch (error) {
      console.error("Error getting file:", error)
      return null
    }
  }

  async getUserFiles(
    userId: string,
    options: {
      limit?: number
      offset?: number
      mimeType?: string
      tags?: string[]
      bucket?: string
    } = {},
  ): Promise<{ files: StoredFile[]; total: number }> {
    try {
      const { limit = 20, offset = 0, mimeType, tags, bucket } = options

      const whereConditions = [sql`sf.user_id = ${userId}`]

      if (mimeType) {
        whereConditions.push(sql`sf.mime_type LIKE ${mimeType + "%"}`)
      }

      if (tags && tags.length > 0) {
        whereConditions.push(sql`sf.tags && ${tags}`)
      }

      if (bucket) {
        whereConditions.push(sql`sb.purpose = ${bucket}`)
      }

      const whereClause =
        whereConditions.length > 1
          ? sql`WHERE ${sql.join(whereConditions, sql` AND `)}`
          : sql`WHERE ${whereConditions[0]}`

      const files = await sql`
        SELECT sf.*, sb.name as bucket_name, sb.purpose as bucket_purpose
        FROM stored_files sf
        JOIN storage_buckets sb ON sf.bucket_id = sb.id
        ${whereClause}
        ORDER BY sf.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      const countResult = await sql`
        SELECT COUNT(*) as total
        FROM stored_files sf
        JOIN storage_buckets sb ON sf.bucket_id = sb.id
        ${whereClause}
      `

      return {
        files,
        total: Number.parseInt(countResult[0].total),
      }
    } catch (error) {
      console.error("Error getting user files:", error)
      return { files: [], total: 0 }
    }
  }

  async deleteFile(fileId: string, userId: string): Promise<boolean> {
    try {
      const file = await this.getFile(fileId, userId)
      if (!file) return false

      // In a real implementation, you would delete from cloud storage here

      await sql`
        DELETE FROM stored_files 
        WHERE id = ${fileId} AND user_id = ${userId}
      `

      // Log the deletion
      await this.logFileAccess(fileId, userId, "delete", 200)

      // Update storage usage
      await this.updateStorageUsage(userId)

      return true
    } catch (error) {
      console.error("Error deleting file:", error)
      return false
    }
  }

  async getStorageStats(userId: string): Promise<StorageStats> {
    try {
      // Get current totals
      const totals = await sql`
        SELECT 
          COUNT(*) as total_files,
          COALESCE(SUM(file_size), 0) as total_size
        FROM stored_files 
        WHERE user_id = ${userId}
      `

      // Get usage by file type
      const byType = await sql`
        SELECT 
          CASE 
            WHEN mime_type LIKE 'image/%' THEN 'images'
            WHEN mime_type LIKE 'video/%' THEN 'videos'
            WHEN mime_type LIKE 'audio/%' THEN 'audio'
            WHEN mime_type LIKE 'application/pdf' THEN 'documents'
            ELSE 'other'
          END as type,
          COUNT(*) as files,
          COALESCE(SUM(file_size), 0) as size
        FROM stored_files 
        WHERE user_id = ${userId}
        GROUP BY type
      `

      // Get daily usage for last 7 days
      const dailyUsage = await sql`
        SELECT 
          date,
          total_files as files,
          total_size as size,
          bandwidth_used as bandwidth,
          requests_count as requests
        FROM storage_usage 
        WHERE user_id = ${userId} 
          AND date >= CURRENT_DATE - INTERVAL '7 days'
        ORDER BY date DESC
      `

      // Get bandwidth and requests from logs
      const bandwidth = await sql`
        SELECT COALESCE(SUM(bytes_transferred), 0) as bandwidth_used
        FROM file_access_logs fal
        JOIN stored_files sf ON fal.file_id = sf.id
        WHERE sf.user_id = ${userId}
          AND fal.created_at >= CURRENT_DATE - INTERVAL '30 days'
      `

      const requests = await sql`
        SELECT COUNT(*) as requests_count
        FROM file_access_logs fal
        JOIN stored_files sf ON fal.file_id = sf.id
        WHERE sf.user_id = ${userId}
          AND fal.created_at >= CURRENT_DATE - INTERVAL '30 days'
      `

      const storageByType: Record<string, { files: number; size: number }> = {}
      byType.forEach((item) => {
        storageByType[item.type] = {
          files: Number.parseInt(item.files),
          size: Number.parseInt(item.size),
        }
      })

      return {
        totalFiles: Number.parseInt(totals[0].total_files),
        totalSize: Number.parseInt(totals[0].total_size),
        bandwidthUsed: Number.parseInt(bandwidth[0].bandwidth_used),
        requestsCount: Number.parseInt(requests[0].requests_count),
        storageByType,
        dailyUsage: dailyUsage.map((item) => ({
          date: item.date,
          files: Number.parseInt(item.files),
          size: Number.parseInt(item.size),
          bandwidth: Number.parseInt(item.bandwidth),
          requests: Number.parseInt(item.requests),
        })),
      }
    } catch (error) {
      console.error("Error getting storage stats:", error)
      return {
        totalFiles: 0,
        totalSize: 0,
        bandwidthUsed: 0,
        requestsCount: 0,
        storageByType: {},
        dailyUsage: [],
      }
    }
  }

  private async logFileAccess(
    fileId: string,
    userId?: string,
    action: "upload" | "download" | "view" | "delete" = "view",
    statusCode?: number,
    bytesTransferred?: number,
  ): Promise<void> {
    try {
      await sql`
        INSERT INTO file_access_logs (
          file_id, user_id, action, status_code, bytes_transferred
        ) VALUES (
          ${fileId}, ${userId || null}, ${action}, ${statusCode || null}, ${bytesTransferred || null}
        )
      `
    } catch (error) {
      console.error("Error logging file access:", error)
    }
  }

  private async updateStorageUsage(userId: string): Promise<void> {
    try {
      const today = new Date().toISOString().split("T")[0]

      const stats = await sql`
        SELECT 
          COUNT(*) as total_files,
          COALESCE(SUM(file_size), 0) as total_size
        FROM stored_files 
        WHERE user_id = ${userId}
      `

      await sql`
        INSERT INTO storage_usage (user_id, date, total_files, total_size)
        VALUES (${userId}, ${today}, ${stats[0].total_files}, ${stats[0].total_size})
        ON CONFLICT (user_id, date) 
        DO UPDATE SET 
          total_files = EXCLUDED.total_files,
          total_size = EXCLUDED.total_size,
          updated_at = NOW()
      `
    } catch (error) {
      console.error("Error updating storage usage:", error)
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  getFileIcon(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "🖼️"
    if (mimeType.startsWith("video/")) return "🎥"
    if (mimeType.startsWith("audio/")) return "🎵"
    if (mimeType.includes("pdf")) return "📄"
    if (mimeType.includes("document") || mimeType.includes("word")) return "📝"
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "📊"
    if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "📈"
    if (mimeType.includes("zip") || mimeType.includes("archive")) return "📦"
    return "📁"
  }
}

export const storageService = StorageService.getInstance()
