"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  LineChart,
  PieChart,
  ResponsiveContainer,
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { AnalyticsFilters, StreamPerformanceMetrics, PlatformBreakdown } from "@/types/analytics"
import { ArrowUpRight, ArrowDownRight, Users, MessageSquare, Heart, DollarSign, Clock } from "lucide-react"

interface AnalyticsOverviewProps {
  filters: AnalyticsFilters
}

export function AnalyticsOverview({ filters }: AnalyticsOverviewProps) {
  // Mock data - in a real implementation, this would come from an API
  const performanceData: StreamPerformanceMetrics = {
    viewerCounts: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      value: Math.floor(Math.random() * 500) + 100,
    })),
    chatActivity: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      value: Math.floor(Math.random() * 2000) + 500,
    })),
    followerGrowth: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      value: Math.floor(Math.random() * 50) + 5,
    })),
    subscriptionGrowth: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      value: Math.floor(Math.random() * 20) + 1,
    })),
    donationAmount: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      value: Math.floor(Math.random() * 200) + 10,
    })),
    watchTime: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      value: Math.floor(Math.random() * 5000) + 1000,
    })),
    engagementRate: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      value: Math.random() * 10 + 2,
    })),
    retentionRate: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      value: Math.random() * 30 + 40,
    })),
  }

  const platformData: PlatformBreakdown[] = [
    {
      platform: "Twitch",
      viewers: 450,
      chatMessages: 1800,
      followers: 120,
      subscribers: 45,
      donations: 350,
      color: "#9146FF",
    },
    {
      platform: "YouTube",
      viewers: 380,
      chatMessages: 1200,
      followers: 85,
      subscribers: 30,
      donations: 220,
      color: "#FF0000",
    },
    {
      platform: "Facebook",
      viewers: 210,
      chatMessages: 750,
      followers: 60,
      subscribers: 15,
      donations: 120,
      color: "#1877F2",
    },
    {
      platform: "TikTok",
      viewers: 320,
      chatMessages: 950,
      followers: 95,
      subscribers: 0,
      donations: 180,
      color: "#000000",
    },
    {
      platform: "Instagram",
      viewers: 180,
      chatMessages: 650,
      followers: 70,
      subscribers: 0,
      donations: 90,
      color: "#E1306C",
    },
  ]

  // Calculate totals and changes
  const totalViewers = platformData.reduce((sum, platform) => sum + platform.viewers, 0)
  const totalChatMessages = platformData.reduce((sum, platform) => sum + platform.chatMessages, 0)
  const totalFollowers = platformData.reduce((sum, platform) => sum + platform.followers, 0)
  const totalSubscribers = platformData.reduce((sum, platform) => sum + platform.subscribers, 0)
  const totalDonations = platformData.reduce((sum, platform) => sum + platform.donations, 0)
  const totalWatchTime = performanceData.watchTime.reduce((sum, day) => sum + day.value, 0)

  // Mock previous period data for comparison
  const viewerChange = 12.5
  const chatChange = 8.3
  const followerChange = 15.2
  const subscriberChange = -3.7
  const donationChange = 22.1
  const watchTimeChange = 5.8

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Viewers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViewers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {viewerChange > 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
              )}
              <span className={viewerChange > 0 ? "text-emerald-500" : "text-rose-500"}>{Math.abs(viewerChange)}%</span>
              <span className="ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chat Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChatMessages.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {chatChange > 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
              )}
              <span className={chatChange > 0 ? "text-emerald-500" : "text-rose-500"}>{Math.abs(chatChange)}%</span>
              <span className="ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Followers</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFollowers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {followerChange > 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
              )}
              <span className={followerChange > 0 ? "text-emerald-500" : "text-rose-500"}>
                {Math.abs(followerChange)}%
              </span>
              <span className="ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {subscriberChange > 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
              )}
              <span className={subscriberChange > 0 ? "text-emerald-500" : "text-rose-500"}>
                {Math.abs(subscriberChange)}%
              </span>
              <span className="ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDonations.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {donationChange > 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
              )}
              <span className={donationChange > 0 ? "text-emerald-500" : "text-rose-500"}>
                {Math.abs(donationChange)}%
              </span>
              <span className="ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Watch Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(totalWatchTime / 60).toLocaleString()} hrs</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {watchTimeChange > 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
              )}
              <span className={watchTimeChange > 0 ? "text-emerald-500" : "text-rose-500"}>
                {Math.abs(watchTimeChange)}%
              </span>
              <span className="ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Viewer Trends</CardTitle>
            <CardDescription>Average viewers over time across all platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  viewers: {
                    label: "Viewers",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData.viewerCounts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getDate()}/${date.getMonth() + 1}`
                      }}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="viewers"
                      stroke="var(--color-viewers)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
            <CardDescription>Viewer distribution across platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="viewers"
                    nameKey="platform"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} viewers`, props.payload.platform]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
            <CardDescription>Chat activity and engagement rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  chatMessages: {
                    label: "Chat Messages",
                    color: "hsl(var(--chart-2))",
                  },
                  engagementRate: {
                    label: "Engagement Rate (%)",
                    color: "hsl(var(--chart-3))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData.chatActivity.slice(-7)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getDate()}/${date.getMonth() + 1}`
                      }}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" name="chatMessages" fill="var(--color-chatMessages)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
