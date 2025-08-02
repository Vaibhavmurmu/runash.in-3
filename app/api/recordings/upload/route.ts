import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { cloudStorage } from "@/lib/cloud-storage"
import { DatabaseService } from "@/lib/database"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("recording") as File
    const streamId = formData.get("streamId") as string
    const title = formData.get("title") as string
    const duration = Number.parseInt(formData.get("duration") as string)
    const quality = (formData.get("quality") as string) || "HD"
    const isPublic = formData.get("isPublic") === "true"

    if (!file || !streamId || !title) {
      return NextResponse.json(
        {
          error: "Missing required fields: recording, streamId, title",
        },
        { status: 400 },
      )
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to cloud storage
    const storageKey = await cloudStorage.uploadRecording(streamId, buffer, {
      duration,
      quality,
      format: file.name.split(".").pop() || "mp4",
      userId: session.user.id,
    })

    // Save recording metadata to database
    const recording = await DatabaseService.saveRecording({
      streamId,
      userId: session.user.id,
      title,
      duration,
      fileSize: buffer.length,
      quality,
      format: file.name.split(".").pop() || "mp4",
      storageKey,
      isPublic,
    })

    return NextResponse.json({
      success: true,
      recording: {
        id: recording.id,
        title: recording.title,
        duration: recording.duration,
        quality: recording.quality,
        createdAt: recording.createdAt,
      },
    })
  } catch (error) {
    console.error("Upload recording error:", error)
    return NextResponse.json({ error: "Failed to upload recording" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const recordingId = searchParams.get("id")

    if (!recordingId) {
      return NextResponse.json({ error: "Recording ID required" }, { status: 400 })
    }

    // Get recording from database
    const recordings = await DatabaseService.getRecordings()
    const recording = recordings.find((r) => r.id === recordingId)

    if (!recording) {
      return NextResponse.json({ error: "Recording not found" }, { status: 404 })
    }

    // Generate signed URL for playback
    const playbackUrl = await cloudStorage.getRecordingUrl(recording.storageKey)

    // Increment view count
    await DatabaseService.incrementRecordingViews(recordingId)

    return NextResponse.json({
      success: true,
      recording: {
        ...recording,
        playbackUrl,
      },
    })
  } catch (error) {
    console.error("Get recording error:", error)
    return NextResponse.json({ error: "Failed to get recording" }, { status: 500 })
  }
}
