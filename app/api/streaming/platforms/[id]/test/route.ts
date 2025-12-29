import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const platformId = params.id

    // Get platform details
    const platform = await Database.query(`SELECT * FROM streaming_platforms WHERE id = $1 AND user_id = $2`, [
      platformId,
      session.user.id,
    ])

    if (!platform[0]) {
      return NextResponse.json({ error: "Platform not found" }, { status: 404 })
    }

    // Test RTMP connection
    const testResult = await testRTMPConnection(platform[0])

    // Update connection status
    await Database.query(
      `UPDATE streaming_platforms 
       SET is_connected = $1, last_connected = $2, connection_status = $3 
       WHERE id = $4`,
      [
        testResult.success,
        testResult.success ? new Date() : null,
        testResult.success ? "connected" : "error",
        platformId,
      ],
    )

    return NextResponse.json(testResult)
  } catch (error) {
    console.error("Test platform connection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function testRTMPConnection(platform: any): Promise<{ success: boolean; message: string; latency?: number }> {
  try {
    const startTime = Date.now()

    // In a real implementation, this would:
    // 1. Attempt to connect to the RTMP server
    // 2. Send a test stream or handshake
    // 3. Verify the stream key is valid
    // 4. Measure latency and connection quality

    // For now, we'll simulate the test based on platform type
    const simulatedLatency = Math.random() * 100 + 50 // 50-150ms

    // Simulate some platforms having issues
    const successRate = getPlatformSuccessRate(platform.platform_type)
    const isSuccessful = Math.random() < successRate

    const latency = Date.now() - startTime + simulatedLatency

    if (isSuccessful) {
      return {
        success: true,
        message: "Connection successful",
        latency: Math.round(latency),
      }
    } else {
      return {
        success: false,
        message: getErrorMessage(platform.platform_type),
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Connection test failed: " + error.message,
    }
  }
}

function getPlatformSuccessRate(platformType: string): number {
  const rates = {
    twitch: 0.95,
    youtube: 0.92,
    facebook: 0.88,
    tiktok: 0.85,
    instagram: 0.8,
    custom: 0.75,
  }
  return rates[platformType] || 0.8
}

function getErrorMessage(platformType: string): string {
  const messages = {
    twitch: "Invalid stream key or server unavailable",
    youtube: "Stream key not found or channel not eligible for streaming",
    facebook: "Page not authorized for live streaming",
    tiktok: "Account not eligible for live streaming",
    instagram: "Professional account required for live streaming",
    custom: "RTMP server connection failed",
  }
  return messages[platformType] || "Connection failed"
}
