import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { EnhancedCloudStorage } from "@/lib/enhanced-cloud-storage"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const action = searchParams.get("action")
    const prefix = searchParams.get("prefix")
    const maxKeys = Number.parseInt(searchParams.get("maxKeys") || "100")
    const continuationToken = searchParams.get("continuationToken") || undefined

    const storage = EnhancedCloudStorage.getInstance()

    switch (action) {
      case "list":
        const userPrefix = `users/${session.user.id}/${prefix || ""}`
        const result = await storage.listFiles(userPrefix, maxKeys, continuationToken)
        return NextResponse.json(result)

      case "stats":
        const stats = await storage.getStorageStats(session.user.id)
        return NextResponse.json(stats)

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Storage API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const action = formData.get("action") as string
    const storage = EnhancedCloudStorage.getInstance()

    switch (action) {
      case "upload":
        const file = formData.get("file") as File
        const folder = (formData.get("folder") as string) || ""

        if (!file) {
          return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const key = `users/${session.user.id}/${folder}/${Date.now()}-${file.name}`

        const url = await storage.uploadFile(key, buffer, file.type, {
          originalName: file.name,
          uploadedBy: session.user.id,
          uploadedAt: new Date().toISOString(),
        })

        return NextResponse.json({ url, key, size: buffer.length })

      case "presigned-url":
        const fileName = formData.get("fileName") as string
        const contentType = formData.get("contentType") as string
        const folderPath = (formData.get("folder") as string) || ""

        if (!fileName || !contentType) {
          return NextResponse.json({ error: "fileName and contentType required" }, { status: 400 })
        }

        const uploadKey = `users/${session.user.id}/${folderPath}/${Date.now()}-${fileName}`
        const presignedUrl = await storage.generatePresignedUploadUrl(uploadKey, contentType)

        return NextResponse.json({ presignedUrl, key: uploadKey })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Storage upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { keys } = await req.json()

    if (!Array.isArray(keys)) {
      return NextResponse.json({ error: "Keys must be an array" }, { status: 400 })
    }

    // Ensure user can only delete their own files
    const userKeys = keys.filter((key) => key.startsWith(`users/${session.user.id}/`))

    const storage = EnhancedCloudStorage.getInstance()
    const result = await storage.deleteFiles(userKeys)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Storage delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, sourceKey, destinationKey } = await req.json()

    // Ensure user can only modify their own files
    if (!sourceKey.startsWith(`users/${session.user.id}/`) || !destinationKey.startsWith(`users/${session.user.id}/`)) {
      return NextResponse.json({ error: "Unauthorized file access" }, { status: 403 })
    }

    const storage = EnhancedCloudStorage.getInstance()

    switch (action) {
      case "move":
        await storage.moveFile(sourceKey, destinationKey)
        return NextResponse.json({ success: true })

      case "copy":
        await storage.copyFile(sourceKey, destinationKey)
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Storage operation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
