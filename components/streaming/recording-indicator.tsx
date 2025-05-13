"use client"

import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface RecordingIndicatorProps {
  isRecording: boolean
  recordingTime: number // in seconds
  isPaused?: boolean
}

export default function RecordingIndicator({ isRecording, recordingTime, isPaused = false }: RecordingIndicatorProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (!isRecording) return null

  return (
    <Badge
      variant="outline"
      className={
        isPaused
          ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
          : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      }
    >
      {isPaused ? (
        <Clock className="h-3 w-3 mr-1" />
      ) : (
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-2"></div>
      )}
      {isPaused ? "Recording Paused" : "Recording"} • {formatTime(recordingTime)}
    </Badge>
  )
}
