"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Square,
  Settings,
  Users,
  MessageCircle,
  BarChart3,
  Cloud,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { toast } from "sonner"

interface StreamStats {
  viewers: number
  duration: number
  bitrate: number
  fps: number
  resolution: string
  status: "live" | "offline" | "starting" | "stopping"
}

interface RecordingStatus {
  isRecording: boolean
  duration: number
  fileSize: number
  quality: string
}

export function ProductionStreamManager() {
  const [streamStats, setStreamStats] = useState<StreamStats>({
    viewers: 0,
    duration: 0,
    bitrate: 0,
    fps: 0,
    resolution: "1920x1080",
    status: "offline",
  })

  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>({
    isRecording: false,
    duration: 0,
    fileSize: 0,
    quality: "HD",
  })

  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected")
  const [cloudStorageStatus, setCloudStorageStatus] = useState<"ready" | "uploading" | "error">("ready")
  const [uploadProgress, setUploadProgress] = useState(0)

  const streamRef = useRef<MediaStream | null>(null)
  const recordingRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    // Simulate real-time stats updates
    const interval = setInterval(() => {
      if (streamStats.status === "live") {
        setStreamStats((prev) => ({
          ...prev,
          viewers: Math.max(0, prev.viewers + Math.floor(Math.random() * 10 - 5)),
          duration: prev.duration + 1,
          bitrate: 2500 + Math.floor(Math.random() * 500),
          fps: 30 + Math.floor(Math.random() * 5),
        }))
      }

      if (recordingStatus.isRecording) {
        setRecordingStatus((prev) => ({
          ...prev,
          duration: prev.duration + 1,
          fileSize: prev.fileSize + Math.floor(Math.random() * 1000000),
        }))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [streamStats.status, recordingStatus.isRecording])

  const startStream = async () => {
    try {
      setStreamStats((prev) => ({ ...prev, status: "starting" }))
      setConnectionStatus("connecting")

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1920, height: 1080, frameRate: 30 },
        audio: { echoCancellation: true, noiseSuppression: true },
      })

      streamRef.current = stream

      // Simulate stream setup
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setStreamStats((prev) => ({ ...prev, status: "live" }))
      setConnectionStatus("connected")

      toast.success("Stream started successfully!")
    } catch (error) {
      console.error("Failed to start stream:", error)
      setStreamStats((prev) => ({ ...prev, status: "offline" }))
      setConnectionStatus("disconnected")
      toast.error("Failed to start stream")
    }
  }

  const stopStream = async () => {
    try {
      setStreamStats((prev) => ({ ...prev, status: "stopping" }))

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }

      if (recordingStatus.isRecording) {
        await stopRecording()
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStreamStats((prev) => ({
        ...prev,
        status: "offline",
        viewers: 0,
        duration: 0,
      }))
      setConnectionStatus("disconnected")

      toast.success("Stream stopped successfully!")
    } catch (error) {
      console.error("Failed to stop stream:", error)
      toast.error("Failed to stop stream")
    }
  }

  const startRecording = async () => {
    try {
      if (!streamRef.current) {
        toast.error("No active stream to record")
        return
      }

      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: "video/webm;codecs=vp9",
      })

      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        await uploadRecording(blob)
      }

      mediaRecorder.start(1000) // Collect data every second
      recordingRef.current = mediaRecorder

      setRecordingStatus((prev) => ({
        ...prev,
        isRecording: true,
        duration: 0,
        fileSize: 0,
      }))

      toast.success("Recording started!")
    } catch (error) {
      console.error("Failed to start recording:", error)
      toast.error("Failed to start recording")
    }
  }

  const stopRecording = async () => {
    try {
      if (recordingRef.current && recordingRef.current.state !== "inactive") {
        recordingRef.current.stop()
      }

      setRecordingStatus((prev) => ({ ...prev, isRecording: false }))
      toast.success("Recording stopped and uploading...")
    } catch (error) {
      console.error("Failed to stop recording:", error)
      toast.error("Failed to stop recording")
    }
  }

  const uploadRecording = async (blob: Blob) => {
    try {
      setCloudStorageStatus("uploading")
      setUploadProgress(0)

      const formData = new FormData()
      formData.append("recording", blob, `stream-${Date.now()}.webm`)
      formData.append("streamId", "current-stream-id")
      formData.append("title", `Stream Recording ${new Date().toLocaleString()}`)
      formData.append("duration", recordingStatus.duration.toString())
      formData.append("quality", recordingStatus.quality)
      formData.append("isPublic", "false")

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.random() * 10
        })
      }, 500)

      const response = await fetch("/api/recordings/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()

      setCloudStorageStatus("ready")
      setUploadProgress(0)

      toast.success("Recording uploaded successfully!")
    } catch (error) {
      console.error("Failed to upload recording:", error)
      setCloudStorageStatus("error")
      toast.error("Failed to upload recording")
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

  return (
    <div className="space-y-6">
      {/* Stream Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                streamStats.status === "live"
                  ? "bg-red-500 animate-pulse"
                  : streamStats.status === "starting" || streamStats.status === "stopping"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
              }`}
            />
            Stream Control
            <Badge variant={streamStats.status === "live" ? "destructive" : "secondary"}>
              {streamStats.status.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            {streamStats.status === "offline" ? (
              <Button onClick={startStream} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Start Stream
              </Button>
            ) : (
              <Button
                onClick={stopStream}
                variant="destructive"
                className="flex items-center gap-2"
                disabled={streamStats.status === "starting" || streamStats.status === "stopping"}
              >
                <Square className="w-4 h-4" />
                Stop Stream
              </Button>
            )}

            {streamStats.status === "live" && (
              <>
                {!recordingStatus.isRecording ? (
                  <Button onClick={startRecording} variant="outline" className="flex items-center gap-2 bg-transparent">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    Start Recording
                  </Button>
                ) : (
                  <Button onClick={stopRecording} variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Square className="w-4 h-4" />
                    Stop Recording
                  </Button>
                )}
              </>
            )}

            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              {connectionStatus === "connected" ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : connectionStatus === "connecting" ? (
                <Wifi className="w-4 h-4 text-yellow-500 animate-pulse" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Connection: {connectionStatus}</span>
            </div>

            <div className="flex items-center gap-2">
              {cloudStorageStatus === "ready" ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : cloudStorageStatus === "uploading" ? (
                <Cloud className="w-4 h-4 text-blue-500 animate-pulse" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Storage: {cloudStorageStatus}</span>
            </div>
          </div>

          {/* Upload Progress */}
          {cloudStorageStatus === "uploading" && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Uploading recording...</span>
                <span>{uploadProgress.toFixed(0)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stream Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{streamStats.viewers}</p>
                <p className="text-sm text-muted-foreground">Viewers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{formatDuration(streamStats.duration)}</p>
                <p className="text-sm text-muted-foreground">Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">{streamStats.bitrate}</p>
              <p className="text-sm text-muted-foreground">Bitrate (kbps)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">{streamStats.fps}</p>
              <p className="text-sm text-muted-foreground">FPS</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recording Status */}
      {recordingStatus.isRecording && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              Recording Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-lg font-semibold">{formatDuration(recordingStatus.duration)}</p>
                <p className="text-sm text-muted-foreground">Recording Duration</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{formatFileSize(recordingStatus.fileSize)}</p>
                <p className="text-sm text-muted-foreground">File Size</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{recordingStatus.quality}</p>
                <p className="text-sm text-muted-foreground">Quality</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stream Details */}
      <Tabs defaultValue="technical" className="w-full">
        <TabsList>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Video Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Resolution:</span>
                      <span>{streamStats.resolution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frame Rate:</span>
                      <span>{streamStats.fps} FPS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bitrate:</span>
                      <span>{streamStats.bitrate} kbps</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Audio Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sample Rate:</span>
                      <span>48 kHz</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bitrate:</span>
                      <span>128 kbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Channels:</span>
                      <span>Stereo</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience">
          <Card>
            <CardHeader>
              <CardTitle>Audience Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Audience analytics will appear here when stream is live</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Live Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Chat messages will appear here when stream is live</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
