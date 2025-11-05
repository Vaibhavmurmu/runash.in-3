"use client"

import { useEffect, useState } from "react"
import type { Stream, UUID } from "@/lib/types"

export function useStreams(userId?: UUID) {
  const [streams, setStreams] = useState<Stream[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    const url = userId ? `/api/streams?userId=${userId}` : "/api/streams"
    fetch(url)
      .then((r) => r.json())
      .then((json) => mounted && setStreams(json.data ?? []))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [userId])

  return {
    streams,
    loading,
    error,
    create: async (input: Partial<Stream>) => {
      const r = await fetch("/api/streams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, user_id: userId }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || "create failed")
      setStreams((prev) => [j.data, ...prev])
      return j.data as Stream
    },
    update: async (id: string, input: Partial<Stream>) => {
      const r = await fetch(`/api/streams/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || "update failed")
      setStreams((prev) => prev.map((s) => (s.id === id ? j.data : s)))
      return j.data as Stream
    },
    remove: async (id: string) => {
      const r = await fetch(`/api/streams/${id}`, { method: "DELETE" })
      if (!r.ok) throw new Error("delete failed")
      setStreams((prev) => prev.filter((s) => s.id !== id))
    },
  }
}
