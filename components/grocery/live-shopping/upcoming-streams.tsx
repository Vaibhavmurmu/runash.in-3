"use client"

import { useState } from "react"
import { Calendar, Clock, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { LiveStream } from "@/types/live-shopping"

interface UpcomingStreamsProps {
  streams: LiveStream[]
  onStreamSelect?: (streamId: string) => void
}

export default function UpcomingStreams({ streams, onStreamSelect }: UpcomingStreamsProps) {
  const [expandedStreamId, setExpandedStreamId] = useState<string | null>(null)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const toggleExpand = (streamId: string) => {
    setExpandedStreamId(expandedStreamId === streamId ? null : streamId)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Upcoming Streams</h3>
        <Button variant="link" size="sm" className="text-xs">
          View All
        </Button>
      </div>

      {streams.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center text-muted-foreground">No upcoming streams scheduled</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {streams.map((stream) => (
            <Card
              key={stream.id}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => toggleExpand(stream.id)}
            >
              <CardContent className="p-0">
                <div className="flex items-center">
                  <div className="h-full w-2 bg-primary" />
                  <div className="p-3 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium line-clamp-1">{stream.title}</h4>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{isToday(stream.startTime) ? "Today" : formatDate(stream.startTime)}</span>
                          <span className="mx-1">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatTime(stream.startTime)}</span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {isToday(stream.startTime) && (
                          <Badge variant="outline" className="mr-2">
                            Today
                          </Badge>
                        )}
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            expandedStreamId === stream.id ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {expandedStreamId === stream.id && (
                      <div className="mt-3 space-y-3">
                        <p className="text-sm text-muted-foreground">{stream.description}</p>

                        <div className="flex items-center gap-2">
                          <img
                            src={stream.host.avatarUrl || "/placeholder.svg"}
                            alt={stream.host.name}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <span className="text-xs">{stream.host.name}</span>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onStreamSelect?.(stream.id)
                            }}
                          >
                            Set Reminder
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
