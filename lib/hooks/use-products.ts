"use client"

import { useEffect, useMemo, useState } from "react"
import type { Product, UUID } from "@/lib/types"

export function useProducts(userId?: UUID) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    const url = userId ? `/api/products?userId=${userId}` : "/api/products"
    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return
        setProducts(json.data ?? [])
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [userId])

  const featured = useMemo(() => products.filter((p) => p.featured), [products])

  return {
    products,
    featured,
    loading,
    error,
    create: async (input: Partial<Product>) => {
      const r = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify({ ...input, user_id: userId }),
        headers: { "Content-Type": "application/json" },
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || "create failed")
      setProducts((prev) => [j.data, ...prev])
      return j.data as Product
    },
    update: async (id: string, input: Partial<Product>) => {
      const r = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input),
        headers: { "Content-Type": "application/json" },
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || "update failed")
      setProducts((prev) => prev.map((p) => (p.id === id ? j.data : p)))
      return j.data as Product
    },
    remove: async (id: string) => {
      const r = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (!r.ok) throw new Error("delete failed")
      setProducts((prev) => prev.filter((p) => p.id !== id))
    },
  }
}
