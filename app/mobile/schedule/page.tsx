"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, CalendarIcon, Clock, ChevronRight } from "lucide-react"
import MobileLayout from "@/components/mobile/layout"
import type { ScheduledStream } from "@/types/mobile-app"

export default function MobileSchedulePage() {
  const [streams, setStreams] = useState<ScheduledStream[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const nextWeek = new Date(now)
      nextWeek.setDate(nextWeek.getDate() + 7)

      const mockStreams: ScheduledStream[] = [
        {
          id: "stream-1",
          title: "Weekly Gaming Stream",
          description: "Join me for some fun gameplay and chat!",
          scheduledDate: tomorrow.toISOString(),
          duration: 120,
          platforms: ["twitch-1", "youtube-1"],
          isRecurring: true,
          recurrencePattern: {
            frequency: "weekly",
            interval: 1,
            daysOfWeek: [tomorrow.getDay()],
          },
          tags: ["gaming", "interactive"],
          category: "Gaming",
          isPublic: true,
          notificationTime: 15,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "stream-2",
          title: "Community Q&A",
          description: "Answering your questions about streaming and content creation",
          scheduledDate: nextWeek.toISOString(),
          duration: 60,
          platforms: ["twitch-1"],
          isRecurring: false,
          tags: ["qa", "community"],
          category: "Just Chatting",
          isPublic: true,
          notificationTime: 30,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      setStreams(mockStreams)
      setIsLoading(false)
    }

    loadData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  }

  const getStreamsForDate = (date: Date) => {
    return streams.filter((stream) => {
      const streamDate = new Date(stream.scheduledDate)
      return (
        streamDate.getDate() === date.getDate() &&
        streamDate.getMonth() === date.getMonth() &&
        streamDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const upcomingStreams = streams.filter((stream) => new Date(stream.scheduledDate) > new Date())
  const selectedDateStreams = selectedDate ? getStreamsForDate(selectedDate) : []

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading schedule...</p>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Stream Schedule</h2>
          <Button className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            New Stream
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4 space-y-4">
            {upcomingStreams.length > 0 ? (
              <div className="space-y-3">
                {upcomingStreams.map((stream) => (
                  <Card key={stream.id}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-medium">{stream.title}</h3>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {formatDate(stream.scheduledDate)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(stream.scheduledDate)} ({stream.duration} min)
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {stream.platforms.map((platform) => (
                              <Badge key={platform} variant="outline" className="text-xs">
                                {platform.split("-")[0]}
                              </Badge>
                            ))}
                            {stream.isRecurring && (
                              <Badge variant="secondary" className="text-xs">
                                Recurring
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium mb-1">No upcoming streams</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Schedule a new stream to see it here</p>
                <Button variant="link" className="mt-2">
                  Schedule Stream
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-4 space-y-4">
            <Card>
              <CardContent className="p-4">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="mx-auto" />
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="font-medium">
                {selectedDate
                  ? selectedDate.toLocaleDateString(undefined, { month: "long", day: "numeric" })
                  : "Select a date"}
              </h3>

              {selectedDateStreams.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateStreams.map((stream) => (
                    <Card key={stream.id}>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="font-medium">{stream.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(stream.scheduledDate)} ({stream.duration} min)
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {stream.platforms.map((platform) => (
                                <Badge key={platform} variant="outline" className="text-xs">
                                  {platform.split("-")[0]}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No streams scheduled for this date</p>
                    <Button variant="link" className="mt-2">
                      Schedule Stream
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  )
}
