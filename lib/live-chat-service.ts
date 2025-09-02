import { EventEmitter } from "events"

export interface ChatUser {
  id: string
  username: string
  displayName: string
  avatar?: string
  role: "viewer" | "moderator" | "host" | "admin"
  badges: string[]
  isSubscriber: boolean
  followDate?: Date
  messageCount: number
  lastActive: Date
}

export interface ChatMessage {
  id: string
  streamId: string
  userId: string
  username: string
  displayName: string
  avatar?: string
  content: string
  type: "message" | "system" | "purchase" | "product_highlight" | "reaction" | "gift"
  timestamp: Date
  isDeleted: boolean
  isModerated: boolean
  mentions: string[]
  emotes: ChatEmote[]
  metadata?: {
    productId?: string
    productName?: string
    price?: number
    giftType?: string
    reactionType?: string
  }
}

export interface ChatEmote {
  id: string
  name: string
  url: string
  startIndex: number
  endIndex: number
}

export interface ChatModerationAction {
  id: string
  streamId: string
  moderatorId: string
  targetUserId: string
  action: "timeout" | "ban" | "unban" | "delete_message" | "slow_mode" | "followers_only"
  duration?: number // in seconds
  reason?: string
  timestamp: Date
}

export interface ChatSettings {
  streamId: string
  slowMode: boolean
  slowModeDelay: number // seconds
  followersOnly: boolean
  subscribersOnly: boolean
  emoteOnly: boolean
  maxMessageLength: number
  allowLinks: boolean
  autoModeration: boolean
  bannedWords: string[]
  allowedDomains: string[]
}

class LiveChatService extends EventEmitter {
  private messages: Map<string, ChatMessage[]> = new Map() // streamId -> messages
  private users: Map<string, Map<string, ChatUser>> = new Map() // streamId -> userId -> user
  private settings: Map<string, ChatSettings> = new Map() // streamId -> settings
  private moderationActions: Map<string, ChatModerationAction[]> = new Map() // streamId -> actions
  private bannedUsers: Map<string, Set<string>> = new Map() // streamId -> Set of userIds
  private timeoutUsers: Map<string, Map<string, Date>> = new Map() // streamId -> userId -> timeout end

  constructor() {
    super()
    this.setupCleanupInterval()
  }

  // Stream Management
  async createChatRoom(streamId: string, hostId: string): Promise<ChatSettings> {
    const defaultSettings: ChatSettings = {
      streamId,
      slowMode: false,
      slowModeDelay: 5,
      followersOnly: false,
      subscribersOnly: false,
      emoteOnly: false,
      maxMessageLength: 500,
      allowLinks: false,
      autoModeration: true,
      bannedWords: ["spam", "scam", "fake"],
      allowedDomains: ["runash.in", "youtube.com", "twitch.tv"],
    }

    this.messages.set(streamId, [])
    this.users.set(streamId, new Map())
    this.settings.set(streamId, defaultSettings)
    this.moderationActions.set(streamId, [])
    this.bannedUsers.set(streamId, new Set())
    this.timeoutUsers.set(streamId, new Map())

    // Add system welcome message
    await this.addSystemMessage(streamId, "Welcome to the live chat! Be respectful and enjoy the stream.")

    this.emit("chat_room_created", { streamId, settings: defaultSettings })
    return defaultSettings
  }

  async closeChatRoom(streamId: string): Promise<void> {
    await this.addSystemMessage(streamId, "Chat has been closed. Thank you for participating!")

    this.emit("chat_room_closed", { streamId })
  }

  // User Management
  async joinChat(streamId: string, user: Omit<ChatUser, "messageCount" | "lastActive">): Promise<void> {
    const users = this.users.get(streamId)
    if (!users) throw new Error("Chat room not found")

    const chatUser: ChatUser = {
      ...user,
      messageCount: 0,
      lastActive: new Date(),
    }

    users.set(user.id, chatUser)

    // Add join message
    await this.addSystemMessage(streamId, `${user.displayName} joined the chat`)

    this.emit("user_joined", { streamId, user: chatUser })
  }

  async leaveChat(streamId: string, userId: string): Promise<void> {
    const users = this.users.get(streamId)
    if (!users) return

    const user = users.get(userId)
    if (user) {
      users.delete(userId)
      await this.addSystemMessage(streamId, `${user.displayName} left the chat`)
      this.emit("user_left", { streamId, userId, user })
    }
  }

