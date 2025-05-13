"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FolderOpen, Settings, Video, RotateCw } from "lucide-react"

import UploadArea from "./upload-area"
import MediaLibrary from "./media-library"
import UploadSettings from "./upload-settings"
import StreamSetup from "./stream-setup"
import UploadQueue from "./upload-queue"
import ConversionPanel from "./conversion/conversion-panel"

import type { UploadProgress, MediaFile, MediaFolder, UploadSettings as UploadSettingsType } from "@/types/upload"
import type { ConversionJob } from "@/types/conversion"

export default function UploadDashboard() {
  const [activeTab, setActiveTab] = useState("upload")
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([])
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [mediaFolders, setMediaFolders] = useState<MediaFolder[]>([])
  const [uploadSettings, setUploadSettings] = useState<UploadSettingsType>({
    defaultPrivacy: "private",
    autoTagging: true,
    autoGenerateThumbnails: true,
    compressionEnabled: true,
    maxFileSize: 1024 * 1024 * 500, // 500MB
    allowedFileTypes: [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "image/jpeg",
      "image/png",
      "image/gif",
      "audio/mpeg",
      "audio/wav",
    ],
  })

  const handleFilesAdded = (files: File[]) => {
    // Create upload progress entries for each file
    const newUploads = files.map((file) => ({
      fileId: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      fileName: file.name,
      progress: 0,
      status: "queued" as const,
    }))

    setUploadQueue((prev) => [...prev, ...newUploads])

    // Simulate upload process for each file
    newUploads.forEach((upload) => {
      simulateFileUpload(upload, files.find((f) => f.name === upload.fileName)!)
    })
  }

  const simulateFileUpload = (upload: UploadProgress, file: File) => {
    // In a real application, this would be replaced with actual upload logic
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 10
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)

        // Update queue item to completed
        setUploadQueue((prev) =>
          prev.map((item) =>
            item.fileId === upload.fileId ? { ...item, progress: 100, status: "processing" as const } : item,
          ),
        )

        // Simulate processing
        setTimeout(() => {
          setUploadQueue((prev) =>
            prev.map((item) => (item.fileId === upload.fileId ? { ...item, status: "complete" as const } : item)),
          )

          // Add to media library
          const fileType = file.type.startsWith("video/")
            ? "video"
            : file.type.startsWith("image/")
              ? "image"
              : file.type.startsWith("audio/")
                ? "audio"
                : "other"

          const newFile: MediaFile = {
            id: upload.fileId,
            name: file.name,
            type: fileType as any,
            size: file.size,
            url: URL.createObjectURL(file), // In a real app, this would be a server URL
            thumbnailUrl: fileType === "video" ? "/placeholder.svg?height=180&width=320" : undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: [],
            isPublic: uploadSettings.defaultPrivacy === "public",
          }

          setMediaFiles((prev) => [...prev, newFile])
        }, 1500)
      } else {
        // Update progress
        setUploadQueue((prev) =>
          prev.map((item) =>
            item.fileId === upload.fileId ? { ...item, progress, status: "uploading" as const } : item,
          ),
        )
      }
    }, 300)
  }

  const handleRemoveFromQueue = (fileId: string) => {
    setUploadQueue((prev) => prev.filter((item) => item.fileId !== fileId))
  }

  const handleClearCompleted = () => {
    setUploadQueue((prev) => prev.filter((item) => item.status !== "complete"))
  }

  const handleDeleteMedia = (fileId: string) => {
    setMediaFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const handleCreateFolder = (name: string, parentId?: string) => {
    const newFolder: MediaFolder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fileCount: 0,
    }

    setMediaFolders((prev) => [...prev, newFolder])
  }

  const handleDeleteFolder = (folderId: string) => {
    setMediaFolders((prev) => prev.filter((folder) => folder.id !== folderId))
    // In a real app, you would also need to handle files in this folder
  }

  const handleUpdateSettings = (newSettings: UploadSettingsType) => {
    setUploadSettings(newSettings)
  }

  const handleConversionComplete = (job: ConversionJob, outputFile: MediaFile) => {
    // Add the converted file to the media library
    setMediaFiles((prev) => [...prev, outputFile])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Upload & Stream</h1>
          <p className="text-muted-foreground mt-1">Upload media files and manage your streaming content</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            <span>Media Library</span>
          </TabsTrigger>
          <TabsTrigger value="convert" className="flex items-center gap-2">
            <RotateCw className="h-4 w-4" />
            <span>Convert</span>
          </TabsTrigger>
          <TabsTrigger value="stream" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span>Stream Setup</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <UploadArea onFilesAdded={handleFilesAdded} settings={uploadSettings} />
            </div>
            <div>
              <UploadQueue
                queue={uploadQueue}
                onRemove={handleRemoveFromQueue}
                onClearCompleted={handleClearCompleted}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <MediaLibrary
            files={mediaFiles}
            folders={mediaFolders}
            onDeleteFile={handleDeleteMedia}
            onCreateFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
          />
        </TabsContent>

        <TabsContent value="convert" className="space-y-4">
          <ConversionPanel mediaFiles={mediaFiles} onConversionComplete={handleConversionComplete} />
        </TabsContent>

        <TabsContent value="stream" className="space-y-4">
          <StreamSetup mediaFiles={mediaFiles} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <UploadSettings settings={uploadSettings} onUpdateSettings={handleUpdateSettings} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
