"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"
import type { AlertTemplate } from "@/types/alerts"
import type { AlertPerformanceMetrics } from "@/types/alert-suggestions"

interface AlertPerformanceProps {
  metrics: AlertPerformanceMetrics
  alertTemplate: AlertTemplate
}

export default function AlertPerformance({ metrics, alertTemplate }: AlertPerformanceProps) {
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">{formatPercentage(metrics.engagementRate)}</div>
              <div className="text-xs text-muted-foreground">
                {metrics.engagementRate > 0.5 ? "Good" : metrics.engagementRate > 0.3 ? "Average" : "Needs Improvement"}
              </div>
            </div>
            <div className="mt-2 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  metrics.engagementRate > 0.5
                    ? "bg-green-500"
                    : metrics.engagementRate > 0.3
                      ? "bg-yellow-500"
                      : "bg-orange-500"
                }`}
                style={{ width: `${metrics.engagementRate * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Viewer Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">{metrics.averageViewerRetention.toFixed(1)}s</div>
              <div className="text-xs text-muted-foreground">
                {metrics.averageViewerRetention > alertTemplate.duration * 0.8
                  ? "Excellent"
                  : metrics.averageViewerRetention > alertTemplate.duration * 0.5
                    ? "Good"
                    : "Low"}
              </div>
            </div>
            <div className="mt-2 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  metrics.averageViewerRetention > alertTemplate.duration * 0.8
                    ? "bg-green-500"
                    : metrics.averageViewerRetention > alertTemplate.duration * 0.5
                      ? "bg-yellow-500"
                      : "bg-orange-500"
                }`}
                style={{ width: `${(metrics.averageViewerRetention / alertTemplate.duration) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chat Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">{metrics.chatActivity.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">messages per minute</div>
            </div>
            <div className="mt-2 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  metrics.chatActivity > 15
                    ? "bg-green-500"
                    : metrics.chatActivity > 8
                      ? "bg-yellow-500"
                      : "bg-orange-500"
                }`}
                style={{ width: `${Math.min((metrics.chatActivity / 20) * 100, 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Details</CardTitle>
          <CardDescription>Detailed metrics for this alert</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">
                <BarChart className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="trends">
                <LineChart className="h-4 w-4 mr-2" />
                Trends
              </TabsTrigger>
              <TabsTrigger value="audience">
                <PieChart className="h-4 w-4 mr-2" />
                Audience
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Total Impressions</h4>
                    <p className="text-2xl font-bold">{metrics.impressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Average Sentiment</h4>
                    <p className="text-2xl font-bold">
                      {metrics.averageSentiment > 0 ? "+" : ""}
                      {metrics.averageSentiment.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {metrics.averageSentiment > 0.3
                        ? "Very Positive"
                        : metrics.averageSentiment > 0
                          ? "Positive"
                          : metrics.averageSentiment > -0.3
                            ? "Neutral"
                            : "Negative"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Performance Rating</h4>
                  <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-600 to-yellow-500"
                      style={{
                        width: `${
                          (metrics.engagementRate * 0.4 +
                            (metrics.averageViewerRetention / alertTemplate.duration) * 0.3 +
                            (metrics.chatActivity / 20) * 0.2 +
                            ((metrics.averageSentiment + 1) / 2) * 0.1) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>Poor</span>
                    <span>Average</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Comparison to Similar Alerts</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-sm">Your Alert</span>
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span className="text-sm">Average</span>
                  </div>
                  <div className="mt-2 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Engagement</span>
                        <span>{formatPercentage(metrics.engagementRate)}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500"
                          style={{ width: `${metrics.engagementRate * 100}%` }}
                        ></div>
                      </div>
                      <div className="h-1 w-full flex items-center">
                        <div style={{ marginLeft: "35%" }} className="h-3 w-0.5 bg-gray-400"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Retention</span>
                        <span>{((metrics.averageViewerRetention / alertTemplate.duration) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500"
                          style={{ width: `${(metrics.averageViewerRetention / alertTemplate.duration) * 100}%` }}
                        ></div>
                      </div>
                      <div className="h-1 w-full flex items-center">
                        <div style={{ marginLeft: "60%" }} className="h-3 w-0.5 bg-gray-400"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                Trend data visualization would appear here
              </div>
            </TabsContent>

            <TabsContent value="audience">
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                Audience data visualization would appear here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
