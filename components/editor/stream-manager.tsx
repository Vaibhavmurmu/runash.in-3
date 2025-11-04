"use client"

import { useState, useEffect } from "react"
import { Radio, Play, Pause, Users, Eye, TrendingUp, Trash2, Plus, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface StreamChannel {
  id: string
  name: string
  platform: "YouTube" | "Twitch" | "TikTok" | "Custom"
  status: "idle" | "streaming" | "paused"
  viewers: number
  duration: number
  bitrate: number
  fps: number
}

interface StreamStats {
  totalViewers: number
  avgBitrate: number
  droppedFrames: number
}

export default function StreamManager() {
  const [streams, setStreams] = useState<StreamChannel[]>([
    {
      id: "1",
      name: "Main YouTube Stream",
      platform: "YouTube",
      status: "streaming",
      viewers: 1240,
      duration: 3600,
      bitrate: 8000,
      fps: 60,
    },
    {
      id: "2",
      name: "Twitch Channel",
      platform: "Twitch",
      status: "idle",
      viewers: 0,
      duration: 0,
      bitrate: 0,
      fps: 0,
    },
    {
      id: "3",
      name: "TikTok Live",
      platform: "TikTok",
      status: "streaming",
      viewers: 5800,
      duration: 1800,
      bitrate: 4000,
      fps: 30,
    },
  ])

  const [selectedStream, setSelectedStream] = useState<string>("1")
  const [stats, setStats] = useState<StreamStats>({
    totalViewers: 0,
    avgBitrate: 0,
    droppedFrames: 0,
  })

  useEffect(() => {
    const activeStreams = streams.filter((s) => s.status === "streaming")
    const total = activeStreams.reduce((sum, s) => sum + s.viewers, 0)
    const avgBitrate = Math.round(
      activeStreams.reduce((sum, s) => sum + s.bitrate, 0) / Math.max(activeStreams.length, 1),
    )

    setStats({
      totalViewers: total,
      avgBitrate,
      droppedFrames: Math.floor(Math.random() * 5),
    })
  }, [streams])

  const toggleStreamStatus = (streamId: string) => {
    setStreams((prev) =>
      prev.map((stream) =>
        stream.id === streamId
          ? {
              ...stream,
              status: stream.status === "streaming" ? "idle" : "streaming",
              viewers: stream.status === "streaming" ? 0 : Math.floor(Math.random() * 10000),
              duration: stream.status === "streaming" ? 0 : 1,
            }
          : stream,
      ),
    )
  }

  const removeStream = (streamId: string) => {
    setStreams((prev) => prev.filter((s) => s.id !== streamId))
    if (selectedStream === streamId) {
      setSelectedStream(streams[0]?.id || "")
    }
  }

  const addNewStream = () => {
    const platforms: Array<"YouTube" | "Twitch" | "TikTok" | "Custom"> = ["YouTube", "Twitch", "TikTok", "Custom"]
    const newStream: StreamChannel = {
      id: Date.now().toString(),
      name: `New Stream ${streams.length + 1}`,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      status: "idle",
      viewers: 0,
      duration: 0,
      bitrate: 0,
      fps: 0,
    }
    setStreams((prev) => [...prev, newStream])
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const getStatusColor = (status: StreamChannel["status"]) => {
    switch (status) {
      case "streaming":
        return "bg-red-500/20 text-red-500 border-red-500/30"
      case "paused":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const selectedStreamData = streams.find((s) => s.id === selectedStream)

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col h-full overflow-hidden">
      <Tabs defaultValue="streams" className="w-full h-full flex flex-col">
        {/* Header with tabs */}
        <div className="border-b border-border px-4 pt-4 pb-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Radio className="w-4 h-4 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground">Stream Manager</h3>
          </div>

          <TabsList className="w-full rounded-none bg-transparent">
            <TabsTrigger value="streams" className="flex-1">
              Channels
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex-1">
              Stats
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Streams tab */}
        <TabsContent value="streams" className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="space-y-2 mb-4">
            {streams.map((stream) => (
              <button
                key={stream.id}
                onClick={() => setSelectedStream(stream.id)}
                className={`w-full p-3 rounded-lg border transition-all text-left ${
                  selectedStream === stream.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm truncate">{stream.name}</h4>
                      <Badge
                        variant={stream.status === "streaming" ? "default" : "secondary"}
                        className={`text-xs whitespace-nowrap ${getStatusColor(stream.status)}`}
                      >
                        {stream.status === "streaming" ? "LIVE" : "Idle"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stream.platform}</p>
                  </div>

                  {stream.status === "streaming" && (
                    <div className="flex items-center gap-1 text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      LIVE
                    </div>
                  )}
                </div>

                {stream.status === "streaming" && (
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-border/50 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      {stream.viewers.toLocaleString()} viewers
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Activity className="w-3 h-3" />
                      {stream.bitrate} kbps
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          <Button onClick={addNewStream} variant="outline" className="w-full gap-2 bg-transparent">
            <Plus className="w-4 h-4" />
            Add Stream Channel
          </Button>
        </TabsContent>

        {/* Stats tab */}
        <TabsContent value="stats" className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedStreamData && (
            <>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">{selectedStreamData.name}</h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Viewers
                    </span>
                    <span className="font-semibold text-foreground">{selectedStreamData.viewers.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Bitrate
                    </span>
                    <span className="font-semibold text-foreground">{selectedStreamData.bitrate} kbps</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      FPS
                    </span>
                    <span className="font-semibold text-foreground">{selectedStreamData.fps}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold text-foreground">{formatTime(selectedStreamData.duration)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <h4 className="font-semibold text-sm">Overall Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Viewers</span>
                    <span className="font-semibold">{stats.totalViewers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Avg Bitrate</span>
                    <span className="font-semibold">{stats.avgBitrate} kbps</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Dropped Frames</span>
                    <span className="font-semibold text-orange-500">{stats.droppedFrames}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* Settings tab */}
        <TabsContent value="settings" className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedStreamData && (
            <>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">{selectedStreamData.name} Settings</h4>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block">Bitrate (kbps)</label>
                  <input
                    type="range"
                    min="1000"
                    max="15000"
                    step="500"
                    defaultValue={selectedStreamData.bitrate}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block">Resolution</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">
                    <option>1080p (Full HD)</option>
                    <option>720p (HD)</option>
                    <option>480p (SD)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block">Frame Rate</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">
                    <option>60 FPS</option>
                    <option>30 FPS</option>
                    <option>24 FPS</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex gap-2">
                <Button
                  onClick={() => toggleStreamStatus(selectedStreamData.id)}
                  className="flex-1 gap-2"
                  variant={selectedStreamData.status === "streaming" ? "destructive" : "default"}
                >
                  {selectedStreamData.status === "streaming" ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Stop Stream
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Start Stream
                    </>
                  )}
                </Button>
                <Button onClick={() => removeStream(selectedStreamData.id)} variant="outline" size="icon">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
