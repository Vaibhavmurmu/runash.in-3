"use client"

import useSWR from "swr"
import { useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type UsageMetric = "stream_minutes" | "uploads_gb" | "view_minutes" | "credits"
type UsageSummary = {
  period: string
  userId: string
  totals: Record<UsageMetric, number>
  limits: Partial<Record<UsageMetric, number>>
  utilization: Partial<Record<UsageMetric, number>>
}

const fetcher = (url: string) => fetch(url, { headers: { "x-user-id": "demo-user" } }).then((r) => r.json())

export function UsageBanner({ plan = "free", className }: { plan?: string; className?: string }) {
  const { data, error, mutate } = useSWR<UsageSummary>(`/api/billing/usage?plan=${plan}`, fetcher, {
    refreshInterval: 30_000,
  })

  useEffect(() => {
    const onTick = () => mutate()
    window.addEventListener("usage:changed", onTick)
    return () => window.removeEventListener("usage:changed", onTick)
  }, [mutate])

  const nearLimits = useMemo(() => {
    if (!data) return [] as { metric: UsageMetric; pct: number }[]
    const out: { metric: UsageMetric; pct: number }[] = []
    for (const [m, pct] of Object.entries(data.utilization || {})) {
      if (typeof pct === "number" && pct >= 0.8) out.push({ metric: m as UsageMetric, pct })
    }
    return out
  }, [data])

  if (error || !data) return null

  const items: UsageMetric[] = ["stream_minutes", "uploads_gb", "view_minutes", "credits"]

  return (
    <Card className={cn("border-amber-300/50 bg-amber-50/40 dark:bg-amber-950/20", className)}>
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="font-medium">Usage this period ({data.period})</div>
          <div className="text-sm text-muted-foreground capitalize">Plan: {plan}</div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((m) => {
            const used = data.totals[m] ?? 0
            const limit = data.limits[m]
            const pct = data.utilization[m] ? Math.round(data.utilization[m]! * 100) : 0
            return (
              <div key={m} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize">{m.replace("_", " ")}</span>
                  <span className="text-muted-foreground">
                    {used}
                    {limit ? ` / ${limit}` : ""} ({pct}%)
                  </span>
                </div>
                <Progress value={pct} />
              </div>
            )
          })}
        </div>
        {nearLimits.length > 0 && (
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm">
              You&apos;re nearing limits on{" "}
              <strong>{nearLimits.map((n) => n.metric.replace("_", " ")).join(", ")}</strong>. Consider upgrading to
              avoid interruptions.
            </div>
            <Button size="sm" onClick={() => (window.location.href = "/payment/dashboard")}>
              Upgrade plan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
