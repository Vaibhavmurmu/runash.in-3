"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Play, Pause, Scissors } from "lucide-react"
import type { RecordedStream, StreamHighlight } from "@/types/recording"

interface ClipEditorProps {
  stream: RecordedStream | null
  isOpen: boolean
  onClose: () => void
  onSave: (clip: StreamHighlight) => void
}

export default function ClipEditor({ stream, isOpen, onClose, onSave }: ClipEditorProps) {
  const [title, setTitle] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isOpen && stream) {
      setTitle(`Clip from ${stream.title}`)
      setIsPlaying(false)
      setCurrentTime(0)
      setStartTime(0)
      setEndTime(0)
    }
  }, [isOpen, stream])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setEndTime(Math.min(30, video.duration)) // Default to 30 seconds or full duration
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [])

  const togglePlay = () => {
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

  const handleStartTimeChange = (value: number[]) => {
    const newStartTime = value[0]
    setStartTime(newStartTime)
    if (newStartTime >= endTime) {
      setEndTime(Math.min(newStartTime + 1, duration))
    }
  }

  const handleEndTimeChange = (value: number[]) => {
    const newEndTime = value[0]
    setEndTime(newEndTime)
    if (newEndTime <= startTime) {
      setStartTime(Math.max(newEndTime - 1, 0))
    }
  }

  const handleSave = () => {
    if (!stream) return

    const newClip: StreamHighlight = {
      id: `clip-${Date.now()}`,
      title,
      startTime,
      endTime,
      viewCount: 0,
      thumbnailUrl: stream.thumbnailUrl,
    }

    onSave(newClip)
    onClose()
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (!stream) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Clip</DialogTitle>
          <DialogDescription>Create a short clip from your recording</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-black rounded-md overflow-hidden">
            <video
              ref={videoRef}
              src={stream.recordingUrl}
              className="w-full aspect-video"
              poster={stream.thumbnailUrl}
              onClick={togglePlay}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Clip Range</Label>
                <div className="text-sm">{formatTime(endTime - startTime)} duration</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 text-center">
                  <span className="text-sm">{formatTime(startTime)}</span>
                </div>
                <Slider
                  value={[startTime, endTime]}
                  max={duration}
                  step={0.1}
                  onValueChange={(values) => {
                    setStartTime(values[0])
                    setEndTime(values[1])
                  }}
                  className="flex-1"
                />
                <div className="w-16 text-center">
                  <span className="text-sm">{formatTime(endTime)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <Button variant="outline" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const video = videoRef.current
                  if (video) {
                    video.currentTime = startTime
                  }
                }}
              >
                Preview Clip
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clip-title">Clip Title</Label>
              <Input
                id="clip-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your clip"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title || startTime === endTime}
            className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
          >
            <Scissors className="h-4 w-4 mr-2" />
            Create Clip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
