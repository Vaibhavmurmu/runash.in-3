"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileIcon as FileSettings,
  ListFilter,
  Clock,
  RotateCw,
  Sparkles,
  BookmarkIcon,
  Layers,
  Search,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

import ConversionSettings from "./conversion-settings"
import ConversionQueue from "./conversion-queue"
import ConversionPresets from "./conversion-presets"
import FileSelector from "./file-selector"
import AIRecommendations from "./ai-recommendations"
import ProfileManager from "./profile-manager"
import BatchProcessor from "./batch-processor"
import CompatibilityChecker from "./compatibility-checker"

import type { MediaFile } from "@/types/upload"
import type { ConversionJob, ConversionSettings as ConversionSettingsType } from "@/types/conversion"
import type { FormatRecommendation } from "@/types/format-recommendations"
import type { ConversionProfile } from "@/types/conversion-profiles"
import {
  availableFormats,
  conversionPresets,
  startConversion,
  getCompatibleFormats,
  createConversionJob,
  estimateOutputSize,
} from "@/services/conversion-service"
import { getDefaultProfile } from "@/services/conversion-profiles-service"
import { optimizeForPlatform } from "@/services/platform-optimizer-service"

interface ConversionPanelProps {
  mediaFiles: MediaFile[]
  onConversionComplete: (job: ConversionJob, outputFile: MediaFile) => void
}

