import { type NextRequest, NextResponse } from "next/server"
import { broadcastScheduler } from "@/lib/broadcast-scheduler"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "upcoming"
    const hostId = searchParams.get("hostId")
    const limit = Number(searchParams.get("limit")) || 10

    switch (type) {
      case "upcoming":
        const upcomingBroadcasts = broadcastScheduler.getUpcomingBroadcasts(limit)
        return NextResponse.json({ success: true, broadcasts: upcomingBroadcasts })

      case "live":
        const liveBroadcasts = broadcastScheduler.getLiveBroadcasts()
        return NextResponse.json({ success: true, broadcasts: liveBroadcasts })

      case "history":
        const historyBroadcasts = broadcastScheduler.getBroadcastHistory(hostId || undefined, limit)
        return NextResponse.json({ success: true, broadcasts: historyBroadcasts })

      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching broadcasts:", error)
    return NextResponse.json({ error: "Failed to fetch broadcasts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      hostId,
      hostName,
      scheduledStartTime,
      duration = 60,
      platforms = [],
      category = "Gaming",
      tags = [],
      isPublic = true,
      isRecurring = false,
      recurrencePattern,
      templateId,
      notificationSettings = {
        enabled: true,
        notifyBefore: [15],
        channels: ["push"],
        audienceNotification: true,
      },
      autoStartSettings = {
        enabled: false,
        prepareMinutesBefore: 5,
        autoGoLive: false,
        autoEndAfterDuration: true,
        fallbackActions: {
          onHostAbsent: "delay",
          onTechnicalIssue: "retry",
        },
      },
      streamSettings = {
        quality: "1080p",
        bitrate: 4500,
        fps: 30,
        enableChat: true,
        enableRecording: true,
        enableTranscription: false,
        chatModeration: {
          enabled: true,
          autoMod: true,
          slowMode: false,
          followersOnly: false,
        },
      },
    } = body

    if (!title || !hostId || !hostName || !scheduledStartTime) {
      return NextResponse.json(
        { error: "Missing required fields: title, hostId, hostName, scheduledStartTime" },
        { status: 400 },
      )
    }

    const scheduledEndTime = new Date(new Date(scheduledStartTime).getTime() + duration * 60 * 1000)

    const broadcast = await broadcastScheduler.createBroadcast({
      title,
      description,
      hostId,
      hostName,
      scheduledStartTime: new Date(scheduledStartTime),
      scheduledEndTime,
      duration,
      platforms,
      category,
      tags,
      isPublic,
      isRecurring,
      recurrencePattern,
      templateId,
      notificationSettings,
      autoStartSettings,
      streamSettings,
    })

    return NextResponse.json({ success: true, broadcast })
  } catch (error) {
    console.error("Error creating broadcast:", error)
    return NextResponse.json({ error: "Failed to create broadcast" }, { status: 500 })
  }
}
