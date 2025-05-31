"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  MessageSquare,
  Clock,
  Target,
  Download,
  Activity,
  Zap,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface HostAnalyticsPanelProps {
  hostId: string
}

export function HostAnalyticsPanel({ hostId }: HostAnalyticsPanelProps) {
  const [timePeriod, setTimePeriod] = useState("week")
  const [analyticsTab, setAnalyticsTab] = useState("overview")

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalViews: 15420,
      uniqueViewers: 8750,
      averageWatchTime: 18.5, // minutes
      peakViewers: 342,
      engagementRate: 78.5,
      conversionRate: 12.3,
      revenue: 4250,
      growth: {
        views: 15.2,
        viewers: 8.7,
        revenue: 22.1,
        engagement: -2.3,
      },
    },
    engagement: {
      chatMessages: 2840,
      pollParticipation: 65.2,
      quizParticipation: 58.7,
      averageEngagement: 78.5,
      topEngagementHours: [
        { hour: 14, engagement: 85 },
        { hour: 15, engagement: 92 },
        { hour: 16, engagement: 88 },
        { hour: 19, engagement: 81 },
        { hour: 20, engagement: 79 },
      ],
    },
    revenue: {
      totalRevenue: 4250,
      averageOrderValue: 34.5,
      conversionRate: 12.3,
      topProducts: [
        { name: "Organic Avocados", sales: 45, revenue: 180 },
        { name: "Fresh Spinach", sales: 38, revenue: 152 },
        { name: "Heirloom Tomatoes", sales: 32, revenue: 256 },
        { name: "Organic Carrots", sales: 28, revenue: 84 },
      ],
    },
    audience: {
      demographics: {
        ageGroups: [
          { range: "18-24", percentage: 15 },
          { range: "25-34", percentage: 35 },
          { range: "35-44", percentage: 28 },
          { range: "45-54", percentage: 15 },
          { range: "55+", percentage: 7 },
        ],
        locations: [
          { city: "New York", percentage: 22 },
          { city: "Los Angeles", percentage: 18 },
          { city: "Chicago", percentage: 12 },
          { city: "Houston", percentage: 8 },
          { city: "Phoenix", percentage: 6 },
        ],
      },
      retention: {
        newViewers: 45,
        returningViewers: 55,
        averageSessionsPerUser: 3.2,
        retentionRate: 68.5,
      },
    },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your streaming performance and audience insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalViews.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />+{analyticsData.overview.growth.views}% from last {timePeriod}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Viewers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.uniqueViewers.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />+{analyticsData.overview.growth.viewers}% from last {timePeriod}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.overview.revenue.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />+{analyticsData.overview.growth.revenue}% from last {timePeriod}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.engagementRate}%</div>
            <p className="text-xs text-red-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
              {analyticsData.overview.growth.engagement}% from last {timePeriod}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={analyticsTab} onValueChange={setAnalyticsTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Performance Metrics */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Watch Time</span>
                    <span className="text-sm text-muted-foreground">{analyticsData.overview.averageWatchTime} min</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Peak Concurrent Viewers</span>
                    <span className="text-sm text-muted-foreground">{analyticsData.overview.peakViewers}</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Conversion Rate</span>
                    <span className="text-sm text-muted-foreground">{analyticsData.overview.conversionRate}%</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Growth Trends */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
                <CardDescription>Compared to previous {timePeriod}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Views Growth</span>
                  <Badge variant="secondary" className="text-emerald-600">
                    +{analyticsData.overview.growth.views}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Viewer Growth</span>
                  <Badge variant="secondary" className="text-emerald-600">
                    +{analyticsData.overview.growth.viewers}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Revenue Growth</span>
                  <Badge variant="secondary" className="text-emerald-600">
                    +{analyticsData.overview.growth.revenue}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Engagement Change</span>
                  <Badge variant="secondary" className="text-red-600">
                    {analyticsData.overview.growth.engagement}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Engagement Metrics */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Engagement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Chat Messages</span>
                  </div>
                  <span className="text-lg font-bold">{analyticsData.engagement.chatMessages.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Poll Participation</span>
                  </div>
                  <span className="text-lg font-bold">{analyticsData.engagement.pollParticipation}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Quiz Participation</span>
                  </div>
                  <span className="text-lg font-bold">{analyticsData.engagement.quizParticipation}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Peak Engagement Hours */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Peak Engagement Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.engagement.topEngagementHours.map((hour) => (
                    <div key={hour.hour} className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {hour.hour}:00 - {hour.hour + 1}:00
                      </span>
                      <div className="flex items-center gap-2">
                        <Progress value={hour.engagement} className="w-20 h-2" />
                        <span className="text-sm text-muted-foreground w-10">{hour.engagement}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Revenue Overview */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Revenue</span>
                  <span className="text-lg font-bold">${analyticsData.revenue.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Order Value</span>
                  <span className="text-lg font-bold">${analyticsData.revenue.averageOrderValue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Conversion Rate</span>
                  <span className="text-lg font-bold">{analyticsData.revenue.conversionRate}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Top Selling Products */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.revenue.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                      </div>
                      <span className="font-bold text-green-600">${product.revenue}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Demographics */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Age Groups</h4>
                    <div className="space-y-2">
                      {analyticsData.audience.demographics.ageGroups.map((group) => (
                        <div key={group.range} className="flex items-center justify-between">
                          <span className="text-sm">{group.range}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={group.percentage * 2} className="w-20 h-2" />
                            <span className="text-sm text-muted-foreground w-10">{group.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Top Locations</h4>
                    <div className="space-y-2">
                      {analyticsData.audience.demographics.locations.map((location) => (
                        <div key={location.city} className="flex items-center justify-between">
                          <span className="text-sm">{location.city}</span>
                          <span className="text-sm text-muted-foreground">{location.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Retention Metrics */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Retention Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">New Viewers</span>
                  <span className="text-lg font-bold">{analyticsData.audience.retention.newViewers}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Returning Viewers</span>
                  <span className="text-lg font-bold">{analyticsData.audience.retention.returningViewers}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Avg. Sessions per User</span>
                  <span className="text-lg font-bold">{analyticsData.audience.retention.averageSessionsPerUser}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Retention Rate</span>
                  <span className="text-lg font-bold">{analyticsData.audience.retention.retentionRate}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
