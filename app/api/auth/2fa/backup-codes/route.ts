import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateBackupCodes, getBackupCodesStatus } from "@/lib/2fa"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id)
    const status = await getBackupCodesStatus(userId)

    return NextResponse.json(status)
  } catch (error) {
    console.error("Backup codes status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id)
    const backupCodes = await generateBackupCodes(userId)

    return NextResponse.json({ backupCodes })
  } catch (error) {
    console.error("Generate backup codes error:", error)
    return NextResponse.json({ error: "Failed to generate backup codes" }, { status: 500 })
  }
}
