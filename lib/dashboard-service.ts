import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface DashboardStats {
  totalViews: number
  followers: number
  liveStreams: number
  revenue: number
  trends: {
    views: number
    followers: number
    streams: number
    revenue: number
  }
}

export interface RecentStream {
  id: string
  title: string
  date: string
  duration: string
  viewers: number
  status: "live" | "ended" | "scheduled"
  thumbnail_url?: string
}

export interface Activity {
  id: string
  user: {
    name: string
    avatar?: string
  }
  action: string
  target?: string
  time: string
  type: "comment" | "follow" | "subscription" | "donation"
}

export interface Achievement {
  title: string
  description: string
  unlocked: boolean
  progress?: number
}

export interface MonthlyGoal {
  name: string
  current: number
  target: number
  unit: string
}

export class DashboardService {
  static async getDashboardStats(userId: number): Promise<DashboardStats> {
    try {
      // Get total views from stream analytics
      const viewsResult = await sql`
        SELECT COALESCE(SUM(sa.total_views), 0) as total_views
        FROM stream_analytics sa
        JOIN streams s ON s.id = sa.stream_id
        WHERE s.user_id = ${userId}
      `

      // Get follower count
      const followersResult = await sql`
        SELECT COUNT(*) as followers
        FROM user_followers
        WHERE user_id = ${userId}
      `

      // Get live streams count this month
      const liveStreamsResult = await sql`
        SELECT COUNT(*) as live_streams
        FROM streams
        WHERE user_id = ${userId}
        AND created_at >= date_trunc('month', CURRENT_DATE)
      `

      // Get revenue from payment transactions
      const revenueResult = await sql`
        SELECT COALESCE(SUM(pt.amount), 0) as revenue
        FROM payment_transactions pt
        WHERE pt.user_id = ${userId}
        AND pt.status = 'succeeded'
        AND pt.created_at >= date_trunc('month', CURRENT_DATE)
      `

      // Get previous month data for trends
      const prevViewsResult = await sql`
        SELECT COALESCE(SUM(sa.total_views), 0) as prev_views
        FROM stream_analytics sa
        JOIN streams s ON s.id = sa.stream_id
        WHERE s.user_id = ${userId}
        AND s.created_at >= date_trunc('month', CURRENT_DATE - interval '1 month')
        AND s.created_at < date_trunc('month', CURRENT_DATE)
      `

      const prevFollowersResult = await sql`
        SELECT COUNT(*) as prev_followers
        FROM user_followers
        WHERE user_id = ${userId}
        AND created_at < date_trunc('month', CURRENT_DATE)
      `

      const prevStreamsResult = await sql`
        SELECT COUNT(*) as prev_streams
        FROM streams
        WHERE user_id = ${userId}
        AND created_at >= date_trunc('month', CURRENT_DATE - interval '1 month')
        AND created_at < date_trunc('month', CURRENT_DATE)
      `

      const prevRevenueResult = await sql`
        SELECT COALESCE(SUM(pt.amount), 0) as prev_revenue
        FROM payment_transactions pt
        WHERE pt.user_id = ${userId}
        AND pt.status = 'succeeded'
        AND pt.created_at >= date_trunc('month', CURRENT_DATE - interval '1 month')
        AND pt.created_at < date_trunc('month', CURRENT_DATE)
      `

      const totalViews = Number(viewsResult[0]?.total_views || 0)
      const followers = Number(followersResult[0]?.followers || 0)
      const liveStreams = Number(liveStreamsResult[0]?.live_streams || 0)
      const revenue = Number(revenueResult[0]?.revenue || 0)

      const prevViews = Number(prevViewsResult[0]?.prev_views || 0)
      const prevFollowers = Number(prevFollowersResult[0]?.prev_followers || 0)
      const prevStreams = Number(prevStreamsResult[0]?.prev_streams || 0)
      const prevRevenue = Number(prevRevenueResult[0]?.prev_revenue || 0)

      return {
        totalViews,
        followers,
        liveStreams,
        revenue,
        trends: {
          views: prevViews > 0 ? ((totalViews - prevViews) / prevViews) * 100 : 0,
          followers: prevFollowers > 0 ? ((followers - prevFollowers) / prevFollowers) * 100 : 0,
          streams: prevStreams > 0 ? ((liveStreams - prevStreams) / prevStreams) * 100 : 0,
          revenue: prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0,
        },
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      throw error
    }
  }

  static async getRecentStreams(userId: number, limit = 6): Promise<RecentStream[]> {
    try {
      const result = await sql`
        SELECT 
          s.id,
          s.title,
          s.created_at,
          s.duration,
          s.viewer_count,
          s.status,
          s.thumbnail_url,
          CASE 
            WHEN s.status = 'live' THEN 'live'
            WHEN s.status = 'scheduled' THEN 'scheduled'
            ELSE 'ended'
          END as stream_status
        FROM streams s
        WHERE s.user_id = ${userId}
        ORDER BY s.created_at DESC
        LIMIT ${limit}
      `

      return result.map((stream: any) => ({
        id: stream.id.toString(),
        title: stream.title || "Untitled Stream",
        date: this.formatDate(stream.created_at),
        duration: this.formatDuration(stream.duration || 0),
        viewers: stream.viewer_count || 0,
        status: stream.stream_status,
        thumbnail_url: stream.thumbnail_url,
      }))
    } catch (error) {
      console.error("Error fetching recent streams:", error)
      return []
    }
  }

  static async getRecentActivity(userId: number, limit = 10): Promise<Activity[]> {
    try {
      const result = await sql`
        SELECT 
          ua.id,
          u.name,
          u.avatar_url,
          ua.action,
          ua.resource_type,
          ua.resource_id,
          ua.created_at,
          ua.metadata
        FROM user_activity ua
        JOIN users u ON u.id = ua.user_id
        WHERE ua.resource_type IN ('stream', 'follow', 'comment', 'donation')
        AND (ua.metadata->>'target_user_id')::int = ${userId}
        ORDER BY ua.created_at DESC
        LIMIT ${limit}
      `

      return result.map((activity: any) => ({
        id: activity.id.toString(),
        user: {
          name: activity.name || "Anonymous User",
          avatar: activity.avatar_url,
        },
        action: this.formatAction(activity.action, activity.resource_type),
        target: activity.metadata?.target_name || "",
        time: this.formatTimeAgo(activity.created_at),
        type: this.mapActivityType(activity.action, activity.resource_type),
      }))
    } catch (error) {
      console.error("Error fetching recent activity:", error)
      return []
    }
  }

  static async getAchievements(userId: number): Promise<Achievement[]> {
    try {
      const stats = await this.getDashboardStats(userId)
      const streams = await sql`
        SELECT COUNT(*) as stream_count, COALESCE(SUM(duration), 0) as total_duration
        FROM streams
        WHERE user_id = ${userId} AND status = 'ended'
      `

      const streamCount = Number(streams[0]?.stream_count || 0)
      const totalHours = Math.floor(Number(streams[0]?.total_duration || 0) / 3600)

      return [
        {
          title: "First Stream",
          description: "Completed your first live stream",
          unlocked: streamCount > 0,
        },
        {
          title: "100 Followers",
          description: "Reached 100 followers",
          unlocked: stats.followers >= 100,
          progress: Math.min((stats.followers / 100) * 100, 100),
        },
        {
          title: "Viral Content",
          description: "Stream reached 10K views",
          unlocked: stats.totalViews >= 10000,
          progress: Math.min((stats.totalViews / 10000) * 100, 100),
        },
        {
          title: "Super Streamer",
          description: "Stream for 100 hours total",
          unlocked: totalHours >= 100,
          progress: Math.min((totalHours / 100) * 100, 100),
        },
      ]
    } catch (error) {
      console.error("Error fetching achievements:", error)
      return []
    }
  }

  static async getMonthlyGoals(userId: number): Promise<MonthlyGoal[]> {
    try {
      // Get current month streaming hours
      const hoursResult = await sql`
        SELECT COALESCE(SUM(duration), 0) / 3600 as hours
        FROM streams
        WHERE user_id = ${userId}
        AND created_at >= date_trunc('month', CURRENT_DATE)
        AND status = 'ended'
      `

      // Get new followers this month
      const followersResult = await sql`
        SELECT COUNT(*) as new_followers
        FROM user_followers
        WHERE user_id = ${userId}
        AND created_at >= date_trunc('month', CURRENT_DATE)
      `

      // Get revenue this month
      const revenueResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as revenue
        FROM payment_transactions
        WHERE user_id = ${userId}
        AND status = 'succeeded'
        AND created_at >= date_trunc('month', CURRENT_DATE)
      `

      return [
        {
          name: "Streaming Hours",
          current: Math.floor(Number(hoursResult[0]?.hours || 0)),
          target: 60,
          unit: "hours",
        },
        {
          name: "New Followers",
          current: Number(followersResult[0]?.new_followers || 0),
          target: 300,
          unit: "followers",
        },
        {
          name: "Revenue Goal",
          current: Number(revenueResult[0]?.revenue || 0),
          target: 2000,
          unit: "$",
        },
      ]
    } catch (error) {
      console.error("Error fetching monthly goals:", error)
      return []
    }
  }

  private static formatDate(date: string): string {
    const now = new Date()
    const streamDate = new Date(date)
    const diffTime = Math.abs(now.getTime() - streamDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    return streamDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  private static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  private static formatTimeAgo(date: string): string {
    const now = new Date()
    const activityDate = new Date(date)
    const diffTime = Math.abs(now.getTime() - activityDate.getTime())
    const diffMinutes = Math.floor(diffTime / (1000 * 60))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffMinutes < 60) return `${diffMinutes} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  private static formatAction(action: string, resourceType: string): string {
    switch (action) {
      case "create":
        return resourceType === "comment" ? "commented on your stream" : "created"
      case "follow":
        return "followed you"
      case "subscribe":
        return "subscribed to your channel"
      case "donate":
        return "donated to your stream"
      default:
        return action
    }
  }

  private static mapActivityType(action: string, resourceType: string): Activity["type"] {
    if (action === "create" && resourceType === "comment") return "comment"
    if (action === "follow") return "follow"
    if (action === "subscribe") return "subscription"
    if (action === "donate") return "donation"
    return "comment"
  }
}
