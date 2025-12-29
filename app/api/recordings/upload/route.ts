import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CloudStorage } from "@/lib/cloud-storage"
import { Database } from "@/lib/database"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const streamId = formData.get("streamId") as string
    const duration = Number.parseInt(formData.get("duration") as string)

    if (!file || !streamId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to cloud storage
    const fileUrl = await CloudStorage.uploadRecording(streamId, buffer)

    // Save recording metadata to database
    const recording = await Database.createRecording({
      stream_id: streamId,
      file_url: fileUrl,
      duration: duration,
      file_size: buffer.length,
    })

    return NextResponse.json({ recording })
  } catch (error) {
    console.error("Recording upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
