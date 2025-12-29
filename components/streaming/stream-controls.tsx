"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause, Share2, RepeatIcon as Record, CircleStopIcon as Stop } from "lucide-react"

interface StreamControlsProps {
  isStreaming: boolean
  isRecording: boolean
  onToggleStream: () => void
  onStartRecording: () => void
  onStopRecording: () => void
}

export default function StreamControls({
  isStreaming,
  isRecording,
  onToggleStream,
  onStartRecording,
  onStopRecording,
}: StreamControlsProps) {
  return (
    <div className="flex flex-col space-y-4">
      <Button
        onClick={onToggleStream}
        className={
          isStreaming
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-white"
        }
        size="lg"
      >
        {isStreaming ? (
          <>
            <Pause className="mr-2 h-4 w-4" />
            End Stream
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Go Live
          </>
        )}
      </Button>

      {isStreaming && (
        <Button
          onClick={isRecording ? onStopRecording : onStartRecording}
          variant="outline"
          className={isRecording ? "border-red-200 text-red-600" : "border-orange-200 dark:border-orange-800"}
        >
          {isRecording ? (
            <>
              <Stop className="mr-2 h-4 w-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Record className="mr-2 h-4 w-4" />
              Record Stream
            </>
          )}
        </Button>
      )}

      <Button variant="outline" className="border-orange-200 dark:border-orange-800">
        <Share2 className="mr-2 h-4 w-4" />
        Share Stream
      </Button>
    </div>
  )
}
