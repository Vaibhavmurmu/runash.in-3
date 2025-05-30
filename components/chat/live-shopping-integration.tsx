"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, Users, ShoppingBag, Play, ArrowRight, Sparkles } from "lucide-react"
import type { LiveStream } from "@/types/live-shopping"

// Mock current live stream
const mockCurrentStream: LiveStream = {
  id: "ls-001",
  title: "Farm Fresh Organic Produce",
  description: "Live showcase of today's freshest organic produce",
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
  tags: ["organic", "farm-fresh"],
}

export default function LiveShoppingIntegration() {
  const router = useRouter()
  const [currentStream, setCurrentStream] = useState<LiveStream | null>(mockCurrentStream)
  const [isExpanded, setIsExpanded] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    if (!currentStream) return

    const interval = setInterval(() => {
      setCurrentStream((prev) =>
        prev
          ? {
              ...prev,
              viewerCount: prev.viewerCount + Math.floor(Math.random() * 10) - 5,
              likeCount: prev.likeCount + Math.floor(Math.random() * 3),
            }
          : null,
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [currentStream])

  const handleJoinStream = () => {
    if (currentStream) {
      router.push(`/grocery/live?id=${currentStream.id}`)
    }
  }

  const handleViewStore = () => {
    router.push("/grocery")
  }

  if (!currentStream) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-4 text-center">
          <Video className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-3">No live streams right now</p>
          <Button variant="outline" size="sm" onClick={handleViewStore}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Browse Store
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-green-200 dark:border-green-800">
      <CardHeader className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Live Shopping</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
            LIVE
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {!isExpanded ? (
          // Compact View
          <div className="p-3">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={currentStream.thumbnailUrl || "/placeholder.svg"}
                  alt={currentStream.title}
                  className="w-16 h-12 object-cover rounded"
                />
                <div className="absolute inset-0 bg-black/20 rounded flex items-center justify-center">
                  <Play className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-1">{currentStream.title}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={currentStream.hostAvatar || "/placeholder.svg"} alt={currentStream.hostName} />
                    <AvatarFallback className="text-xs">{currentStream.hostName[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{currentStream.hostName}</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{currentStream.viewerCount} watching</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 mt-3">
              <Button onClick={handleJoinStream} className="flex-1 bg-red-600 hover:bg-red-700 text-white" size="sm">
                <Video className="h-4 w-4 mr-1" />
                Join
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsExpanded(true)}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          // Expanded View
          <div>
            <div className="relative">
              <img
                src={currentStream.thumbnailUrl || "/placeholder.svg"}
                alt={currentStream.title}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Button onClick={handleJoinStream} className="bg-white/90 text-black hover:bg-white">
                  <Play className="h-4 w-4 mr-2" />
                  Join Stream
                </Button>
              </div>
              <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse mr-1"></div>
                LIVE
              </Badge>
              <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                <Users className="h-3 w-3 mr-1" />
                {currentStream.viewerCount}
              </Badge>
            </div>

            <div className="p-3">
              <h4 className="font-semibold mb-2">{currentStream.title}</h4>

              <div className="flex items-center space-x-2 mb-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={currentStream.hostAvatar || "/placeholder.svg"} alt={currentStream.hostName} />
                  <AvatarFallback>{currentStream.hostName[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{currentStream.hostName}</span>
              </div>

              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{currentStream.description}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {currentStream.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleJoinStream} className="flex-1 bg-red-600 hover:bg-red-700 text-white" size="sm">
                  <Video className="h-4 w-4 mr-2" />
                  Join Stream
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsExpanded(false)}>
                  ×
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="border-t p-3 bg-muted/30">
          <div className="flex items-center justify-between text-xs">
            <Button variant="ghost" size="sm" onClick={handleViewStore} className="text-xs h-8">
              <ShoppingBag className="h-3 w-3 mr-1" />
              Browse Store
            </Button>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              <span>Live deals available</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
