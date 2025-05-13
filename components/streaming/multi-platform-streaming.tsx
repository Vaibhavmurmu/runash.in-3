"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Plus, Info, Share2, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import PlatformConnection from "./platform-connection"
import PlatformForm, { type PlatformFormData } from "./platform-form"
import PlatformEmptyState from "./platform-empty-state"
import { TwitchIcon, YouTubeIcon, FacebookIcon, TikTokIcon, InstagramIcon, CustomRTMPIcon } from "./platform-icons"

interface PlatformConnectionType {
  id: string
  platform: string
  name: string
  streamKey: string
  serverUrl?: string
  isActive: boolean
  isConnected: boolean
}

interface MultiPlatformStreamingProps {
  isStreaming: boolean
}

export default function MultiPlatformStreaming({ isStreaming }: MultiPlatformStreamingProps) {
  const [platforms, setPlatforms] = useState<PlatformConnectionType[]>([])
  const [activeTab, setActiveTab] = useState("connections")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlatform, setEditingPlatform] = useState<PlatformConnectionType | null>(null)
  const [testingConnection, setTestingConnection] = useState(false)
  const [simulatedBandwidth, setSimulatedBandwidth] = useState(5000) // kbps

  useEffect(() => {
    // In a real app, we would fetch this data from an API
    const demoDelay = setTimeout(() => {
      setPlatforms([
        {
          id: "twitch-1",
          platform: "twitch",
          name: "My Twitch Channel",
          streamKey: "live_123456789_abcdefg",
          isActive: true,
          isConnected: true,
        },
      ])
    }, 1000)

    return () => clearTimeout(demoDelay)
  }, [])

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitch":
        return <TwitchIcon />
      case "youtube":
        return <YouTubeIcon />
      case "facebook":
        return <FacebookIcon />
      case "tiktok":
        return <TikTokIcon />
      case "instagram":
        return <InstagramIcon />
      case "custom":
        return <CustomRTMPIcon />
      default:
        return <Share2 className="text-blue-500" />
    }
  }

  const handleAddPlatform = () => {
    setEditingPlatform(null)
    setIsFormOpen(true)
  }

  const handleEditPlatform = (id: string) => {
    const platform = platforms.find((p) => p.id === id)
    if (platform) {
      setEditingPlatform(platform)
      setIsFormOpen(true)
    }
  }

  const handleDeletePlatform = (id: string) => {
    setPlatforms((prev) => prev.filter((p) => p.id !== id))
  }

  const handleTogglePlatform = (id: string, active: boolean) => {
    setPlatforms((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: active } : p)))

    // Simulate testing connection
    if (active) {
      setTestingConnection(true)
      setTimeout(() => {
        setTestingConnection(false)
      }, 1500)
    }
  }

  const handleSavePlatform = (data: PlatformFormData) => {
    if (editingPlatform) {
      // Update existing platform
      setPlatforms((prev) => prev.map((p) => (p.id === editingPlatform.id ? { ...p, ...data, isConnected: true } : p)))
    } else {
      // Add new platform
      const newPlatform: PlatformConnectionType = {
        id: `${data.platform}-${Date.now()}`,
        platform: data.platform,
        name: data.name,
        streamKey: data.streamKey,
        serverUrl: data.serverUrl,
        isActive: true,
        isConnected: true,
      }
      setPlatforms((prev) => [...prev, newPlatform])
    }

    setIsFormOpen(false)
    setEditingPlatform(null)
  }

  const activePlatforms = platforms.filter((p) => p.isActive)
  const estimatedBandwidthRequired = activePlatforms.length * 2500 // Estimate 2.5Mbps per platform

  return (
    <div className="h-full flex flex-col">
      <PlatformForm
        isOpen={isFormOpen}
        initialData={
          editingPlatform
            ? {
                id: editingPlatform.id,
                platform: editingPlatform.platform,
                name: editingPlatform.name,
                streamKey: editingPlatform.streamKey,
                serverUrl: editingPlatform.serverUrl,
              }
            : undefined
        }
        onClose={() => setIsFormOpen(false)}
        onSave={handleSavePlatform}
      />

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Multi-Platform Streaming</h3>
        {platforms.length > 0 && (
          <Button
            onClick={handleAddPlatform}
            className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Platform
          </Button>
        )}
      </div>

      {testingConnection && (
        <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50">
          <Info className="h-4 w-4 mr-2" />
          <AlertDescription>Testing connection to platforms...</AlertDescription>
        </Alert>
      )}

      {platforms.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 w-full max-w-xs">
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="analytics">Performance</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden mt-4">
            <TabsContent value="connections" className="h-full m-0">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  {platforms.map((platform) => (
                    <PlatformConnection
                      key={platform.id}
                      id={platform.id}
                      platform={platform.platform}
                      name={platform.name}
                      icon={getPlatformIcon(platform.platform)}
                      isActive={platform.isActive}
                      isConnected={platform.isConnected}
                      onToggle={handleTogglePlatform}
                      onEdit={handleEditPlatform}
                      onDelete={handleDeletePlatform}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="analytics" className="h-full m-0">
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                  <h4 className="text-sm font-medium mb-3">Bandwidth Usage</h4>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Estimated Required: {estimatedBandwidthRequired} kbps</span>
                      <span>Available: {simulatedBandwidth} kbps</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          estimatedBandwidthRequired > simulatedBandwidth ? "bg-red-500" : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min((estimatedBandwidthRequired / simulatedBandwidth) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {estimatedBandwidthRequired > simulatedBandwidth && (
                    <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/50">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <AlertDescription>
                        Your bandwidth might not be sufficient for high quality streams on all platforms. Consider
                        optimizing or disabling some platforms.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                  <h4 className="text-sm font-medium mb-3">Platform Status</h4>
                  <div className="space-y-3">
                    {platforms.map((platform) => (
                      <div key={`status-${platform.id}`} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="mr-2">{getPlatformIcon(platform.platform)}</div>
                          <span>{platform.name}</span>
                        </div>
                        <div className="flex items-center">
                          {platform.isActive ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                              <span>Active</span>
                            </>
                          ) : (
                            <span className="text-gray-500">Disabled</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                  <h4 className="text-sm font-medium mb-3">AI Optimization</h4>

                  <TooltipProvider>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span>Smart Bitrate Allocation</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-gray-400 ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-sm">
                              Automatically adjusts the bitrate for each platform based on their requirements and your
                              available bandwidth.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="text-green-500">Enabled</span>
                    </div>
                  </TooltipProvider>

                  <TooltipProvider>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span>Adaptive Resolution</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-gray-400 ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-sm">
                              Automatically adjusts resolution for each platform based on their requirements.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="text-green-500">Enabled</span>
                    </div>
                  </TooltipProvider>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        <div className="flex-1">
          <PlatformEmptyState onAddPlatform={handleAddPlatform} />
        </div>
      )}
    </div>
  )
}
