"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface StorageUploaderProps {
  onUpload: (files: FileList) => Promise<void>
  disabled?: boolean
  accept?: string
  multiple?: boolean
}

export default function StorageUploader({
  onUpload,
  disabled = false,
  accept = "*/*",
  multiple = true,
}: StorageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      await handleUpload(files)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleUpload(files)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUpload = async (files: FileList) => {
    if (disabled || uploading) return

    setUploading(true)
    try {
      await onUpload(files)
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload files",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20" : "border-gray-300 dark:border-gray-700"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-orange-400"}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium mb-2">{uploading ? "Uploading..." : "Drop files here or click to browse"}</p>
        <p className="text-sm text-muted-foreground">
          {multiple ? "Select multiple files" : "Select a file"} to upload
        </p>

        {uploading && (
          <div className="mt-4">
            <Progress value={undefined} className="w-full" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex gap-2">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Uploading..." : "Choose Files"}
        </Button>
      </div>
    </div>
  )
}
