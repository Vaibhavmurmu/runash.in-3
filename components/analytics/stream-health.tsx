"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { AlertTriangle, CheckCircle, Activity, Wifi, Server, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface StreamHealthProps {
  streamId?: string
}

export function StreamHealth({ streamId }: StreamHealthProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data - in a real implementation, this would come from an API
  const healthScore = 92
  const status = "Excellent"
  const issues = []
  const warnings = ["Minor frame drops detected in the last 5 minutes"]

  // Mock data for the charts
  const bitrateData = Array.from({ length: 30 }, (_, i) => ({
    time: `${i}m`,
    bitrate: 5000 + Math.random() * 1000 - 500,
  }))

  const frameData = Array.from({ length: 30 }, (_, i) => ({
    time: `${i}m`,
    fps: 60 + Math.random() * 2 - 1,
    dropped: Math.floor(Math.random() * 5),
  }))

  const latencyData = Array.from({ length: 30 }, (_, i) => ({
    time: `${i}m`,
    latency: 200 + Math.random() * 100 - 50,
  }))

  const getStatusColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  const getStatusIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (score >= 70) return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    return <AlertTriangle className="h-5 w-5 text-red-500" />
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Stream Health</CardTitle>
            <CardDescription>Real-time performance metrics for your stream</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(healthScore)}
            <span className={`font-medium ${getStatusColor(healthScore)}`}>{status}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bitrate">Bitrate</TabsTrigger>
            <TabsTrigger value="frames">Frames</TabsTrigger>
            <TabsTrigger value="latency">Latency</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Health Score</span>
                  <span className={`text-sm font-medium ${getStatusColor(healthScore)}`}>{healthScore}%</span>
                </div>
                <Progress value={healthScore} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center p-3 border rounded-md">
                  <Wifi className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Bitrate</div>
                    <div className="text-2xl font-bold">5.2 Mbps</div>
                  </div>
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <Activity className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Frame Rate</div>
                    <div className="text-2xl font-bold">60 fps</div>
                  </div>
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Latency</div>
                    <div className="text-2xl font-bold">215 ms</div>
                  </div>
                </div>
              </div>

              {(issues.length > 0 || warnings.length > 0) && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Issues & Warnings</h4>
                  {issues.map((issue, i) => (
                    <div key={i} className="flex items-start space-x-2 text-red-500 text-sm">
                      <AlertTriangle className="h-4 w-4 mt-0.5" />
                      <span>{issue}</span>
                    </div>
                  ))}
                  {warnings.map((warning, i) => (
                    <div key={i} className="flex items-start space-x-2 text-yellow-500 text-sm">
                      <AlertTriangle className="h-4 w-4 mt-0.5" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              {issues.length === 0 && warnings.length === 0 && (
                <div className="flex items-center space-x-2 text-green-500 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>No issues detected with your stream</span>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bitrate">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bitrateData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[4000, 6000]} />
                  <Tooltip formatter={(value) => [`${value} Kbps`, "Bitrate"]} />
                  <Line type="monotone" dataKey="bitrate" stroke="#f97316" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Target bitrate: 5000 Kbps</p>
              <p>Recommended range: 4500-5500 Kbps for 1080p60</p>
            </div>
          </TabsContent>

          <TabsContent value="frames">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={frameData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" domain={[55, 65]} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="fps"
                    name="FPS"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="dropped"
                    name="Dropped Frames"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Target frame rate: 60 FPS</p>
              <p>Dropped frames: 0.2% (12 frames in the last 10 minutes)</p>
            </div>
          </TabsContent>

          <TabsContent value="latency">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[100, 300]} />
                  <Tooltip formatter={(value) => [`${value} ms`, "Latency"]} />
                  <Line type="monotone" dataKey="latency" stroke="#f97316" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Average latency: 215 ms</p>
              <p>Recommended: Below 250 ms for interactive streams</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-between">
          <div className="text-sm text-muted-foreground">Last updated: Just now</div>
          <div>
            <Badge variant="outline" className="ml-2">
              <Server className="h-3 w-3 mr-1" />
              <span>Server: US East</span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
