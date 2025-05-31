"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  Video,
  Users,
  DollarSign,
  Calendar,
  Bell,
  Pause,
  Square,
  Star,
  Activity,
  PlusCircle,
  Edit,
} from "lucide-react"
import { HostAnalyticsPanel } from "./host-analytics-panel"
import { StreamManagementPanel } from "./stream-management-panel"
import { PollQuizManagementPanel } from "./poll-quiz-management-panel"
import { ViewerManagementPanel } from "./viewer-management-panel"
import { HostSettingsPanel } from "./host-settings-panel"

interface HostDashboardProps {
  hostId: string
}

export function HostDashboard({ hostId }: HostDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLive, setIsLive] = useState(false)
  const [currentStream, setCurrentStream] = useState<any>(null)

  // Mock data - in real app, this would come from API
  const dashboardData = {
    hostName: "Sarah Johnson",
    hostAvatar: "/placeholder.svg",
    totalStreams: 45,
    totalViewers: 12500,
    totalRevenue: 8750,
    averageRating: 4.8,
    followerCount: 2340,
    todayStats: {
      viewers: 156,
      revenue: 420,
      engagement: 85,
      streamTime: 180, // minutes
    },
    recentStreams: [
      {
        id: "1",
        title: "Organic Produce Showcase",
        date: "Today",
        viewers: 156,
        revenue: 420,
        duration: "2h 15m",
        status: "ended",
      },
      {
        id: "2",
        title: "Healthy Cooking Tips",
        date: "Yesterday",
        viewers: 203,
        revenue: 680,
        duration: "1h 45m",
        status: "ended",
      },
      {
        id: "3",
        title: "Farm Fresh Friday",
        date: "2 days ago",
        viewers: 189,
        revenue: 520,
        duration: "2h 30m",
        status: "ended",
      },
    ],
    upcomingStreams: [
      {
        id: "4",
        title: "Weekend Meal Prep",
        scheduledTime: "Tomorrow 2:00 PM",
        expectedViewers: 200,
        featuredProducts: 8,
      },
      {
        id: "5",
        title: "Seasonal Vegetables Guide",
        scheduledTime: "Sunday 10:00 AM",
        expectedViewers: 150,
        featuredProducts: 12,
      },
    ],
    notifications: [
      {
        id: "1",
        type: "high_engagement",
        title: "High Engagement Alert",
        message: "Your current stream has 95% engagement rate!",
        timestamp: "5 minutes ago",
        priority: "high",
      },
      {
        id: "2",
        type: "new_follower",
        title: "New Milestone",
        message: "You've reached 2,340 followers!",
        timestamp: "1 hour ago",
        priority: "medium",
      },
    ],
  }

  const quickActions = [
    {
      label: "Go Live",
      icon: <Video className="h-4 w-4" />,
      action: () => setIsLive(true),
      variant: "default" as const,
      disabled: isLive,
    },
    {
      label: "Schedule Stream",
      icon: <Calendar className="h-4 w-4" />,
      action: () => setActiveTab("streams"),
      variant: "outline" as const,
    },
    {
      label: "Create Poll",
      icon: <PlusCircle className="h-4 w-4" />,
      action: () => setActiveTab("polls"),
      variant: "outline" as const,
    },
    {
      label: "View Analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      action: () => setActiveTab("analytics"),
      variant: "outline" as const,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-orange-50/20 dark:to-orange-950/20">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={dashboardData.hostAvatar || "/placeholder.svg"} alt={dashboardData.hostName} />
              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-amber-400 text-white text-lg">
                {dashboardData.hostName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                Host Dashboard
              </h1>
              <p className="text-muted-foreground">Welcome back, {dashboardData.hostName}!</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  {dashboardData.averageRating} Rating
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {dashboardData.followerCount.toLocaleString()} Followers
                </Badge>
                {isLive && (
                  <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full mr-1" />
                    LIVE
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                onClick={action.action}
                disabled={action.disabled}
                className={
                  action.variant === "default"
                    ? "bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500"
                    : ""
                }
              >
                {action.icon}
                <span className="ml-2 hidden sm:inline">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Live Stream Alert */}
        {isLive && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <div>
                    <h3 className="font-semibold text-red-900 dark:text-red-100">You're currently live!</h3>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      156 viewers • 2h 15m streaming • $420 revenue today
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-red-200 text-red-700">
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setIsLive(false)}>
                    <Square className="h-4 w-4 mr-1" />
                    End Stream
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="streams">Streams</TabsTrigger>
            <TabsTrigger value="polls">Polls & Quizzes</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalStreams}</div>
                  <p className="text-xs text-muted-foreground">+3 this week</p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Viewers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalViewers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${dashboardData.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.averageRating}</div>
                  <p className="text-xs text-muted-foreground">Based on 234 reviews</p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Performance */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Today's Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Viewers</span>
                      <span className="text-sm text-muted-foreground">{dashboardData.todayStats.viewers}</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Revenue</span>
                      <span className="text-sm text-muted-foreground">${dashboardData.todayStats.revenue}</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Engagement</span>
                      <span className="text-sm text-muted-foreground">{dashboardData.todayStats.engagement}%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Stream Time</span>
                      <span className="text-sm text-muted-foreground">{dashboardData.todayStats.streamTime}m</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Streams */}
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Recent Streams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentStreams.map((stream) => (
                      <div key={stream.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <h4 className="font-medium">{stream.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {stream.date} • {stream.viewers} viewers • {stream.duration}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">${stream.revenue}</p>
                          <Badge variant="secondary" className="text-xs">
                            {stream.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Streams */}
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Streams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.upcomingStreams.map((stream) => (
                      <div key={stream.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <h4 className="font-medium">{stream.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {stream.scheduledTime} • {stream.featuredProducts} products
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">~{stream.expectedViewers} viewers</p>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notifications */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          notification.priority === "high"
                            ? "bg-red-500"
                            : notification.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <HostAnalyticsPanel hostId={hostId} />
          </TabsContent>

          {/* Streams Tab */}
          <TabsContent value="streams">
            <StreamManagementPanel hostId={hostId} />
          </TabsContent>

          {/* Polls & Quizzes Tab */}
          <TabsContent value="polls">
            <PollQuizManagementPanel hostId={hostId} />
          </TabsContent>

          {/* Audience Tab */}
          <TabsContent value="audience">
            <ViewerManagementPanel hostId={hostId} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <HostSettingsPanel hostId={hostId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
