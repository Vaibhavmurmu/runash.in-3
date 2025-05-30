"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Play, Users, Clock, Calendar, Eye, Heart, Share2, Bell, Video } from "lucide-react"
import type { LiveStream } from "@/types/live-shopping"

// Mock live streams data
const mockLiveStreams: LiveStream[] = [
  {
    id: "ls-001",
    title: "Farm Fresh Organic Produce - Direct from Farmers",
    description: "Join us for a special showcase of this week's freshest organic produce",
    hostName: "Priya Sharma",
    hostAvatar: "/placeholder.svg?height=100&width=100",
    thumbnailUrl: "/placeholder.svg?height=720&width=1280",
    scheduledStartTime: new Date(Date.now() - 30 * 60 * 1000),
    actualStartTime: new Date(Date.now() - 28 * 60 * 1000),
    status: "live",
    viewerCount: 342,
    peakViewerCount: 450,
    totalViews: 1200,
    likeCount: 287,
    featuredProducts: [],
    chatEnabled: true,
    recordingAvailable: false,
    tags: ["organic", "farm-fresh", "seasonal", "recipes"],
  },
  {
    id: "ls-002",
    title: "Superfood Sunday - Quinoa & Ancient Grains",
    description: "Discover the nutritional benefits of ancient grains and superfoods",
    hostName: "Dr. Rajesh Kumar",
    hostAvatar: "/placeholder.svg?height=100&width=100",
    thumbnailUrl: "/placeholder.svg?height=720&width=1280",
    scheduledStartTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: "scheduled",
    viewerCount: 0,
    peakViewerCount: 0,
    totalViews: 0,
    likeCount: 0,
    featuredProducts: [],
    chatEnabled: true,
    recordingAvailable: false,
    tags: ["superfood", "nutrition", "health", "grains"],
  },
  {
    id: "ls-003",
    title: "Spice Masterclass - Indian Organic Spices",
    description: "Learn about authentic Indian spices and their health benefits",
    hostName: "Chef Meera Patel",
    hostAvatar: "/placeholder.svg?height=100&width=100",
    thumbnailUrl: "/placeholder.svg?height=720&width=1280",
    scheduledStartTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: "scheduled",
    viewerCount: 0,
    peakViewerCount: 0,
    totalViews: 0,
    likeCount: 0,
    featuredProducts: [],
    chatEnabled: true,
    recordingAvailable: false,
    tags: ["spices", "cooking", "indian", "health"],
  },
]

export default function LiveShoppingWidget() {
  const router = useRouter()
  const [streams, setStreams] = useState<LiveStream[]>(mockLiveStreams)

  // Simulate real-time updates for live streams
  useEffect(() => {
    const interval = setInterval(() => {
      setStreams((prev) =>
        prev.map((stream) => {
          if (stream.status === "live") {
            return {
              ...stream,
              viewerCount: stream.viewerCount + Math.floor(Math.random() * 10) - 5,
              likeCount: stream.likeCount + Math.floor(Math.random() * 3),
            }
          }
          return stream
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const liveStreams = streams.filter((s) => s.status === "live")
  const upcomingStreams = streams.filter((s) => s.status === "scheduled").slice(0, 2)

  const formatTimeUntil = (date: Date) => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const handleJoinStream = (streamId: string) => {
    router.push(`/grocery/live?id=${streamId}`)
  }

  return (
    <div className="space-y-6">
      {/* Live Streams */}
      {liveStreams.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            <h3 className="text-lg font-semibold text-red-600">Live Now</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveStreams.map((stream) => (
              <Card key={stream.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <img
                    src={stream.thumbnailUrl || "/placeholder.svg"}
                    alt={stream.title}
                    className="w-full h-48 object-cover"
                  />

                  {/* Live Badge */}
                  <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                    <div className="h-2 w-2 rounded-full bg-white animate-pulse mr-1"></div>
                    LIVE
                  </Badge>

                  {/* Viewer Count */}
                  <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                    <Users className="h-3 w-3 mr-1" />
                    {stream.viewerCount.toLocaleString()}
                  </Badge>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={() => handleJoinStream(stream.id)}
                      className="bg-white/90 text-black hover:bg-white"
                      size="lg"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Join Stream
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h4 className="font-semibold line-clamp-2 mb-2">{stream.title}</h4>

                  <div className="flex items-center space-x-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={stream.hostAvatar || "/placeholder.svg"} alt={stream.hostName} />
                      <AvatarFallback>{stream.hostName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{stream.hostName}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{stream.totalViews.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{stream.likeCount}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleJoinStream(stream.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      size="sm"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Watch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Streams */}
      {upcomingStreams.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upcoming Streams</h3>
            <Button variant="outline" onClick={() => router.push("/grocery/live")}>
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingStreams.map((stream) => (
              <Card key={stream.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={stream.thumbnailUrl || "/placeholder.svg"}
                    alt={stream.title}
                    className="w-full h-32 object-cover opacity-75"
                  />

                  <Badge className="absolute top-2 left-2 bg-blue-600 text-white">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTimeUntil(stream.scheduledStartTime!)}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <h4 className="font-semibold line-clamp-2 mb-2">{stream.title}</h4>

                  <div className="flex items-center space-x-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={stream.hostAvatar || "/placeholder.svg"} alt={stream.hostName} />
                      <AvatarFallback>{stream.hostName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{stream.hostName}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{stream.scheduledStartTime?.toLocaleDateString()}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Bell className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Streams Message */}
      {liveStreams.length === 0 && upcomingStreams.length === 0 && (
        <Card className="p-8 text-center">
          <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Live Streams</h3>
          <p className="text-muted-foreground mb-4">
            Check back later for live shopping streams with our organic food experts
          </p>
          <Button onClick={() => router.push("/grocery/live")}>View Stream Schedule</Button>
        </Card>
      )}
    </div>
  )
}
