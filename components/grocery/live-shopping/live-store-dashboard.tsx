"use client"

import useSWR from "swr"
import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import LiveStreamPlayer from "@/components/grocery/live-shopping/live-stream-player"
import LiveStreamChat from "@/components/grocery/live-shopping/live-stream-chat"
import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"

type Product = {
  id: string
  title: string
  price: number
  image?: string
  description?: string
  inventory?: number
  tags?: string[]
}

type Recording = {
  id: string
  title: string
  previewUrl?: string
  createdAt?: string
}

type StreamMeta = {
  id: string
  title: string
  status: "live" | "scheduled" | "ended"
  hlsUrl?: string
  scheduledAt?: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function LiveStoreDashboard() {
  const { addItem } = useCart()
  const [query, setQuery] = useState("")

  const { data: productsRes } = useSWR<{ items: Product[] }>("/api/grocery/products/overlay", fetcher, {
    revalidateOnFocus: true,
  })
  const products = productsRes?.items ?? []

  const { data: streamsRes } = useSWR<{ items: StreamMeta[] }>("/api/live-streams", fetcher, { refreshInterval: 5000 })
  const streams = streamsRes?.items ?? []
  const live = streams.find((s) => s.status === "live")
  const upcoming = streams.filter((s) => s.status === "scheduled").slice(0, 6)

  const { data: recRes } = useSWR<{ items: Recording[] }>("/api/recordings", fetcher)
  const recordings = recRes?.items ?? []

  const filtered = useMemo(() => {
    if (!query) return products
    const q = query.toLowerCase()
    return products.filter((p) =>
      [p.title, p.description, ...(p.tags ?? [])].filter(Boolean).some((t) => (t as string).toLowerCase().includes(q)),
    )
  }, [products, query])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className={cn("text-2xl font-semibold tracking-tight text-balance")}>Organic Live Store</h1>
          <p className="text-sm text-muted-foreground">
            Watch live demos, chat in real-time, and shop hand-picked organic products.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64"
          />
          <Link href="/schedule">
            <Button variant="outline">Schedule</Button>
          </Link>
          <Link href="/checkout">
            <Button>Checkout</Button>
          </Link>
        </div>
      </div>

      {/* Live section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {live ? <Badge variant="destructive">LIVE</Badge> : <Badge variant="secondary">Offline</Badge>}
              {live ? live.title : "No live stream right now"}
            </CardTitle>
            {live && live.hlsUrl ? (
              <a href="#watch-live" className="text-sm text-primary underline">
                Watch Live
              </a>
            ) : null}
          </CardHeader>
          <CardContent id="watch-live">
            {live?.hlsUrl ? (
              <LiveStreamPlayer hlsUrl={live.hlsUrl} />
            ) : (
              <div className="aspect-video w-full rounded-md bg-muted grid place-items-center text-muted-foreground">
                Upcoming streams and on‑demand recordings below
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Chat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Live chat component handles auth internally */}
            <LiveStreamChat />
          </CardContent>
        </Card>
      </div>

      {/* Featured / Products */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Products</h2>
          <Link href="/grocery">
            <Button variant="ghost" className="text-sm">
              View all
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <div className="aspect-square w-full bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image || "/placeholder.svg?height=600&width=600&query=organic%20produce"}
                  alt={p.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium line-clamp-1">{p.title}</div>
                    <div className="text-sm text-muted-foreground">${(p.price ?? 0).toFixed(2)}</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addItem({ id: p.id, name: p.title, price: p.price, quantity: 1, image: p.image })}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Upcoming streams */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming</h2>
          <Link href="/schedule">
            <Button variant="ghost" className="text-sm">
              Manage
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((s) => (
            <Card key={s.id}>
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1">{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Scheduled {s.scheduledAt ? new Date(s.scheduledAt).toLocaleString() : "TBA"}
              </CardContent>
            </Card>
          ))}
          {!upcoming.length && <div className="text-sm text-muted-foreground">No scheduled streams</div>}
        </div>
      </section>

      {/* On-demand recordings */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">On‑Demand</h2>
          <Link href="/recordings">
            <Button variant="ghost" className="text-sm">
              View library
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {recordings.slice(0, 8).map((r) => (
            <Link key={r.id} href={`/recordings?id=${encodeURIComponent(r.id)}`}>
              <Card className="overflow-hidden">
                <div className="aspect-video w-full bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.previewUrl || "/placeholder.svg?height=360&width=640&query=recording%20thumbnail"}
                    alt={r.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="pt-3">
                  <div className="text-sm font-medium line-clamp-1">{r.title}</div>
                  {r.createdAt ? (
                    <div className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</div>
                  ) : null}
                </CardContent>
              </Card>
            </Link>
          ))}
          {!recordings.length && <div className="text-sm text-muted-foreground">No recordings yet</div>}
        </div>
      </section>
    </div>
  )
}
