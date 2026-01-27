import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface ChatMessage {
  id: string
  streamId: string
  userId: string
  username: string
  message: string
  timestamp: Date
  platform: string
  type: "message" | "donation" | "follow" | "subscription"
  metadata: Record<string, any>
}

export interface StreamRecord {
  id: string
  userId: string
  title: string
  description?: string
  status: "live" | "ended" | "scheduled"
  startTime: Date
  endTime?: Date
  viewerCount: number
  recordingUrl?: string
  thumbnailUrl?: string
  platforms: string[]
  metadata: Record<string, any>
}

export interface RecordingRecord {
  id: string
  streamId: string
  userId: string
  title: string
  duration: number
  fileSize: number
  quality: string
  format: string
  storageKey: string
  thumbnailKey?: string
  createdAt: Date
  isPublic: boolean
  viewCount: number
}

export interface Stream {
  id: string
  title: string
  description: string
  user_id: string
  status: "scheduled" | "live" | "ended"
  platform: string
  stream_key: string
  viewer_count: number
  created_at: Date
  started_at?: Date
  ended_at?: Date
}

export interface Recording {
  id: string
  stream_id: string
  file_url: string
  thumbnail_url?: string
  duration: number
  file_size: number
  created_at: Date
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  inStock: boolean
  isOrganic: boolean
  isLocal: boolean
  sustainabilityScore: number
  nutritionalInfo: {
    calories: number
    protein: number
    carbohydrates: number
    fat: number
    fiber: number
    sugar: number
  }
  certifications: string[]
  supplier: string
  carbonFootprint: number
  rating: number
  reviewCount: number
  tags: string[]
  variants?: Array<{
    id: string
    name: string
    price: number
    inStock: boolean
  }>
}

