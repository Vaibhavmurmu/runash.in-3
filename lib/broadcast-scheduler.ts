import { EventEmitter } from "events"
import { liveStreamingService } from "./live-streaming-service"
import { liveChatService } from "./live-chat-service"

export interface ScheduledBroadcast {
  id: string
  title: string
  description?: string
  hostId: string
  hostName: string
  scheduledStartTime: Date
  scheduledEndTime: Date
  actualStartTime?: Date
  actualEndTime?: Date
  duration: number // in minutes
  status: "scheduled" | "preparing" | "live" | "ended" | "cancelled"
  platforms: BroadcastPlatform[]
  category: string
  tags: string[]
  isPublic: boolean
  isRecurring: boolean
  recurrencePattern?: RecurrencePattern
  templateId?: string
  notificationSettings: NotificationSettings
  autoStartSettings: AutoStartSettings
  streamSettings: StreamSettings
  createdAt: Date
  updatedAt: Date
}

export interface BroadcastPlatform {
  id: string
  name: string
  platform: "twitch" | "youtube" | "facebook" | "tiktok" | "instagram" | "custom"
  isEnabled: boolean
  streamKey?: string
  rtmpUrl?: string
  settings: Record<string, any>
}

export interface RecurrencePattern {
  frequency: "daily" | "weekly" | "monthly"
  interval: number
  daysOfWeek?: number[] // 0-6, Sunday = 0
  dayOfMonth?: number
  endDate?: Date
  maxOccurrences?: number
}

export interface NotificationSettings {
  enabled: boolean
  notifyBefore: number[] // minutes before start
  channels: ("email" | "sms" | "push" | "discord" | "slack")[]
  customMessage?: string
  audienceNotification: boolean
}

export interface AutoStartSettings {
  enabled: boolean
  prepareMinutesBefore: number
  autoGoLive: boolean
  autoEndAfterDuration: boolean
  fallbackActions: {
    onHostAbsent: "cancel" | "delay" | "auto_start"
    onTechnicalIssue: "retry" | "cancel" | "switch_platform"
  }
}

export interface StreamSettings {
  quality: "720p" | "1080p" | "4K"
  bitrate: number
  fps: number
  enableChat: boolean
  enableRecording: boolean
  enableTranscription: boolean
  backgroundMusic?: string
  overlayTemplate?: string
  chatModeration: {
    enabled: boolean
    autoMod: boolean
    slowMode: boolean
    followersOnly: boolean
  }
}

export interface BroadcastTemplate {
  id: string
  name: string
  description?: string
  category: string
  duration: number
  platforms: string[]
  tags: string[]
  streamSettings: StreamSettings
  notificationSettings: NotificationSettings
  autoStartSettings: AutoStartSettings
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BroadcastAnalytics {
  broadcastId: string
  totalViewers: number
  peakViewers: number
  averageViewTime: number
  chatMessages: number
  engagement: number
  platformBreakdown: Record<string, { viewers: number; chatMessages: number }>
  audienceRetention: { timestamp: Date; viewers: number }[]
  revenue?: number
  donations?: number
}

class BroadcastScheduler extends EventEmitter {
  private broadcasts: Map<string, ScheduledBroadcast> = new Map()
  private templates: Map<string, BroadcastTemplate> = new Map()
  private analytics: Map<string, BroadcastAnalytics> = new Map()
  private scheduledJobs: Map<string, NodeJS.Timeout> = new Map()
  private platforms: Map<string, BroadcastPlatform> = new Map()

  constructor() {
    super()
    this.initializeDefaultPlatforms()
    this.startScheduleMonitoring()
  }

