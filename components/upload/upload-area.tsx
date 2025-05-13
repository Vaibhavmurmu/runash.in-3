"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, File, ImageIcon, FileVideo, FileAudio, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { UploadSettings } from "@/types/upload"

interface UploadAreaProps {
  onFilesAdded: (files: File[]) => void
  settings: UploadSettings
}

export default function UploadArea({ onFilesAdded, settings }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = []
    const errors: string[] = []

    for (const file of files) {
      // Check file size
      if (file.size > settings.maxFileSize) {
        errors.push(`${file.name} exceeds the maximum file size of ${formatBytes(settings.maxFileSize)}`)
        continue
      }

      // Check file type
      if (settings.allowedFileTypes.length > 0 && !settings.allowedFileTypes.includes(file.type)) {
        errors.push(`${file.name} has an unsupported file type (${file.type})`)
        continue
      }

      validFiles.push(file)
    }

    if (errors.length > 0) {
      setError(errors.join(". "))
    } else {
      setError(null)
    }

    return validFiles
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
      const validFiles = validateFiles(files)

      if (validFiles.length > 0) {
        setSelectedFiles(validFiles)
        onFilesAdded(validFiles)
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      const validFiles = validateFiles(files)

      if (validFiles.length > 0) {
        setSelectedFiles(validFiles)
        onFilesAdded(validFiles)
      }
    }
  }

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />
    } else if (file.type.startsWith("video/")) {
      return <FileVideo className="h-8 w-8 text-purple-500" />
    } else if (file.type.startsWith("audio/")) {
      return <FileAudio className="h-8 w-8 text-green-500" />
    } else {
      return <File className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        multiple
        accept={settings.allowedFileTypes.join(",")}
      />

      <Card>
        <CardContent className="p-0">
          <div
            className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg transition-colors ${
              isDragging
                ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                : "border-gray-300 dark:border-gray-700"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Drag and drop files here</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              or click the button below to browse your files
            </p>
            <Button
              onClick={handleBrowseClick}
              className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
            >
              Browse Files
            </Button>
            <p className="text-xs text-muted-foreground mt-4">Maximum file size: {formatBytes(settings.maxFileSize)}</p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Selected Files</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {getFileIcon(file)}
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
