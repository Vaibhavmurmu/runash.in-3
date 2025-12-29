"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Settings,
  Users,
  MessageSquare,
  ShoppingCart,
  Bot,
  Play,
  Square,
  Monitor,
  Camera,
} from "lucide-react"
import { StreamChat } from "./stream-chat"
import { ProductShowcase } from "./product-showcase"
import { AIAgentPanel } from "./ai-agent-panel"
import { StreamMetrics } from "./stream-metrics"

export function StreamStudio() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [streamTitle, setStreamTitle] = useState("Organic Skincare Live Show")
  const [streamDescription, setStreamDescription] = useState(
    "Join us for an exclusive look at our latest organic skincare products!",
  )
  const [viewerCount, setViewerCount] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        streamRef.current = stream
      } catch (error) {
        console.error("Error accessing camera:", error)
      }
    }

    initCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Simulate viewer count updates
  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => {
        setViewerCount((prev) => prev + Math.floor(Math.random() * 10) - 4)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isStreaming])

  const toggleStream = () => {
    setIsStreaming(!isStreaming)
    if (!isStreaming) {
      setViewerCount(Math.floor(Math.random() * 100) + 50)
    } else {
      setViewerCount(0)
    }
  }

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled
      }
    }
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Stream Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Stream Studio</h2>
          <p className="text-muted-foreground">Create and manage your live streams</p>
        </div>
        <div className="flex items-center gap-4">
          {isStreaming && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="font-medium">LIVE</span>
              <Badge variant="secondary">{viewerCount} viewers</Badge>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Stream Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Stream Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                {!isVideoEnabled && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <VideoOff className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                {/* Stream Controls Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant={isVideoEnabled ? "secondary" : "destructive"} size="sm" onClick={toggleVideo}>
                      {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </Button>
                    <Button variant={isAudioEnabled ? "secondary" : "destructive"} size="sm" onClick={toggleAudio}>
                      {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                  </div>

                  <Button variant={isStreaming ? "destructive" : "default"} onClick={toggleStream} className="gap-2">
                    {isStreaming ? (
                      <>
                        <Square className="h-4 w-4" />
                        End Stream
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Go Live
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stream Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Stream Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Stream Title</Label>
                <Input
                  id="title"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="Enter stream title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={streamDescription}
                  onChange={(e) => setStreamDescription(e.target.value)}
                  placeholder="Describe your stream"
                  rows={3}
                />
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Settings
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Camera Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stream Metrics */}
          {isStreaming && <StreamMetrics />}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chat" className="text-xs">
                <MessageSquare className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="products" className="text-xs">
                <ShoppingCart className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-xs">
                <Bot className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="viewers" className="text-xs">
                <Users className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-4">
              <StreamChat isStreaming={isStreaming} />
            </TabsContent>

            <TabsContent value="products" className="mt-4">
              <ProductShowcase />
            </TabsContent>

            <TabsContent value="ai" className="mt-4">
              <AIAgentPanel isStreaming={isStreaming} />
            </TabsContent>

            <TabsContent value="viewers" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Viewers ({viewerCount})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {isStreaming ? (
                      <>
                        <div className="flex justify-between">
                          <span>Peak viewers</span>
                          <span className="font-medium">{Math.max(viewerCount + 15, 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average watch time</span>
                          <span className="font-medium">8m 32s</span>
                        </div>
                        <div className="flex justify-between">
                          <span>New followers</span>
                          <span className="font-medium">+12</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-muted-foreground">Start streaming to see viewer metrics</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
