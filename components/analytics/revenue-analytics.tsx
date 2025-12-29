"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  ResponsiveContainer,
  Pie,
  Tooltip,
  Legend,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts"
import type { AnalyticsFilters, RevenueMetrics } from "@/types/analytics"
import { DollarSign, TrendingUp, Users, BadgePercent, BarChart3 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RevenueAnalyticsProps {
  filters: AnalyticsFilters
}

export function RevenueAnalytics({ filters }: RevenueAnalyticsProps) {
  // Mock data - in a real implementation, this would come from an API
  const revenueData: RevenueMetrics = {
    subscriptions: {
      total: 90,
      new: 15,
      recurring: 75,
      revenue: 450,
    },
    donations: {
      total: 960,
      average: 12.5,
      largest: 150,
      topDonors: [
        { name: "SuperFan123", amount: 150 },
        { name: "GameLover", amount: 100 },
        { name: "StreamSupporter", amount: 75 },
        { name: "ContentFan", amount: 50 },
        { name: "RegularViewer", amount: 45 },
      ],
    },
    ads: {
      impressions: 45000,
      revenue: 320,
      cpm: 7.11,
    },
    sponsorships: {
      active: 2,
      revenue: 500,
    },
    totalRevenue: 2230,
    revenueByPlatform: [
      { platform: "Twitch", amount: 1250, percentage: 56 },
      { platform: "YouTube", amount: 580, percentage: 26 },
      { platform: "Facebook", amount: 280, percentage: 13 },
      { platform: "TikTok", amount: 120, percentage: 5 },
      { platform: "Instagram", amount: 0, percentage: 0 },
    ],
  }

  // Mock revenue over time data
  const revenueOverTime = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    return {
      date,
      subscriptions: Math.floor(Math.random() * 30) + 10,
      donations: Math.floor(Math.random() * 50) + 20,
      ads: Math.floor(Math.random() * 20) + 5,
      sponsorships: i % 7 === 0 ? Math.floor(Math.random() * 100) + 50 : 0,
    }
  })

  // Calculate total revenue
  const totalRevenue =
    revenueData.subscriptions.revenue +
    revenueData.donations.total * revenueData.donations.average +
    revenueData.ads.revenue +
    revenueData.sponsorships.revenue

  // Calculate revenue breakdown percentages
  const subscriptionPercentage = Math.round((revenueData.subscriptions.revenue / totalRevenue) * 100)
  const donationPercentage = Math.round(
    ((revenueData.donations.total * revenueData.donations.average) / totalRevenue) * 100,
  )
  const adPercentage = Math.round((revenueData.ads.revenue / totalRevenue) * 100)
  const sponsorshipPercentage = Math.round((revenueData.sponsorships.revenue / totalRevenue) * 100)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueData.subscriptions.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
              <span className="text-emerald-500">+{revenueData.subscriptions.new}</span>
              <span className="ml-1">new this period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(revenueData.donations.total * revenueData.donations.average).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {revenueData.donations.total} donations (avg. ${revenueData.donations.average})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ad Revenue</CardTitle>
            <BadgePercent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.ads.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {revenueData.ads.impressions.toLocaleString()} impressions (${revenueData.ads.cpm.toFixed(2)} CPM)
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="breakdown">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="breakdown">Revenue Breakdown</TabsTrigger>
          <TabsTrigger value="platforms">Platform Revenue</TabsTrigger>
          <TabsTrigger value="trends">Revenue Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Revenue sources by percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Subscriptions", value: revenueData.subscriptions.revenue, color: "#3b82f6" },
                        {
                          name: "Donations",
                          value: revenueData.donations.total * revenueData.donations.average,
                          color: "#f97316",
                        },
                        { name: "Ads", value: revenueData.ads.revenue, color: "#84cc16" },
                        { name: "Sponsorships", value: revenueData.sponsorships.revenue, color: "#8b5cf6" },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: "Subscriptions", value: revenueData.subscriptions.revenue, color: "#3b82f6" },
                        {
                          name: "Donations",
                          value: revenueData.donations.total * revenueData.donations.average,
                          color: "#f97316",
                        },
                        { name: "Ads", value: revenueData.ads.revenue, color: "#84cc16" },
                        { name: "Sponsorships", value: revenueData.sponsorships.revenue, color: "#8b5cf6" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, "Revenue"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms">
          <Card>
            <CardHeader>
              <CardTitle>Platform Revenue</CardTitle>
              <CardDescription>Revenue distribution by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData.revenueByPlatform}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, "Revenue"]} />
                    <Bar dataKey="amount" fill="#f97316" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-4">
                {revenueData.revenueByPlatform.map(
                  (platform) =>
                    platform.amount > 0 && (
                      <div key={platform.platform} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{platform.platform}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${platform.amount.toLocaleString()} ({platform.percentage}%)
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full"
                            style={{ width: `${platform.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Revenue over time by source</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getMonth() + 1}/${date.getDate()}`
                      }}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, "Revenue"]} />
                    <Legend />
                    <Line type="monotone" dataKey="subscriptions" stroke="#3b82f6" name="Subscriptions" />
                    <Line type="monotone" dataKey="donations" stroke="#f97316" name="Donations" />
                    <Line type="monotone" dataKey="ads" stroke="#84cc16" name="Ads" />
                    <Line type="monotone" dataKey="sponsorships" stroke="#8b5cf6" name="Sponsorships" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Top Donors</CardTitle>
          <CardDescription>Your most generous supporters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueData.donations.topDonors.map((donor, index) => (
              <div key={donor.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 mr-3">
                    {index + 1}
                  </div>
                  <span className="font-medium">{donor.name}</span>
                </div>
                <span className="font-bold">${donor.amount}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
