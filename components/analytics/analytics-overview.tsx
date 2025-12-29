"use client"

import { useState, useEffect } from "react"
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
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  MessageSquare,
  Heart,
  DollarSign,
  Clock,
  TrendingUp,
  RefreshCw,
} from "lucide-react"
import { AnalyticsService, type AnalyticsData, type PlatformAnalytics } from "@/lib/analytics-service"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AnalyticsOverviewProps {
  period: string
  isLive?: boolean
}

export function AnalyticsOverview({ period, isLive = false }: AnalyticsOverviewProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [historicalData, setHistoricalData] = useState<any>(null)
  const [platformData, setPlatformData] = useState<PlatformAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [previousPeriodData, setPreviousPeriodData] = useState<AnalyticsData | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(isLive)

  const analyticsService = AnalyticsService.getInstance()

  useEffect(() => {
    loadAnalyticsData()
  }, [period])

  useEffect(() => {
    let unsubscribe: (() => void) | null = null
    let refreshInterval: NodeJS.Timeout | null = null

    if (isLive && autoRefresh) {
      // Subscribe to real-time updates
      unsubscribe = analyticsService.subscribeToRealTimeUpdates("current", (data) => {
        setAnalyticsData(data)
        setLastUpdated(new Date())
      })

      // Also refresh historical data every 30 seconds
      refreshInterval = setInterval(() => {
        loadHistoricalData()
      }, 30000)
    }

    return () => {
      if (unsubscribe) unsubscribe()
      if (refreshInterval) clearInterval(refreshInterval)
    }
  }, [isLive, autoRefresh])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)

      // Load real-time data
      const realTimeData = await analyticsService.getRealTimeAnalytics()
      setAnalyticsData(realTimeData)

      await loadHistoricalData()

      // Load platform data
      const platforms = await analyticsService.getPlatformAnalytics(period)
      setPlatformData(platforms)

      // Load previous period for comparison
      const previousPeriod = getPreviousPeriod(period)
      const previousData = await analyticsService.getHistoricalAnalytics(previousPeriod)
      const prevTotals = calculatePeriodTotals(previousData)
      setPreviousPeriodData(prevTotals)

      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to load analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadHistoricalData = async () => {
    try {
      const historical = await analyticsService.getHistoricalAnalytics(period)
      setHistoricalData(historical)
    } catch (error) {
      console.error("Failed to load historical data:", error)
    }
  }

  const calculatePeriodTotals = (data: any): AnalyticsData => {
    if (!data) return {} as AnalyticsData

    return {
      totalViews: data.viewerCounts?.reduce((sum: number, item: any) => sum + item.value, 0) || 0,
      currentViewers: 0,
      peakViewers: Math.max(...(data.viewerCounts?.map((item: any) => item.value) || [0])),
      averageViewers:
        data.viewerCounts?.reduce((sum: number, item: any) => sum + item.value, 0) / (data.viewerCounts?.length || 1) ||
        0,
      watchTime: data.watchTime?.reduce((sum: number, item: any) => sum + item.value, 0) || 0,
      chatMessages: data.chatActivity?.reduce((sum: number, item: any) => sum + item.value, 0) || 0,
      newFollowers: data.followerGrowth?.reduce((sum: number, item: any) => sum + item.value, 0) || 0,
      donations: 0,
      engagement:
        data.engagement?.reduce((sum: number, item: any) => sum + item.value, 0) / (data.engagement?.length || 1) || 0,
      streamHealth: "Good",
      revenue: data.revenue?.reduce((sum: number, item: any) => sum + item.value, 0) || 0,
      subscriptions: 0,
    }
  }

  const getPreviousPeriod = (currentPeriod: string): string => {
    return currentPeriod
  }

  const calculateChange = (current: number, previous: number): { value: number; trend: "up" | "down" } => {
    if (previous === 0) return { value: 0, trend: "up" }
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change),
      trend: change >= 0 ? "up" : "down",
    }
  }

  if (loading || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Calculate changes from previous period
  const viewerChange = previousPeriodData
    ? calculateChange(analyticsData.totalViews, previousPeriodData.totalViews)
    : { value: 0, trend: "up" as const }
  const chatChange = previousPeriodData
    ? calculateChange(analyticsData.chatMessages, previousPeriodData.chatMessages)
    : { value: 0, trend: "up" as const }
  const followerChange = previousPeriodData
    ? calculateChange(analyticsData.newFollowers, previousPeriodData.newFollowers)
    : { value: 0, trend: "up" as const }
  const revenueChange = previousPeriodData
    ? calculateChange(analyticsData.revenue, previousPeriodData.revenue)
    : { value: 0, trend: "up" as const }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isLive && (
            <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
              Live Analytics
            </Badge>
          )}
          <span className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)} disabled={!isLive}>
            {autoRefresh ? "Pause" : "Resume"} Auto-refresh
          </Button>
          <Button variant="outline" size="sm" onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalViews.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {viewerChange.trend === "up" ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
              )}
              <span className={viewerChange.trend === "up" ? "text-emerald-500" : "text-rose-500"}>
                {viewerChange.value.toFixed(1)}%
              </span>
              <span className="ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Viewers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.currentViewers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {isLive && (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                  <span>Live now</span>
                </>
              )}
              {!isLive && <span>Not streaming</span>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chat Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.chatMessages.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {chatChange.trend === "up" ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
              )}
              <span className={chatChange.trend === "up" ? "text-emerald-500" : "text-rose-500"}>
                {chatChange.value.toFixed(1)}%
              </span>
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
            <div className="text-2xl font-bold">{analyticsData.newFollowers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {followerChange.trend === "up" ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
              )}
              <span className={followerChange.trend === "up" ? "text-emerald-500" : "text-rose-500"}>
                {followerChange.value.toFixed(1)}%
              </span>
              <span className="ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.revenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {revenueChange.trend === "up" ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
              )}
              <span className={revenueChange.trend === "up" ? "text-emerald-500" : "text-rose-500"}>
                {revenueChange.value.toFixed(1)}%
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
            <div className="text-2xl font-bold">{Math.floor(analyticsData.watchTime / 60).toLocaleString()} hrs</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
              <span className="text-emerald-500">Engagement: {analyticsData.engagement.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts with real data */}
      {historicalData && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Viewer Trends</CardTitle>
              <CardDescription>Average viewers over time</CardDescription>
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
                    <LineChart data={historicalData.viewerCounts}>
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

          {platformData.length > 0 && (
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
          )}

          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>Chat activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    chatMessages: {
                      label: "Chat Messages",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historicalData.chatActivity}>
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
      )}
    </div>
  )
}
