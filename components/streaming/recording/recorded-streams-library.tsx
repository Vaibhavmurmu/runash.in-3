"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  MoreVertical,
  Play,
  Download,
  Trash2,
  Edit,
  Share2,
  Clock,
  Eye,
  Tag,
  FileVideo,
  Scissors,
} from "lucide-react"
import Image from "next/image"
import type { RecordedStream } from "@/types/recording"

interface RecordedStreamsLibraryProps {
  streams: RecordedStream[]
  onPlay: (stream: RecordedStream) => void
  onEdit: (stream: RecordedStream) => void
  onDelete: (streamId: string) => void
  onDownload: (stream: RecordedStream) => void
  onShare: (stream: RecordedStream) => void
  onCreateClip: (stream: RecordedStream) => void
}

export default function RecordedStreamsLibrary({
  streams,
  onPlay,
  onEdit,
  onDelete,
  onDownload,
  onShare,
  onCreateClip,
}: RecordedStreamsLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")
  const [activeTab, setActiveTab] = useState("all")

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Filter streams based on search query and active tab
  const filteredStreams = streams.filter((stream) => {
    const matchesSearch =
      stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stream.description && stream.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      stream.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "public") return matchesSearch && stream.isPublic
    if (activeTab === "private") return matchesSearch && !stream.isPublic
    if (activeTab === "processing") return matchesSearch && stream.isProcessing

    return matchesSearch
  })

  // Sort streams based on selected sort option
  const sortedStreams = [...filteredStreams].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "date-asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "title-asc":
        return a.title.localeCompare(b.title)
      case "title-desc":
        return b.title.localeCompare(a.title)
      case "duration-desc":
        return b.duration - a.duration
      case "duration-asc":
        return a.duration - b.duration
      case "views-desc":
        return b.viewCount - a.viewCount
      case "views-asc":
        return a.viewCount - b.viewCount
      default:
        return 0
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Recorded Streams</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500" />
            <Input
              type="search"
              placeholder="Search recordings..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>Sort by</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest first</SelectItem>
              <SelectItem value="date-asc">Oldest first</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              <SelectItem value="duration-desc">Longest first</SelectItem>
              <SelectItem value="duration-asc">Shortest first</SelectItem>
              <SelectItem value="views-desc">Most viewed</SelectItem>
              <SelectItem value="views-asc">Least viewed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Recordings</TabsTrigger>
          <TabsTrigger value="public">Public</TabsTrigger>
          <TabsTrigger value="private">Private</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {sortedStreams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileVideo className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-1">No recordings found</h3>
              <p className="text-sm text-gray-500 max-w-md">
                {searchQuery
                  ? "No recordings match your search criteria. Try different keywords."
                  : "Start streaming with automatic recording enabled to see your recordings here."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedStreams.map((stream) => (
                <Card key={stream.id} className="overflow-hidden">
                  <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
                    {stream.thumbnailUrl ? (
                      <Image
                        src={stream.thumbnailUrl || "/placeholder.svg"}
                        alt={stream.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileVideo className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {stream.isProcessing && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-sm">Processing...</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(stream.duration)}
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-1">{stream.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatDate(stream.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        <span>{stream.viewCount} views</span>
                      </div>
                    </div>

                    {stream.tags.length > 0 && (
                      <div className="flex items-center space-x-1 mb-2 overflow-x-auto scrollbar-hide">
                        <Tag className="h-3 w-3 text-gray-500 flex-shrink-0" />
                        {stream.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full whitespace-nowrap"
                          >
                            {tag}
                          </span>
                        ))}
                        {stream.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{stream.tags.length - 3} more</span>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-gray-500">Size: {formatFileSize(stream.fileSize)}</div>
                  </CardContent>

                  <CardFooter className="pt-0 flex justify-between">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
                      onClick={() => onPlay(stream)}
                      disabled={stream.isProcessing}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Play
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(stream)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDownload(stream)} disabled={stream.isProcessing}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onShare(stream)} disabled={stream.isProcessing}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onCreateClip(stream)} disabled={stream.isProcessing}>
                          <Scissors className="h-4 w-4 mr-2" />
                          Create clip
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(stream.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
