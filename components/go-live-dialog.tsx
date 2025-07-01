"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Camera, Mic, X, Plus, AlertCircle, CheckCircle } from "lucide-react"
import { useStreaming, useMediaDevices } from "@/hooks/use-streaming"
import type { StreamConfig } from "@/lib/streaming-types"

interface GoLiveDialogProps {
  children: React.ReactNode
}

export function GoLiveDialog({ children }: GoLiveDialogProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("setup")
  const [config, setConfig] = useState<StreamConfig>({
    title: "",
    description: "",
    category: "",
    tags: [],
    privacy: "public",
    chatEnabled: true,
    recordingEnabled: false,
    quality: "1080p",
    bitrate: 2500,
    frameRate: 30,
    audioQuality: "high",
  })
  const [newTag, setNewTag] = useState("")
  const [deviceTest, setDeviceTest] = useState({
    camera: false,
    microphone: false,
  })

  const { createStream, startStream, isLoading, error } = useStreaming()
  const { devices } = useMediaDevices()

  const categories = [
    "Programming",
    "Gaming",
    "Music",
    "Art",
    "Education",
    "Fitness",
    "Cooking",
    "Talk Shows",
    "Technology",
    "Business",
  ]

  const handleAddTag = () => {
    if (newTag.trim() && !config.tags.includes(newTag.trim()) && config.tags.length < 10) {
      setConfig((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setConfig((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleTestDevice = async (deviceType: "camera" | "microphone") => {
    try {
      const constraints = deviceType === "camera" ? { video: true, audio: false } : { video: false, audio: true }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setDeviceTest((prev) => ({ ...prev, [deviceType]: true }))

      // Stop the stream after testing
      setTimeout(() => {
        stream.getTracks().forEach((track) => track.stop())
        setDeviceTest((prev) => ({ ...prev, [deviceType]: false }))
      }, 3000)
    } catch (err) {
      console.error(`Error testing ${deviceType}:`, err)
    }
  }

  const handleGoLive = async () => {
    if (!config.title || !config.category) {
      return
    }

    const stream = await createStream(config)
    if (stream) {
      const success = await startStream(stream.id)
      if (success) {
        setOpen(false)
        setActiveTab("setup")
        // Reset form
        setConfig({
          title: "",
          description: "",
          category: "",
          tags: [],
          privacy: "public",
          chatEnabled: true,
          recordingEnabled: false,
          quality: "1080p",
          bitrate: 2500,
          frameRate: 30,
          audioQuality: "high",
        })
      }
    }
  }

  const isFormValid = config.title.trim() && config.category

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5 text-red-500" />
            <span>Go Live</span>
          </DialogTitle>
          <DialogDescription>Set up your stream and start broadcasting to your audience</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Stream Setup</TabsTrigger>
            <TabsTrigger value="devices">Device Test</TabsTrigger>
            <TabsTrigger value="settings">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Stream Title *</Label>
                <Input
                  id="title"
                  placeholder="What are you streaming today?"
                  value={config.title}
                  onChange={(e) => setConfig((prev) => ({ ...prev, title: e.target.value }))}
                  maxLength={255}
                />
                <p className="text-xs text-muted-foreground">{config.title.length}/255 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell your audience what to expect..."
                  value={config.description}
                  onChange={(e) => setConfig((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={config.category}
                    onValueChange={(value) => setConfig((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privacy">Privacy</Label>
                  <Select
                    value={config.privacy}
                    onValueChange={(value: "public" | "unlisted" | "private") =>
                      setConfig((prev) => ({ ...prev, privacy: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="unlisted">Unlisted</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {config.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    maxLength={20}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTag}
                    disabled={!newTag.trim() || config.tags.length >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">{config.tags.length}/10 tags</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Chat</Label>
                  <p className="text-xs text-muted-foreground">Allow viewers to chat during your stream</p>
                </div>
                <Switch
                  checked={config.chatEnabled}
                  onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, chatEnabled: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Record Stream</Label>
                  <p className="text-xs text-muted-foreground">Save a recording of your stream</p>
                </div>
                <Switch
                  checked={config.recordingEnabled}
                  onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, recordingEnabled: checked }))}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="h-5 w-5" />
                    <span>Camera Test</span>
                  </CardTitle>
                  <CardDescription>Test your camera before going live</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    {deviceTest.camera ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span>Camera is working!</span>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Camera preview will appear here</p>
                      </div>
                    )}
                  </div>
                  <Button onClick={() => handleTestDevice("camera")} disabled={deviceTest.camera} className="w-full">
                    {deviceTest.camera ? "Testing..." : "Test Camera"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mic className="h-5 w-5" />
                    <span>Microphone Test</span>
                  </CardTitle>
                  <CardDescription>Test your microphone audio levels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                    {deviceTest.microphone ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span>Microphone is working!</span>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <Mic className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Audio levels will appear here</p>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => handleTestDevice("microphone")}
                    disabled={deviceTest.microphone}
                    className="w-full"
                  >
                    {deviceTest.microphone ? "Testing..." : "Test Microphone"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Available Devices</CardTitle>
                <CardDescription>Detected cameras and microphones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {devices
                    .filter((d) => d.kind === "videoinput")
                    .map((device) => (
                      <div key={device.deviceId} className="flex items-center space-x-2 p-2 border rounded">
                        <Camera className="h-4 w-4" />
                        <span className="text-sm">{device.label}</span>
                      </div>
                    ))}
                  {devices
                    .filter((d) => d.kind === "audioinput")
                    .map((device) => (
                      <div key={device.deviceId} className="flex items-center space-x-2 p-2 border rounded">
                        <Mic className="h-4 w-4" />
                        <span className="text-sm">{device.label}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Video Quality</CardTitle>
                  <CardDescription>Configure your stream video settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Resolution</Label>
                      <Select
                        value={config.quality}
                        onValueChange={(value: "720p" | "1080p" | "4K") =>
                          setConfig((prev) => ({ ...prev, quality: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="720p">720p (1280x720)</SelectItem>
                          <SelectItem value="1080p">1080p (1920x1080)</SelectItem>
                          <SelectItem value="4K">4K (3840x2160)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Frame Rate</Label>
                      <Select
                        value={config.frameRate.toString()}
                        onValueChange={(value) =>
                          setConfig((prev) => ({ ...prev, frameRate: Number.parseInt(value) as 30 | 60 }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 FPS</SelectItem>
                          <SelectItem value="60">60 FPS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Bitrate: {config.bitrate} kbps</Label>
                    <input
                      type="range"
                      min="1000"
                      max="8000"
                      step="500"
                      value={config.bitrate}
                      onChange={(e) => setConfig((prev) => ({ ...prev, bitrate: Number.parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1000 kbps</span>
                      <span>8000 kbps</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audio Quality</CardTitle>
                  <CardDescription>Configure your stream audio settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Audio Quality</Label>
                    <Select
                      value={config.audioQuality}
                      onValueChange={(value: "standard" | "high" | "studio") =>
                        setConfig((prev) => ({ ...prev, audioQuality: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (128 kbps)</SelectItem>
                        <SelectItem value="high">High (256 kbps)</SelectItem>
                        <SelectItem value="studio">Studio (320 kbps)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleGoLive} disabled={!isFormValid || isLoading} className="bg-red-500 hover:bg-red-600">
            {isLoading ? "Starting..." : "Go Live"}
            <Play className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
