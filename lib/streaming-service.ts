import { sql } from "@/lib/database"
import type { StreamConfig, StreamStatus, ChatMessage } from "./streaming-types"

export class StreamingService {
  private static instance: StreamingService

  static getInstance(): StreamingService {
    if (!StreamingService.instance) {
      StreamingService.instance = new StreamingService()
    }
    return StreamingService.instance
  }

  async createStream(userId: string, config: StreamConfig): Promise<StreamStatus | null> {
    try {
      // Generate stream key and URLs
      const streamKey = this.generateStreamKey()
      const rtmpUrl = `rtmp://live.runash.in/live/${streamKey}`
      const hlsUrl = `https://live.runash.in/hls/${streamKey}/index.m3u8`

      const streamData = {
        user_id: userId,
        title: config.title,
        description: config.description,
        category: config.category,
        tags: config.tags,
        thumbnail_url: config.thumbnail,
        privacy: config.privacy,
        chat_enabled: config.chatEnabled,
        recording_enabled: config.recordingEnabled,
        quality: config.quality,
        bitrate: config.bitrate,
        frame_rate: config.frameRate,
        audio_quality: config.audioQuality,
        scheduled_for: config.scheduledFor?.toISOString(),
        max_duration: config.maxDuration,
        stream_key: streamKey,
        rtmp_url: rtmpUrl,
        hls_url: hlsUrl,
        status: "idle",
        viewer_count: 0,
        duration: 0,
      }

      const result = await sql`
        INSERT INTO streams ${sql(streamData)}
        RETURNING *
      `

      return {
        id: result[0].id,
        status: result[0].status,
        viewerCount: result[0].viewer_count,
        duration: result[0].duration,
        streamKey: result[0].stream_key,
        rtmpUrl: result[0].rtmp_url,
        hlsUrl: result[0].hls_url,
      }
    } catch (error) {
      console.error("Error creating stream:", error)
      return null
    }
  }

  async startStream(streamId: string, userId: string): Promise<boolean> {
    try {
      const result = await sql`
        UPDATE streams 
        SET status = 'starting', start_time = NOW(), updated_at = NOW()
        WHERE id = ${streamId} AND user_id = ${userId}
        RETURNING *
      `

      if (result.length === 0) return false

      // Simulate stream startup process
      setTimeout(async () => {
        await sql`
          UPDATE streams 
          SET status = 'live', updated_at = NOW()
          WHERE id = ${streamId}
        `

        // Send notification to followers
        await this.notifyFollowers(userId, streamId)
      }, 3000)

      return true
    } catch (error) {
      console.error("Error starting stream:", error)
      return false
    }
  }

  async endStream(streamId: string, userId: string): Promise<boolean> {
    try {
      const result = await sql`
        UPDATE streams 
        SET status = 'ending', end_time = NOW(), updated_at = NOW()
        WHERE id = ${streamId} AND user_id = ${userId} AND status IN ('live', 'paused')
        RETURNING *
      `

      if (result.length === 0) return false

      // Calculate final duration
      const stream = result[0]
      const duration = stream.end_time - stream.start_time

      setTimeout(async () => {
        await sql`
          UPDATE streams 
          SET status = 'ended', duration = ${duration}, updated_at = NOW()
          WHERE id = ${streamId}
        `

        // Generate analytics
        await this.generateStreamAnalytics(streamId)
      }, 2000)

      return true
    } catch (error) {
      console.error("Error ending stream:", error)
      return false
    }
  }

  async getStreamStatus(streamId: string): Promise<StreamStatus | null> {
    try {
      const result = await sql`
        SELECT * FROM streams WHERE id = ${streamId}
      `

      if (result.length === 0) return null

      const stream = result[0]
      return {
        id: stream.id,
        status: stream.status,
        viewerCount: stream.viewer_count,
        duration: stream.duration,
        startTime: stream.start_time,
        endTime: stream.end_time,
        streamKey: stream.stream_key,
        rtmpUrl: stream.rtmp_url,
        hlsUrl: stream.hls_url,
        recordingUrl: stream.recording_url,
      }
    } catch (error) {
      console.error("Error getting stream status:", error)
      return null
    }
  }

  async getUserStreams(userId: string, limit = 10): Promise<StreamStatus[]> {
    try {
      const result = await sql`
        SELECT * FROM streams 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `

      return result.map((stream) => ({
        id: stream.id,
        status: stream.status,
        viewerCount: stream.viewer_count,
        duration: stream.duration,
        startTime: stream.start_time,
        endTime: stream.end_time,
        streamKey: stream.stream_key,
        rtmpUrl: stream.rtmp_url,
        hlsUrl: stream.hls_url,
        recordingUrl: stream.recording_url,
      }))
    } catch (error) {
      console.error("Error getting user streams:", error)
      return []
    }
  }

  async updateViewerCount(streamId: string, count: number): Promise<void> {
    try {
      await sql`
        UPDATE streams 
        SET viewer_count = ${count}, updated_at = NOW()
        WHERE id = ${streamId}
      `
    } catch (error) {
      console.error("Error updating viewer count:", error)
    }
  }

  async sendChatMessage(streamId: string, userId: string, message: string): Promise<ChatMessage | null> {
    try {
      const chatData = {
        stream_id: streamId,
        user_id: userId,
        message: message,
        type: "message",
        metadata: {},
      }

      const result = await sql`
        INSERT INTO stream_chat ${sql(chatData)}
        RETURNING *
      `

      // Get user info
      const user = await sql`
        SELECT username, name FROM users WHERE id = ${userId}
      `

      return {
        id: result[0].id,
        userId: result[0].user_id,
        username: user[0]?.username || user[0]?.name || "Anonymous",
        message: result[0].message,
        timestamp: result[0].created_at,
        type: result[0].type,
        metadata: result[0].metadata,
      }
    } catch (error) {
      console.error("Error sending chat message:", error)
      return null
    }
  }

  private generateStreamKey(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  private async notifyFollowers(userId: string, streamId: string): Promise<void> {
    try {
      // Get user's followers
      const followers = await sql`
        SELECT follower_id FROM user_followers WHERE user_id = ${userId}
      `

      // Send notifications (simplified)
      for (const follower of followers) {
        await sql`
          INSERT INTO notifications (user_id, type, title, message, metadata)
          VALUES (
            ${follower.follower_id},
            'stream_live',
            'Stream Started',
            'A streamer you follow just went live!',
            ${JSON.stringify({ streamId, userId })}
          )
        `
      }
    } catch (error) {
      console.error("Error notifying followers:", error)
    }
  }

  private async generateStreamAnalytics(streamId: string): Promise<void> {
    try {
      // Get stream data
      const stream = await sql`
        SELECT * FROM streams WHERE id = ${streamId}
      `

      if (stream.length === 0) return

      // Calculate analytics
      const analytics = {
        stream_id: streamId,
        peak_viewers: stream[0].viewer_count, // This would be tracked during the stream
        average_viewers: Math.floor(stream[0].viewer_count * 0.7), // Simplified calculation
        total_views: stream[0].viewer_count * 2, // Simplified
        chat_messages: 0, // Would be calculated from chat
        likes: 0,
        shares: 0,
        donations: 0,
        new_followers: 0,
        watch_time: stream[0].duration,
        engagement: 0.85, // Simplified calculation
      }

      await sql`
        INSERT INTO stream_analytics ${sql(analytics)}
      `
    } catch (error) {
      console.error("Error generating stream analytics:", error)
    }
  }
}

export const streamingService = StreamingService.getInstance()
