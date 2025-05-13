"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Bell, Calendar, X } from "lucide-react"
import { formatDistanceToNow, parseISO } from "date-fns"
import type { ScheduledStream } from "@/types/stream-scheduler"

interface StreamNotificationProps {
  stream: ScheduledStream
  onDismiss: () => void
  onGoToStudio: () => void
}

export default function StreamNotification({ stream, onDismiss, onGoToStudio }: StreamNotificationProps) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date()
      const streamDate = parseISO(stream.scheduledDate)
      const diffMs = streamDate.getTime() - now.getTime()

      if (diffMs <= 0) {
        setTimeLeft("Starting now")
        return
      }

      setTimeLeft(formatDistanceToNow(streamDate, { addSuffix: false }))
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [stream.scheduledDate])

  return (
    <Card className="p-4 border-l-4 border-l-orange-500 shadow-md animate-slideIn">
      <div className="flex items-start">
        <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full mr-4">
          <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">Upcoming Stream</h4>
            <Button variant="ghost" size="icon" onClick={onDismiss} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm font-medium mt-1">{stream.title}</p>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Starting in {timeLeft}</span>
          </div>
          <div className="mt-3">
            <Button
              onClick={onGoToStudio}
              className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-white w-full"
              size="sm"
            >
              Go to Studio
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
