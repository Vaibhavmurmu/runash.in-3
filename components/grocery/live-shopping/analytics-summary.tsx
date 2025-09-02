"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fetcher = (u: string) => fetch(u).then((r) => r.json())

export default function AnalyticsSummary() {
  const { data } = useSWR("/api/grocery/analytics", fetcher, { refreshInterval: 5000 })
  const a = data || {}

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Live Streams</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">{a.streams?.liveCount ?? 0}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Scheduled</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">{a.streams?.scheduledCount ?? 0}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recordings</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">{a.recordings?.total ?? 0}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">${(a.revenue?.totalRevenue ?? 0).toFixed(2)}</CardContent>
      </Card>
    </div>
  )
}
