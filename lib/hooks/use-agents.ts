"use client"

import { useEffect, useState } from "react"
import { neon } from "@/lib/neon/client"
import type { Database } from "@/lib/neon/types"
import { v4 as uuidv4 } from "uuid"

export type AIAgent = Database["public"]["Tables"]["ai_agents"]["Row"]
export type AIAgentInsert = Database["public"]["Tables"]["ai_agents"]["Insert"]
export type AIAgentUpdate = Database["public"]["Tables"]["ai_agents"]["Update"]

export function useAIAgents(userId?: string) {
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchAgents()
      subscribeToAgents()
    }
  }, [userId])

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const { data, error } = await neon
        .from("ai_agents")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })

      if (error) throw error
      setAgents(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const subscribeToAgents = () => {
    const subscription = neon
      .channel("ai_agents")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ai_agents",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setAgents((prev) => [payload.new as AIAgent, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setAgents((prev) => prev.map((agent) => (agent.id === payload.new.id ? (payload.new as AIAgent) : agent)))
          } else if (payload.eventType === "DELETE") {
            setAgents((prev) => prev.filter((agent) => agent.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }

  const createAgent = async (agentData: Omit<AIAgentInsert, "id" | "user_id">) => {
    try {
      const newAgent: AIAgentInsert = {
        id: uuidv4(),
        user_id: userId!,
        ...agentData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await neon.from("ai_agents").insert(newAgent).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "An error occurred" }
    }
  }

  const updateAgent = async (id: string, updates: AIAgentUpdate) => {
    try {
      const { data, error } = await neon
        .from("ai_agents")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : "An error occurred" }
    }
  }

  const deleteAgent = async (id: string) => {
    try {
      const { error } = await neon.from("ai_agents").delete().eq("id", id)

      if (error) throw error
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : "An error occurred" }
    }
  }

  const toggleAgentStatus = async (id: string, enabled: boolean) => {
    return updateAgent(id, {
      enabled,
      status: enabled ? "active" : "disabled",
    })
  }

  return {
    agents,
    loading,
    error,
    createAgent,
    updateAgent,
    deleteAgent,
    toggleAgentStatus,
    refetch: fetchAgents,
  }
}
