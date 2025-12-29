"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MoreVertical,
  Download,
  Trash2,
  Folder,
  File,
  ImageIcon,
  Video,
  Music,
  FileText,
  Archive,
  HardDrive,
  Activity,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import type {
  StorageFile,
  StorageFolder,
  StorageStats as StorageStatsType,
  UploadProgress,
} from "@/lib/enhanced-cloud-storage"
import StorageUploader from "./storage-uploader"
import StorageStatsComponent from "./storage-stats"

export default function StorageManager() {
  const [files, setFiles] = useState<StorageFile[]>([])
  const [folders, setFolders] = useState<StorageFolder[]>([])
  const [stats, setStats] = useState<StorageStatsType | null>(null)
  const [currentPath, setCurrentPath] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({})
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { toast } = useToast()

  useEffect(() => {
    loadFiles()
    loadStats()
  }, [currentPath])

  const loadFiles = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/storage?action=list&prefix=${currentPath}&maxKeys=100`)
      if (!response.ok) throw new Error("Failed to load files")

      const data = await response.json()
      setFiles(data.files || [])
      setFolders(data.folders || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch("/api/storage?action=stats")
      if (!response.ok) throw new Error("Failed to load stats")

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to load storage stats:", error)
    }
  }

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      setUploading(true)
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append("action", "upload")
        formData.append("file", file)
        formData.append("folder", currentPath)

        try {
          const response = await fetch("/api/storage", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) throw new Error("Upload failed")

          return await response.json()
        } catch (error) {
          toast({
            title: "Upload Failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive",
          })
          throw error
        }
      })

      try {
        await Promise.all(uploadPromises)
        toast({
          title: "Upload Complete",
          description: `Successfully uploaded ${files.length} file(s)`,
        })
        loadFiles()
        loadStats()
      } catch (error) {
        // Individual errors already handled
      } finally {
        setUploading(false)
      }
    },
    [currentPath, toast],
  )

  const handleDeleteFiles = async (keys: string[]) => {
    try {
      const response = await fetch("/api/storage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys }),
      })

      if (!response.ok) throw new Error("Delete failed")

      const result = await response.json()

      toast({
        title: "Files Deleted",
        description: `Successfully deleted ${result.success.length} file(s)`,
      })

      setSelectedFiles(new Set())
      loadFiles()
      loadStats()
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete selected files",
        variant: "destructive",
      })
    }
  }

  const handleMoveFile = async (sourceKey: string, destinationKey: string) => {
    try {
      const response = await fetch("/api/storage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "move", sourceKey, destinationKey }),
      })

      if (!response.ok) throw new Error("Move failed")

      toast({
        title: "File Moved",
        description: "File moved successfully",
      })

      loadFiles()
    } catch (error) {
      toast({
        title: "Move Failed",
        description: "Failed to move file",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (contentType.startsWith("video/")) return <Video className="h-4 w-4" />
    if (contentType.startsWith("audio/")) return <Music className="h-4 w-4" />
    if (contentType.includes("zip") || contentType.includes("archive")) return <Archive className="h-4 w-4" />
    if (contentType.startsWith("text/")) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const breadcrumbs = currentPath.split("/").filter(Boolean)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Storage Manager</h2>
          <p className="text-muted-foreground">Manage your files and media</p>
        </div>
        <div className="flex items-center gap-2">
          <StorageUploader onUpload={handleFileUpload} disabled={uploading} />
          <Button variant="outline" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? "List View" : "Grid View"}
          </Button>
        </div>
      </div>

      {stats && <StorageStatsComponent stats={stats} />}

      <Tabs defaultValue="files" className="w-full">
        <TabsList>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-4">
          {/* Navigation and Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Button variant="ghost" size="sm" onClick={() => setCurrentPath("")} disabled={!currentPath}>
                <HardDrive className="h-4 w-4 mr-1" />
                Root
              </Button>
              {breadcrumbs.map((folder, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-muted-foreground mx-1">/</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPath(breadcrumbs.slice(0, index + 1).join("/"))}
                  >
                    {folder}
                  </Button>
                </div>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search files..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedFiles.size > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm">{selectedFiles.size} file(s) selected</span>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteFiles(Array.from(selectedFiles))}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedFiles(new Set())}>
                Clear Selection
              </Button>
            </div>
          )}

          {/* File Grid/List */}
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-2"
            }
          >
            {/* Folders */}
            {folders.map((folder) => (
              <Card
                key={folder.path}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setCurrentPath(folder.path)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Folder className="h-8 w-8 text-blue-500" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{folder.name}</p>
                      <p className="text-sm text-muted-foreground">{folder.fileCount} files</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Files */}
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))
              : filteredFiles.map((file) => (
                  <Card
                    key={file.key}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selectedFiles.has(file.key) ? "ring-2 ring-orange-500" : ""
                    }`}
                    onClick={() => {
                      const newSelected = new Set(selectedFiles)
                      if (newSelected.has(file.key)) {
                        newSelected.delete(file.key)
                      } else {
                        newSelected.add(file.key)
                      }
                      setSelectedFiles(newSelected)
                    }}
                  >
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                      {file.contentType.startsWith("image/") ? (
                        <img
                          src={file.url || "/placeholder.svg"}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                            e.currentTarget.nextElementSibling?.classList.remove("hidden")
                          }}
                        />
                      ) : null}
                      <div
                        className={`flex items-center justify-center ${file.contentType.startsWith("image/") ? "hidden" : ""}`}
                      >
                        {getFileIcon(file.contentType)}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)} • {file.lastModified.toLocaleDateString()}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => window.open(file.url, "_blank")}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteFiles([file.key])}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Activity tracking coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
