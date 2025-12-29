"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HardDrive, Cloud, Settings, FileVideo, Scissors } from "lucide-react"
import RecordingSettingsComponent from "@/components/streaming/recording/recording-settings"
import RecordedStreamsLibrary from "@/components/streaming/recording/recorded-streams-library"
import StorageUsageComponent from "@/components/streaming/recording/storage-usage"
import CloudStorageProviderComponent from "@/components/streaming/recording/cloud-storage-provider"
import StreamPlayback from "@/components/streaming/recording/stream-playback"
import ShareDialog from "@/components/streaming/recording/share-dialog"
import ClipEditor from "@/components/streaming/recording/clip-editor"
import VideoEditor from "@/components/streaming/recording/video-editor"
import { RecordingService } from "@/lib/recording-service"
import type {
  RecordedStream,
  RecordingSettings,
  StorageUsage,
  CloudStorageProvider,
  StreamHighlight,
} from "@/types/recording"

export default function RecordingsPage() {
  const [activeTab, setActiveTab] = useState("library")
  const [recordings, setRecordings] = useState<RecordedStream[]>([])
  const [selectedStream, setSelectedStream] = useState<RecordedStream | null>(null)
  const [isPlaybackOpen, setIsPlaybackOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isClipEditorOpen, setIsClipEditorOpen] = useState(false)
  const [isVideoEditorOpen, setIsVideoEditorOpen] = useState(false)
  const [storageUsage, setStorageUsage] = useState<StorageUsage>({
    used: 0,
    total: 0,
    recordings: 0,
  })
  const [cloudProviders, setCloudProviders] = useState<CloudStorageProvider[]>([])
  const [recordingSettings, setRecordingSettings] = useState<RecordingSettings>({
    autoRecord: true,
    recordAudio: true,
    recordVideo: true,
    quality: "high",
    format: "mp4",
    storage: "cloud",
    maxStorageGB: 50,
    autoDelete: false,
    autoDeleteAfterDays: 30,
    saveChat: true,
    createHighlights: true,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [recordingsData, storageData] = await Promise.all([
          RecordingService.getRecordings(),
          RecordingService.getStorageUsage(),
        ])

        setRecordings(recordingsData)
        setStorageUsage(storageData)
      } catch (error) {
        console.error("Failed to load recordings:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handlePlayRecording = (stream: RecordedStream) => {
    setSelectedStream(stream)
    setIsPlaybackOpen(true)
  }

  const handleEditRecording = (stream: RecordedStream) => {
    setSelectedStream(stream)
    setIsVideoEditorOpen(true)
  }

  const handleDeleteRecording = async (streamId: string) => {
    try {
      await RecordingService.deleteRecording(streamId)
      setRecordings((prev) => prev.filter((rec) => rec.id !== streamId))
    } catch (error) {
      console.error("Failed to delete recording:", error)
    }
  }

  const handleDownloadRecording = async (stream: RecordedStream) => {
    try {
      await RecordingService.downloadRecording(stream.id)
    } catch (error) {
      console.error("Failed to download recording:", error)
    }
  }

  const handleShareRecording = (stream: RecordedStream) => {
    setSelectedStream(stream)
    setIsShareOpen(true)
  }

  const handleCreateClip = (stream: RecordedStream) => {
    setSelectedStream(stream)
    setIsClipEditorOpen(true)
  }

  const handleSaveClip = async (clip: StreamHighlight) => {
    try {
      await RecordingService.createClip(clip)
      const updatedRecordings = await RecordingService.getRecordings()
      setRecordings(updatedRecordings)
    } catch (error) {
      console.error("Failed to save clip:", error)
    }
  }

  const handleSaveEditedVideo = async (editedVideo: any) => {
    try {
      await RecordingService.saveEditedVideo(editedVideo)
      setIsVideoEditorOpen(false)
      const updatedRecordings = await RecordingService.getRecordings()
      setRecordings(updatedRecordings)
    } catch (error) {
      console.error("Failed to save edited video:", error)
    }
  }

  const handleConnectProvider = (providerId: string) => {
    setCloudProviders((prev) =>
      prev.map((provider) =>
        provider.id === providerId
          ? {
              ...provider,
              isConnected: true,
            }
          : provider,
      ),
    )
  }

  const handleDisconnectProvider = (providerId: string) => {
    setCloudProviders((prev) =>
      prev.map((provider) =>
        provider.id === providerId
          ? {
              ...provider,
              isConnected: false,
            }
          : provider,
      ),
    )
  }

  const handleSaveSettings = async (settings: RecordingSettings) => {
    try {
      await RecordingService.updateSettings(settings)
      setRecordingSettings(settings)
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading recordings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Recordings</h1>
          <Button className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90">
            <FileVideo className="h-4 w-4 mr-2" />
            Manage Storage
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="library" className="flex items-center">
              <FileVideo className="h-4 w-4 mr-2" />
              Library
            </TabsTrigger>
            <TabsTrigger value="clips" className="flex items-center">
              <Scissors className="h-4 w-4 mr-2" />
              Clips
            </TabsTrigger>
            <TabsTrigger value="storage" className="flex items-center">
              <HardDrive className="h-4 w-4 mr-2" />
              Storage
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="mt-0">
            <RecordedStreamsLibrary
              streams={recordings}
              onPlay={handlePlayRecording}
              onEdit={handleEditRecording}
              onDelete={handleDeleteRecording}
              onDownload={handleDownloadRecording}
              onShare={handleShareRecording}
              onCreateClip={handleCreateClip}
            />
          </TabsContent>

          <TabsContent value="clips" className="mt-0">
            <div className="text-center py-16">
              <Scissors className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No clips yet</h3>
              <p className="text-gray-500 mb-4">Create clips from your recordings to highlight the best moments</p>
              <Button
                onClick={() => setActiveTab("library")}
                className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
              >
                Browse Recordings
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="storage" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <StorageUsageComponent usage={storageUsage} />
              </div>
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Cloud className="h-5 w-5 mr-2" />
                      Cloud Storage
                    </CardTitle>
                    <CardDescription>Connect cloud storage providers to store your recordings</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cloudProviders.map((provider) => (
                      <CloudStorageProviderComponent
                        key={provider.id}
                        provider={provider}
                        onConnect={handleConnectProvider}
                        onDisconnect={handleDisconnectProvider}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <RecordingSettingsComponent initialSettings={recordingSettings} onSave={handleSaveSettings} />
          </TabsContent>
        </Tabs>

        <StreamPlayback
          stream={selectedStream}
          isOpen={isPlaybackOpen}
          onClose={() => setIsPlaybackOpen(false)}
          onDownload={handleDownloadRecording}
          onShare={handleShareRecording}
        />

        <ShareDialog stream={selectedStream} isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />

        <ClipEditor
          stream={selectedStream}
          isOpen={isClipEditorOpen}
          onClose={() => setIsClipEditorOpen(false)}
          onSave={handleSaveClip}
        />

        {selectedStream && (
          <VideoEditor
            videoUrl={selectedStream.recordingUrl}
            isOpen={isVideoEditorOpen}
            onClose={() => setIsVideoEditorOpen(false)}
            onSave={handleSaveEditedVideo}
          />
        )}
      </div>
    </div>
  )
}
