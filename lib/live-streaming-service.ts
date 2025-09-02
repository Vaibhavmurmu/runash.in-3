import { EventEmitter } from "events"

export interface StreamConfig {
  id: string
  title: string
  description?: string
  hostId: string
  hostName: string
  category: string
  tags: string[]
  isPublic: boolean
  allowChat: boolean
  allowProducts: boolean
  recordingEnabled: boolean
  maxViewers?: number
}

export interface StreamMetrics {
  streamId: string
  viewerCount: number
  peakViewers: number
  totalViews: number
  chatMessages: number
  productViews: number
  purchases: number
  revenue: number
  averageWatchTime: number
  engagementRate: number
  startTime: Date
  endTime?: Date
}

export interface StreamEvent {
  type:
    | "viewer_joined"
    | "viewer_left"
    | "chat_message"
    | "product_featured"
    | "purchase"
    | "stream_started"
    | "stream_ended"
  streamId: string
  data: any
  timestamp: Date
}

class LiveStreamingService extends EventEmitter {
  private streams: Map<string, StreamConfig> = new Map()
  private metrics: Map<string, StreamMetrics> = new Map()
  private viewers: Map<string, Set<string>> = new Map() // streamId -> Set of userIds
  private rtmpServers: Map<string, string> = new Map() // streamId -> RTMP URL
  private hlsUrls: Map<string, string> = new Map() // streamId -> HLS URL

  constructor() {
    super()
    this.setupRealTimeUpdates()
  }

  // Create a new live stream
  async createStream(config: StreamConfig): Promise<{ rtmpUrl: string; streamKey: string; hlsUrl: string }> {
    const streamKey = this.generateStreamKey()
    const rtmpUrl = `rtmp://live.runash.in/live/${streamKey}`
    const hlsUrl = `https://live.runash.in/hls/${config.id}/playlist.m3u8`

    this.streams.set(config.id, config)
    this.rtmpServers.set(config.id, rtmpUrl)
    this.hlsUrls.set(config.id, hlsUrl)
    this.viewers.set(config.id, new Set())

    // Initialize metrics
    this.metrics.set(config.id, {
      streamId: config.id,
      viewerCount: 0,
      peakViewers: 0,
      totalViews: 0,
      chatMessages: 0,
      productViews: 0,
      purchases: 0,
      revenue: 0,
      averageWatchTime: 0,
      engagementRate: 0,
      startTime: new Date(),
    })

    return { rtmpUrl, streamKey, hlsUrl }
  }

  // Start streaming
  async startStream(streamId: string): Promise<void> {
    const stream = this.streams.get(streamId)
    if (!stream) throw new Error("Stream not found")

    const metrics = this.metrics.get(streamId)
    if (metrics) {
      metrics.startTime = new Date()
    }

    this.emitStreamEvent({
      type: "stream_started",
      streamId,
      data: { stream },
      timestamp: new Date(),
    })

    // Start real-time metrics collection
    this.startMetricsCollection(streamId)
  }

  // Stop streaming
  async stopStream(streamId: string): Promise<StreamMetrics> {
    const stream = this.streams.get(streamId)
    if (!stream) throw new Error("Stream not found")

    const metrics = this.metrics.get(streamId)
    if (metrics) {
      metrics.endTime = new Date()
    }

    this.emitStreamEvent({
      type: "stream_ended",
      streamId,
      data: { stream, metrics },
      timestamp: new Date(),
    })

    // Stop metrics collection
    this.stopMetricsCollection(streamId)

    return metrics!
  }

  // Add viewer to stream
  async addViewer(streamId: string, userId: string): Promise<void> {
    const viewers = this.viewers.get(streamId)
    if (!viewers) throw new Error("Stream not found")

    if (!viewers.has(userId)) {
      viewers.add(userId)

      const metrics = this.metrics.get(streamId)
      if (metrics) {
        metrics.viewerCount = viewers.size
        metrics.totalViews++
        if (metrics.viewerCount > metrics.peakViewers) {
          metrics.peakViewers = metrics.viewerCount
        }
      }

      this.emitStreamEvent({
        type: "viewer_joined",
        streamId,
        data: { userId, viewerCount: viewers.size },
        timestamp: new Date(),
      })
    }
  }

  // Remove viewer from stream
  async removeViewer(streamId: string, userId: string): Promise<void> {
    const viewers = this.viewers.get(streamId)
    if (!viewers) return

    if (viewers.has(userId)) {
      viewers.delete(userId)

      const metrics = this.metrics.get(streamId)
      if (metrics) {
        metrics.viewerCount = viewers.size
      }

      this.emitStreamEvent({
        type: "viewer_left",
        streamId,
        data: { userId, viewerCount: viewers.size },
        timestamp: new Date(),
      })
    }
  }

  // Get stream metrics
  getStreamMetrics(streamId: string): StreamMetrics | undefined {
    return this.metrics.get(streamId)
  }

  // Get all active streams
  getActiveStreams(): StreamConfig[] {
    return Array.from(this.streams.values())
  }

  // Get stream by ID
  getStream(streamId: string): StreamConfig | undefined {
    return this.streams.get(streamId)
  }

  // Get HLS URL for stream
  getHlsUrl(streamId: string): string | undefined {
    return this.hlsUrls.get(streamId)
  }

  // Record purchase event
  async recordPurchase(streamId: string, productId: string, amount: number): Promise<void> {
    const metrics = this.metrics.get(streamId)
    if (metrics) {
      metrics.purchases++
      metrics.revenue += amount
    }

    this.emitStreamEvent({
      type: "purchase",
      streamId,
      data: { productId, amount },
      timestamp: new Date(),
    })
  }

  // Record product view
  async recordProductView(streamId: string, productId: string): Promise<void> {
    const metrics = this.metrics.get(streamId)
    if (metrics) {
      metrics.productViews++
    }
  }

  // Record chat message
  async recordChatMessage(streamId: string, messageId: string): Promise<void> {
    const metrics = this.metrics.get(streamId)
    if (metrics) {
      metrics.chatMessages++
    }

    this.emitStreamEvent({
      type: "chat_message",
      streamId,
      data: { messageId },
      timestamp: new Date(),
    })
  }

  private generateStreamKey(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  private startMetricsCollection(streamId: string): void {
    const interval = setInterval(() => {
      const metrics = this.metrics.get(streamId)
      if (metrics) {
        // Calculate engagement rate
        const viewers = this.viewers.get(streamId)?.size || 0
        if (viewers > 0) {
          metrics.engagementRate = (metrics.chatMessages + metrics.productViews) / viewers
        }

        // Emit real-time metrics update
        this.emit("metrics_update", { streamId, metrics })
      }
    }, 5000) // Update every 5 seconds

    // Store interval for cleanup
    this.emit("interval_created", { streamId, interval })
  }

  private stopMetricsCollection(streamId: string): void {
    this.emit("stop_metrics", streamId)
  }

  private setupRealTimeUpdates(): void {
    // Setup WebSocket or Server-Sent Events for real-time updates
    setInterval(() => {
      this.streams.forEach((stream, streamId) => {
        const metrics = this.metrics.get(streamId)
        if (metrics) {
          this.emit("real_time_update", { streamId, metrics })
        }
      })
    }, 1000) // Real-time updates every second
  }

  private emitStreamEvent(event: StreamEvent): void {
    this.emit("stream_event", event)
  }
}

export const liveStreamingService = new LiveStreamingService()
