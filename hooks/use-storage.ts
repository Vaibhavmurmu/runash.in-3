"use client"

import { useState, useEffect } from "react"
import type { StoredFile, StorageStats } from "@/lib/storage-types"

export function useStorageFiles(
  options: {
    limit?: number
    offset?: number
    mimeType?: string
    bucket?: string
    tags?: string[]
  } = {},
) {
  const [files, setFiles] = useState<StoredFile[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFiles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (options.limit) params.set("limit", options.limit.toString())
      if (options.offset) params.set("offset", options.offset.toString())
      if (options.mimeType) params.set("mimeType", options.mimeType)
      if (options.bucket) params.set("bucket", options.bucket)
      if (options.tags) params.set("tags", options.tags.join(","))

      const response = await fetch(`/api/storage/files?${params}`)
      if (!response.ok) throw new Error("Failed to fetch files")

      const data = await response.json()
      setFiles(data.files)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [options.limit, options.offset, options.mimeType, options.bucket, options.tags?.join(",")])

  const uploadFile = async (
    file: File,
    uploadOptions: {
      bucket?: string
      isPublic?: boolean
      tags?: string[]
      metadata?: Record<string, any>
    } = {},
  ) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      if (uploadOptions.bucket) formData.append("bucket", uploadOptions.bucket)
      if (uploadOptions.isPublic) formData.append("isPublic", "true")
      if (uploadOptions.tags) formData.append("tags", uploadOptions.tags.join(","))
      if (uploadOptions.metadata) formData.append("metadata", JSON.stringify(uploadOptions.metadata))

      const response = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to upload file")

      const uploadedFile = await response.json()
      await fetchFiles() // Refresh the list
      return uploadedFile
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      throw err
    }
  }

  const deleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/storage/files/${fileId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete file")

      await fetchFiles() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
      throw err
    }
  }

  return {
    files,
    total,
    loading,
    error,
    uploadFile,
    deleteFile,
    refetch: fetchFiles,
  }
}

export function useStorageStats() {
  const [stats, setStats] = useState<StorageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/storage/stats")
      if (!response.ok) throw new Error("Failed to fetch storage stats")

      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, loading, error, refetch: fetchStats }
}
