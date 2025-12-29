"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreHorizontal, Calendar, Clock, Repeat, Edit, Trash2, Copy } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow, format, parseISO, isToday, isTomorrow } from "date-fns"
import type { ScheduledStream } from "@/types/stream-scheduler"

interface UpcomingStreamsProps {
  streams: ScheduledStream[]
  onEdit: (stream: ScheduledStream) => void
  onDelete: (streamId: string) => void
  onDuplicate: (stream: ScheduledStream) => void
}

export default function UpcomingStreams({ streams, onEdit, onDelete, onDuplicate }: UpcomingStreamsProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = (streamId: string) => {
    if (isDeleting === streamId) {
      onDelete(streamId)
      setIsDeleting(null)
    } else {
      setIsDeleting(streamId)
      setTimeout(() => {
        setIsDeleting(null)
      }, 3000)
    }
  }

  const getDateLabel = (dateString: string) => {
    const date = parseISO(dateString)
    if (isToday(date)) {
      return "Today"
    } else if (isTomorrow(date)) {
      return "Tomorrow"
    } else {
      return format(date, "EEE, MMM d")
    }
  }

  const getTimeLabel = (dateString: string) => {
    const date = parseISO(dateString)
    return format(date, "h:mm a")
  }

  const sortedStreams = [...streams].sort(
    (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime(),
  )

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Upcoming Streams</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        {sortedStreams.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mb-2" />
            <h3 className="text-lg font-medium mb-1">No upcoming streams</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Schedule your first stream to see it here</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100%-1rem)] px-4">
            <div className="space-y-4 py-2">
              {sortedStreams.map((stream) => (
                <div
                  key={stream.id}
                  className="border rounded-lg p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{stream.title}</h4>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{getDateLabel(stream.scheduledDate)}</span>
                        <span className="mx-1">•</span>
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{getTimeLabel(stream.scheduledDate)}</span>
                        <span className="mx-1">•</span>
                        <span>{stream.duration} min</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(stream)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicate(stream)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={isDeleting === stream.id ? "text-red-600 dark:text-red-400" : ""}
                          onClick={() => handleDelete(stream.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {isDeleting === stream.id ? "Confirm Delete" : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {stream.platforms.map((platform) => (
                      <Badge key={platform} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                    {stream.isRecurring && (
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800"
                      >
                        <Repeat className="h-3 w-3 mr-1" />
                        {stream.recurrencePattern?.frequency}
                      </Badge>
                    )}
                    {!stream.isPublic && (
                      <Badge
                        variant="outline"
                        className="bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                      >
                        Private
                      </Badge>
                    )}
                  </div>

                  {stream.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">{stream.description}</p>
                  )}

                  <div className="mt-3 text-xs text-gray-500">
                    Scheduled {formatDistanceToNow(parseISO(stream.createdAt), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
