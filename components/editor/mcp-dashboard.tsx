"use client"

import { useState } from "react"
import {
  Server,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Settings,
  Plus,
  Trash2,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ProcessingTask {
  id: string
  name: string
  status: "queued" | "processing" | "completed" | "failed"
  progress: number
  channel: string
  startTime: Date
  estimatedTime: number
  cpuUsage: number
  memoryUsage: number
}

interface MCPServer {
  id: string
  name: string
  status: "online" | "offline" | "error"
  uptime: number
  requests: number
  averageLatency: number
  errorRate: number
}

interface ChannelConfig {
  id: string
  name: string
  enabled: boolean
  priority: number
  maxConcurrent: number
}

export default function MCPDashboard() {
  const [servers, setServers] = useState<MCPServer[]>([
    {
      id: "1",
      name: "Primary Processing",
      status: "online",
      uptime: 99.8,
      requests: 15420,
      averageLatency: 125,
      errorRate: 0.02,
    },
    {
      id: "2",
      name: "Secondary Processing",
      status: "online",
      uptime: 99.5,
      requests: 8230,
      averageLatency: 185,
      errorRate: 0.05,
    },
    {
      id: "3",
      name: "Backup Server",
      status: "offline",
      uptime: 0,
      requests: 0,
      averageLatency: 0,
      errorRate: 0,
    },
  ])

  const [tasks, setTasks] = useState<ProcessingTask[]>([
    {
      id: "t1",
      name: "Video Generation - Scene 1",
      status: "processing",
      progress: 65,
      channel: "YouTube",
      startTime: new Date(Date.now() - 180000),
      estimatedTime: 300,
      cpuUsage: 85,
      memoryUsage: 72,
    },
    {
      id: "t2",
      name: "Thumbnail Generation",
      status: "queued",
      progress: 0,
      channel: "TikTok",
      startTime: new Date(),
      estimatedTime: 120,
      cpuUsage: 0,
      memoryUsage: 0,
    },
    {
      id: "t3",
      name: "Audio Processing",
      status: "completed",
      progress: 100,
      channel: "YouTube",
      startTime: new Date(Date.now() - 600000),
      estimatedTime: 180,
      cpuUsage: 0,
      memoryUsage: 0,
    },
  ])

  const [channels, setChannels] = useState<ChannelConfig[]>([
    { id: "1", name: "YouTube", enabled: true, priority: 1, maxConcurrent: 3 },
    { id: "2", name: "TikTok", enabled: true, priority: 2, maxConcurrent: 2 },
    { id: "3", name: "Twitch", enabled: false, priority: 3, maxConcurrent: 2 },
  ])

  const [selectedServer, setSelectedServer] = useState<string>("1")

  const totalCPU = tasks.filter((t) => t.status === "processing").reduce((sum, t) => sum + t.cpuUsage, 0)
  const totalMemory = tasks.filter((t) => t.status === "processing").reduce((sum, t) => sum + t.memoryUsage, 0)
  const activeProcessing = tasks.filter((t) => t.status === "processing").length
  const queuedTasks = tasks.filter((t) => t.status === "queued").length

  const getStatusColor = (status: ProcessingTask["status"] | MCPServer["status"]) => {
    switch (status) {
      case "online":
      case "completed":
        return "bg-green-500/20 text-green-500 border-green-500/30"
      case "processing":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30"
      case "queued":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
      case "offline":
      case "error":
      case "failed":
        return "bg-red-500/20 text-red-500 border-red-500/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusIcon = (status: ProcessingTask["status"] | MCPServer["status"]) => {
    switch (status) {
      case "online":
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "processing":
        return <Activity className="w-4 h-4 animate-pulse" />
      case "queued":
        return <Zap className="w-4 h-4" />
      case "offline":
      case "error":
      case "failed":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return null
    }
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ${seconds % 60}s`
  }

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(2)}%`
  }

  const selectedServerData = servers.find((s) => s.id === selectedServer)

  return (
    <div className="w-full space-y-4">
      {/* System Overview */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <p className="text-xs text-muted-foreground">Active Tasks</p>
          <p className="text-2xl font-bold text-foreground">{activeProcessing}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <p className="text-xs text-muted-foreground">Queued</p>
          <p className="text-2xl font-bold text-foreground">{queuedTasks}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <p className="text-xs text-muted-foreground">CPU Usage</p>
          <p className="text-2xl font-bold text-foreground">{totalCPU}%</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 border border-border">
          <p className="text-xs text-muted-foreground">Memory Usage</p>
          <p className="text-2xl font-bold text-foreground">{totalMemory}%</p>
        </div>
      </div>

      <Tabs defaultValue="servers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="servers" className="gap-2">
            <Server className="w-4 h-4" />
            Servers
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <Activity className="w-4 h-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="channels" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Channels
          </TabsTrigger>
        </TabsList>

        {/* Servers Tab */}
        <TabsContent value="servers" className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {servers.map((server) => (
              <div
                key={server.id}
                onClick={() => setSelectedServer(server.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedServer === server.id
                    ? "bg-primary/10 border-primary"
                    : "border-border hover:border-primary/50 bg-card"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0">
                      <Server className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{server.name}</p>
                      <p className="text-xs text-muted-foreground">{server.requests.toLocaleString()} requests</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(server.status)}>
                    {getStatusIcon(server.status)}
                    <span className="ml-1 text-xs">{server.status.toUpperCase()}</span>
                  </Badge>
                </div>

                {server.status === "online" && (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Uptime</span>
                      <span className="font-semibold text-foreground">{formatUptime(server.uptime)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Avg Latency</span>
                      <span className="font-semibold text-foreground">{server.averageLatency}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Error Rate</span>
                      <span
                        className={`font-semibold ${server.errorRate > 0.1 ? "text-orange-500" : "text-foreground"}`}
                      >
                        {(server.errorRate * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedServerData && selectedServerData.status === "online" && (
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-foreground">Server Performance</h4>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Health Score</span>
                  <span className="font-semibold">
                    {Math.round(selectedServerData.uptime - selectedServerData.errorRate * 100)}/100
                  </span>
                </div>
                <Progress value={selectedServerData.uptime - selectedServerData.errorRate * 100} className="h-2" />
              </div>
            </div>
          )}
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">{task.name}</p>
                    <Badge variant="outline" className={getStatusColor(task.status)}>
                      {getStatusIcon(task.status)}
                      <span className="ml-1 text-xs">{task.status.toUpperCase()}</span>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{task.channel}</p>
                </div>
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>

              {task.status === "processing" || task.status === "queued" ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />

                  <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-border/50">
                    <div>
                      <p className="text-muted-foreground">CPU</p>
                      <p className="font-semibold text-foreground">{task.cpuUsage}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Memory</p>
                      <p className="font-semibold text-foreground">{task.memoryUsage}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ETA</p>
                      <p className="font-semibold text-foreground">
                        {formatTime((task.estimatedTime - (task.progress / 100) * task.estimatedTime) * 1000)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Completed at{" "}
                  {task.startTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          ))}
        </TabsContent>

        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-3">
          {channels.map((channel) => (
            <div key={channel.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-2 h-2 rounded-full ${channel.enabled ? "bg-green-500" : "bg-muted"}`} />
                  <div>
                    <p className="font-medium text-foreground">{channel.name}</p>
                    <p className="text-xs text-muted-foreground">{channel.maxConcurrent} concurrent allowed</p>
                  </div>
                </div>
                <Badge variant={channel.enabled ? "default" : "secondary"} className="gap-1">
                  {channel.enabled ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      Disabled
                    </>
                  )}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  {channel.enabled ? "Disable" : "Enable"}
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full gap-2 bg-transparent">
            <Plus className="w-4 h-4" />
            Add Channel
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
