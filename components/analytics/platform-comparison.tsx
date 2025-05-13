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
import type { AnalyticsFilters, PlatformBreakdown } from "@/types/analytics"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PlatformComparisonProps {
  filters: AnalyticsFilters
}

export function PlatformComparison({ filters }: PlatformComparisonProps) {
  // Mock data - in a real implementation, this would come from an API
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

  // Mock time series data for platform comparison
  const timeSeriesData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    return {
      date,
      Twitch: Math.floor(Math.random() * 200) + 350,
      YouTube: Math.floor(Math.random() * 150) + 300,
      Facebook: Math.floor(Math.random() * 100) + 150,
      TikTok: Math.floor(Math.random() * 150) + 250,
      Instagram: Math.floor(Math.random() * 100) + 120,
    }
  })

  // Calculate totals
  const totalViewers = platformData.reduce((sum, platform) => sum + platform.viewers, 0)
  const totalChatMessages = platformData.reduce((sum, platform) => sum + platform.chatMessages, 0)
  const totalFollowers = platformData.reduce((sum, platform) => sum + platform.followers, 0)
  const totalDonations = platformData.reduce((sum, platform) => sum + platform.donations, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Comparison</CardTitle>
          <CardDescription>Performance metrics across all streaming platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead className="text-right">Viewers</TableHead>
                <TableHead className="text-right">Chat Messages</TableHead>
                <TableHead className="text-right">Followers</TableHead>
                <TableHead className="text-right">Subscribers</TableHead>
                <TableHead className="text-right">Donations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {platformData.map((platform) => (
                <TableRow key={platform.platform}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: platform.color }}></div>
                      {platform.platform}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {platform.viewers.toLocaleString()}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({Math.round((platform.viewers / totalViewers) * 100)}%)
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {platform.chatMessages.toLocaleString()}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({Math.round((platform.chatMessages / totalChatMessages) * 100)}%)
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {platform.followers.toLocaleString()}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({Math.round((platform.followers / totalFollowers) * 100)}%)
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {platform.subscribers > 0 ? platform.subscribers.toLocaleString() : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    ${platform.donations.toLocaleString()}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({Math.round((platform.donations / totalDonations) * 100)}%)
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-medium">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{totalViewers.toLocaleString()}</TableCell>
                <TableCell className="text-right">{totalChatMessages.toLocaleString()}</TableCell>
                <TableCell className="text-right">{totalFollowers.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  {platformData.reduce((sum, p) => sum + p.subscribers, 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">${totalDonations.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Viewer Distribution</CardTitle>
            <CardDescription>Percentage of viewers by platform</CardDescription>
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
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} viewers (${(((value as number) / totalViewers) * 100).toFixed(1)}%)`,
                      props.payload.platform,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Comparison</CardTitle>
            <CardDescription>Chat messages per viewer by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  chatPerViewer: {
                    label: "Messages per Viewer",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={platformData.map((p) => ({
                      platform: p.platform,
                      chatPerViewer: +(p.chatMessages / p.viewers).toFixed(2),
                      color: p.color,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="chatPerViewer" name="chatPerViewer" radius={[4, 4, 0, 0]}>
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Viewer Trends by Platform</CardTitle>
          <CardDescription>Daily viewer counts across platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ChartContainer
              config={{
                Twitch: {
                  label: "Twitch",
                  color: "#9146FF",
                },
                YouTube: {
                  label: "YouTube",
                  color: "#FF0000",
                },
                Facebook: {
                  label: "Facebook",
                  color: "#1877F2",
                },
                TikTok: {
                  label: "TikTok",
                  color: "#000000",
                },
                Instagram: {
                  label: "Instagram",
                  color: "#E1306C",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return `${date.getDate()}/${date.getMonth() + 1}`
                    }}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Twitch"
                    name="Twitch"
                    stroke="#9146FF"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="YouTube"
                    name="YouTube"
                    stroke="#FF0000"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Facebook"
                    name="Facebook"
                    stroke="#1877F2"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="TikTok"
                    name="TikTok"
                    stroke="#000000"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Instagram"
                    name="Instagram"
                    stroke="#E1306C"
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
  )
}
