import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { DatabaseService } from "@/lib/database"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const streamId = searchParams.get("streamId")
    const timeRange = searchParams.get("timeRange") || "7d"

    // Get user's streams
    const streams = await DatabaseService.getUserStreams(session.user.id)

    // Calculate analytics
    const totalStreams = streams.length
    const liveStreams = streams.filter((s) => s.status === "live").length
    const totalViewers = streams.reduce((sum, s) => sum + s.viewerCount, 0)
    const avgViewers = totalStreams > 0 ? Math.round(totalViewers / totalStreams) : 0

    // Get recordings analytics
    const recordings = await DatabaseService.getRecordings(session.user.id)
    const totalRecordings = recordings.length
    const totalViews = recordings.reduce((sum, r) => sum + r.viewCount, 0)

    // Mock engagement data (you can implement real analytics)
    const engagementData = [
      { date: "2024-01-01", viewers: 120, engagement: 85 },
      { date: "2024-01-02", viewers: 150, engagement: 92 },
      { date: "2024-01-03", viewers: 180, engagement: 78 },
      { date: "2024-01-04", viewers: 200, engagement: 95 },
      { date: "2024-01-05", viewers: 175, engagement: 88 },
      { date: "2024-01-06", viewers: 220, engagement: 91 },
      { date: "2024-01-07", viewers: 250, engagement: 96 },
    ]

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalStreams,
          liveStreams,
          totalViewers,
          avgViewers,
          totalRecordings,
          totalViews,
        },
        engagement: engagementData,
        topStreams: streams
          .sort((a, b) => b.viewerCount - a.viewerCount)
          .slice(0, 5)
          .map((s) => ({
            id: s.id,
            title: s.title,
            viewers: s.viewerCount,
            duration:
              s.endTime && s.startTime ? Math.round((s.endTime.getTime() - s.startTime.getTime()) / 1000 / 60) : 0,
          })),
      },
    })
  } catch (error) {
    console.error("Get analytics error:", error)
    return NextResponse.json({ error: "Failed to get analytics" }, { status: 500 })
  }
}
