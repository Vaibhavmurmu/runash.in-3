import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId, isAuthenticated } from "@/lib/auth"
import { storageService } from "@/lib/storage"

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()
    const { searchParams } = new URL(request.url)

    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const mimeType = searchParams.get("mimeType") || undefined
    const bucket = searchParams.get("bucket") || undefined
    const tags = searchParams.get("tags")?.split(",") || undefined

    const result = await storageService.getUserFiles(userId, {
      limit,
      offset,
      mimeType,
      bucket,
      tags,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching files:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