  // Message Management
  async sendMessage(
    streamId: string,
    userId: string,
    content: string,
    type: ChatMessage["type"] = "message",
    metadata?: ChatMessage["metadata"],
  ): Promise<ChatMessage | null> {
    const users = this.users.get(streamId)
    const settings = this.settings.get(streamId)
    const messages = this.messages.get(streamId)

    if (!users || !settings || !messages) {
      throw new Error("Chat room not found")
    }

    const user = users.get(userId)
    if (!user) {
      throw new Error("User not found in chat")
    }

    // Check if user is banned or timed out
    if (this.isUserBanned(streamId, userId) || this.isUserTimedOut(streamId, userId)) {
      return null
    }

    // Validate message
    const validationResult = await this.validateMessage(streamId, content, user)
    if (!validationResult.isValid) {
      this.emit("message_rejected", { streamId, userId, reason: validationResult.reason })
      return null
    }

    // Process emotes and mentions
    const { processedContent, emotes, mentions } = await this.processMessageContent(content)

    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      streamId,
      userId,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      content: processedContent,
      type,
      timestamp: new Date(),
      isDeleted: false,
      isModerated: false,
      mentions,
      emotes,
      metadata,
    }

    messages.push(message)

    // Update user stats
    user.messageCount++
    user.lastActive = new Date()

    // Keep only last 1000 messages per stream
    if (messages.length > 1000) {
      messages.splice(0, messages.length - 1000)
    }

