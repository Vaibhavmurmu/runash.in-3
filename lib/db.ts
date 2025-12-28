import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Type definitions for core tables
export interface User {
  id: number
  email: string
  username: string
  name: string | null
  password_hash: string | null
  avatar_url: string | null
  bio: string | null
  website: string | null
  location: string | null
  role: string
  provider: string | null
  provider_id: string | null
  email_verified: boolean
  email_verified_at: Date | null
  pending_email: string | null
  created_at: Date
  updated_at: Date
}

export interface UserSession {
  id: number
  user_id: number
  session_token: string
  expires_at: Date
  created_at: Date
}

export interface Product {
  id: number
  user_id: number
  name: string
  description: string | null
  price: number
  stock: number
  sales: number
  category: string | null
  image: string | null
  rating: number | null
  status: string
  created_at: Date
  updated_at: Date
}

export interface Order {
  id: number
  user_id: number
  total: number
  status: string
  payment_method: string | null
  shipping_address: string | null
  buyer_name: string | null
  buyer_email: string | null
  buyer_phone: string | null
  created_at: Date
  updated_at: Date
}

export interface Stream {
  id: number
  user_id: number
  title: string
  description: string | null
  category: string | null
  status: string
  privacy: string | null
  stream_key: string | null
  rtmp_url: string | null
  hls_url: string | null
  thumbnail_url: string | null
  viewer_count: number | null
  chat_enabled: boolean | null
  recording_enabled: boolean | null
  recording_url: string | null
  scheduled_for: Date | null
  start_time: Date | null
  end_time: Date | null
  duration: number | null
  max_duration: number | null
  quality: string | null
  bitrate: number | null
  frame_rate: number | null
  audio_quality: string | null
  tags: string[] | null
  created_at: Date
  updated_at: Date
}

export interface ContentItem {
  id: number
  user_id: number
  title: string
  description: string | null
  type: string
  category: string | null
  file_url: string | null
  thumbnail_url: string | null
  file_size: bigint | null
  duration: number | null
  status: string
  visibility: string | null
  moderation_status: string | null
  moderation_notes: string | null
  view_count: number | null
  like_count: number | null
  comment_count: number | null
  tags: string[] | null
  published_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface SubscriptionPlan {
  id: number
  name: string
  description: string | null
  price_monthly: number | null
  price_yearly: number | null
  features: Record<string, any> | null
  limits: Record<string, any> | null
  is_active: boolean | null
  created_at: Date
  updated_at: Date
}

export interface UserSubscription {
  id: number
  user_id: number
  plan_id: number
  stripe_subscription_id: string | null
  status: string
  billing_cycle: string | null
  current_period_start: Date | null
  current_period_end: Date | null
  cancel_at_period_end: boolean | null
  canceled_at: Date | null
  created_at: Date
  updated_at: Date
}

// Database helper functions
export class DatabaseError extends Error {
  constructor(
    message: string,
    public cause?: unknown,
  ) {
    super(message)
    this.name = "DatabaseError"
  }
}

/**
 * Execute a database query with error handling
 */
export async function executeQuery<T>(queryFn: () => Promise<T>, errorMessage: string): Promise<T> {
  try {
    return await queryFn()
  } catch (error) {
    console.error(`[v0] Database error: ${errorMessage}`, error)
    throw new DatabaseError(errorMessage, error)
  }
}

/**
 * Get a user by ID
 */
export async function getUserById(id: number): Promise<User | null> {
  return executeQuery(async () => {
    const result = await sql<User[]>`
      SELECT * FROM users WHERE id = ${id} LIMIT 1
    `
    return result[0] || null
  }, `Failed to fetch user with id: ${id}`)
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return executeQuery(async () => {
    const result = await sql<User[]>`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `
    return result[0] || null
  }, `Failed to fetch user with email: ${email}`)
}

/**
 * Get a user by username
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  return executeQuery(async () => {
    const result = await sql<User[]>`
      SELECT * FROM users WHERE username = ${username} LIMIT 1
    `
    return result[0] || null
  }, `Failed to fetch user with username: ${username}`)
}

/**
 * Get active subscription plans
 */
export async function getActiveSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  return executeQuery(async () => {
    return await sql<SubscriptionPlan[]>`
      SELECT * FROM subscription_plans WHERE is_active = true ORDER BY price_monthly ASC
    `
  }, "Failed to fetch active subscription plans")
}

/**
 * Get user's active subscription
 */
export async function getUserSubscription(userId: number): Promise<UserSubscription | null> {
  return executeQuery(async () => {
    const result = await sql<UserSubscription[]>`
      SELECT * FROM user_subscriptions 
      WHERE user_id = ${userId} AND status = 'active' 
      LIMIT 1
    `
    return result[0] || null
  }, `Failed to fetch subscription for user: ${userId}`)
}

/**
 * Get products with pagination
 */
export async function getProducts(limit = 20, offset = 0, category?: string): Promise<Product[]> {
  "use cache"
  return executeQuery(async () => {
    if (category) {
      return await sql<Product[]>`
        SELECT * FROM products 
        WHERE status = 'active' AND category = ${category}
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    }
    return await sql<Product[]>`
      SELECT * FROM products 
      WHERE status = 'active'
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `
  }, "Failed to fetch products")
}

/**
 * Get live streams
 */
export async function getLiveStreams(limit = 10): Promise<Stream[]> {
  return executeQuery(async () => {
    return await sql<Stream[]>`
      SELECT * FROM streams 
      WHERE status = 'live' 
      ORDER BY viewer_count DESC, start_time DESC 
      LIMIT ${limit}
    `
  }, "Failed to fetch live streams")
}

/**
 * Get content items with pagination
 */
export async function getContentItems(limit = 20, offset = 0, type?: string): Promise<ContentItem[]> {
  return executeQuery(async () => {
    if (type) {
      return await sql<ContentItem[]>`
        SELECT * FROM content_items 
        WHERE status = 'published' AND visibility = 'public' AND type = ${type}
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    }
    return await sql<ContentItem[]>`
      SELECT * FROM content_items 
      WHERE status = 'published' AND visibility = 'public'
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `
  }, "Failed to fetch content items")
}
