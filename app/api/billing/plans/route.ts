import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    const plans = await sql`
      SELECT * FROM subscription_plans 
      WHERE is_active = true
      ORDER BY price_monthly ASC
    `

    return NextResponse.json({ plans })
  } catch (error) {
    console.error("Error fetching plans:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
