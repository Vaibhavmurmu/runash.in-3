"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import StreamControls from "./stream-controls"
import StreamChat from "./stream-chat"
import StreamAnalytics from "./stream-analytics"
import StreamSettings from "./stream-settings"
import StreamStatusBar from "./stream-status-bar"
import ScreenShareWithAnnotations from "./screen-share-with-annotations"
import VirtualBackgrounds from "./virtual-backgrounds"
import MultiPlatformStreaming from "./multi-platform-streaming"
import QuickScheduleButton from "./quick-schedule-button"
import AlertDisplay from "./alerts/alert-display"
import { useRouter } from "next/navigation"

export default function StreamingStudio() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [streamDuration, setStreamDuration] = useState("00:00:00")
  const [viewerCount, setViewerCount] = useState(0)
  const [streamHealth, setStreamHealth] = useState("Excellent")
  const [activePlatforms, setActivePlatforms] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isStreaming) {
      let seconds = 0
      interval = setInterval(() => {
        seconds++
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        setStreamDuration(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
        )

        // Simulate viewer count increasing
        if (seconds % 10 === 0) {
          setViewerCount((prev) => Math.floor(prev + Math.random() * 5))
        }

        // Simulate stream health changes
        if (seconds % 30 === 0) {
          const healthOptions = ["Excellent", "Good", "Fair", "Poor"]
          const weights = [0.7, 0.2, 0.07, 0.03] // Weighted probabilities

          const random = Math.random()
          let cumulativeWeight = 0
          let selectedHealth = "Excellent"

          for (let i = 0; i < healthOptions.length; i++) {
            cumulativeWeight += weights[i]
            if (random <= cumulativeWeight) {
              selectedHealth = healthOptions[i]
              break
            }
          }

          setStreamHealth(selectedHealth)
        }
      }, 1000)
    } else {
      setStreamDuration("00:00:00")
      setViewerCount(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isStreaming])

  const handleToggleStream = () => {
    setIsStreaming((prev) => !prev)
    if (!isStreaming) {
      // Starting stream
      setActivePlatforms(["twitch"]) // Example platform
    } else {
      // Ending stream
      setIsRecording(false)
      setActivePlatforms([])
    }
  }

  const handleStartRecording = () => {
    setIsRecording(true)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
  }

  const handlePlatformChange = (platforms: string[]) => {
    setActivePlatforms(platforms)
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Streaming Studio</h1>
          <div className="flex items-center space-x-4">
            <QuickScheduleButton />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardContent className="p-0">
                <ScreenShareWithAnnotations isStreaming={isStreaming} />
              </CardContent>
            </Card>

            <StreamStatusBar
              isStreaming={isStreaming}
              streamDuration={streamDuration}
              viewerCount={viewerCount}
              streamHealth={streamHealth}
              activePlatforms={activePlatforms}
            />

            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
                <TabsTrigger value="platforms">Platforms</TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="mt-4">
                <StreamChat isStreaming={isStreaming} />
              </TabsContent>
              <TabsContent value="analytics" className="mt-4">
                <StreamAnalytics isStreaming={isStreaming} />
              </TabsContent>
              <TabsContent value="backgrounds" className="mt-4">
                <VirtualBackgrounds />
              </TabsContent>
              <TabsContent value="platforms" className="mt-4">
                <MultiPlatformStreaming isStreaming={isStreaming} onPlatformsChange={handlePlatformChange} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <StreamControls
                  isStreaming={isStreaming}
                  isRecording={isRecording}
                  onToggleStream={handleToggleStream}
                  onStartRecording={handleStartRecording}
                  onStopRecording={handleStopRecording}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <StreamSettings />
              </CardContent>
            </Card>

            <div className="flex space-x-2">
              <button
                onClick={() => router.push("/alerts")}
                className="flex-1 py-2 px-4 bg-white dark:bg-gray-800 rounded-md border border-orange-200 dark:border-orange-800 text-sm font-medium hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors"
              >
                Manage Alerts
              </button>
              <button
                onClick={() => router.push("/recordings")}
                className="flex-1 py-2 px-4 bg-white dark:bg-gray-800 rounded-md border border-orange-200 dark:border-orange-800 text-sm font-medium hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors"
              >
                Recordings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert display component (invisible until alerts are triggered) */}
      <AlertDisplay isStreaming={isStreaming} alertsEnabled={true} queueAlerts={true} alertDelay={2} testMode={false} />
    </div>
  )
}
