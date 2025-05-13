"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, MessageSquare, Clock, TrendingUp, Activity } from "lucide-react"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import MobileLayout from "@/components/mobile/layout"
import type { StreamAnalytics } from "@/types/mobile-app"

export default function MobileAnalyticsPage() {
  const [analytics, setAnalytics] = useState<StreamAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("today")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      setAnalytics({
        viewerCount: 42,
        peakViewers: 78,
        chatMessages: 156,
        newFollowers: 12,
        watchTime: 1240, // in minutes
        platformBreakdown: [
          { platform: "twitch", viewers: 28, percentage: 67 },
          { platform: "youtube", viewers: 14, percentage: 33 },
        ],
      })

      setIsLoading(false)
    }

    loadData()
  }, [])

  // Mock viewer data for chart
  const viewerData = [
    { time: "10:00", viewers: 10 },
    { time: "10:15", viewers: 22 },
    { time: "10:30", viewers: 35 },
    { time: "10:45", viewers: 42 },
    { time: "11:00", viewers: 38 },
    { time: "11:15", viewers: 50 },
    { time: "11:30", viewers: 65 },
    { time: "11:45", viewers: 78 },
    { time: "12:00", viewers: 72 },
    { time: "12:15", viewers: 68 },
    { time: "12:30", viewers: 42 },
  ]

  // Colors for pie chart
  const COLORS = ["#8b5cf6", "#f97316", "#06b6d4", "#10b981"]

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading analytics...</p>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Time Range Selector */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Stream Analytics</h2>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Users className="h-6 w-6 text-orange-500 mb-2" />
              <p className="text-xs text-gray-500">Current Viewers</p>
              <p className="text-2xl font-bold">{analytics?.viewerCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-500 mb-2" />
              <p className="text-xs text-gray-500">Peak Viewers</p>
              <p className="text-2xl font-bold">{analytics?.peakViewers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <MessageSquare className="h-6 w-6 text-orange-500 mb-2" />
              <p className="text-xs text-gray-500">Chat Messages</p>
              <p className="text-2xl font-bold">{analytics?.chatMessages}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Clock className="h-6 w-6 text-orange-500 mb-2" />
              <p className="text-xs text-gray-500">Watch Time</p>
              <p className="text-2xl font-bold">
                {Math.floor(analytics?.watchTime! / 60)}h {analytics?.watchTime! % 60}m
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different analytics views */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="viewers">Viewers</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Viewer Trend</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={viewerData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="viewers"
                        stroke="#f97316"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">New Followers</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex items-center">
                <div className="h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-4">
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{analytics?.newFollowers}</p>
                  <p className="text-sm text-gray-500">New followers today</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="viewers" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Viewer Activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={viewerData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="viewers"
                        stroke="#f97316"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <Activity className="h-6 w-6 text-orange-500 mb-2" />
                  <p className="text-xs text-gray-500">Engagement Rate</p>
                  <p className="text-2xl font-bold">8.2%</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-500 mb-2" />
                  <p className="text-xs text-gray-500">Avg. Watch Time</p>
                  <p className="text-2xl font-bold">12m</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="platforms" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics?.platformBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="viewers"
                        nameKey="platform"
                        label={({ platform, percentage }) => `${platform}: ${percentage}%`}
                      >
                        {analytics?.platformBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {analytics?.platformBreakdown.map((platform) => (
                <Card key={platform.platform}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                          <span className="text-xs font-medium">{platform.platform.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium capitalize">{platform.platform}</p>
                          <p className="text-xs text-gray-500">{platform.viewers} viewers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{platform.percentage}%</p>
                        <p className="text-xs text-gray-500">of total</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  )
}
