"use client"

import { useState } from "react"
import { Calendar, Clock, User, Share2, Bell, BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { LiveStream } from "@/types/live-shopping"

interface LiveStreamInfoProps {
  stream: LiveStream
  isLive?: boolean
}

export default function LiveStreamInfo({ stream, isLive = true }: LiveStreamInfoProps) {
  const [isNotifying, setIsNotifying] = useState(false)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStreamDuration = () => {
    if (!stream.startTime || !stream.endTime) return "Duration unknown"

    const durationMs = stream.endTime.getTime() - stream.startTime.getTime()
    const minutes = Math.floor(durationMs / 60000)

    if (minutes < 60) {
      return `${minutes} min`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return `${hours}h ${remainingMinutes}m`
    }
  }

  const toggleNotification = () => {
    setIsNotifying(!isNotifying)
    // Here you would implement actual notification subscription logic
  }

  const shareStream = () => {
    if (navigator.share) {
      navigator.share({
        title: stream.title,
        text: `Watch ${stream.title} with ${stream.host.name}`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      // Show toast notification that URL was copied
    }
  }

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-xl font-semibold line-clamp-1">{stream.title}</h2>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <User className="h-3 w-3 mr-1" />
            <span>Hosted by {stream.host.name}</span>
          </div>
        </div>

        <div>
          {isLive ? (
            <Badge className="bg-red-500 animate-pulse">LIVE NOW</Badge>
          ) : (
            <Badge variant="outline">UPCOMING</Badge>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{stream.description}</p>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{formatDate(stream.startTime)}</span>
        </div>

        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{getStreamDuration()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={stream.host.avatarUrl || "/placeholder.svg"}
            alt={stream.host.name}
            className="h-8 w-8 rounded-full object-cover"
          />
          <div>
            <div className="text-sm font-medium">{stream.host.name}</div>
            <div className="text-xs text-muted-foreground">{stream.host.role}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={toggleNotification}>
                  {isNotifying ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isNotifying ? "Turn off notifications" : "Get notified"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={shareStream}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share stream</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
