import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId, isAuthenticated } from "@/lib/auth"
import { storageService } from "@/lib/storage"

export async function GET(request: NextRequest, { params }: { params: { fileId: string } }) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()
    const file = await storageService.getFile(params.fileId, userId)

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    return NextResponse.json(file)
  } catch (error) {
    console.error("Error fetching file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { fileId: string } }) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()
    const success = await storageService.deleteFile(params.fileId, userId)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
