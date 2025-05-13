"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RepeatIcon as Record, Pause, CircleStopIcon as Stop, Clock } from "lucide-react"

interface RecordingStatusProps {
  isStreaming: boolean
  isRecording: boolean
  recordingTime: number // in seconds
  onStartRecording: () => void
  onPauseRecording: () => void
  onStopRecording: () => void
}

export default function RecordingStatus({
  isStreaming,
  isRecording,
  recordingTime,
  onStartRecording,
  onPauseRecording,
  onStopRecording,
}: RecordingStatusProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [formattedTime, setFormattedTime] = useState("00:00:00")

  useEffect(() => {
    const hours = Math.floor(recordingTime / 3600)
    const minutes = Math.floor((recordingTime % 3600) / 60)
    const seconds = recordingTime % 60

    setFormattedTime(
      `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`,
    )
  }, [recordingTime])

  const handlePauseResume = () => {
    if (isPaused) {
      onStartRecording()
      setIsPaused(false)
    } else {
      onPauseRecording()
      setIsPaused(true)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recording</CardTitle>
          {isRecording && !isPaused && (
            <Badge
              variant="outline"
              className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
            >
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-2"></div>
              Recording
            </Badge>
          )}
          {isRecording && isPaused && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Paused
            </Badge>
          )}
          {!isRecording && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
              Inactive
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isRecording && (
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 text-xl font-mono">
              <Clock className="h-5 w-5 text-red-500" />
              <span>{formattedTime}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isRecording ? (
          <>
            <Button
              variant="outline"
              onClick={handlePauseResume}
              className={isPaused ? "text-orange-600" : "text-amber-600"}
            >
              {isPaused ? <Record className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button variant="destructive" onClick={onStopRecording}>
              <Stop className="h-4 w-4 mr-2" />
              Stop Recording
            </Button>
          </>
        ) : (
          <Button
            onClick={onStartRecording}
            disabled={!isStreaming}
            className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
          >
            <Record className="h-4 w-4 mr-2" />
            Start Recording
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
