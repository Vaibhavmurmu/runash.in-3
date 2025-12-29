import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "7d"
    const streamId = searchParams.get("streamId")

    let dateFilter = ""
    switch (period) {
      case "24h":
        dateFilter = "created_at >= NOW() - INTERVAL '24 hours'"
        break
      case "7d":
        dateFilter = "created_at >= NOW() - INTERVAL '7 days'"
        break
      case "30d":
        dateFilter = "created_at >= NOW() - INTERVAL '30 days'"
        break
      default:
        dateFilter = "created_at >= NOW() - INTERVAL '7 days'"
    }

    // Get stream analytics
    const streamAnalytics = await sql`
      SELECT 
        COUNT(*) as total_streams,
        AVG(viewer_count) as avg_viewers,
        SUM(viewer_count) as total_views,
        COUNT(CASE WHEN status = 'live' THEN 1 END) as live_streams
      FROM streams 
      WHERE user_id = ${session.user.id} 
      AND ${sql.unsafe(dateFilter)}
    `

    // Get chat analytics
    const chatAnalytics = await sql`
      SELECT 
        COUNT(*) as total_messages,
        COUNT(DISTINCT user_id) as unique_chatters,
        COUNT(CASE WHEN message_type = 'donation' THEN 1 END) as donations,
        COUNT(CASE WHEN message_type = 'follow' THEN 1 END) as new_followers
      FROM chat_messages cm
      JOIN streams s ON cm.stream_id = s.id
      WHERE s.user_id = ${session.user.id}
      AND cm.${sql.unsafe(dateFilter)}
    `

    // Get recording analytics
    const recordingAnalytics = await sql`
      SELECT 
        COUNT(*) as total_recordings,
        SUM(duration) as total_duration,
        AVG(duration) as avg_duration,
        SUM(file_size) as total_storage
      FROM recordings r
      JOIN streams s ON r.stream_id = s.id
      WHERE s.user_id = ${session.user.id}
      AND r.${sql.unsafe(dateFilter)}
    `

    // Get daily breakdown
    const dailyBreakdown = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as streams,
        AVG(viewer_count) as avg_viewers
      FROM streams
      WHERE user_id = ${session.user.id}
      AND ${sql.unsafe(dateFilter)}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `

    return NextResponse.json({
      streams: streamAnalytics[0],
      chat: chatAnalytics[0],
      recordings: recordingAnalytics[0],
      daily: dailyBreakdown,
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