    this.emit("message_sent", { streamId, message })
    return message
  }

  async deleteMessage(streamId: string, messageId: string, moderatorId: string): Promise<void> {
    const messages = this.messages.get(streamId)
    if (!messages) return

    const messageIndex = messages.findIndex((m) => m.id === messageId)
    if (messageIndex === -1) return

    const message = messages[messageIndex]
    message.isDeleted = true

    // Record moderation action
    await this.recordModerationAction(
      streamId,
      moderatorId,
      message.userId,
      "delete_message",
      undefined,
      "Message deleted",
    )

    this.emit("message_deleted", { streamId, messageId, moderatorId })
  }

  // Moderation
  async timeoutUser(
    streamId: string,
    moderatorId: string,
    targetUserId: string,
    duration: number,
    reason?: string,
  ): Promise<void> {
    const timeoutEnd = new Date(Date.now() + duration * 1000)
    const timeouts = this.timeoutUsers.get(streamId) || new Map()
    timeouts.set(targetUserId, timeoutEnd)
    this.timeoutUsers.set(streamId, timeouts)

    await this.recordModerationAction(streamId, moderatorId, targetUserId, "timeout", duration, reason)
    await this.addSystemMessage(streamId, `User has been timed out for ${duration} seconds`)

    this.emit("user_timed_out", { streamId, targetUserId, duration, moderatorId, reason })
  }

  async banUser(streamId: string, moderatorId: string, targetUserId: string, reason?: string): Promise<void> {
    const banned = this.bannedUsers.get(streamId) || new Set()
    banned.add(targetUserId)
    this.bannedUsers.set(streamId, banned)

    await this.recordModerationAction(streamId, moderatorId, targetUserId, "ban", undefined, reason)
    await this.addSystemMessage(streamId, `User has been banned from the chat`)

    // Remove user from chat
    await this.leaveChat(streamId, targetUserId)

    this.emit("user_banned", { streamId, targetUserId, moderatorId, reason })
  }

  async unbanUser(streamId: string, moderatorId: string, targetUserId: string): Promise<void> {
    const banned = this.bannedUsers.get(streamId)
    if (banned) {
      banned.delete(targetUserId)
    }

    await this.recordModerationAction(streamId, moderatorId, targetUserId, "unban")
    this.emit("user_unbanned", { streamId, targetUserId, moderatorId })
  }

  // Settings Management
  async updateChatSettings(streamId: string, updates: Partial<ChatSettings>): Promise<ChatSettings> {
    const settings = this.settings.get(streamId)
    if (!settings) throw new Error("Chat room not found")

    const updatedSettings = { ...settings, ...updates }
    this.settings.set(streamId, updatedSettings)

    this.emit("settings_updated", { streamId, settings: updatedSettings })
    return updatedSettings
  }

  // Data Retrieval
  getMessages(streamId: string, limit = 100): ChatMessage[] {
    const messages = this.messages.get(streamId) || []
    return messages.slice(-limit).filter((m) => !m.isDeleted)
  }

  getUsers(streamId: string): ChatUser[] {
    const users = this.users.get(streamId)
    return users ? Array.from(users.values()) : []
  }

  getChatSettings(streamId: string): ChatSettings | undefined {
    return this.settings.get(streamId)
  }

  getModerationActions(streamId: string): ChatModerationAction[] {
    return this.moderationActions.get(streamId) || []
  }

  // Analytics
  getChatAnalytics(streamId: string): {
    totalMessages: number
    uniqueUsers: number
    averageMessagesPerUser: number
    topChatters: { user: ChatUser; messageCount: number }[]
    messagesByHour: { hour: number; count: number }[]
  } {
    const messages = this.messages.get(streamId) || []
    const users = this.users.get(streamId) || new Map()

    const totalMessages = messages.filter((m) => !m.isDeleted && m.type === "message").length
    const uniqueUsers = users.size
    const averageMessagesPerUser = uniqueUsers > 0 ? totalMessages / uniqueUsers : 0

    const topChatters = Array.from(users.values())
      .sort((a, b) => b.messageCount - a.messageCount)
      .slice(0, 10)
      .map((user) => ({ user, messageCount: user.messageCount }))

    // Group messages by hour
    const messagesByHour: { hour: number; count: number }[] = []
    const hourCounts: Record<number, number> = {}

    messages.forEach((message) => {
      if (!message.isDeleted && message.type === "message") {
        const hour = message.timestamp.getHours()
        hourCounts[hour] = (hourCounts[hour] || 0) + 1
      }
    })

    for (let hour = 0; hour < 24; hour++) {
      messagesByHour.push({ hour, count: hourCounts[hour] || 0 })
    }

    return {
      totalMessages,
      uniqueUsers,
      averageMessagesPerUser,
      topChatters,
      messagesByHour,
    }
  }

  // Private Methods
  private async addSystemMessage(streamId: string, content: string): Promise<void> {
    const messages = this.messages.get(streamId)
    if (!messages) return

    const systemMessage: ChatMessage = {
      id: `sys_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      streamId,
      userId: "system",
      username: "System",
      displayName: "System",
      content,
      type: "system",
      timestamp: new Date(),
      isDeleted: false,
      isModerated: false,
      mentions: [],
      emotes: [],
    }

    messages.push(systemMessage)
    this.emit("message_sent", { streamId, message: systemMessage })
  }

  private async validateMessage(
    streamId: string,
    content: string,
    user: ChatUser,
  ): Promise<{ isValid: boolean; reason?: string }> {
    const settings = this.settings.get(streamId)
    if (!settings) return { isValid: false, reason: "Chat room not found" }

    // Check message length
    if (content.length > settings.maxMessageLength) {
      return { isValid: false, reason: "Message too long" }
    }

    // Check for banned words
    if (settings.autoModeration) {
      const lowerContent = content.toLowerCase()
      for (const bannedWord of settings.bannedWords) {
        if (lowerContent.includes(bannedWord.toLowerCase())) {
          return { isValid: false, reason: "Message contains prohibited content" }
        }
      }
    }

    // Check links
    if (!settings.allowLinks && this.containsLinks(content)) {
      return { isValid: false, reason: "Links are not allowed" }
    }

    // Check role restrictions
    if (settings.subscribersOnly && !user.isSubscriber && user.role === "viewer") {
      return { isValid: false, reason: "Subscribers only mode is enabled" }
    }

    return { isValid: true }
  }

  private async processMessageContent(content: string): Promise<{
    processedContent: string
    emotes: ChatEmote[]
    mentions: string[]
  }> {
    const mentions: string[] = []
    const emotes: ChatEmote[] = []

    // Extract mentions (@username)
    const mentionRegex = /@(\w+)/g
    let match
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1])
    }

    // Process emotes (simplified - in real implementation would use emote APIs)
    const emoteRegex = /:(\w+):/g
    while ((match = emoteRegex.exec(content)) !== null) {
      emotes.push({
        id: match[1],
        name: match[1],
        url: `/emotes/${match[1]}.png`,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      })
    }

    return {
      processedContent: content,
      emotes,
      mentions,
    }
  }

  private containsLinks(content: string): boolean {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return urlRegex.test(content)
  }

  private isUserBanned(streamId: string, userId: string): boolean {
    const banned = this.bannedUsers.get(streamId)
    return banned ? banned.has(userId) : false
  }

  private isUserTimedOut(streamId: string, userId: string): boolean {
    const timeouts = this.timeoutUsers.get(streamId)
    if (!timeouts) return false

    const timeoutEnd = timeouts.get(userId)
    if (!timeoutEnd) return false

    if (new Date() > timeoutEnd) {
      timeouts.delete(userId)
      return false
    }

    return true
  }

  private async recordModerationAction(
    streamId: string,
    moderatorId: string,
    targetUserId: string,
    action: ChatModerationAction["action"],
    duration?: number,
    reason?: string,
  ): Promise<void> {
    const actions = this.moderationActions.get(streamId) || []

    const moderationAction: ChatModerationAction = {
      id: `mod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      streamId,
      moderatorId,
      targetUserId,
      action,
      duration,
      reason,
      timestamp: new Date(),
    }

    actions.push(moderationAction)
    this.moderationActions.set(streamId, actions)

    this.emit("moderation_action", { streamId, action: moderationAction })
  }

  private setupCleanupInterval(): void {
    // Clean up old messages and expired timeouts every 5 minutes
    setInterval(
      () => {
        const now = new Date()

        // Clean up expired timeouts
        this.timeoutUsers.forEach((timeouts, streamId) => {
          timeouts.forEach((timeoutEnd, userId) => {
            if (now > timeoutEnd) {
              timeouts.delete(userId)
            }
          })
        })

        // Clean up old messages (keep only last 24 hours)
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        this.messages.forEach((messages, streamId) => {
          const filteredMessages = messages.filter((m) => m.timestamp > oneDayAgo)
          this.messages.set(streamId, filteredMessages)
        })
      },
      5 * 60 * 1000,
    )
  }
}

export const liveChatService = new LiveChatService()
