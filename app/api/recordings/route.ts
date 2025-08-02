import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { DatabaseService } from "@/lib/database"
import { cloudStorage } from "@/lib/cloud-storage"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const isPublic = searchParams.get("public") === "true"
    const session = await getServerSession(authOptions)

    // If requesting user's own recordings, verify authentication
    if (userId && userId === session?.user?.id) {
      const recordings = await DatabaseService.getRecordings(userId)

      // Generate signed URLs for each recording
      const recordingsWithUrls = await Promise.all(
        recordings.map(async (recording) => {
          const playbackUrl = await cloudStorage.getRecordingUrl(recording.storageKey)
          const thumbnailUrl = recording.thumbnailKey
            ? await cloudStorage.getRecordingUrl(recording.thumbnailKey)
            : null

          return {
            ...recording,
            playbackUrl,
            thumbnailUrl,
          }
        }),
      )

      return NextResponse.json({
        success: true,
        recordings: recordingsWithUrls,
      })
    }

    // Get public recordings
    if (isPublic) {
      const recordings = await DatabaseService.getRecordings(undefined, true)

      const recordingsWithUrls = await Promise.all(
        recordings.map(async (recording) => {
          const playbackUrl = await cloudStorage.getRecordingUrl(recording.storageKey)
          const thumbnailUrl = recording.thumbnailKey
            ? await cloudStorage.getRecordingUrl(recording.thumbnailKey)
            : null

          return {
            ...recording,
            playbackUrl,
            thumbnailUrl,
          }
        }),
      )

      return NextResponse.json({
        success: true,
        recordings: recordingsWithUrls,
      })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error) {
    console.error("Get recordings error:", error)
    return NextResponse.json({ error: "Failed to get recordings" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { recordingId } = await request.json()

    if (!recordingId) {
      return NextResponse.json({ error: "Recording ID required" }, { status: 400 })
    }

    // Get recording to verify ownership
    const recordings = await DatabaseService.getRecordings(session.user.id)
    const recording = recordings.find((r) => r.id === recordingId)

    if (!recording) {
      return NextResponse.json({ error: "Recording not found or unauthorized" }, { status: 404 })
    }

    // Delete from cloud storage
    await cloudStorage.deleteRecording(recording.storageKey)

    if (recording.thumbnailKey) {
      await cloudStorage.deleteRecording(recording.thumbnailKey)
    }

    // Delete from database (you'll need to implement this method)
    // await DatabaseService.deleteRecording(recordingId)

    return NextResponse.json({
      success: true,
      message: "Recording deleted successfully",
    })
  } catch (error) {
    console.error("Delete recording error:", error)
    return NextResponse.json({ error: "Failed to delete recording" }, { status: 500 })
  }
}
