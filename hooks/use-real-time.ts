"use client"

import { useEffect, useState } from "react"
import { neon } from "@/lib/neon/client"
import { useAuth } from "@/lib/auth/auth-context"

export function useRealtimeTransactions() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    if (!user) return

    const channel = neon
      .channel("transactions")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
          filter: `or(sender_id.eq.${user.id},receiver_id.eq.${user.id})`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTransactions((prev) => [payload.new, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setTransactions((prev) => prev.map((txn) => (txn.id === payload.new.id ? payload.new : txn)))
          }
        },
      )
      .subscribe()

    return () => {
      neon.removeChannel(channel)
    }
  }, [user])

  return transactions
}

export function useRealtimeNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (!user) return

    const channel = neon
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev])
        },
      )
      .subscribe()

    return () => {
      neon.removeChannel(channel)
    }
  }, [user])

  return notifications
  }
