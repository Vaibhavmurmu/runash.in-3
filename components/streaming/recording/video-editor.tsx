"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RotateCcw, Save } from "lucide-react"

interface VideoEditorProps {
  videoUrl: string
  onSave: (editedVideo: EditedVideo) => void
  onClose: () => void
}

interface EditedVideo {
  originalId: string
  title: string
  startTime: number
  endTime: number
  filters: VideoFilter[]
  transitions: VideoTransition[]
  audioLevel: number
  exportSettings: ExportSettings
}

interface VideoFilter {
  type: "brightness" | "contrast" | "saturation" | "blur" | "sharpen"
  value: number
}

interface VideoTransition {
  type: "fade" | "slide" | "zoom"
  duration: number
  position: number
}

interface ExportSettings {
  quality: "low" | "medium" | "high" | "ultra"
  format: "mp4" | "webm" | "mov"
  resolution: "720p" | "1080p" | "4k"
}

export default function VideoEditor({ videoUrl, onSave, onClose }: VideoEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [title, setTitle] = useState("Edited Video")
  const [filters, setFilters] = useState<VideoFilter[]>([
    { type: "brightness", value: 100 },
    { type: "contrast", value: 100 },
    { type: "saturation", value: 100 },
  ])
  const [audioLevel, setAudioLevel] = useState(100)
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    quality: "high",
    format: "mp4",
    resolution: "1080p",
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setEndTime(video.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("timeupdate", handleTimeUpdate)

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [])

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newTime = value[0]
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0] / 100
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const handleFilterChange = (filterType: VideoFilter["type"], value: number) => {
    setFilters((prev) => prev.map((filter) => (filter.type === filterType ? { ...filter, value } : filter)))
    applyFilters()
  }

  const applyFilters = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const brightness = filters.find((f) => f.type === "brightness")?.value || 100
    const contrast = filters.find((f) => f.type === "contrast")?.value || 100
    const saturation = filters.find((f) => f.type === "saturation")?.value || 100

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  }

  const handleTrimStart = () => {
    setStartTime(currentTime)
  }

  const handleTrimEnd = () => {
    setEndTime(currentTime)
  }

  const handleSave = () => {
    const editedVideo: EditedVideo = {
      originalId: "current-video-id", // This would come from props
      title,
      startTime,
      endTime,
      filters,
      transitions: [], // Would be implemented with more advanced editor
      audioLevel,
      exportSettings,
    }
    onSave(editedVideo)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-6xl h-full max-h-[90vh] overflow-hidden">
        <div className="flex h-full">
          {/* Video Preview */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Video Editor</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center bg-black relative">
              <video
                ref={videoRef}
                src={videoUrl}
                className="max-w-full max-h-full"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-0" />
            </div>

            {/* Video Controls */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800">
              <div className="space-y-4">
                {/* Timeline */}
                <div className="space-y-2">
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Trim Controls */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label>Trim:</Label>
                    <Button size="sm" variant="outline" onClick={handleTrimStart}>
                      Start ({formatTime(startTime)})
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleTrimEnd}>
                      End ({formatTime(endTime)})
                    </Button>
                  </div>
                  <div className="flex-1" />
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={togglePlayPause}>
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="outline">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={toggleMute}>
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editing Panel */}
          <div className="w-80 border-l bg-gray-50 dark:bg-gray-800 overflow-y-auto">
            <Tabs defaultValue="basic" className="h-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="filters">Filters</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Audio Level</Label>
                  <Slider value={[audioLevel]} max={200} step={1} onValueChange={(value) => setAudioLevel(value[0])} />
                  <div className="text-sm text-gray-500">{audioLevel}%</div>
                </div>

                <div className="space-y-2">
                  <Label>Trim Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Start</Label>
                      <Input
                        type="number"
                        value={startTime.toFixed(1)}
                        onChange={(e) => setStartTime(Number.parseFloat(e.target.value))}
                        step="0.1"
                        min="0"
                        max={duration}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">End</Label>
                      <Input
                        type="number"
                        value={endTime.toFixed(1)}
                        onChange={(e) => setEndTime(Number.parseFloat(e.target.value))}
                        step="0.1"
                        min="0"
                        max={duration}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="filters" className="p-4 space-y-4">
                {filters.map((filter) => (
                  <div key={filter.type} className="space-y-2">
                    <Label className="capitalize">{filter.type}</Label>
                    <Slider
                      value={[filter.value]}
                      max={200}
                      step={1}
                      onValueChange={(value) => handleFilterChange(filter.type, value[0])}
                    />
                    <div className="text-sm text-gray-500">{filter.value}%</div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setFilters((prev) => prev.map((f) => ({ ...f, value: 100 })))}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              </TabsContent>

              <TabsContent value="export" className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Quality</Label>
                  <select
                    value={exportSettings.quality}
                    onChange={(e) =>
                      setExportSettings((prev) => ({
                        ...prev,
                        quality: e.target.value as ExportSettings["quality"],
                      }))
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="low">Low (Fast)</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="ultra">Ultra (Slow)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Format</Label>
                  <select
                    value={exportSettings.format}
                    onChange={(e) =>
                      setExportSettings((prev) => ({
                        ...prev,
                        format: e.target.value as ExportSettings["format"],
                      }))
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="mp4">MP4</option>
                    <option value="webm">WebM</option>
                    <option value="mov">MOV</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Resolution</Label>
                  <select
                    value={exportSettings.resolution}
                    onChange={(e) =>
                      setExportSettings((prev) => ({
                        ...prev,
                        resolution: e.target.value as ExportSettings["resolution"],
                      }))
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="720p">720p</option>
                    <option value="1080p">1080p</option>
                    <option value="4k">4K</option>
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-500 mb-2">
                    Estimated file size: ~{Math.round((endTime - startTime) * 0.5)} MB
                  </div>
                  <div className="text-sm text-gray-500">
                    Processing time: ~{Math.round((endTime - startTime) / 10)} minutes
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
