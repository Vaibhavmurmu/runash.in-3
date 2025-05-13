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

  // Load mock data
  useEffect(() => {
    // In a real app, we would fetch this data from an API
    const mockRecordings: RecordedStream[] = [
      {
        id: "rec-1",
        title: "Weekly Gaming Stream",
        description: "Playing the latest releases with viewers",
        thumbnailUrl: "/placeholder.svg?height=720&width=1280",
        recordingUrl: "https://example.com/recordings/rec-1.mp4",
        duration: 7200, // 2 hours
        fileSize: 4.5 * 1024 * 1024 * 1024, // 4.5 GB
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        platforms: ["twitch", "youtube"],
        viewCount: 245,
        downloadCount: 12,
        isProcessing: false,
        isPublic: true,
        tags: ["gaming", "interactive", "multiplayer"],
        category: "Gaming",
      },
      {
        id: "rec-2",
        title: "Community Q&A Session",
        description: "Answering questions from the community about streaming",
        thumbnailUrl: "/placeholder.svg?height=720&width=1280",
        recordingUrl: "https://example.com/recordings/rec-2.mp4",
        duration: 3600, // 1 hour
        fileSize: 2.2 * 1024 * 1024 * 1024, // 2.2 GB
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        platforms: ["twitch"],
        viewCount: 187,
        downloadCount: 8,
        isProcessing: false,
        isPublic: true,
        tags: ["qa", "community", "discussion"],
        category: "Just Chatting",
      },
      {
        id: "rec-3",
        title: "Tutorial: Advanced Streaming Techniques",
        description: "Learn how to improve your streams with advanced techniques",
        thumbnailUrl: "/placeholder.svg?height=720&width=1280",
        recordingUrl: "https://example.com/recordings/rec-3.mp4",
        duration: 5400, // 1.5 hours
        fileSize: 3.1 * 1024 * 1024 * 1024, // 3.1 GB
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        platforms: ["twitch", "youtube", "facebook"],
        viewCount: 412,
        downloadCount: 37,
        isProcessing: false,
        isPublic: true,
        tags: ["tutorial", "educational", "streaming"],
        category: "Education",
      },
      {
        id: "rec-4",
        title: "New Game First Look",
        description: "First impressions of the latest game release",
        thumbnailUrl: "/placeholder.svg?height=720&width=1280",
        recordingUrl: "https://example.com/recordings/rec-4.mp4",
        duration: 4500, // 1.25 hours
        fileSize: 2.8 * 1024 * 1024 * 1024, // 2.8 GB
        createdAt: new Date().toISOString(), // Today
        platforms: ["twitch", "youtube"],
        viewCount: 56,
        downloadCount: 3,
        isProcessing: true,
        isPublic: false,
        tags: ["gaming", "first-look", "review"],
        category: "Gaming",
      },
    ]

    const mockStorageUsage: StorageUsage = {
      used: 12.6 * 1024 * 1024 * 1024, // 12.6 GB
      total: 50 * 1024 * 1024 * 1024, // 50 GB
      recordings: mockRecordings.length,
      oldestRecordingDate: mockRecordings[mockRecordings.length - 1].createdAt,
    }

    const mockCloudProviders: CloudStorageProvider[] = [
      {
        id: "google-drive",
        name: "Google Drive",
        icon: "/placeholder.svg?height=64&width=64",
        isConnected: true,
        usedSpace: 12.6 * 1024 * 1024 * 1024, // 12.6 GB
        totalSpace: 15 * 1024 * 1024 * 1024, // 15 GB
      },
      {
        id: "dropbox",
        name: "Dropbox",
        icon: "/placeholder.svg?height=64&width=64",
        isConnected: false,
        usedSpace: 0,
        totalSpace: 2 * 1024 * 1024 * 1024 * 1024, // 2 TB
      },
      {
        id: "onedrive",
        name: "OneDrive",
        icon: "/placeholder.svg?height=64&width=64",
        isConnected: false,
        usedSpace: 0,
        totalSpace: 1 * 1024 * 1024 * 1024 * 1024, // 1 TB
      },
    ]

    setRecordings(mockRecordings)
    setStorageUsage(mockStorageUsage)
    setCloudProviders(mockCloudProviders)
  }, [])

  const handlePlayRecording = (stream: RecordedStream) => {
    setSelectedStream(stream)
    setIsPlaybackOpen(true)
  }

  const handleEditRecording = (stream: RecordedStream) => {
    // In a real app, this would open an edit dialog
    console.log("Edit recording", stream)
  }

  const handleDeleteRecording = (streamId: string) => {
    setRecordings((prev) => prev.filter((rec) => rec.id !== streamId))
  }

  const handleDownloadRecording = (stream: RecordedStream) => {
    // In a real app, this would trigger a download
    console.log("Download recording", stream)
  }

  const handleShareRecording = (stream: RecordedStream) => {
    setSelectedStream(stream)
    setIsShareOpen(true)
  }

  const handleCreateClip = (stream: RecordedStream) => {
    setSelectedStream(stream)
    setIsClipEditorOpen(true)
  }

  const handleSaveClip = (clip: StreamHighlight) => {
    // In a real app, this would save the clip to the database
    console.log("Save clip", clip)
  }

  const handleConnectProvider = (providerId: string) => {
    // In a real app, this would open an OAuth flow
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

  const handleSaveSettings = (settings: RecordingSettings) => {
    setRecordingSettings(settings)
    // In a real app, this would save the settings to the database
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
      </div>
    </div>
  )
}
