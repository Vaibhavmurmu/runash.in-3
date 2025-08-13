"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { EmailEvent, RealtimeEmailMetrics } from "@/lib/email-realtime"
import { Mail, Activity, MousePointer, AlertTriangle } from "lucide-react"

export function RealTimeEmailDashboard() {
  const [metrics, setMetrics] = useState<RealtimeEmailMetrics>({
    totalSent: 0,
    totalDelivered: 0,
    totalBounced: 0,
    totalOpened: 0,
    totalClicked: 0,
    deliveryRate: 0,
    openRate: 0,
    clickRate: 0,
    bounceRate: 0,
    recentEvents: [],
  })
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected")
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    connectToRealtime()
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  const connectToRealtime = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    setConnectionStatus("connecting")

    const eventSource = new EventSource("/api/email/realtime")
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setIsConnected(true)
      setConnectionStatus("connected")
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === "metrics") {
          setMetrics(data.data)
        } else if (data.type === "event") {
          // Handle individual events if needed
          console.log("New email event:", data.data)
        } else if (data.type === "connected") {
          console.log("Connected to real-time email updates")
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error)
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
      setConnectionStatus("disconnected")

      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          connectToRealtime()
        }
      }, 5000)
    }
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "delivery_status":
        return <Mail className="h-4 w-4" />
      case "open":
        return <Activity className="h-4 w-4" />
      case "click":
        return <MousePointer className="h-4 w-4" />
      case "bounce":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "delivery_status":
        return "bg-blue-500"
      case "open":
        return "bg-green-500"
      case "click":
        return "bg-purple-500"
      case "bounce":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatEventDescription = (event: EmailEvent) => {
    switch (event.type) {
      case "delivery_status":
        return `Email ${event.data?.status || "processed"} to ${event.email}`
      case "open":
        return `Email opened by ${event.email}`
      case "click":
        return `Link clicked by ${event.email}: ${event.data?.url || "Unknown URL"}`
      case "bounce":
        return `Email bounced for ${event.email}: ${event.data?.reason || "Unknown reason"}`
      default:
        return `${event.type} event for ${event.email}`
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Real-Time Email Monitoring</CardTitle>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-green-500"
                    : connectionStatus === "connecting"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />
              <span className="text-sm text-muted-foreground capitalize">{connectionStatus}</span>
              {connectionStatus === "disconnected" && (
                <Button size="sm" variant="outline" onClick={connectToRealtime}>
                  Reconnect
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Real-Time Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{metrics.deliveryRate.toFixed(1)}% delivery rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opens</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOpened.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{metrics.openRate.toFixed(1)}% open rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalClicked.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{metrics.clickRate.toFixed(1)}% click rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounces</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalBounced.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{metrics.bounceRate.toFixed(1)}% bounce rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Live Activity Feed</CardTitle>
          <CardDescription>Real-time email events as they happen</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {metrics.recentEvents.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">No recent events</div>
            ) : (
              <div className="space-y-4">
                {metrics.recentEvents.map((event, index) => (
                  <div key={`${event.messageId}-${index}`} className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getEventColor(event.type)}`}>{getEventIcon(event.type)}</div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{formatEventDescription(event)}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {event.type.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
