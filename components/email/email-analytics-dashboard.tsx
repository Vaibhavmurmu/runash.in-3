"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import {
  LineChart,
  BarChart,
  PieChart,
  ResponsiveContainer,
  Line,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Mail, Send, Eye, MousePointer, SparkleIcon as Bounce, UserX, Clock, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { EmailAnalyticsData } from "@/lib/email-analytics"

export function EmailAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<EmailAnalyticsData | null>(null)
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const { toast } = useToast()

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        date_from: dateRange.from.toISOString(),
        date_to: dateRange.to.toISOString(),
      })

      const [analyticsRes, realtimeRes] = await Promise.all([
        fetch(`/api/admin/email-analytics?${params}`),
        fetch("/api/admin/email-analytics/realtime"),
      ])

      if (analyticsRes.ok && realtimeRes.ok) {
        const analyticsData = await analyticsRes.json()
        const realtimeData = await realtimeRes.json()
        setAnalytics(analyticsData.data)
        setRealTimeMetrics(realtimeData.data)
      } else {
        throw new Error("Failed to fetch analytics")
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast({
        title: "Error",
        description: "Failed to fetch email analytics",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  // Auto-refresh real-time metrics every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/admin/email-analytics/realtime")
        if (res.ok) {
          const data = await res.json()
          setRealTimeMetrics(data.data)
        }
      } catch (error) {
        console.error("Error refreshing real-time metrics:", error)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  const deviceColors = {
    Mobile: "#ff6b35",
    Desktop: "#f7931e",
    Tablet: "#ffb366",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Email Analytics
          </h1>
          <p className="text-muted-foreground mt-2">Comprehensive email performance insights and metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <DatePickerWithRange date={dateRange} onDateChange={(range) => range && setDateRange(range)} />
          <Button variant="outline" onClick={fetchAnalytics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      {realTimeMetrics && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Emails</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realTimeMetrics.emails_sent_today.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Emails sent today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Open Rate</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realTimeMetrics.current_open_rate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Today's performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realTimeMetrics.active_campaigns}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Live Activity</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realTimeMetrics.recent_activity.length}</div>
              <p className="text-xs text-muted-foreground">Events in last hour</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.total_sent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Emails sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.delivery_rate.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{analytics.overview.delivered.toLocaleString()} delivered</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.open_rate.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{analytics.overview.opened.toLocaleString()} opened</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.click_rate.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{analytics.overview.clicked.toLocaleString()} clicked</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <Bounce className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.bounce_rate.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{analytics.overview.bounced.toLocaleString()} bounced</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unsubscribe Rate</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.unsubscribe_rate.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{analytics.overview.unsubscribed.toLocaleString()} unsubscribed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Email Trends</CardTitle>
                <CardDescription>Email delivery and engagement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      sent: { label: "Sent", color: "hsl(var(--chart-1))" },
                      delivered: { label: "Delivered", color: "hsl(var(--chart-2))" },
                      opened: { label: "Opened", color: "hsl(var(--chart-3))" },
                      clicked: { label: "Clicked", color: "hsl(var(--chart-4))" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.trends.daily_stats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="sent" name="sent" stroke="var(--color-sent)" strokeWidth={2} />
                        <Line
                          type="monotone"
                          dataKey="delivered"
                          name="delivered"
                          stroke="var(--color-delivered)"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="opened"
                          name="opened"
                          stroke="var(--color-opened)"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="clicked"
                          name="clicked"
                          stroke="var(--color-clicked)"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hourly Engagement</CardTitle>
                <CardDescription>Best times for email engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      opens: { label: "Opens", color: "hsl(var(--chart-1))" },
                      clicks: { label: "Clicks", color: "hsl(var(--chart-2))" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.trends.hourly_engagement}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="opens" name="opens" fill="var(--color-opens)" />
                        <Bar dataKey="clicks" name="clicks" fill="var(--color-clicks)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Recent email campaign results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.campaigns.slice(0, 10).map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{campaign.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Sent: {campaign.sent_count.toLocaleString()} • Delivered:{" "}
                        {campaign.delivered_count.toLocaleString()} • Opened: {campaign.opened_count.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{campaign.open_rate.toFixed(1)}% open</div>
                        <div className="text-sm text-muted-foreground">{campaign.click_rate.toFixed(1)}% click</div>
                      </div>
                      <Badge variant={campaign.open_rate > 20 ? "default" : "secondary"}>
                        {campaign.open_rate > 20 ? "Good" : "Average"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Performance</CardTitle>
              <CardDescription>Most effective email templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.templates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Used {template.usage_count} times • Last used:{" "}
                        {new Date(template.last_used).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{template.avg_open_rate.toFixed(1)}% avg open</div>
                        <div className="text-sm text-muted-foreground">
                          {template.avg_click_rate.toFixed(1)}% avg click
                        </div>
                      </div>
                      <Badge variant={template.avg_open_rate > 25 ? "default" : "secondary"}>
                        {template.avg_open_rate > 25 ? "High Performing" : "Standard"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
                <CardDescription>How recipients open emails</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.devices}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="opens"
                        nameKey="device_type"
                        label={({ device_type, percentage }) => `${device_type}: ${percentage}%`}
                      >
                        {analytics.devices.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={deviceColors[entry.device_type as keyof typeof deviceColors]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} opens`, "Opens"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Top countries by engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.geographic.map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{country.country}</div>
                          <div className="text-sm text-muted-foreground">{country.unique_recipients} recipients</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{country.opens} opens</div>
                        <div className="text-sm text-muted-foreground">{country.clicks} clicks</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Subject Lines</CardTitle>
                <CardDescription>Subject lines with highest open rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.top_performing.subject_lines.map((subject, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="font-medium text-sm mb-1">{subject.subject}</div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{subject.sent_count} sent</span>
                        <Badge variant="outline">{subject.open_rate.toFixed(1)}% open rate</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bounce Analysis</CardTitle>
                <CardDescription>Email delivery issues breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.bounce_analysis.bounce_types.map((type) => (
                    <div key={type.type} className="flex items-center justify-between">
                      <span className="font-medium">{type.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{type.count}</span>
                        <Badge variant="outline">{type.percentage}%</Badge>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Top Bounce Reasons</h4>
                    <div className="space-y-2">
                      {analytics.bounce_analysis.top_bounce_reasons.slice(0, 5).map((reason, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{reason.reason}</span>
                          <span className="font-medium">{reason.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
