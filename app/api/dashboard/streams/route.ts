import { type NextRequest, NextResponse } from "next/server"
import { DashboardService } from "@/lib/dashboard-service"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "6")

    const streams = await DashboardService.getRecentStreams(Number.parseInt(userId), limit)
    return NextResponse.json(streams)
  } catch (error) {
    console.error("Error fetching recent streams:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
