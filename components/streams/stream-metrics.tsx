"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Eye, DollarSign, Heart, MessageSquare } from "lucide-react"

interface StreamMetric {
  label: string
  value: string | number
  change: number
  icon: React.ElementType
  color: string
}

export function StreamMetrics() {
  const [metrics, setMetrics] = useState<StreamMetric[]>([
    {
      label: "Current Viewers",
      value: 2847,
      change: 12,
      icon: Eye,
      color: "text-blue-500",
    },
    {
      label: "Revenue",
      value: "$1,234",
      change: 8,
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      label: "Engagement",
      value: "87%",
      change: -2,
      icon: Heart,
      color: "text-red-500",
    },
    {
      label: "Chat Messages",
      value: 456,
      change: 15,
      icon: MessageSquare,
      color: "text-purple-500",
    },
  ])

  // Simulate real-time metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value:
            metric.label === "Current Viewers"
              ? Math.max(0, Number(metric.value) + Math.floor(Math.random() * 20) - 10)
              : metric.value,
          change: Math.floor(Math.random() * 30) - 15,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Live Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {metric.change > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs ${metric.change > 0 ? "text-green-500" : "text-red-500"}`}>
                    {Math.abs(metric.change)}%
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.label === "Engagement" && (
                <Progress value={Number.parseInt(metric.value.toString())} className="h-2" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
