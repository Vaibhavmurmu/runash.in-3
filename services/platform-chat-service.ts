import type { ChatMessage, ChatStatistics, StreamingPlatform } from "@/types/platform-chat"

// This would be a real service in a production app
// For this demo, we'll simulate the chat service
export class PlatformChatService {
  private static instance: PlatformChatService
  private connectedPlatforms: Set<StreamingPlatform> = new Set()
  private messageListeners: ((message: ChatMessage) => void)[] = []
  private statisticsListeners: ((stats: ChatStatistics[]) => void)[] = []
  private simulationIntervals: NodeJS.Timeout[] = []

  private constructor() {}

  public static getInstance(): PlatformChatService {
    if (!PlatformChatService.instance) {
      PlatformChatService.instance = new PlatformChatService()
    }
    return PlatformChatService.instance
  }

  public connectToPlatform(platform: StreamingPlatform, credentials: any): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate connection delay
      setTimeout(() => {
        this.connectedPlatforms.add(platform)
        this.startChatSimulation(platform)
        resolve(true)
      }, 1500)
    })
  }

  public disconnectFromPlatform(platform: StreamingPlatform): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate disconnection delay
      setTimeout(() => {
        this.connectedPlatforms.delete(platform)
        resolve(true)
      }, 500)
    })
  }

  public isConnectedToPlatform(platform: StreamingPlatform): boolean {
    return this.connectedPlatforms.has(platform)
  }

  public getConnectedPlatforms(): StreamingPlatform[] {
    return Array.from(this.connectedPlatforms)
  }

  public sendMessage(content: string, platform: StreamingPlatform): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate sending message
      setTimeout(() => {
        resolve(true)
      }, 300)
    })
  }

  public sendMessageToAll(content: string): Promise<{ [key in StreamingPlatform]?: boolean }> {
    return new Promise((resolve) => {
      // Simulate sending message to all platforms
      setTimeout(() => {
        const results: { [key in StreamingPlatform]?: boolean } = {}
        this.connectedPlatforms.forEach((platform) => {
          results[platform] = true
        })
        resolve(results)
      }, 500)
    })
  }

  public onMessage(callback: (message: ChatMessage) => void): () => void {
    this.messageListeners.push(callback)
    return () => {
      this.messageListeners = this.messageListeners.filter((cb) => cb !== callback)
    }
  }

  public onStatisticsUpdate(callback: (stats: ChatStatistics[]) => void): () => void {
    this.statisticsListeners.push(callback)
    return () => {
      this.statisticsListeners = this.statisticsListeners.filter((cb) => cb !== callback)
    }
  }

  private startChatSimulation(platform: StreamingPlatform) {
    // Clear any existing simulation for this platform
    this.stopChatSimulation(platform)

    // Start a new simulation
    const interval = setInterval(() => {
      if (!this.connectedPlatforms.has(platform)) {
        clearInterval(interval)
        return
      }

      // Generate a random chat message
      const message = this.generateRandomMessage(platform)

      // Notify listeners
      this.messageListeners.forEach((listener) => listener(message))

      // Update statistics
      this.updateStatistics(platform)
    }, this.getRandomInterval(platform))

    this.simulationIntervals.push(interval)
  }

  private stopChatSimulation(platform: StreamingPlatform) {
    // Clear all intervals for this platform
    this.simulationIntervals.forEach((interval) => clearInterval(interval))
    this.simulationIntervals = []
  }

  private getRandomInterval(platform: StreamingPlatform): number {
    // Different platforms have different chat activity rates
    switch (platform) {
      case "twitch":
        return Math.random() * 2000 + 1000 // 1-3 seconds
      case "youtube":
        return Math.random() * 3000 + 2000 // 2-5 seconds
      case "facebook":
        return Math.random() * 4000 + 3000 // 3-7 seconds
      case "tiktok":
        return Math.random() * 1500 + 500 // 0.5-2 seconds
      default:
        return Math.random() * 3000 + 2000 // 2-5 seconds
    }
  }

  private generateRandomMessage(platform: StreamingPlatform): ChatMessage {
    const platforms = {
      twitch: {
        users: ["TwitchUser1", "TwitchFan42", "TwitchGamer", "TwitchMod", "TwitchSub"],
        messages: [
          "Hello from Twitch!",
          "PogChamp",
          "Kappa",
          "Great stream!",
          "When are you playing Fortnite?",
          "LUL that was funny",
        ],
      },
      youtube: {
        users: ["YTViewer", "YouTubeFan", "YTGaming", "YTModerator", "YTMember"],
        messages: [
          "Hello from YouTube!",
          "First time watching, love the content!",
          "Can you do a tutorial on this?",
          "Subscribed!",
          "When is the next stream?",
        ],
      },
      facebook: {
        users: ["FBUser", "FacebookFan", "FBGamer", "FBMod", "FBSupporter"],
        messages: [
          "Hello from Facebook!",
          "Just shared your stream",
          "Love from India!",
          "Great content as always",
          "When will you be live next?",
        ],
      },
      tiktok: {
        users: ["TikTokUser", "TikTokFan", "TikTokGamer", "TikTokMod", "TikTokGifter"],
        messages: [
          "Hello from TikTok!",
          "First time here!",
          "Sent you roses",
          "Love your content",
          "Do you have Instagram?",
        ],
      },
      instagram: {
        users: ["IGUser", "InstaFan", "IGGamer", "IGMod", "IGSupporter"],
        messages: [
          "Hello from Instagram!",
          "Love your feed",
          "Just followed you",
          "When's your next post?",
          "Greetings from Brazil!",
        ],
      },
      custom: {
        users: ["CustomUser", "CustomFan", "CustomGamer", "CustomMod", "CustomSub"],
        messages: [
          "Hello from custom platform!",
          "Testing the chat",
          "This is a custom message",
          "How's the stream going?",
          "Great content!",
        ],
      },
    }

    const platformData = platforms[platform]
    const username = platformData.users[Math.floor(Math.random() * platformData.users.length)]
    const content = platformData.messages[Math.floor(Math.random() * platformData.messages.length)]

    return {
      id: `${platform}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      user: {
        id: `${platform}-user-${username}`,
        username: username,
        displayName: username,
        platform: platform,
        roles: ["viewer"],
        badges: [],
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      },
      content: content,
      timestamp: new Date(),
      platform: platform,
      isDeleted: false,
      isHighlighted: false,
      isPinned: false,
      isAction: false,
      emotes: [],
      mentions: [],
    }
  }

  private updateStatistics(platform: StreamingPlatform) {
    // Generate random statistics for the platform
    const stats: ChatStatistics[] = this.getConnectedPlatforms().map((p) => ({
      platform: p,
      messageCount: Math.floor(Math.random() * 1000),
      userCount: Math.floor(Math.random() * 100),
      newUserCount: Math.floor(Math.random() * 20),
      messageRate: Math.random() * 30,
      topChatters: [
        { username: `${p}User1`, messageCount: Math.floor(Math.random() * 100) },
        { username: `${p}User2`, messageCount: Math.floor(Math.random() * 80) },
        { username: `${p}User3`, messageCount: Math.floor(Math.random() * 60) },
      ],
      engagement: Math.random() * 100,
    }))

    // Notify listeners
    this.statisticsListeners.forEach((listener) => listener(stats))
  }
}
