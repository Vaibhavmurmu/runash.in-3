import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId, isAuthenticated } from "@/lib/auth"
import { storageService } from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()
    const formData = await request.formData()

    const file = formData.get("file") as File
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 50MB" }, { status: 400 })
    }

    // Get upload options
    const bucket = (formData.get("bucket") as string) || "documents"
    const isPublic = formData.get("isPublic") === "true"
    const tags = formData.get("tags") ? (formData.get("tags") as string).split(",") : []
    const metadata = formData.get("metadata") ? JSON.parse(formData.get("metadata") as string) : {}

    const uploadedFile = await storageService.uploadFile(userId, file, {
      bucket,
      isPublic,
      tags,
      metadata,
    })

    if (!uploadedFile) {
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    return NextResponse.json(uploadedFile)
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
