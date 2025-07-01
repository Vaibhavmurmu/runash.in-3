import { NextResponse } from "next/server"
import { getConfigStatus } from "@/lib/config"

export async function GET() {
  try {
    const status = getConfigStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error("Error getting config status:", error)
    return NextResponse.json({ error: "Failed to get configuration status" }, { status: 500 })
  }
}
