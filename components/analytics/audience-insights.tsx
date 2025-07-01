"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  PieChart,
  ResponsiveContainer,
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
import type { AnalyticsFilters, AudienceDemographics } from "@/types/analytics"
import { Globe, Smartphone, Laptop } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface AudienceInsightsProps {
  filters: AnalyticsFilters
}

export function AudienceInsights({ filters }: AudienceInsightsProps) {
  // Mock data - in a real implementation, this would come from an API
  const audienceData: AudienceDemographics = {
    ageGroups: [
      { range: "13-17", percentage: 8 },
      { range: "18-24", percentage: 35 },
      { range: "25-34", percentage: 42 },
      { range: "35-44", percentage: 10 },
      { range: "45-54", percentage: 3 },
      { range: "55+", percentage: 2 },
    ],
    genderDistribution: [
      { gender: "Male", percentage: 65 },
      { gender: "Female", percentage: 32 },
      { gender: "Non-binary", percentage: 3 },
    ],
    topCountries: [
      { country: "United States", viewers: 450, percentage: 32 },
      { country: "United Kingdom", viewers: 210, percentage: 15 },
      { country: "Canada", viewers: 180, percentage: 13 },
      { country: "Germany", viewers: 120, percentage: 9 },
      { country: "Australia", viewers: 105, percentage: 7 },
      { country: "France", viewers: 90, percentage: 6 },
      { country: "Brazil", viewers: 75, percentage: 5 },
      { country: "Japan", viewers: 60, percentage: 4 },
      { country: "Other", viewers: 130, percentage: 9 },
    ],
    deviceTypes: [
      { device: "Mobile", percentage: 45 },
      { device: "Desktop", percentage: 38 },
      { device: "Tablet", percentage: 12 },
      { device: "Smart TV", percentage: 5 },
    ],
    returningViewers: 65,
    newViewers: 35,
  }

  const genderColors = ["#3b82f6", "#ec4899", "#8b5cf6"]
  const deviceIcons = {
    Mobile: <Smartphone className="h-4 w-4" />,
    Desktop: <Laptop className="h-4 w-4" />,
    Tablet: <Laptop className="h-4 w-4 rotate-90" />,
    "Smart TV": <Laptop className="h-4 w-4" />,
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
            <CardDescription>Viewer age groups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  percentage: {
                    label: "Percentage",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={audienceData.ageGroups}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="percentage" name="percentage" fill="var(--color-percentage)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>Viewer gender breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={audienceData.genderDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                    nameKey="gender"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {audienceData.genderDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={genderColors[index % genderColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <CardDescription>Top countries by viewer count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {audienceData.topCountries.map((country) => (
              <div key={country.country} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{country.country}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {country.viewers.toLocaleString()} viewers ({country.percentage}%)
                  </div>
                </div>
                <Progress value={country.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
            <CardDescription>How viewers are watching your streams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {audienceData.deviceTypes.map((device) => (
                <div key={device.device} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {deviceIcons[device.device as keyof typeof deviceIcons]}
                      <span className="ml-2">{device.device}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{device.percentage}%</div>
                  </div>
                  <Progress value={device.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Viewer Loyalty</CardTitle>
            <CardDescription>New vs. returning viewers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Returning Viewers", value: audienceData.returningViewers },
                      { name: "New Viewers", value: audienceData.newViewers },
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
                    <Cell fill="#f97316" />
                    <Cell fill="#84cc16" />
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
