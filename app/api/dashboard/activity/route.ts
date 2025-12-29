import { type NextRequest, NextResponse } from "next/server"
import { DashboardService } from "@/lib/dashboard-service"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const activity = await DashboardService.getRecentActivity(Number.parseInt(userId), limit)
    return NextResponse.json(activity)
  } catch (error) {
    console.error("Error fetching recent activity:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
