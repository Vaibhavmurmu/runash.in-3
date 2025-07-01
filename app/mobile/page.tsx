"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Calendar, Bell, Radio, MessageSquare, Users, Clock } from "lucide-react"
import MobileLayout from "@/components/mobile/layout"
import type { StreamStatus, ChatMessage } from "@/types/mobile-app"

export default function MobileHomePage() {
  const [streamStatus, setStreamStatus] = useState<StreamStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [upcomingStreams, setUpcomingStreams] = useState<any[]>([])
  const [recentMessages, setRecentMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      setStreamStatus({
        isLive: false,
        title: "My Awesome Stream",
        description: "Join me for some fun gameplay and chat!",
        viewerCount: 0,
        platforms: [
          {
            id: "twitch-1",
            name: "My Twitch Channel",
            platform: "twitch",
            isActive: true,
            viewerCount: 0,
            chatCount: 0,
          },
          {
            id: "youtube-1",
            name: "YouTube Gaming",
            platform: "youtube",
            isActive: true,
            viewerCount: 0,
            chatCount: 0,
          },
        ],
      })

      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const nextWeek = new Date(now)
      nextWeek.setDate(nextWeek.getDate() + 7)

      setUpcomingStreams([
        {
          id: "stream-1",
          title: "Weekly Gaming Stream",
          scheduledDate: tomorrow.toISOString(),
          platforms: ["twitch", "youtube"],
        },
        {
          id: "stream-2",
          title: "Community Q&A",
          scheduledDate: nextWeek.toISOString(),
          platforms: ["twitch"],
        },
      ])

      setRecentMessages([
        {
          id: "msg-1",
          platform: "twitch",
          username: "StreamFan123",
          message: "Great stream yesterday! Looking forward to the next one!",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "msg-2",
          platform: "youtube",
          username: "GamingPro",
          message: "When is the next stream?",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
      ])

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

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Stream Status */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-yellow-500 p-4">
            <h2 className="text-white font-bold">Stream Status</h2>
          </div>
          <CardContent className="p-4">
            {streamStatus?.isLive ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
                    <span className="font-medium">Live Now</span>
                  </div>
                  <Badge variant="outline" className="border-orange-500 text-orange-600">
                    {streamStatus.viewerCount} viewers
                  </Badge>
                </div>
                <h3 className="font-bold text-lg">{streamStatus.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{streamStatus.description}</p>
                <div className="flex space-x-2">
                  {streamStatus.platforms.map((platform) => (
                    <Badge key={platform.id} variant="secondary">
                      {platform.name}
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button asChild className="flex-1">
                    <Link href="/mobile/stream">Manage Stream</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/mobile/chat">View Chat</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-gray-300 mr-2"></div>
                  <span className="font-medium">Offline</span>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90">
                  <Link href="/mobile/stream">
                    <Play className="h-4 w-4 mr-2" />
                    Go Live
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Streams */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Upcoming Streams</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/mobile/schedule">
                <Calendar className="h-4 w-4 mr-1" />
                View All
              </Link>
            </Button>
          </div>

          {upcomingStreams.length > 0 ? (
            <div className="space-y-3">
              {upcomingStreams.map((stream) => (
                <Card key={stream.id}>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-medium">{stream.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(stream.scheduledDate)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(stream.scheduledDate)}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex space-x-1">
                          {stream.platforms.map((platform: string) => (
                            <Badge key={platform} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="ghost" size="sm" className="mt-2">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-400">No upcoming streams</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/mobile/schedule">Schedule a stream</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="flex flex-col h-20 space-y-1" asChild>
              <Link href="/mobile/stream">
                <Radio className="h-5 w-5" />
                <span className="text-xs">Go Live</span>
              </Link>
            </Button>
            <Button variant="outline" className="flex flex-col h-20 space-y-1" asChild>
              <Link href="/mobile/chat">
                <MessageSquare className="h-5 w-5" />
                <span className="text-xs">Chat</span>
              </Link>
            </Button>
            <Button variant="outline" className="flex flex-col h-20 space-y-1" asChild>
              <Link href="/mobile/analytics">
                <Users className="h-5 w-5" />
                <span className="text-xs">Viewers</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent Messages</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/mobile/chat">View All</Link>
            </Button>
          </div>

          {recentMessages.length > 0 ? (
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <Card key={message.id}>
                  <CardContent className="p-3">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                        <span className="text-xs font-medium">{message.username.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="font-medium text-sm">{message.username}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {message.platform}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{message.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-4 text-center">
                <MessageSquare className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-400">No recent messages</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MobileLayout>
  )
}
