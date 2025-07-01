"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, BarChart, ResponsiveContainer, Line, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { AnalyticsFilters, StreamPerformanceMetrics } from "@/types/analytics"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Clock, TrendingUp, Users } from "lucide-react"

interface EngagementMetricsProps {
  filters: AnalyticsFilters
}

export function EngagementMetrics({ filters }: EngagementMetricsProps) {
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

  // Calculate engagement metrics
  const avgChatPerViewer = (
    performanceData.chatActivity.reduce((sum, day) => sum + day.value, 0) /
    performanceData.viewerCounts.reduce((sum, day) => sum + day.value, 0)
  ).toFixed(2)

  const avgWatchTimePerViewer = (
    performanceData.watchTime.reduce((sum, day) => sum + day.value, 0) /
    performanceData.viewerCounts.reduce((sum, day) => sum + day.value, 0) /
    60
  ).toFixed(1)

  const avgEngagementRate = (
    performanceData.engagementRate.reduce((sum, day) => sum + day.value, 0) / performanceData.engagementRate.length
  ).toFixed(1)

  const avgRetentionRate = (
    performanceData.retentionRate.reduce((sum, day) => sum + day.value, 0) / performanceData.retentionRate.length
  ).toFixed(1)

  // Top engagement times (mock data)
  const topEngagementTimes = [
    { time: "8:00 PM - 10:00 PM", day: "Friday", engagementRate: 12.4 },
    { time: "9:00 PM - 11:00 PM", day: "Saturday", engagementRate: 11.8 },
    { time: "7:00 PM - 9:00 PM", day: "Wednesday", engagementRate: 9.5 },
    { time: "8:00 PM - 10:00 PM", day: "Monday", engagementRate: 8.7 },
    { time: "6:00 PM - 8:00 PM", day: "Sunday", engagementRate: 8.2 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chat Per Viewer</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgChatPerViewer}</div>
            <p className="text-xs text-muted-foreground">Average messages per viewer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Watch Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgWatchTimePerViewer} min</div>
            <p className="text-xs text-muted-foreground">Per viewer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEngagementRate}%</div>
            <p className="text-xs text-muted-foreground">Average across all streams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRetentionRate}%</div>
            <p className="text-xs text-muted-foreground">Average across all streams</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chat Activity</CardTitle>
            <CardDescription>Messages per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  chatActivity: {
                    label: "Chat Messages",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData.chatActivity.slice(-14)}>
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
                    <Bar dataKey="value" name="chatActivity" fill="var(--color-chatActivity)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Rate</CardTitle>
            <CardDescription>Viewer interaction percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  engagementRate: {
                    label: "Engagement Rate (%)",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData.engagementRate.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getDate()}/${date.getMonth() + 1}`
                      }}
                    />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="engagementRate"
                      stroke="var(--color-engagementRate)"
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Engagement Times</CardTitle>
          <CardDescription>When your audience is most active</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topEngagementTimes.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="font-medium">{item.time}</div>
                  <div className="text-sm text-muted-foreground">{item.day}</div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                >
                  {item.engagementRate}% engagement
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
