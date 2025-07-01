"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoLiveDialog } from "@/components/go-live-dialog"
import { Play, Square, Eye, Clock, Settings, BarChart3, Users, MessageCircle } from "lucide-react"
import { useStreaming } from "@/hooks/use-streaming"

export default function StreamingPage() {
  const { currentStream, getStreamStatus, endStream, isLoading } = useStreaming()
  const [activeStreams, setActiveStreams] = useState([])

  useEffect(() => {
    // Poll for stream status updates
    const interval = setInterval(() => {
      if (currentStream) {
        getStreamStatus(currentStream.id)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [currentStream, getStreamStatus])

  const handleEndStream = async () => {
    if (currentStream) {
      await endStream(currentStream.id)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Streaming Dashboard</h1>
            <p className="text-muted-foreground">Manage your live streams and broadcasting</p>
          </div>
          <GoLiveDialog>
            <Button className="bg-red-500 hover:bg-red-600">
              <Play className="mr-2 h-4 w-4" />
              Go Live
            </Button>
          </GoLiveDialog>
        </div>

        {/* Current Stream Status */}
        {currentStream && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <CardTitle className="text-red-900">Currently Live</CardTitle>
                  <Badge variant="secondary" className="bg-red-500 text-white">
                    {currentStream.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleEndStream} disabled={isLoading}>
                    <Square className="mr-2 h-4 w-4" />
                    End Stream
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{currentStream.viewerCount}</p>
                    <p className="text-xs text-muted-foreground">Viewers</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{formatDuration(currentStream.duration)}</p>
                    <p className="text-xs text-muted-foreground">Duration</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">1.2K</p>
                    <p className="text-xs text-muted-foreground">Peak Viewers</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">847</p>
                    <p className="text-xs text-muted-foreground">Chat Messages</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="streams">Stream History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
                  <Play className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45.2K</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2h 15m</div>
                  <p className="text-xs text-muted-foreground">+5m from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Peak Viewers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.4K</div>
                  <p className="text-xs text-muted-foreground">Personal best!</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common streaming tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <GoLiveDialog>
                    <Button className="w-full bg-red-500 hover:bg-red-600">
                      <Play className="mr-2 h-4 w-4" />
                      Start New Stream
                    </Button>
                  </GoLiveDialog>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Settings className="mr-2 h-4 w-4" />
                    Stream Settings
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stream Health</CardTitle>
                  <CardDescription>Your streaming setup status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Internet Connection</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Excellent
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Camera Quality</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      1080p Ready
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Audio Quality</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Studio Quality
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Server Status</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Online
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="streams" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Streams</CardTitle>
                <CardDescription>Your streaming history and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Building a React Dashboard",
                      date: "2 hours ago",
                      duration: "2h 15m",
                      viewers: "1,247",
                      status: "ended",
                    },
                    {
                      title: "Music Production Tutorial",
                      date: "1 day ago",
                      duration: "1h 45m",
                      viewers: "892",
                      status: "ended",
                    },
                    {
                      title: "Gaming Session - Finals",
                      date: "3 days ago",
                      duration: "3h 22m",
                      viewers: "3,421",
                      status: "ended",
                    },
                  ].map((stream, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{stream.title}</h4>
                        <p className="text-sm text-muted-foreground">{stream.date}</p>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-center">
                          <p className="font-medium">{stream.duration}</p>
                          <p className="text-muted-foreground">Duration</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{stream.viewers}</p>
                          <p className="text-muted-foreground">Peak Viewers</p>
                        </div>
                        <Badge variant="outline">{stream.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Detailed Analytics Coming Soon</h3>
              <p className="text-muted-foreground">Advanced streaming analytics and insights will be available here.</p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="text-center py-12">
              <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Stream Settings</h3>
              <p className="text-muted-foreground">
                Configure your default streaming preferences and quality settings.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
