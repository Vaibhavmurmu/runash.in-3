import { neon } from "@/lib/neon/client"
import type { Database } from "@/lib/neon/types"

type Notification = Database["public"]["Tables"]["notifications"]["Row"]
type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"]

export class NotificationService {
  static async getNotifications(userId: string): Promise<{ data: Notification[] | null; error: any }> {
    try {
      const { data, error } = await neon
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async markAsRead(notificationId: string): Promise<{ error: any }> {
    try {
      const { error } = await neon.from("notifications").update({ is_read: true }).eq("id", notificationId)

      return { error }
    } catch (error) {
      return { error }
    }
  }

  static async markAllAsRead(userId: string): Promise<{ error: any }> {
    try {
      const { error } = await neon
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false)

      return { error }
    } catch (error) {
      return { error }
    }
  }

  static async createNotification(notification: NotificationInsert): Promise<{ error: any }> {
    try {
      const { error } = await neon.from("notifications").insert(notification)

      return { error }
    } catch (error) {
      return { error }
    }
  }

  static async subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    return neon
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as Notification)
        },
      )
      .subscribe()
  }
}
