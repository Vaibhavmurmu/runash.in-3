import { type NextRequest, NextResponse } from "next/server"
import { liveStreamingService } from "@/lib/live-streaming-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status") // 'live', 'scheduled', 'ended'

    let streams = liveStreamingService.getActiveStreams()

    // Filter by category
    if (category && category !== "all") {
      streams = streams.filter((stream) => stream.category === category)
    }

    // Add metrics to each stream
    const streamsWithMetrics = streams.map((stream) => ({
      ...stream,
      metrics: liveStreamingService.getStreamMetrics(stream.id),
      hlsUrl: liveStreamingService.getHlsUrl(stream.id),
    }))

    return NextResponse.json({
      streams: streamsWithMetrics,
      total: streamsWithMetrics.length,
    })
  } catch (error) {
    console.error("Error fetching live streams:", error)
    return NextResponse.json({ error: "Failed to fetch live streams" }, { status: 500 })
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
      category,
      tags = [],
      isPublic = true,
      allowChat = true,
      allowProducts = true,
      recordingEnabled = true,
      maxViewers,
    } = body

    if (!title || !hostId || !hostName || !category) {
      return NextResponse.json({ error: "Missing required fields: title, hostId, hostName, category" }, { status: 400 })
    }

    const streamId = `stream_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    const streamConfig = {
      id: streamId,
      title,
      description,
      hostId,
      hostName,
      category,
      tags,
      isPublic,
      allowChat,
      allowProducts,
      recordingEnabled,
      maxViewers,
    }

    const { rtmpUrl, streamKey, hlsUrl } = await liveStreamingService.createStream(streamConfig)

    return NextResponse.json({
      success: true,
      stream: {
        ...streamConfig,
        rtmpUrl,
        streamKey,
        hlsUrl,
      },
    })
  } catch (error) {
    console.error("Error creating live stream:", error)
    return NextResponse.json({ error: "Failed to create live stream" }, { status: 500 })
  }
}
