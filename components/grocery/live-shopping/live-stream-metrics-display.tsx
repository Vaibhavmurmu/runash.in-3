"use client"

import { useState, useEffect } from "react"
import { Users, Heart, MessageSquare, ShoppingBag, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { LiveStreamMetrics } from "@/types/live-shopping"

interface LiveStreamMetricsDisplayProps {
  initialMetrics: LiveStreamMetrics
  streamId: string
}

export default function LiveStreamMetricsDisplay({ initialMetrics, streamId }: LiveStreamMetricsDisplayProps) {
  const [metrics, setMetrics] = useState<LiveStreamMetrics>(initialMetrics)

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real implementation, this would be replaced with WebSocket updates
      setMetrics((prev) => ({
        ...prev,
        currentViewers: Math.min(prev.currentViewers + Math.floor(Math.random() * 5) - 2, prev.peakViewers + 10),
        likes: prev.likes + Math.floor(Math.random() * 2),
        comments: prev.comments + Math.floor(Math.random() * 1),
        productViews: prev.productViews + Math.floor(Math.random() * 3),
        cartAdds: prev.cartAdds + (Math.random() > 0.8 ? 1 : 0),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [streamId])

  // Update peak viewers if current exceeds peak
  useEffect(() => {
    if (metrics.currentViewers > metrics.peakViewers) {
      setMetrics((prev) => ({
        ...prev,
        peakViewers: prev.currentViewers,
      }))
    }
  }, [metrics.currentViewers, metrics.peakViewers])

  const calculateEngagementRate = () => {
    if (metrics.totalViewers === 0) return 0
    return ((metrics.likes + metrics.comments) / metrics.totalViewers) * 100
  }

  const calculateConversionRate = () => {
    if (metrics.productViews === 0) return 0
    return (metrics.cartAdds / metrics.productViews) * 100
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Live Metrics</h3>
            <span className="text-xs text-muted-foreground">Updating live</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="text-xs">Current Viewers</span>
                </div>
                <span className="text-sm font-medium">{metrics.currentViewers.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="text-xs">Peak Viewers</span>
                </div>
                <span className="text-sm font-medium">{metrics.peakViewers.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Heart className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="text-xs">Likes</span>
                </div>
                <span className="text-sm font-medium">{metrics.likes.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="text-xs">Comments</span>
                </div>
                <span className="text-sm font-medium">{metrics.comments.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Shopping Metrics</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingBag className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="text-xs">Products Added to Cart</span>
                </div>
                <span className="text-sm font-medium">{metrics.cartAdds.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Conversion Rate</span>
                <span className="text-sm font-medium">{calculateConversionRate().toFixed(1)}%</span>
              </div>

              <Progress value={calculateConversionRate()} className="h-1" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Engagement Rate</span>
                <span className="text-sm font-medium">{calculateEngagementRate().toFixed(1)}%</span>
              </div>

              <Progress value={calculateEngagementRate()} className="h-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
