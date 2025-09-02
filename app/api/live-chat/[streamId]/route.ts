import { type NextRequest, NextResponse } from "next/server"
import { liveChatService } from "@/lib/live-chat-service"

export async function GET(request: NextRequest, { params }: { params: { streamId: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get("limit")) || 100
    const action = searchParams.get("action")

    const streamId = params.streamId

    switch (action) {
      case "messages":
        const messages = liveChatService.getMessages(streamId, limit)
        return NextResponse.json({ success: true, messages })

      case "users":
        const users = liveChatService.getUsers(streamId)
        return NextResponse.json({ success: true, users })

      case "settings":
        const settings = liveChatService.getChatSettings(streamId)
        return NextResponse.json({ success: true, settings })

      case "analytics":
        const analytics = liveChatService.getChatAnalytics(streamId)
        return NextResponse.json({ success: true, analytics })

      case "moderation":
        const moderationActions = liveChatService.getModerationActions(streamId)
        return NextResponse.json({ success: true, moderationActions })

      default:
        // Return chat overview
        const chatMessages = liveChatService.getMessages(streamId, limit)
        const chatUsers = liveChatService.getUsers(streamId)
        const chatSettings = liveChatService.getChatSettings(streamId)

        return NextResponse.json({
          success: true,
          messages: chatMessages,
          users: chatUsers,
          settings: chatSettings,
          userCount: chatUsers.length,
          messageCount: chatMessages.length,
        })
    }
  } catch (error) {
    console.error("Error handling chat request:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { streamId: string } }) {
  try {
    const streamId = params.streamId
    const body = await request.json()
    const { action, ...actionData } = body

    switch (action) {
      case "create_room":
        const { hostId } = actionData
        if (!hostId) {
          return NextResponse.json({ error: "hostId required" }, { status: 400 })
        }
        const settings = await liveChatService.createChatRoom(streamId, hostId)
        return NextResponse.json({ success: true, settings })

      case "close_room":
        await liveChatService.closeChatRoom(streamId)
        return NextResponse.json({ success: true })

      case "join":
        const { user } = actionData
        if (!user) {
          return NextResponse.json({ error: "user data required" }, { status: 400 })
        }
        await liveChatService.joinChat(streamId, user)
        return NextResponse.json({ success: true })

      case "leave":
        const { userId } = actionData
        if (!userId) {
          return NextResponse.json({ error: "userId required" }, { status: 400 })
        }
        await liveChatService.leaveChat(streamId, userId)
        return NextResponse.json({ success: true })

      case "send_message":
        const { userId: senderId, content, type = "message", metadata } = actionData
        if (!senderId || !content) {
          return NextResponse.json({ error: "userId and content required" }, { status: 400 })
        }
        const message = await liveChatService.sendMessage(streamId, senderId, content, type, metadata)
        return NextResponse.json({ success: true, message })

      case "delete_message":
        const { messageId, moderatorId } = actionData
        if (!messageId || !moderatorId) {
          return NextResponse.json({ error: "messageId and moderatorId required" }, { status: 400 })
        }
        await liveChatService.deleteMessage(streamId, messageId, moderatorId)
        return NextResponse.json({ success: true })

      case "timeout_user":
        const { moderatorId: timeoutModId, targetUserId, duration, reason } = actionData
        if (!timeoutModId || !targetUserId || !duration) {
          return NextResponse.json({ error: "moderatorId, targetUserId, and duration required" }, { status: 400 })
        }
        await liveChatService.timeoutUser(streamId, timeoutModId, targetUserId, duration, reason)
        return NextResponse.json({ success: true })

      case "ban_user":
        const { moderatorId: banModId, targetUserId: banTargetId, reason: banReason } = actionData
        if (!banModId || !banTargetId) {
          return NextResponse.json({ error: "moderatorId and targetUserId required" }, { status: 400 })
        }
        await liveChatService.banUser(streamId, banModId, banTargetId, banReason)
        return NextResponse.json({ success: true })

      case "unban_user":
        const { moderatorId: unbanModId, targetUserId: unbanTargetId } = actionData
        if (!unbanModId || !unbanTargetId) {
          return NextResponse.json({ error: "moderatorId and targetUserId required" }, { status: 400 })
        }
        await liveChatService.unbanUser(streamId, unbanModId, unbanTargetId)
        return NextResponse.json({ success: true })

      case "update_settings":
        const { settings: newSettings } = actionData
        if (!newSettings) {
          return NextResponse.json({ error: "settings required" }, { status: 400 })
        }
        const updatedSettings = await liveChatService.updateChatSettings(streamId, newSettings)
        return NextResponse.json({ success: true, settings: updatedSettings })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error handling chat action:", error)
    return NextResponse.json({ error: "Failed to process chat action" }, { status: 500 })
  }
}