  // Broadcast Management
  async createBroadcast(
    broadcastData: Omit<ScheduledBroadcast, "id" | "createdAt" | "updatedAt">,
  ): Promise<ScheduledBroadcast> {
    const broadcastId = `broadcast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    const broadcast: ScheduledBroadcast = {
      id: broadcastId,
      ...broadcastData,
      status: "scheduled",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.broadcasts.set(broadcastId, broadcast)

    // Schedule notifications and auto-start
    await this.scheduleNotifications(broadcast)
    await this.scheduleAutoStart(broadcast)

    // Handle recurring broadcasts
    if (broadcast.isRecurring && broadcast.recurrencePattern) {
      await this.scheduleRecurringBroadcasts(broadcast)
    }

    this.emit("broadcast_created", { broadcast })
    return broadcast
  }

  async updateBroadcast(broadcastId: string, updates: Partial<ScheduledBroadcast>): Promise<ScheduledBroadcast> {
    const broadcast = this.broadcasts.get(broadcastId)
    if (!broadcast) throw new Error("Broadcast not found")

    const updatedBroadcast = {
      ...broadcast,
      ...updates,
      updatedAt: new Date(),
    }

    this.broadcasts.set(broadcastId, updatedBroadcast)

    // Reschedule if timing changed
    if (updates.scheduledStartTime || updates.notificationSettings || updates.autoStartSettings) {
      await this.cancelScheduledJobs(broadcastId)
      await this.scheduleNotifications(updatedBroadcast)
      await this.scheduleAutoStart(updatedBroadcast)
    }

    this.emit("broadcast_updated", { broadcast: updatedBroadcast })
    return updatedBroadcast
  }

  async cancelBroadcast(broadcastId: string, reason?: string): Promise<void> {
    const broadcast = this.broadcasts.get(broadcastId)
    if (!broadcast) throw new Error("Broadcast not found")

    broadcast.status = "cancelled"
    broadcast.updatedAt = new Date()

    await this.cancelScheduledJobs(broadcastId)

    this.emit("broadcast_cancelled", { broadcast, reason })
  }

  async startBroadcast(broadcastId: string, manual = false): Promise<void> {
    const broadcast = this.broadcasts.get(broadcastId)
    if (!broadcast) throw new Error("Broadcast not found")

    if (broadcast.status !== "scheduled" && broadcast.status !== "preparing") {
      throw new Error(`Cannot start broadcast with status: ${broadcast.status}`)
    }

    try {
      // Update status
      broadcast.status = "preparing"
      broadcast.actualStartTime = new Date()
      this.broadcasts.set(broadcastId, broadcast)

      // Create live stream
      const streamConfig = {
        id: broadcastId,
        title: broadcast.title,
        description: broadcast.description,
        hostId: broadcast.hostId,
        hostName: broadcast.hostName,
        category: broadcast.category,
        tags: broadcast.tags,
        isPublic: broadcast.isPublic,
        allowChat: broadcast.streamSettings.enableChat,
        allowProducts: true,
        recordingEnabled: broadcast.streamSettings.enableRecording,
      }

      const { rtmpUrl, streamKey, hlsUrl } = await liveStreamingService.createStream(streamConfig)

      // Create chat room if enabled
      if (broadcast.streamSettings.enableChat) {
        await liveChatService.createChatRoom(broadcastId, broadcast.hostId)

        // Apply chat settings
        const chatSettings = {
          slowMode: broadcast.streamSettings.chatModeration.slowMode,
          followersOnly: broadcast.streamSettings.chatModeration.followersOnly,
          autoModeration: broadcast.streamSettings.chatModeration.autoMod,
        }
        await liveChatService.updateChatSettings(broadcastId, chatSettings)
      }

      // Start streaming on platforms
      for (const platform of broadcast.platforms) {
        if (platform.isEnabled) {
          await this.startPlatformStream(platform, rtmpUrl, streamKey)
        }
      }

      // Update status to live
      broadcast.status = "live"
      this.broadcasts.set(broadcastId, broadcast)

      // Start live stream service
      await liveStreamingService.startStream(broadcastId)

      // Schedule auto-end if enabled
      if (broadcast.autoStartSettings.autoEndAfterDuration) {
        const endTime = new Date(Date.now() + broadcast.duration * 60 * 1000)
        const endTimeout = setTimeout(
          () => {
            this.endBroadcast(broadcastId, true)
          },
          broadcast.duration * 60 * 1000,
        )

        this.scheduledJobs.set(`${broadcastId}_end`, endTimeout)
      }

      this.emit("broadcast_started", { broadcast, manual })
    } catch (error) {
      broadcast.status = "scheduled"
      this.broadcasts.set(broadcastId, broadcast)

      this.emit("broadcast_start_failed", { broadcast, error })
      throw error
    }
  }

  async endBroadcast(broadcastId: string, automatic = false): Promise<BroadcastAnalytics> {
    const broadcast = this.broadcasts.get(broadcastId)
    if (!broadcast) throw new Error("Broadcast not found")

    if (broadcast.status !== "live") {
      throw new Error(`Cannot end broadcast with status: ${broadcast.status}`)
    }

    try {
      // Update status
      broadcast.status = "ended"
      broadcast.actualEndTime = new Date()
      this.broadcasts.set(broadcastId, broadcast)

      // Stop live stream
      const finalMetrics = await liveStreamingService.stopStream(broadcastId)

      // Close chat room
      if (broadcast.streamSettings.enableChat) {
        await liveChatService.closeChatRoom(broadcastId)
      }

      // Stop platform streams
      for (const platform of broadcast.platforms) {
        if (platform.isEnabled) {
          await this.stopPlatformStream(platform)
        }
      }

      // Generate analytics
      const analytics = await this.generateBroadcastAnalytics(broadcast, finalMetrics)
      this.analytics.set(broadcastId, analytics)

      // Clean up scheduled jobs
      await this.cancelScheduledJobs(broadcastId)

      this.emit("broadcast_ended", { broadcast, analytics, automatic })
      return analytics
    } catch (error) {
      this.emit("broadcast_end_failed", { broadcast, error })
      throw error
    }
  }

  // Template Management
  async createTemplate(
    templateData: Omit<BroadcastTemplate, "id" | "createdAt" | "updatedAt">,
  ): Promise<BroadcastTemplate> {
    const templateId = `template_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    const template: BroadcastTemplate = {
      id: templateId,
      ...templateData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.templates.set(templateId, template)
    this.emit("template_created", { template })
    return template
  }

  async createBroadcastFromTemplate(
    templateId: string,
    overrides: Partial<ScheduledBroadcast>,
  ): Promise<ScheduledBroadcast> {
    const template = this.templates.get(templateId)
    if (!template) throw new Error("Template not found")

    const broadcastData = {
      title: template.name,
      description: template.description,
      hostId: overrides.hostId || "",
      hostName: overrides.hostName || "",
      scheduledStartTime: overrides.scheduledStartTime || new Date(),
      scheduledEndTime: overrides.scheduledEndTime || new Date(Date.now() + template.duration * 60 * 1000),
      duration: template.duration,
      platforms: this.getPlatformsByIds(template.platforms),
      category: template.category,
      tags: template.tags,
      isPublic: template.isPublic,
      isRecurring: false,
      templateId: templateId,
      notificationSettings: template.notificationSettings,
      autoStartSettings: template.autoStartSettings,
      streamSettings: template.streamSettings,
      ...overrides,
    }

    return this.createBroadcast(broadcastData)
  }

  // Platform Management
  async addPlatform(platformData: Omit<BroadcastPlatform, "id">): Promise<BroadcastPlatform> {
    const platformId = `platform_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    const platform: BroadcastPlatform = {
      id: platformId,
      ...platformData,
    }

    this.platforms.set(platformId, platform)
    this.emit("platform_added", { platform })
    return platform
  }

  // Analytics and Reporting
  getBroadcastAnalytics(broadcastId: string): BroadcastAnalytics | undefined {
    return this.analytics.get(broadcastId)
  }

  getUpcomingBroadcasts(limit = 10): ScheduledBroadcast[] {
    const now = new Date()
    return Array.from(this.broadcasts.values())
      .filter((b) => b.scheduledStartTime > now && b.status === "scheduled")
      .sort((a, b) => a.scheduledStartTime.getTime() - b.scheduledStartTime.getTime())
      .slice(0, limit)
  }

  getLiveBroadcasts(): ScheduledBroadcast[] {
    return Array.from(this.broadcasts.values()).filter((b) => b.status === "live")
  }

  getBroadcastHistory(hostId?: string, limit = 50): ScheduledBroadcast[] {
    let broadcasts = Array.from(this.broadcasts.values())
      .filter((b) => b.status === "ended")
      .sort(
        (a, b) =>
          (b.actualStartTime || b.scheduledStartTime).getTime() - (a.actualStartTime || a.scheduledStartTime).getTime(),
      )

    if (hostId) {
      broadcasts = broadcasts.filter((b) => b.hostId === hostId)
    }

    return broadcasts.slice(0, limit)
  }

  // Private Methods
  private async scheduleNotifications(broadcast: ScheduledBroadcast): Promise<void> {
    if (!broadcast.notificationSettings.enabled) return

    for (const minutesBefore of broadcast.notificationSettings.notifyBefore) {
      const notificationTime = new Date(broadcast.scheduledStartTime.getTime() - minutesBefore * 60 * 1000)

      if (notificationTime > new Date()) {
        const timeout = setTimeout(() => {
          this.sendNotification(broadcast, minutesBefore)
        }, notificationTime.getTime() - Date.now())

        this.scheduledJobs.set(`${broadcast.id}_notification_${minutesBefore}`, timeout)
      }
    }
  }

  private async scheduleAutoStart(broadcast: ScheduledBroadcast): Promise<void> {
    if (!broadcast.autoStartSettings.enabled) return

    const prepareTime = new Date(
      broadcast.scheduledStartTime.getTime() - broadcast.autoStartSettings.prepareMinutesBefore * 60 * 1000,
    )

    if (prepareTime > new Date()) {
      const timeout = setTimeout(() => {
        this.prepareBroadcast(broadcast.id)
      }, prepareTime.getTime() - Date.now())

      this.scheduledJobs.set(`${broadcast.id}_prepare`, timeout)
    }

    if (broadcast.autoStartSettings.autoGoLive) {
      const startTime = broadcast.scheduledStartTime

      if (startTime > new Date()) {
        const timeout = setTimeout(() => {
          this.startBroadcast(broadcast.id, false)
        }, startTime.getTime() - Date.now())

        this.scheduledJobs.set(`${broadcast.id}_start`, timeout)
      }
    }
  }

  private async scheduleRecurringBroadcasts(broadcast: ScheduledBroadcast): Promise<void> {
    if (!broadcast.recurrencePattern) return

    const pattern = broadcast.recurrencePattern
    let nextDate = new Date(broadcast.scheduledStartTime)

    // Generate next occurrences
    for (let i = 0; i < (pattern.maxOccurrences || 52); i++) {
      switch (pattern.frequency) {
        case "daily":
          nextDate = new Date(nextDate.getTime() + pattern.interval * 24 * 60 * 60 * 1000)
          break
        case "weekly":
          nextDate = new Date(nextDate.getTime() + pattern.interval * 7 * 24 * 60 * 60 * 1000)
          break
        case "monthly":
          nextDate = new Date(nextDate.getFullYear(), nextDate.getMonth() + pattern.interval, nextDate.getDate())
          break
      }

      if (pattern.endDate && nextDate > pattern.endDate) break

      // Create recurring broadcast
      const recurringBroadcast = {
        ...broadcast,
        id: `${broadcast.id}_recurring_${i + 1}`,
        scheduledStartTime: nextDate,
        scheduledEndTime: new Date(nextDate.getTime() + broadcast.duration * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      this.broadcasts.set(recurringBroadcast.id, recurringBroadcast)
      await this.scheduleNotifications(recurringBroadcast)
      await this.scheduleAutoStart(recurringBroadcast)
    }
  }

  private async cancelScheduledJobs(broadcastId: string): Promise<void> {
    const jobsToCancel = Array.from(this.scheduledJobs.keys()).filter((key) => key.startsWith(broadcastId))

    for (const jobKey of jobsToCancel) {
      const timeout = this.scheduledJobs.get(jobKey)
      if (timeout) {
        clearTimeout(timeout)
        this.scheduledJobs.delete(jobKey)
      }
    }
  }

  private async prepareBroadcast(broadcastId: string): Promise<void> {
    const broadcast = this.broadcasts.get(broadcastId)
    if (!broadcast) return

    broadcast.status = "preparing"
    this.broadcasts.set(broadcastId, broadcast)

    this.emit("broadcast_preparing", { broadcast })
  }

  private async sendNotification(broadcast: ScheduledBroadcast, minutesBefore: number): Promise<void> {
    const notification = {
      broadcastId: broadcast.id,
      title: `Stream starting in ${minutesBefore} minutes`,
      message:
        broadcast.notificationSettings.customMessage || `"${broadcast.title}" starts in ${minutesBefore} minutes`,
      channels: broadcast.notificationSettings.channels,
      audienceNotification: broadcast.notificationSettings.audienceNotification,
    }

    this.emit("notification_sent", { broadcast, notification, minutesBefore })
  }

  private async startPlatformStream(platform: BroadcastPlatform, rtmpUrl: string, streamKey: string): Promise<void> {
    // Platform-specific streaming logic would go here
    this.emit("platform_stream_started", { platform, rtmpUrl, streamKey })
  }

  private async stopPlatformStream(platform: BroadcastPlatform): Promise<void> {
    // Platform-specific stop logic would go here
    this.emit("platform_stream_stopped", { platform })
  }

  private async generateBroadcastAnalytics(
    broadcast: ScheduledBroadcast,
    streamMetrics: any,
  ): Promise<BroadcastAnalytics> {
    const analytics: BroadcastAnalytics = {
      broadcastId: broadcast.id,
      totalViewers: streamMetrics?.totalViews || 0,
      peakViewers: streamMetrics?.peakViewers || 0,
      averageViewTime: streamMetrics?.averageWatchTime || 0,
      chatMessages: streamMetrics?.chatMessages || 0,
      engagement: streamMetrics?.engagementRate || 0,
      platformBreakdown: {},
      audienceRetention: [],
      revenue: streamMetrics?.revenue || 0,
      donations: streamMetrics?.donations || 0,
    }

    return analytics
  }

  private getPlatformsByIds(platformIds: string[]): BroadcastPlatform[] {
    return platformIds.map((id) => this.platforms.get(id)).filter(Boolean) as BroadcastPlatform[]
  }

  private initializeDefaultPlatforms(): void {
    const defaultPlatforms: BroadcastPlatform[] = [
      {
        id: "twitch_default",
        name: "Twitch",
        platform: "twitch",
        isEnabled: true,
        settings: {},
      },
      {
        id: "youtube_default",
        name: "YouTube Live",
        platform: "youtube",
        isEnabled: true,
        settings: {},
      },
      {
        id: "facebook_default",
        name: "Facebook Live",
        platform: "facebook",
        isEnabled: false,
        settings: {},
      },
    ]

    defaultPlatforms.forEach((platform) => {
      this.platforms.set(platform.id, platform)
    })
  }

  private startScheduleMonitoring(): void {
    // Check for broadcasts that need attention every minute
    setInterval(() => {
      const now = new Date()

      this.broadcasts.forEach((broadcast) => {
        // Check for broadcasts that should have started but didn't
        if (
          broadcast.status === "scheduled" &&
          broadcast.scheduledStartTime < now &&
          broadcast.autoStartSettings.enabled &&
          broadcast.autoStartSettings.autoGoLive
        ) {
          this.handleMissedBroadcast(broadcast)
        }

        // Check for broadcasts that have been live too long
        if (
          broadcast.status === "live" &&
          broadcast.actualStartTime &&
          now.getTime() - broadcast.actualStartTime.getTime() > (broadcast.duration + 30) * 60 * 1000
        ) {
          this.handleOverrunBroadcast(broadcast)
        }
      })
    }, 60000) // Every minute
  }

  private async handleMissedBroadcast(broadcast: ScheduledBroadcast): Promise<void> {
    const action = broadcast.autoStartSettings.fallbackActions.onHostAbsent

    switch (action) {
      case "cancel":
        await this.cancelBroadcast(broadcast.id, "Host absent - auto cancelled")
        break
      case "delay":
        // Delay by 15 minutes
        broadcast.scheduledStartTime = new Date(Date.now() + 15 * 60 * 1000)
        broadcast.scheduledEndTime = new Date(broadcast.scheduledStartTime.getTime() + broadcast.duration * 60 * 1000)
        await this.updateBroadcast(broadcast.id, broadcast)
        break
      case "auto_start":
        await this.startBroadcast(broadcast.id, false)
        break
    }

    this.emit("missed_broadcast_handled", { broadcast, action })
  }

  private async handleOverrunBroadcast(broadcast: ScheduledBroadcast): Promise<void> {
    this.emit("broadcast_overrun", { broadcast })

    if (broadcast.autoStartSettings.autoEndAfterDuration) {
      await this.endBroadcast(broadcast.id, true)
    }
  }
}

export const broadcastScheduler = new BroadcastScheduler()