export interface DatabaseFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  isOrganic?: boolean
  isLocal?: boolean
  inStock?: boolean
  search?: string
  sortBy?: "name" | "price" | "rating" | "popularity"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export class DatabaseService {
  static async saveChatMessage(messageData: Omit<ChatMessage, "id">): Promise<ChatMessage> {
    const result = await sql`
      INSERT INTO chat_messages (stream_id, user_id, username, message, timestamp, platform, type, metadata)
      VALUES (${messageData.streamId}, ${messageData.userId}, ${messageData.username}, 
              ${messageData.message}, ${messageData.timestamp.toISOString()}, 
              ${messageData.platform}, ${messageData.type}, ${JSON.stringify(messageData.metadata)})
      RETURNING *
    `

    return {
      id: result[0].id,
      streamId: result[0].stream_id,
      userId: result[0].user_id,
      username: result[0].username,
      message: result[0].message,
      timestamp: new Date(result[0].timestamp),
      platform: result[0].platform,
      type: result[0].type,
      metadata: result[0].metadata,
    }
  }

  static async getChatMessages(streamId: string, limit = 50, offset = 0): Promise<ChatMessage[]> {
    const result = await sql`
      SELECT * FROM chat_messages 
      WHERE stream_id = ${streamId}
      ORDER BY timestamp DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    return result.map((row) => ({
      id: row.id,
      streamId: row.stream_id,
      userId: row.user_id,
      username: row.username,
      message: row.message,
      timestamp: new Date(row.timestamp),
      platform: row.platform,
      type: row.type,
      metadata: row.metadata,
    }))
  }

  static async createStream(streamData: Omit<StreamRecord, "id">): Promise<StreamRecord> {
    const result = await sql`
      INSERT INTO streams (user_id, title, description, status, start_time, viewer_count, platforms, metadata)
      VALUES (${streamData.userId}, ${streamData.title}, ${streamData.description}, 
              ${streamData.status}, ${streamData.startTime.toISOString()}, 
              ${streamData.viewerCount}, ${JSON.stringify(streamData.platforms)}, 
              ${JSON.stringify(streamData.metadata)})
      RETURNING *
    `

    return {
      id: result[0].id,
      userId: result[0].user_id,
      title: result[0].title,
      description: result[0].description,
      status: result[0].status,
      startTime: new Date(result[0].start_time),
      endTime: result[0].end_time ? new Date(result[0].end_time) : undefined,
      viewerCount: result[0].viewer_count,
      recordingUrl: result[0].recording_url,
      thumbnailUrl: result[0].thumbnail_url,
      platforms: result[0].platforms,
      metadata: result[0].metadata,
    }
  }

  static async updateStream(streamId: string, updates: Partial<StreamRecord>): Promise<void> {
    const setClause = Object.entries(updates)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _]) => {
        const dbKey = key.replace(/([A-Z])/g, "_$1").toLowerCase()
        return `${dbKey} = $${dbKey}`
      })
      .join(", ")

    if (setClause) {
      await sql`UPDATE streams SET ${sql.unsafe(setClause)} WHERE id = ${streamId}`
    }
  }

  static async getStream(streamId: string): Promise<StreamRecord | null> {
    const result = await sql`
      SELECT * FROM streams WHERE id = ${streamId}
    `

    if (result.length === 0) return null

    const row = result[0]
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      status: row.status,
      startTime: new Date(row.start_time),
      endTime: row.end_time ? new Date(row.end_time) : undefined,
      viewerCount: row.viewer_count,
      recordingUrl: row.recording_url,
      thumbnailUrl: row.thumbnail_url,
      platforms: row.platforms,
      metadata: row.metadata,
    }
  }

  static async getUserStreams(userId: string, limit = 20): Promise<StreamRecord[]> {
    const result = await sql`
      SELECT * FROM streams 
      WHERE user_id = ${userId}
      ORDER BY start_time DESC
      LIMIT ${limit}
    `

    return result.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      status: row.status,
      startTime: new Date(row.start_time),
      endTime: row.end_time ? new Date(row.end_time) : undefined,
      viewerCount: row.viewer_count,
      recordingUrl: row.recording_url,
      thumbnailUrl: row.thumbnail_url,
      platforms: row.platforms,
      metadata: row.metadata,
    }))
  }

  static async saveRecording(
    recordingData: Omit<RecordingRecord, "id" | "createdAt" | "viewCount">,
  ): Promise<RecordingRecord> {
    const result = await sql`
      INSERT INTO recordings (stream_id, user_id, title, duration, file_size, quality, format, 
                             storage_key, thumbnail_key, is_public)
      VALUES (${recordingData.streamId}, ${recordingData.userId}, ${recordingData.title}, 
              ${recordingData.duration}, ${recordingData.fileSize}, ${recordingData.quality}, 
              ${recordingData.format}, ${recordingData.storageKey}, ${recordingData.thumbnailKey}, 
              ${recordingData.isPublic})
      RETURNING *
    `

    return {
      id: result[0].id,
      streamId: result[0].stream_id,
      userId: result[0].user_id,
      title: result[0].title,
      duration: result[0].duration,
      fileSize: result[0].file_size,
      quality: result[0].quality,
      format: result[0].format,
      storageKey: result[0].storage_key,
      thumbnailKey: result[0].thumbnail_key,
      createdAt: new Date(result[0].created_at),
      isPublic: result[0].is_public,
      viewCount: result[0].view_count || 0,
    }
  }

  static async getRecordings(userId?: string, isPublic?: boolean): Promise<RecordingRecord[]> {
    let query = "SELECT * FROM recordings WHERE 1=1"
    const params: any[] = []

    if (userId) {
      query += ` AND user_id = $${params.length + 1}`
      params.push(userId)
    }

    if (isPublic !== undefined) {
      query += ` AND is_public = $${params.length + 1}`
      params.push(isPublic)
    }

    query += " ORDER BY created_at DESC"

    const result = await sql.unsafe(query, params)

    return result.map((row) => ({
      id: row.id,
      streamId: row.stream_id,
      userId: row.user_id,
      title: row.title,
      duration: row.duration,
      fileSize: row.file_size,
      quality: row.quality,
      format: row.format,
      storageKey: row.storage_key,
      thumbnailKey: row.thumbnail_key,
      createdAt: new Date(row.created_at),
      isPublic: row.is_public,
      viewCount: row.view_count || 0,
    }))
  }

  static async incrementRecordingViews(recordingId: string): Promise<void> {
    await sql`
      UPDATE recordings 
      SET view_count = COALESCE(view_count, 0) + 1 
      WHERE id = ${recordingId}
    `
  }

  static async searchProducts(query: string, limit = 5): Promise<Product[]> {
    const result = await sql`
      SELECT * FROM grocery_products 
      WHERE name ILIKE ${`%${query}%`} OR description ILIKE ${`%${query}%`}
      ORDER BY sustainability_score DESC
      LIMIT ${limit}
    `

    return result.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      category: row.category,
      image: row.images?.[0] || "/placeholder.svg",
      inStock: row.in_stock,
      isOrganic: row.is_organic,
      isLocal: !!row.origin,
      sustainabilityScore: Number(row.sustainability_score),
      nutritionalInfo: row.farm_info?.nutritionalInfo || {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
      },
      certifications: row.certifications || [],
      supplier: row.brand || "Unknown",
      carbonFootprint: Number(row.carbon_footprint || 0),
      rating: Number(row.average_rating || 0),
      reviewCount: row.total_reviews || 0,
      tags: row.tags || [],
    }))
  }

  static async getSustainabilityTips(category?: string, limit = 3): Promise<any[]> {
    // This could be from a dedicated tips table or hardcoded for now
    const tips = [
      {
        id: "1",
        title: "Compost Scraps",
        description: "Turn your kitchen waste into nutrient-rich soil.",
        category: "waste",
        impact: "high",
        difficulty: "easy",
        estimatedSavings: 15,
      },
      {
        id: "2",
        title: "LED Lighting",
        description: "Switch to LED bulbs to save energy and money.",
        category: "energy",
        impact: "medium",
        difficulty: "easy",
        estimatedSavings: 25,
      },
    ]

    return category ? tips.filter((t) => t.category === category).slice(0, limit) : tips.slice(0, limit)
  }
}

// Legacy Database class for backward compatibility
export class Database {
  static async createStream(data: Omit<Stream, "id" | "created_at">): Promise<Stream> {
    const result = await sql`
      INSERT INTO streams (title, description, user_id, status, platform, stream_key, viewer_count)
      VALUES (${data.title}, ${data.description}, ${data.user_id}, ${data.status}, ${data.platform}, ${data.stream_key}, ${data.viewer_count})
      RETURNING *
    `
    return result[0] as Stream
  }

  static async getStream(id: string): Promise<Stream | null> {
    const result = await sql`
      SELECT * FROM streams WHERE id = ${id}
    `
    return (result[0] as Stream) || null
  }

  static async updateStream(id: string, data: Partial<Stream>): Promise<Stream> {
    const setClause = Object.keys(data)
      .map((key) => `${key} = $${Object.keys(data).indexOf(key) + 2}`)
      .join(", ")

    const values = [id, ...Object.values(data)]

    const result = await sql`
      UPDATE streams 
      SET ${sql.unsafe(setClause)}
      WHERE id = $1
      RETURNING *
    `.apply(null, values)

    return result[0] as Stream
  }

  static async getUserStreams(userId: string): Promise<Stream[]> {
    const result = await sql`
      SELECT * FROM streams 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
    return result as Stream[]
  }

  static async createRecording(data: Omit<Recording, "id" | "created_at">): Promise<Recording> {
    const result = await sql`
      INSERT INTO recordings (stream_id, file_url, thumbnail_url, duration, file_size)
      VALUES (${data.stream_id}, ${data.file_url}, ${data.thumbnail_url}, ${data.duration}, ${data.file_size})
      RETURNING *
    `
    return result[0] as Recording
  }

  static async getRecordings(streamId: string): Promise<Recording[]> {
    const result = await sql`
      SELECT * FROM recordings 
      WHERE stream_id = ${streamId}
      ORDER BY created_at DESC
    `
    return result as Recording[]
  }

  static async saveChatMessage(data: Omit<ChatMessage, "id" | "timestamp">): Promise<ChatMessage> {
    const result = await sql`
      INSERT INTO chat_messages (stream_id, user_id, username, message, type, platform, metadata)
      VALUES (${data.streamId}, ${data.userId}, ${data.username}, ${data.message}, ${data.type}, ${data.platform}, ${JSON.stringify(data.metadata)})
      RETURNING *
    `
    return {
      id: result[0].id,
      streamId: result[0].stream_id,
      userId: result[0].user_id,
      username: result[0].username,
      message: result[0].message,
      timestamp: new Date(result[0].timestamp),
      platform: result[0].platform,
      type: result[0].type,
      metadata: result[0].metadata,
    }
  }

  static async getChatMessages(streamId: string, limit = 100): Promise<ChatMessage[]> {
    const result = await sql`
      SELECT * FROM chat_messages 
      WHERE stream_id = ${streamId}
      ORDER BY timestamp DESC
      LIMIT ${limit}
    `
    return result.map((row) => ({
      id: row.id,
      streamId: row.stream_id,
      userId: row.user_id,
      username: row.username,
      message: row.message,
      timestamp: new Date(row.timestamp),
      platform: row.platform,
      type: row.type,
      metadata: row.metadata,
    }))
  }
}
