import { NextResponse } from "next/server"
import { getCurrentUserId, isAuthenticated } from "@/lib/auth"
import { storageService } from "@/lib/storage"

export async function GET() {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()
    const stats = await storageService.getStorageStats(userId)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching storage stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
