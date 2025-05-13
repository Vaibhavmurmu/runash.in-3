"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { AnalyticsFilters, ContentPerformance } from "@/types/analytics"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, Share2 } from "lucide-react"

interface ContentAnalyticsProps {
  filters: AnalyticsFilters
}

export function ContentAnalytics({ filters }: ContentAnalyticsProps) {
  // Mock data - in a real implementation, this would come from an API
  const contentData: ContentPerformance = {
    topMoments: [
      { timestamp: "2023-04-15T19:45:23Z", title: "Clutch play in final round", viewerSpike: 245, chatSpike: 187 },
      {
        timestamp: "2023-04-18T20:12:05Z",
        title: "Reaction to surprise announcement",
        viewerSpike: 198,
        chatSpike: 156,
      },
      { timestamp: "2023-04-22T18:37:42Z", title: "Hilarious viewer interaction", viewerSpike: 176, chatSpike: 203 },
      { timestamp: "2023-04-25T21:03:18Z", title: "Unexpected game ending", viewerSpike: 165, chatSpike: 142 },
      { timestamp: "2023-04-28T19:22:51Z", title: "New feature demonstration", viewerSpike: 152, chatSpike: 128 },
    ],
    topClips: [
      {
        id: "clip1",
        title: "Perfect timing on that jump!",
        views: 12450,
        shares: 345,
        duration: 28,
        thumbnailUrl: "/placeholder.svg?height=80&width=120",
      },
      {
        id: "clip2",
        title: "Can't believe that worked!",
        views: 8720,
        shares: 287,
        duration: 42,
        thumbnailUrl: "/placeholder.svg?height=80&width=120",
      },
      {
        id: "clip3",
        title: "This new update is amazing",
        views: 7340,
        shares: 215,
        duration: 35,
        thumbnailUrl: "/placeholder.svg?height=80&width=120",
      },
      {
        id: "clip4",
        title: "Most epic win ever",
        views: 6890,
        shares: 198,
        duration: 47,
        thumbnailUrl: "/placeholder.svg?height=80&width=120",
      },
      {
        id: "clip5",
        title: "Funniest stream moment",
        views: 5620,
        shares: 176,
        duration: 31,
        thumbnailUrl: "/placeholder.svg?height=80&width=120",
      },
    ],
    categoryPerformance: [
      { category: "Gaming", avgViewers: 425, avgEngagement: 8.7, streams: 18 },
      { category: "Just Chatting", avgViewers: 380, avgEngagement: 9.2, streams: 12 },
      { category: "Creative", avgViewers: 310, avgEngagement: 7.8, streams: 8 },
      { category: "Music", avgViewers: 290, avgEngagement: 8.1, streams: 5 },
      { category: "Technology", avgViewers: 350, avgEngagement: 7.5, streams: 7 },
    ],
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>Average viewers by content category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                avgViewers: {
                  label: "Average Viewers",
                  color: "hsl(var(--chart-1))",
                },
                avgEngagement: {
                  label: "Engagement Rate (%)",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contentData.categoryPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgViewers" name="avgViewers" fill="var(--color-avgViewers)" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="avgEngagement"
                    name="avgEngagement"
                    fill="var(--color-avgEngagement)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Clips</CardTitle>
          <CardDescription>Most viewed clips from your streams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentData.topClips.map((clip) => (
              <div key={clip.id} className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
                <Avatar className="h-20 w-30 rounded-md">
                  <AvatarImage
                    src={clip.thumbnailUrl || "/placeholder.svg"}
                    alt={clip.title}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-md bg-gradient-to-br from-orange-500 to-amber-300 text-white">
                    Clip
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium">{clip.title}</h4>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      {clip.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center">
                      <Share2 className="h-3.5 w-3.5 mr-1" />
                      {clip.shares.toLocaleString()} shares
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {clip.duration}s
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Stream Moments</CardTitle>
          <CardDescription>Highest engagement points during your streams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentData.topMoments.map((moment, index) => (
              <div key={index} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <h4 className="font-medium">{moment.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(moment.timestamp).toLocaleDateString()} at{" "}
                    {new Date(moment.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    +{moment.viewerSpike} viewers
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                  >
                    +{moment.chatSpike} messages
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