export default function ConversionPanel({ mediaFiles, onConversionComplete }: ConversionPanelProps) {
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([])
  const [selectedFormat, setSelectedFormat] = useState<string>("")
  const [conversionSettings, setConversionSettings] = useState<ConversionSettingsType>({
    resolution: { width: 1280, height: 720 },
    videoBitrate: 2500,
    framerate: 30,
    audioBitrate: 128,
    quality: 80,
    preserveMetadata: true,
  })
  const [conversionJobs, setConversionJobs] = useState<ConversionJob[]>([])
  const [activeTab, setActiveTab] = useState("files")
  const [showBatchProcessor, setShowBatchProcessor] = useState(false)

  const { toast } = useToast()

  // Mock user ID (in a real app, this would come from authentication)
  const userId = "user-1"

  // Filter media files to only include video and audio
  const convertibleFiles = mediaFiles.filter((file) => file.type === "video" || file.type === "audio")

  // Get compatible formats for the selected files
  const compatibleFormats = selectedFiles.length > 0 ? getCompatibleFormats(selectedFiles[0]) : []

  // Load default profile on initial render
  useEffect(() => {
    const defaultProfile = getDefaultProfile(userId)
    if (defaultProfile) {
      setSelectedFormat(defaultProfile.targetFormat)
      setConversionSettings(defaultProfile.settings)
    }
  }, [userId])

  // Reset selected format when files change
  useEffect(() => {
    if (selectedFiles.length > 0) {
      // Set default format based on file type
      const defaultFormat = selectedFiles[0].type === "video" ? "mp4" : "mp3"
      setSelectedFormat(defaultFormat)

      // Apply default preset
      const defaultPreset = conversionPresets.find((preset) => preset.id === "web-optimized")
      if (defaultPreset) {
        setConversionSettings(defaultPreset.settings)
      }
    } else {
      setSelectedFormat("")
    }
  }, [selectedFiles])

  const handleSelectFiles = (files: MediaFile[]) => {
    // Only allow selecting files of the same type
    if (files.length > 0) {
      const fileType = files[0].type
      const sameTypeFiles = files.filter((file) => file.type === fileType)
      setSelectedFiles(sameTypeFiles)
    } else {
      setSelectedFiles([])
    }
  }

  const handleApplyPreset = (presetId: string) => {
    const preset = conversionPresets.find((p) => p.id === presetId)
    if (preset) {
      setSelectedFormat(preset.targetFormat)
      setConversionSettings(preset.settings)
    }
  }

  const handleApplyProfile = (profile: ConversionProfile) => {
    setSelectedFormat(profile.targetFormat)
    setConversionSettings(profile.settings)
    setActiveTab("files")
  }

  const handleApplyRecommendation = (recommendation: FormatRecommendation) => {
    setSelectedFormat(recommendation.format.id)
    setConversionSettings(recommendation.settings)
    setActiveTab("files")
  }

  const handleOptimizeForPlatform = (platformId: string) => {
    const mediaType = selectedFiles.length > 0 ? selectedFiles[0].type : "video"
    const { format, settings } = optimizeForPlatform(platformId, mediaType)

    setSelectedFormat(format)
    setConversionSettings(settings)
    setActiveTab("settings")

    toast({
      title: "Settings Optimized",
      description: `Conversion settings have been optimized for platform compatibility.`,
    })
  }

  const handleStartConversion = () => {
    if (selectedFiles.length === 0 || !selectedFormat) return

    // If multiple files are selected, show batch processor
    if (selectedFiles.length > 1) {
      setShowBatchProcessor(true)
      return
    }

    // Create conversion jobs for each selected file
    const newJobs = selectedFiles.map((file) => createConversionJob(file, selectedFormat, conversionSettings))

    setConversionJobs((prev) => [...prev, ...newJobs])

    // Start conversion for each job
    newJobs.forEach((job) => {
      startConversion(
        job,
        (progress) => {
          // Update job progress
          setConversionJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, progress, status: "converting" } : j)))
        },
        (outputFileId) => {
          // Mark job as complete
          setConversionJobs((prev) =>
            prev.map((j) =>
              j.id === job.id
                ? {
                    ...j,
                    progress: 100,
                    status: "complete",
                    endTime: new Date().toISOString(),
                    outputFileId,
                  }
                : j,
            ),
          )

          // Create output file
          const sourceFile = selectedFiles.find((f) => f.id === job.fileId)
          if (sourceFile) {
            const format = availableFormats.find((f) => f.id === selectedFormat)
            if (format) {
              const outputFileName = sourceFile.name.replace(/\.[^/.]+$/, "") + format.extension

              // Create a new media file for the converted output
              const outputFile: MediaFile = {
                id: outputFileId,
                name: outputFileName,
                type: format.category as any,
                size: estimateOutputSize(sourceFile.size, sourceFile.type, selectedFormat, conversionSettings),
                url: sourceFile.url, // In a real app, this would be a new URL
                thumbnailUrl: sourceFile.thumbnailUrl,
                duration: sourceFile.duration,
                width: conversionSettings.resolution?.width || sourceFile.width,
                height: conversionSettings.resolution?.height || sourceFile.height,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tags: [...(sourceFile.tags || []), "converted"],
                description: sourceFile.description,
                isPublic: sourceFile.isPublic,
              }

              // Notify parent component
              onConversionComplete(job, outputFile)
            }
          }
        },
        (error) => {
          // Mark job as failed
          setConversionJobs((prev) =>
            prev.map((j) =>
              j.id === job.id
                ? {
                    ...j,
                    status: "failed",
                    error,
                    endTime: new Date().toISOString(),
                  }
                : j,
            ),
          )
        },
      )
    })

    // Switch to queue tab
    setActiveTab("queue")

    // Clear selected files
    setSelectedFiles([])
  }

  const handleBatchComplete = (jobs: ConversionJob[], outputFiles: MediaFile[]) => {
    // Add all jobs to the queue
    setConversionJobs((prev) => [...prev, ...jobs])

    // Notify parent component for each output file
    outputFiles.forEach((outputFile, index) => {
      onConversionComplete(jobs[index], outputFile)
    })

    // Show success toast
    toast({
      title: "Batch Conversion Complete",
      description: `Successfully converted ${outputFiles.length} of ${jobs.length} files.`,
    })

    // Hide batch processor and switch to queue tab
    setShowBatchProcessor(false)
    setActiveTab("queue")

    // Clear selected files
    setSelectedFiles([])
  }

  const handleCancelBatch = () => {
    setShowBatchProcessor(false)
  }

  const handleClearCompletedJobs = () => {
    setConversionJobs((prev) => prev.filter((job) => job.status !== "complete" && job.status !== "failed"))
  }

  const handleRemoveJob = (jobId: string) => {
    setConversionJobs((prev) => prev.filter((job) => job.id !== jobId))
  }

  const activeJobs = conversionJobs.filter((job) => job.status === "queued" || job.status === "converting").length

  const completedJobs = conversionJobs.filter((job) => job.status === "complete" || job.status === "failed").length

  // If batch processor is shown, render it instead of the main UI
  if (showBatchProcessor) {
    return (
      <BatchProcessor
        files={selectedFiles}
        targetFormat={selectedFormat}
        settings={conversionSettings}
        onComplete={handleBatchComplete}
        onCancel={handleCancelBatch}
      />
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Media Converter</span>
          {activeJobs > 0 && (
            <Badge variant="outline" className="ml-2 bg-orange-100 dark:bg-orange-900/20">
              {activeJobs} active conversion{activeJobs !== 1 ? "s" : ""}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Convert your media files to different formats</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 w-full rounded-none border-b">
            <TabsTrigger value="files" className="flex items-center gap-2">
              <ListFilter className="h-4 w-4" />
              <span>Select Files</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>AI Suggestions</span>
            </TabsTrigger>
            <TabsTrigger value="compatibility" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Compatibility</span>
            </TabsTrigger>
            <TabsTrigger value="profiles" className="flex items-center gap-2">
              <BookmarkIcon className="h-4 w-4" />
              <span>My Profiles</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <FileSettings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Queue</span>
              {conversionJobs.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {conversionJobs.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="p-4 space-y-4">
            {convertibleFiles.length === 0 ? (
              <Alert>
                <AlertDescription>No convertible files found. Upload video or audio files first.</AlertDescription>
              </Alert>
            ) : (
              <>
                <FileSelector
                  files={convertibleFiles}
                  selectedFiles={selectedFiles}
                  onSelectFiles={handleSelectFiles}
                />

                {selectedFiles.length > 0 && (
                  <div className="space-y-4">
                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium mb-2">Target Format</h3>
                      <div className="flex flex-wrap gap-2">
                        {compatibleFormats.map((format) => (
                          <Badge
                            key={format.id}
                            variant={selectedFormat === format.id ? "default" : "outline"}
                            className={
                              selectedFormat === format.id
                                ? "bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 cursor-pointer"
                                : "cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/20"
                            }
                            onClick={() => setSelectedFormat(format.id)}
                          >
                            {format.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleStartConversion}
                        disabled={!selectedFormat}
                        className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
                      >
                        {selectedFiles.length > 1 ? (
                          <>
                            <Layers className="mr-2 h-4 w-4" />
                            Batch Convert ({selectedFiles.length} files)
                          </>
                        ) : (
                          <>
                            <RotateCw className="mr-2 h-4 w-4" />
                            Start Conversion
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="ai" className="p-4">
            <AIRecommendations
              selectedFile={selectedFiles.length > 0 ? selectedFiles[0] : null}
              onSelectRecommendation={handleApplyRecommendation}
            />
          </TabsContent>

          <TabsContent value="compatibility" className="p-4">
            <CompatibilityChecker
              selectedFile={selectedFiles.length > 0 ? selectedFiles[0] : null}
              targetFormat={selectedFormat}
              settings={conversionSettings}
              onOptimizeForPlatform={handleOptimizeForPlatform}
            />
          </TabsContent>

          <TabsContent value="profiles" className="p-4">
            <ProfileManager
              currentSettings={conversionSettings}
              currentFormat={selectedFormat}
              onApplyProfile={handleApplyProfile}
            />
          </TabsContent>

          <TabsContent value="settings" className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="p-4 border-r">
                <h3 className="text-sm font-medium mb-4">Conversion Presets</h3>
                <ScrollArea className="h-[400px] pr-4">
                  <ConversionPresets presets={conversionPresets} onApplyPreset={handleApplyPreset} />
                </ScrollArea>
              </div>

              <div className="md:col-span-2 p-4">
                <h3 className="text-sm font-medium mb-4">Custom Settings</h3>
                <ConversionSettings
                  settings={conversionSettings}
                  onUpdateSettings={setConversionSettings}
                  selectedFormat={selectedFormat}
                  selectedFileType={selectedFiles[0]?.type || "video"}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="queue" className="p-4">
            <ConversionQueue
              jobs={conversionJobs}
              onRemoveJob={handleRemoveJob}
              onClearCompleted={handleClearCompletedJobs}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
