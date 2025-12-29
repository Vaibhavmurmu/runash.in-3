"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, Mic, MicOff, Camera, CameraOff, Settings, Share2, Users, MessageSquare, Plus } from "lucide-react"
import MobileLayout from "@/components/mobile/layout"
import type { StreamStatus } from "@/types/mobile-app"

export default function MobileStreamPage() {
  const [streamStatus, setStreamStatus] = useState<StreamStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMicMuted, setIsMicMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [volume, setVolume] = useState(80)
  const [activeTab, setActiveTab] = useState("controls")

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      setStreamStatus({
        isLive: false,
        title: "My Awesome Stream",
        description: "Join me for some fun gameplay and chat!",
        viewerCount: 0,
        platforms: [
          {
            id: "twitch-1",
            name: "My Twitch Channel",
            platform: "twitch",
            isActive: true,
            viewerCount: 0,
            chatCount: 0,
          },
          {
            id: "youtube-1",
            name: "YouTube Gaming",
            platform: "youtube",
            isActive: true,
            viewerCount: 0,
            chatCount: 0,
          },
        ],
      })

      setIsLoading(false)
    }

    loadData()
  }, [])

  const toggleStream = () => {
    if (streamStatus) {
      setStreamStatus({
        ...streamStatus,
        isLive: !streamStatus.isLive,
        startTime: streamStatus.isLive ? undefined : new Date().toISOString(),
        viewerCount: streamStatus.isLive ? 0 : 42,
      })
    }
  }

  const togglePlatform = (platformId: string) => {
    if (streamStatus) {
      setStreamStatus({
        ...streamStatus,
        platforms: streamStatus.platforms.map((p) => (p.id === platformId ? { ...p, isActive: !p.isActive } : p)),
      })
    }
  }

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Stream Preview */}
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {streamStatus?.isLive ? (
              <div className="text-center">
                <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mx-auto mb-2"></div>
                <p className="text-white text-sm font-medium">
                  Live on {streamStatus.platforms.filter((p) => p.isActive).length} platforms
                </p>
                <p className="text-gray-300 text-xs mt-1">{streamStatus.viewerCount} viewers</p>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Preview not available in offline mode</p>
              </div>
            )}
          </div>
        </div>

        {/* Stream Controls */}
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="controls">Controls</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <CardContent className="p-4">
              <TabsContent value="controls" className="mt-0 space-y-4">
                <Button
                  onClick={toggleStream}
                  className={`w-full ${
                    streamStatus?.isLive
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
                  }`}
                  size="lg"
                >
                  {streamStatus?.isLive ? (
                    <>
                      <Pause className="mr-2 h-5 w-5" />
                      End Stream
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Go Live
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={isMicMuted ? "destructive" : "outline"}
                    className="flex flex-col py-6"
                    onClick={() => setIsMicMuted(!isMicMuted)}
                  >
                    {isMicMuted ? <MicOff className="h-6 w-6 mb-1" /> : <Mic className="h-6 w-6 mb-1" />}
                    <span className="text-xs">{isMicMuted ? "Unmute" : "Mute"}</span>
                  </Button>

                  <Button
                    variant={isCameraOff ? "destructive" : "outline"}
                    className="flex flex-col py-6"
                    onClick={() => setIsCameraOff(!isCameraOff)}
                  >
                    {isCameraOff ? <CameraOff className="h-6 w-6 mb-1" /> : <Camera className="h-6 w-6 mb-1" />}
                    <span className="text-xs">{isCameraOff ? "Camera On" : "Camera Off"}</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Volume</span>
                    <span className="text-sm text-gray-500">{volume}%</span>
                  </div>
                  <Slider value={[volume]} onValueChange={(values) => setVolume(values[0])} max={100} step={1} />
                </div>

                {streamStatus?.isLive && (
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{streamStatus.viewerCount} viewers</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
                      <span>
                        {streamStatus.platforms.reduce((sum, platform) => sum + platform.chatCount, 0)} messages
                      </span>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="platforms" className="mt-0 space-y-4">
                <div className="space-y-3">
                  {streamStatus?.platforms.map((platform) => (
                    <div key={platform.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                          <span className="text-xs font-medium">{platform.platform.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium">{platform.name}</p>
                          <p className="text-xs text-gray-500">{platform.platform}</p>
                        </div>
                      </div>
                      <Switch
                        checked={platform.isActive}
                        onCheckedChange={() => togglePlatform(platform.id)}
                        disabled={streamStatus.isLive}
                      />
                    </div>
                  ))}

                  {streamStatus?.isLive && (
                    <p className="text-xs text-gray-500 italic">
                      Platform settings cannot be changed while streaming is active
                    </p>
                  )}

                  <Button variant="outline" className="w-full" disabled={streamStatus?.isLive}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Platform
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-0 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Stream Title</p>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">{streamStatus?.title}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Stream Quality</p>
                      <p className="text-sm text-gray-500">720p (Medium)</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Network</p>
                      <p className="text-sm text-gray-500">WiFi (Good)</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Battery Saver</p>
                      <p className="text-sm text-gray-500">Reduces quality to save battery</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Remote Camera</p>
                      <p className="text-sm text-gray-500">Use this device as a camera source</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" className="flex flex-col h-20 space-y-1">
            <Share2 className="h-5 w-5" />
            <span className="text-xs">Share</span>
          </Button>
          <Button variant="outline" className="flex flex-col h-20 space-y-1">
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">Chat</span>
          </Button>
          <Button variant="outline" className="flex flex-col h-20 space-y-1">
            <Users className="h-5 w-5" />
            <span className="text-xs">Viewers</span>
          </Button>
        </div>
      </div>
    </MobileLayout>
  )
}
