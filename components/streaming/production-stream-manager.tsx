"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  Square,
  Users,
  Eye,
  Clock,
  Upload,
  Download,
  Share2,
  BarChart3,
  Camera,
  Monitor,
  Wifi,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StreamData {
  id: string
  title: string
  description: string
  status: "scheduled" | "live" | "ended"
  platform: string
  viewerCount: number
  duration: number
  quality: string
  bitrate: number
}

interface RecordingData {
  id: string
  streamId: string
  fileName: string
  duration: number
  fileSize: number
  uploadProgress: number
  status: "recording" | "processing" | "uploaded" | "failed"
  playbackUrl?: string
}

export default function ProductionStreamManager() {
  const { toast } = useToast()
  const [currentStream, setCurrentStream] = useState<StreamData | null>(null)
  const [recordings, setRecordings] = useState<RecordingData[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [streamSettings, setStreamSettings] = useState({
    title: "",
    description: "",
    platform: "youtube",
    quality: "1080p",
    bitrate: 6000,
    enableRecording: true,
    enableChat: true,
  })

  // Simulate real-time updates
  useEffect(() => {
    if (isStreaming && currentStream) {
      const interval = setInterval(() => {
        setCurrentStream((prev) =>
          prev
            ? {
                ...prev,
                viewerCount: prev.viewerCount + Math.floor(Math.random() * 10) - 5,
                duration: prev.duration + 1,
              }
            : null,
        )
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isStreaming, currentStream])

  const startStream = async () => {
    try {
      const response = await fetch("/api/streams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: streamSettings.title,
          description: streamSettings.description,
          platform: streamSettings.platform,
        }),
      })

      if (response.ok) {
        const { stream } = await response.json()
        setCurrentStream({
          ...stream,
          viewerCount: 0,
          duration: 0,
          quality: streamSettings.quality,
          bitrate: streamSettings.bitrate,
        })
        setIsStreaming(true)

        if (streamSettings.enableRecording) {
          setIsRecording(true)
          // Start recording
          const newRecording: RecordingData = {
            id: `rec_${Date.now()}`,
            streamId: stream.id,
            fileName: `${stream.title}_${new Date().toISOString()}.mp4`,
            duration: 0,
            fileSize: 0,
            uploadProgress: 0,
            status: "recording",
          }
          setRecordings((prev) => [newRecording, ...prev])
        }

        toast({
          title: "Stream Started",
          description: "Your live stream is now broadcasting!",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start stream. Please try again.",
        variant: "destructive",
      })
    }
  }

  const stopStream = async () => {
    if (!currentStream) return

    try {
      await fetch("/api/streams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentStream.id,
          status: "ended",
          ended_at: new Date().toISOString(),
        }),
      })

      setIsStreaming(false)

      if (isRecording) {
        setIsRecording(false)
        // Process recording
        const recordingToUpdate = recordings.find((r) => r.streamId === currentStream.id && r.status === "recording")
        if (recordingToUpdate) {
          setRecordings((prev) =>
            prev.map((r) =>
              r.id === recordingToUpdate.id ? { ...r, status: "processing", duration: currentStream.duration } : r,
            ),
          )

          // Simulate upload process
          setTimeout(() => {
            setRecordings((prev) =>
              prev.map((r) =>
                r.id === recordingToUpdate.id
                  ? { ...r, status: "uploaded", uploadProgress: 100, playbackUrl: `/recordings/${r.id}` }
                  : r,
              ),
            )
          }, 3000)
        }
      }

      toast({
        title: "Stream Ended",
        description: "Your stream has been successfully ended and saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop stream properly.",
        variant: "destructive",
      })
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"]
    if (bytes === 0) return "0 Bytes"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "recording":
        return <div className="h-4 w-4 bg-red-500 rounded-full animate-pulse" />
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "uploaded":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Stream Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Live Stream Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="setup" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
              <TabsTrigger value="recordings">Recordings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Stream Title</Label>
                  <Input
                    id="title"
                    value={streamSettings.title}
                    onChange={(e) => setStreamSettings((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter stream title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={streamSettings.platform}
                    onValueChange={(value) => setStreamSettings((prev) => ({ ...prev, platform: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="twitch">Twitch</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={streamSettings.description}
                  onChange={(e) => setStreamSettings((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter stream description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quality">Quality</Label>
                  <Select
                    value={streamSettings.quality}
                    onValueChange={(value) => setStreamSettings((prev) => ({ ...prev, quality: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p HD</SelectItem>
                      <SelectItem value="1080p">1080p Full HD</SelectItem>
                      <SelectItem value="1440p">1440p 2K</SelectItem>
                      <SelectItem value="2160p">2160p 4K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bitrate">Bitrate (kbps)</Label>
                  <Input
                    id="bitrate"
                    type="number"
                    value={streamSettings.bitrate}
                    onChange={(e) =>
                      setStreamSettings((prev) => ({ ...prev, bitrate: Number.parseInt(e.target.value) }))
                    }
                    min="1000"
                    max="50000"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="recording"
                    checked={streamSettings.enableRecording}
                    onChange={(e) => setStreamSettings((prev) => ({ ...prev, enableRecording: e.target.checked }))}
                  />
                  <Label htmlFor="recording">Enable Recording</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={startStream}
                  disabled={isStreaming || !streamSettings.title}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Start Stream
                </Button>
                <Button
                  onClick={stopStream}
                  disabled={!isStreaming}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  Stop Stream
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="live" className="space-y-4">
              {currentStream ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(currentStream.status)}
                      <Badge variant={isStreaming ? "default" : "secondary"}>{isStreaming ? "LIVE" : "OFFLINE"}</Badge>
                      <span className="font-medium">{currentStream.title}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {currentStream.viewerCount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(currentStream.duration)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4" />
                          <span className="text-sm font-medium">Viewers</span>
                        </div>
                        <div className="text-2xl font-bold">{currentStream.viewerCount.toLocaleString()}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Monitor className="h-4 w-4" />
                          <span className="text-sm font-medium">Quality</span>
                        </div>
                        <div className="text-2xl font-bold">{currentStream.quality}</div>
                        <div className="text-sm text-muted-foreground">{currentStream.bitrate} kbps</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Wifi className="h-4 w-4" />
                          <span className="text-sm font-medium">Connection</span>
                        </div>
                        <div className="text-2xl font-bold text-green-500">Stable</div>
                        <div className="text-sm text-muted-foreground">0% dropped frames</div>
                      </CardContent>
                    </Card>
                  </div>

                  {isRecording && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                            <span className="font-medium">Recording in progress</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{formatDuration(currentStream.duration)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Stream</h3>
                  <p className="text-muted-foreground">Start a stream from the Setup tab to see live controls</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recordings" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Stream Recordings</h3>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Recording
                </Button>
              </div>

              <div className="space-y-3">
                {recordings.length > 0 ? (
                  recordings.map((recording) => (
                    <Card key={recording.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(recording.status)}
                              <span className="font-medium">{recording.fileName}</span>
                              <Badge variant="outline">{recording.status}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{formatDuration(recording.duration)}</span>
                              <span>{formatFileSize(recording.fileSize)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {recording.status === "processing" && (
                              <div className="w-24">
                                <Progress value={recording.uploadProgress} />
                              </div>
                            )}
                            {recording.playbackUrl && (
                              <>
                                <Button variant="outline" size="sm">
                                  <Play className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Recordings</h3>
                    <p className="text-muted-foreground">Your stream recordings will appear here</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-sm font-medium">Total Streams</span>
                    </div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-green-600">+2 this week</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">Total Views</span>
                    </div>
                    <div className="text-2xl font-bold">1,234</div>
                    <div className="text-sm text-green-600">+15% vs last week</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">Watch Time</span>
                    </div>
                    <div className="text-2xl font-bold">45.2h</div>
                    <div className="text-sm text-green-600">+8% vs last week</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">Avg Viewers</span>
                    </div>
                    <div className="text-2xl font-bold">103</div>
                    <div className="text-sm text-green-600">+12% vs last week</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Stream Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Analytics chart would be rendered here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
