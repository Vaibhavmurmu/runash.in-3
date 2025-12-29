"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { HardDrive, Files, Image, Video, Music, FileText, Archive } from "lucide-react"
import type { StorageStats as StorageStatsType } from "@/lib/enhanced-cloud-storage"

interface StorageStatsProps {
  stats: StorageStatsType
}

export default function StorageStats({ stats }: StorageStatsProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const usagePercentage = (stats.usedStorage / stats.storageLimit) * 100

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      case "text":
        return <FileText className="h-4 w-4" />
      case "application":
        return <Archive className="h-4 w-4" />
      default:
        return <Files className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "video":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "audio":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      case "text":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "application":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatFileSize(stats.usedStorage)}</div>
          <div className="text-xs text-muted-foreground mb-2">of {formatFileSize(stats.storageLimit)}</div>
          <Progress value={usagePercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{usagePercentage.toFixed(1)}% used</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Files</CardTitle>
          <Files className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFiles.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">files stored</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">File Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.filesByType).map(([type, count]) => (
              <Badge key={type} variant="outline" className={getTypeColor(type)}>
                <div className="flex items-center gap-1">
                  {getTypeIcon(type)}
                  <span className="capitalize">{type}</span>
                  <span className="ml-1">({count})</span>
                </div>
              </Badge>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {Object.entries(stats.sizeByType).map(([type, size]) => (
              <div key={type} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  {getTypeIcon(type)}
                  <span className="capitalize">{type}</span>
                </div>
                <span className="text-muted-foreground">{formatFileSize(size)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
