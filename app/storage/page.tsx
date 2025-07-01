"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  File,
  ImageIcon,
  Video,
  Music,
  FileText,
  Download,
  Trash2,
  Eye,
  Search,
  HardDrive,
  Zap,
  Activity,
  Loader2,
} from "lucide-react"
import { useStorageFiles, useStorageStats } from "@/hooks/use-storage"
import { useToast } from "@/hooks/use-toast"
import { storageService } from "@/lib/storage"

export default function StoragePage() {
  const { toast } = useToast()
  const [selectedBucket, setSelectedBucket] = useState<string>("documents")
  const [selectedMimeType, setSelectedMimeType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const { files, total, loading, uploadFile, deleteFile, refetch } = useStorageFiles({
    bucket: selectedBucket || undefined,
    mimeType: selectedMimeType || undefined,
    limit: 20,
  })

  const { stats, loading: statsLoading } = useStorageStats()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      await uploadFile(file, {
        bucket: selectedBucket || "documents",
        isPublic: false,
        tags: ["user-upload"],
      })

      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset the input
      event.target.value = ""
    }
  }

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    try {
      await deleteFile(fileId)
      toast({
        title: "File deleted",
        description: `${fileName} has been deleted.`,
      })
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (mimeType.startsWith("video/")) return <Video className="h-4 w-4" />
    if (mimeType.startsWith("audio/")) return <Music className="h-4 w-4" />
    if (mimeType.includes("pdf") || mimeType.includes("document")) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const filteredFiles = files.filter(
    (file) =>
      file.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cloud Storage</h1>
          <p className="text-muted-foreground">Manage your files and media assets</p>
        </div>
        <div className="flex gap-2">
          <Label htmlFor="file-upload" className="cursor-pointer">
            <Button
              disabled={isUploading}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </>
              )}
            </Button>
          </Label>
          <Input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
        </div>
      </div>

      <Tabs defaultValue="files" className="space-y-4">
        <TabsList>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-4">
          {/* Storage Overview */}
          {stats && (
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                  <File className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalFiles}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{storageService.formatFileSize(stats.totalSize)}</div>
                  <Progress value={75} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">75% of 1GB used</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bandwidth</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{storageService.formatFileSize(stats.bandwidthUsed)}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Requests</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.requestsCount}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>File Management</CardTitle>
              <CardDescription>Search, filter, and manage your uploaded files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Files</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by filename or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Label>File Type</Label>
                  <Select value={selectedMimeType} onValueChange={setSelectedMimeType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="application/pdf">PDFs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Bucket</Label>
                  <Select value={selectedBucket} onValueChange={setSelectedBucket}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All buckets" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All buckets</SelectItem>
                      <SelectItem value="avatars">Avatars</SelectItem>
                      <SelectItem value="videos">Videos</SelectItem>
                      <SelectItem value="thumbnails">Thumbnails</SelectItem>
                      <SelectItem value="documents">Documents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Files List */}
          <Card>
            <CardHeader>
              <CardTitle>Files ({filteredFiles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-8">
                  <File className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">No files found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {searchQuery || selectedMimeType !== "all" || selectedBucket !== "all"
                      ? "Try adjusting your filters"
                      : "Upload your first file to get started"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.mime_type)}
                        <div>
                          <p className="font-medium">{file.original_name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{storageService.formatFileSize(file.file_size)}</span>
                            <span>•</span>
                            <span>{new Date(file.created_at).toLocaleDateString()}</span>
                            {file.tags.length > 0 && (
                              <>
                                <span>•</span>
                                <div className="flex gap-1">
                                  {file.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {file.tags.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{file.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {file.is_public && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Public
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {file.cdn_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={file.cdn_url} download>
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFile(file.id, file.original_name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {statsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : stats ? (
            <>
              {/* Storage by Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Storage by File Type</CardTitle>
                  <CardDescription>Breakdown of your storage usage by file type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.storageByType).map(([type, data]) => (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{type}</span>
                          <span>
                            {data.files} files • {storageService.formatFileSize(data.size)}
                          </span>
                        </div>
                        <Progress value={(data.size / stats.totalSize) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Daily Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Usage (Last 7 Days)</CardTitle>
                  <CardDescription>Your storage and bandwidth usage over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.dailyUsage.map((day) => (
                      <div key={day.date} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{new Date(day.date).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {day.files} files • {storageService.formatFileSize(day.size)}
                          </p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{storageService.formatFileSize(day.bandwidth)} bandwidth</p>
                          <p>{day.requests} requests</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Alert>
              <AlertDescription>Unable to load storage analytics. Please try again later.</AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
