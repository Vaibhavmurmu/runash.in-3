"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Search,
  Filter,
  MessageSquare,
  DollarSign,
  Eye,
  Heart,
  Gift,
  Crown,
  Shield,
  Ban,
  UserPlus,
  TrendingUp,
  Clock,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ViewerManagementPanelProps {
  hostId: string
}

export function ViewerManagementPanel({ hostId }: ViewerManagementPanelProps) {
  const [activeTab, setActiveTab] = useState("current")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")

  // Mock viewer data
  const viewerData = {
    current: [
      {
        id: "1",
        username: "sarah_foodie",
        avatar: "/placeholder.svg",
        isVip: true,
        isModerator: false,
        joinedAt: "2:15 PM",
        watchTime: "45m",
        messagesCount: 12,
        purchasesToday: 2,
        totalSpent: 85,
        isFollowing: true,
        status: "active",
      },
      {
        id: "2",
        username: "healthy_chef",
        avatar: "/placeholder.svg",
        isVip: false,
        isModerator: true,
        joinedAt: "2:00 PM",
        watchTime: "1h 15m",
        messagesCount: 28,
        purchasesToday: 0,
        totalSpent: 245,
        isFollowing: true,
        status: "active",
      },
      {
        id: "3",
        username: "organic_lover",
        avatar: "/placeholder.svg",
        isVip: true,
        isModerator: false,
        joinedAt: "2:30 PM",
        watchTime: "30m",
        messagesCount: 8,
        purchasesToday: 1,
        totalSpent: 156,
        isFollowing: false,
        status: "active",
      },
    ],
    followers: [
      {
        id: "1",
        username: "sarah_foodie",
        avatar: "/placeholder.svg",
        followedAt: "2 weeks ago",
        totalWatchTime: "12h 30m",
        totalPurchases: 15,
        totalSpent: 450,
        lastSeen: "Currently watching",
        engagement: 85,
      },
      {
        id: "2",
        username: "healthy_chef",
        avatar: "/placeholder.svg",
        followedAt: "1 month ago",
        totalWatchTime: "25h 15m",
        totalPurchases: 8,
        totalSpent: 320,
        lastSeen: "Currently watching",
        engagement: 92,
      },
    ],
    analytics: {
      totalViewers: 156,
      newViewers: 45,
      returningViewers: 111,
      averageWatchTime: "18m",
      peakViewers: 203,
      chatParticipation: 68,
      purchaseConversion: 12.5,
    },
  }

  const filteredCurrentViewers = viewerData.current.filter((viewer) => {
    const matchesSearch = viewer.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "vip" && viewer.isVip) ||
      (filterBy === "moderators" && viewer.isModerator) ||
      (filterBy === "followers" && viewer.isFollowing) ||
      (filterBy === "purchasers" && viewer.purchasesToday > 0)

    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Audience Management</h2>
          <p className="text-muted-foreground">Manage your viewers, followers, and community</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Viewers
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500">
            <Gift className="h-4 w-4 mr-2" />
            Send Rewards
          </Button>
        </div>
      </div>

      {/* Audience Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Viewers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{viewerData.analytics.totalViewers}</div>
            <p className="text-xs text-emerald-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Peak: {viewerData.analytics.peakViewers}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Viewers</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{viewerData.analytics.newViewers}</div>
            <p className="text-xs text-muted-foreground">
              {((viewerData.analytics.newViewers / viewerData.analytics.totalViewers) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Watch Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{viewerData.analytics.averageWatchTime}</div>
            <p className="text-xs text-emerald-600">+15% from last stream</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Purchase Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{viewerData.analytics.purchaseConversion}%</div>
            <p className="text-xs text-emerald-600">+2.3% from average</p>
          </CardContent>
        </Card>
      </div>

      {/* Viewer Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Viewers ({viewerData.current.length})</TabsTrigger>
          <TabsTrigger value="followers">Followers ({viewerData.followers.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Current Viewers */}
        <TabsContent value="current" className="space-y-4">
          {/* Search and Filter */}
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search viewers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Viewers</SelectItem>
                    <SelectItem value="vip">VIP Members</SelectItem>
                    <SelectItem value="moderators">Moderators</SelectItem>
                    <SelectItem value="followers">Followers</SelectItem>
                    <SelectItem value="purchasers">Made Purchases</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Viewer List */}
          <div className="space-y-3">
            {filteredCurrentViewers.map((viewer) => (
              <Card key={viewer.id} className="border-border/40 bg-card/50 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={viewer.avatar || "/placeholder.svg"} alt={viewer.username} />
                          <AvatarFallback className="bg-gradient-to-r from-orange-500 to-amber-400 text-white">
                            {viewer.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {viewer.status === "active" && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{viewer.username}</h4>
                          {viewer.isVip && (
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                              <Crown className="h-3 w-3 mr-1" />
                              VIP
                            </Badge>
                          )}
                          {viewer.isModerator && (
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              MOD
                            </Badge>
                          )}
                          {viewer.isFollowing && <Heart className="h-4 w-4 text-red-500 fill-current" />}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>Joined: {viewer.joinedAt}</span>
                          <span>Watch time: {viewer.watchTime}</span>
                          <span>Messages: {viewer.messagesCount}</span>
                          {viewer.purchasesToday > 0 && (
                            <span className="text-green-600">${viewer.totalSpent} spent today</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      {!viewer.isModerator && (
                        <Button variant="outline" size="sm">
                          <Shield className="h-4 w-4 mr-1" />
                          Make Mod
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Followers */}
        <TabsContent value="followers" className="space-y-4">
          <div className="space-y-3">
            {viewerData.followers.map((follower) => (
              <Card key={follower.id} className="border-border/40 bg-card/50 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={follower.avatar || "/placeholder.svg"} alt={follower.username} />
                        <AvatarFallback className="bg-gradient-to-r from-orange-500 to-amber-400 text-white">
                          {follower.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{follower.username}</h4>
                          <Heart className="h-4 w-4 text-red-500 fill-current" />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>Followed: {follower.followedAt}</span>
                          <span>Watch time: {follower.totalWatchTime}</span>
                          <span>Purchases: {follower.totalPurchases}</span>
                          <span>Spent: ${follower.totalSpent}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">Engagement:</span>
                          <Progress value={follower.engagement} className="w-20 h-2" />
                          <span className="text-xs text-muted-foreground">{follower.engagement}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Gift className="h-4 w-4 mr-1" />
                        Send Gift
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Engagement Metrics */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Chat Participation</span>
                    <span className="text-sm text-muted-foreground">{viewerData.analytics.chatParticipation}%</span>
                  </div>
                  <Progress value={viewerData.analytics.chatParticipation} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Purchase Conversion</span>
                    <span className="text-sm text-muted-foreground">{viewerData.analytics.purchaseConversion}%</span>
                  </div>
                  <Progress value={viewerData.analytics.purchaseConversion * 4} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Returning Viewers</span>
                    <span className="text-sm text-muted-foreground">
                      {((viewerData.analytics.returningViewers / viewerData.analytics.totalViewers) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={(viewerData.analytics.returningViewers / viewerData.analytics.totalViewers) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Viewer Breakdown */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Viewer Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">New Viewers</span>
                  <span className="text-lg font-bold">{viewerData.analytics.newViewers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Returning Viewers</span>
                  <span className="text-lg font-bold">{viewerData.analytics.returningViewers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Peak Concurrent</span>
                  <span className="text-lg font-bold">{viewerData.analytics.peakViewers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Watch Time</span>
                  <span className="text-lg font-bold">{viewerData.analytics.averageWatchTime}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
