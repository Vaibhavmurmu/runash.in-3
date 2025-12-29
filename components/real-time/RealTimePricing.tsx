"use client"

import { useEffect, useRef, useState } from "react"

/**
 * usePricing - polls a pricing endpoint and returns latest numeric prices
 * - Expects an endpoint at /api/pricing returning JSON like:
 *   { starter: 19, professional: 49, enterprise: 99, updated_at: "ISO" }
 *
 * The hook gracefully falls back to default static prices when endpoint fails.
 */

type Prices = {
  starter: number
  professional: number
  enterprise: number
  updated_at?: string
}

const DEFAULT_PRICES: Prices = {
  starter: 19,
  professional: 49,
  enterprise: 99,
}

export function usePricing(pollInterval = 10000) {
  const [prices, setPrices] = useState<Prices | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<string>("unknown")
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    let timer: number | undefined

    async function fetchPrices() {
      setStatus("fetching")
      try {
        // We try a local API route first — mirror this on serverless as needed.
        const res = await fetch("/api/pricing", { cache: "no-store" })
        if (!res.ok) throw new Error("no-pricing")
        const data = await res.json()
        if (!mounted.current) return
        setPrices({
          starter: Number(data.starter ?? DEFAULT_PRICES.starter),
          professional: Number(data.professional ?? DEFAULT_PRICES.professional),
          enterprise: Number(data.enterprise ?? DEFAULT_PRICES.enterprise),
          updated_at: data.updated_at,
        })
        setStatus("live")
      } catch (err) {
        // fallback to defaults and mark degraded
        setPrices(DEFAULT_PRICES)
        setStatus("degraded")
      } finally {
        if (mounted.current) setLoading(false)
      }
    }

    fetchPrices()
    timer = window.setInterval(fetchPrices, pollInterval)

    return () => {
      mounted.current = false
      if (timer) clearInterval(timer)
    }
  }, [pollInterval])

  return { prices, loading, status }
}
