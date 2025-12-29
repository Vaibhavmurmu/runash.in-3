export interface UserProfile {
  id: string
  name: string
  email: string
  username: string
  avatar_url?: string
  bio?: string
  location?: string
  website?: string
  role: "user" | "creator" | "moderator" | "admin"
  status: "active" | "suspended" | "pending" | "banned"
  email_verified: boolean
  created_at: string
  updated_at: string
  last_login?: string
  follower_count: number
  following_count: number
  stream_count: number
  total_views: number
  subscription_tier?: string
}

export interface ContentItem {
  id: string
  user_id: string
  title: string
  description?: string
  type: "stream" | "video" | "image" | "document"
  status: "draft" | "published" | "archived" | "moderated" | "rejected"
  visibility: "public" | "private" | "unlisted" | "subscribers_only"
  file_url?: string
  thumbnail_url?: string
  duration?: number
  file_size?: number
  tags: string[]
  category: string
  created_at: string
  updated_at: string
  published_at?: string
  view_count: number
  like_count: number
  comment_count: number
  moderation_status?: "pending" | "approved" | "rejected"
  moderation_notes?: string
}

export interface UserActivity {
  id: string
  user_id: string
  action: string
  resource_type: string
  resource_id: string
  metadata: Record<string, any>
  ip_address: string
  user_agent: string
  created_at: string
}

export class UserManagementService {
  private static instance: UserManagementService

  private constructor() {}

  public static getInstance(): UserManagementService {
    if (!UserManagementService.instance) {
      UserManagementService.instance = new UserManagementService()
    }
    return UserManagementService.instance
  }

  // User Profile Management
  public async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await fetch(`/api/users/${userId}/profile`)
      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      return null
    }
  }

  public async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const response = await fetch(`/api/users/${userId}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error("Failed to update profile")
      return await response.json()
    } catch (error) {
      console.error("Failed to update user profile:", error)
      throw error
    }
  }

  public async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      const formData = new FormData()
      formData.append("avatar", file)

      const response = await fetch(`/api/users/${userId}/avatar`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to upload avatar")
      const { avatar_url } = await response.json()
      return avatar_url
    } catch (error) {
      console.error("Failed to upload avatar:", error)
      throw error
    }
  }

  // Content Management
  public async getUserContent(
    userId: string,
    filters?: {
      type?: string
      status?: string
      category?: string
      limit?: number
      offset?: number
    },
  ): Promise<{ content: ContentItem[]; total: number }> {
    try {
      const params = new URLSearchParams()
      if (filters?.type) params.append("type", filters.type)
      if (filters?.status) params.append("status", filters.status)
      if (filters?.category) params.append("category", filters.category)
      if (filters?.limit) params.append("limit", filters.limit.toString())
      if (filters?.offset) params.append("offset", filters.offset.toString())

      const response = await fetch(`/api/users/${userId}/content?${params}`)
      if (!response.ok) throw new Error("Failed to fetch content")
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch user content:", error)
      return { content: [], total: 0 }
    }
  }

  public async createContent(content: Omit<ContentItem, "id" | "created_at" | "updated_at">): Promise<ContentItem> {
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })
      if (!response.ok) throw new Error("Failed to create content")
      return await response.json()
    } catch (error) {
      console.error("Failed to create content:", error)
      throw error
    }
  }

  public async updateContent(contentId: string, updates: Partial<ContentItem>): Promise<ContentItem> {
    try {
      const response = await fetch(`/api/content/${contentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error("Failed to update content")
      return await response.json()
    } catch (error) {
      console.error("Failed to update content:", error)
      throw error
    }
  }

  public async deleteContent(contentId: string): Promise<void> {
    try {
      const response = await fetch(`/api/content/${contentId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete content")
    } catch (error) {
      console.error("Failed to delete content:", error)
      throw error
    }
  }

  // Content Upload
  public async uploadContent(file: File, metadata: Partial<ContentItem>): Promise<ContentItem> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("metadata", JSON.stringify(metadata))

      const response = await fetch("/api/content/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to upload content")
      return await response.json()
    } catch (error) {
      console.error("Failed to upload content:", error)
      throw error
    }
  }

  // User Activity Tracking
  public async getUserActivity(
    userId: string,
    limit = 50,
    offset = 0,
  ): Promise<{ activities: UserActivity[]; total: number }> {
    try {
      const response = await fetch(`/api/users/${userId}/activity?limit=${limit}&offset=${offset}`)
      if (!response.ok) throw new Error("Failed to fetch user activity")
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch user activity:", error)
      return { activities: [], total: 0 }
    }
  }

  public async logActivity(activity: Omit<UserActivity, "id" | "created_at">): Promise<void> {
    try {
      await fetch("/api/users/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activity),
      })
    } catch (error) {
      console.error("Failed to log activity:", error)
    }
  }

  // User Search and Discovery
  public async searchUsers(query: string, filters?: { role?: string; status?: string }): Promise<UserProfile[]> {
    try {
      const params = new URLSearchParams({ q: query })
      if (filters?.role) params.append("role", filters.role)
      if (filters?.status) params.append("status", filters.status)

      const response = await fetch(`/api/users/search?${params}`)
      if (!response.ok) throw new Error("Failed to search users")
      const { users } = await response.json()
      return users
    } catch (error) {
      console.error("Failed to search users:", error)
      return []
    }
  }

  // Follow/Unfollow System
  public async followUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to follow user")
    } catch (error) {
      console.error("Failed to follow user:", error)
      throw error
    }
  }

  public async unfollowUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to unfollow user")
    } catch (error) {
      console.error("Failed to unfollow user:", error)
      throw error
    }
  }

  public async getFollowers(userId: string): Promise<UserProfile[]> {
    try {
      const response = await fetch(`/api/users/${userId}/followers`)
      if (!response.ok) throw new Error("Failed to fetch followers")
      const { followers } = await response.json()
      return followers
    } catch (error) {
      console.error("Failed to fetch followers:", error)
      return []
    }
  }

  public async getFollowing(userId: string): Promise<UserProfile[]> {
    try {
      const response = await fetch(`/api/users/${userId}/following`)
      if (!response.ok) throw new Error("Failed to fetch following")
      const { following } = await response.json()
      return following
    } catch (error) {
      console.error("Failed to fetch following:", error)
      return []
    }
  }
}
