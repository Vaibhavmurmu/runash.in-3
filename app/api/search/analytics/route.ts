import { NextResponse } from "next/server"
import { aiSearchService } from "@/lib/ai-search"

export async function GET() {
  try {
    const analytics = await aiSearchService.getSearchAnalytics(7)

    return NextResponse.json({
      success: true,
      data: analytics,
    })
  } catch (error) {
    console.error("Search analytics API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch search analytics",
        data: {
          totalQueries: 0,
          uniqueUsers: 0,
          avgResponseTime: 0,
          topQueries: [],
          period: 7,
        },
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { days = 7 } = body

    const analytics = await aiSearchService.getSearchAnalytics(days)

    return NextResponse.json({
      success: true,
      data: analytics,
    })
  } catch (error) {
    console.error("Search analytics API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch search analytics",
      },
      { status: 500 },
    )
  }
}
