"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { AnalyticsOverview } from "@/components/analytics/analytics-overview"
import { AudienceInsights } from "@/components/analytics/audience-insights"
import { EngagementMetrics } from "@/components/analytics/engagement-metrics"
import { ContentAnalytics } from "@/components/analytics/content-analytics"
import { RevenueAnalytics } from "@/components/analytics/revenue-analytics"
import { StreamHealth } from "@/components/analytics/stream-health"
import { AnalyticsFilters } from "@/components/analytics/analytics-filters"
import { AnalyticsPeriodSelector } from "@/components/analytics/analytics-period-selector"
import { PlatformComparison } from "@/components/analytics/platform-comparison"
import { AnalyticsExport } from "@/components/analytics/analytics-export"
import type { AnalyticsFilters as AnalyticsFiltersType } from "@/types/analytics"

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [filters, setFilters] = useState<AnalyticsFiltersType>({
    period: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString(),
      label: "Last 30 days",
    },
    platforms: ["twitch", "youtube", "facebook", "tiktok", "instagram"],
  })

  const handleFilterChange = (newFilters: Partial<AnalyticsFiltersType>) => {
    setFilters({ ...filters, ...newFilters })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Stream Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive insights into your streaming performance across all platforms
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
            <AnalyticsPeriodSelector
              currentPeriod={filters.period}
              onChange={(period) => handleFilterChange({ period })}
            />
            <div className="flex gap-2">
              <AnalyticsFilters filters={filters} onChange={handleFilterChange} />
              <AnalyticsExport filters={filters} />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 md:grid-cols-7 lg:w-[800px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="health">Stream Health</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <AnalyticsOverview filters={filters} />
            </TabsContent>

            <TabsContent value="audience" className="space-y-4">
              <AudienceInsights filters={filters} />
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <EngagementMetrics filters={filters} />
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <ContentAnalytics filters={filters} />
            </TabsContent>

            <TabsContent value="platforms" className="space-y-4">
              <PlatformComparison filters={filters} />
            </TabsContent>

            <TabsContent value="revenue" className="space-y-4">
              <RevenueAnalytics filters={filters} />
            </TabsContent>

            <TabsContent value="health" className="space-y-4">
              <StreamHealth filters={filters} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
