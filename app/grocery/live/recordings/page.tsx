"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import RecordedStreamsLibrary from "@/components/grocery/live-shopping/recorded-streams-library"
import { toast } from "@/components/ui/use-toast"
import type { StreamRecording } from "@/types/live-shopping"

export default function RecordingsPage() {
  const router = useRouter()
  const [recordings, setRecordings] = useState<StreamRecording[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<"all" | "public" | "private" | "processing">("all")
  const [playing, setPlaying] = useState<StreamRecording | null>(null)

  const fetchRecordings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("limit", String(limit))
      if (query) params.set("q", query)
      if (tab && tab !== "all") params.set("filter", tab)

      const res = await fetch(`/api/grocery/live/recordings?${params.toString()}`)
      if (!res.ok) throw new Error(`Failed to load recordings: ${res.status}`)
      const data = await res.json()
      setRecordings(data.recordings)
      setTotal(data.total ?? data.recordings.length)
    } catch (err: any) {
      setError(err?.message ?? "Unknown error")
      toast({ title: "Could not load recordings", description: err?.message ?? "Unknown" })
    } finally {
      setLoading(false)
    }
  }, [page, limit, query, tab])

  useEffect(() => {
    fetchRecordings()
  }, [fetchRecordings])

  const handlePlayRecording = (recording: StreamRecording) => {
    setPlaying(recording)
    // Optimistically increment view count locally
    setRecordings((prev) => prev.map((r) => (r.id === recording.id ? { ...r, viewCount: r.viewCount + 1 } : r)))
  }

  const handleClosePlayer = () => setPlaying(null)

  const handleDownloadRecording = async (recording: StreamRecording) => {
    try {
      toast({ title: "Preparing download", description: `Preparing "${recording.title}"...` })
      const res = await fetch(`/api/grocery/live/recordings/${recording.id}/download`)
      if (!res.ok) throw new Error("Download failed")
      const data = await res.json()
      // data.url is a signed URL or direct file url
      const a = document.createElement("a")
      a.href = data.url
      a.download = ""
      a.target = "_blank"
      document.body.appendChild(a)
      a.click()
      a.remove()

      // optimistic update
      setRecordings((prev) => prev.map((r) => (r.id === recording.id ? { ...r, downloadCount: r.downloadCount + 1 } : r)))
      toast({ title: "Download started", description: `Downloading "${recording.title}"` })
    } catch (err: any) {
      toast({ title: "Download failed", description: err?.message ?? "Unknown" })
    }
  }

  const handleShareRecording = async (recording: StreamRecording) => {
    try {
      const res = await fetch(`/api/grocery/live/recordings/${recording.id}/share`, { method: "POST" })
      if (!res.ok) throw new Error("Could not create share link")
      const data = await res.json()
      await navigator.clipboard.writeText(data.shareUrl)
      toast({ title: "Link copied", description: "Recording link copied to clipboard" })
    } catch (err: any) {
      toast({ title: "Share failed", description: err?.message ?? "Unknown" })
    }
  }

  const handleCreateClip = (recording: StreamRecording) => {
    // route to a clip editor — create a route in the app to handle this
    router.push(`/grocery/live/recordings/${recording.id}/clip-editor`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-orange-100 dark:hover:bg-orange-900/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                Stream Recordings
              </h1>
              <p className="text-muted-foreground">Watch and manage your recorded live shopping streams</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              aria-label="Search recordings"
              placeholder="Search recordings..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-3 py-2 rounded-md border bg-white dark:bg-gray-800"
            />
            <Button
              variant="outline"
              onClick={() => {
                setPage(1)
                fetchRecordings()
              }}
              className="border-orange-200 dark:border-orange-800"
            >
              Search
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/grocery/live")}
              className="border-orange-200 dark:border-orange-800"
            >
              Back to Live
            </Button>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => { setTab(v as any); setPage(1) }} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Recordings</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <RecordedStreamsLibrary
              recordings={recordings}
              onPlay={handlePlayRecording}
              onDownload={handleDownloadRecording}
              onShare={handleShareRecording}
              onCreateClip={handleCreateClip}
            />
          </TabsContent>

          <TabsContent value="public" className="mt-0">
            <RecordedStreamsLibrary
              recordings={recordings}
              onPlay={handlePlayRecording}
              onDownload={handleDownloadRecording}
              onShare={handleShareRecording}
              onCreateClip={handleCreateClip}
            />
          </TabsContent>

          <TabsContent value="private" className="mt-0">
            <RecordedStreamsLibrary
              recordings={recordings}
              onPlay={handlePlayRecording}
              onDownload={handleDownloadRecording}
              onShare={handleShareRecording}
              onCreateClip={handleCreateClip}
            />
          </TabsContent>

          <TabsContent value="processing" className="mt-0">
            <RecordedStreamsLibrary
              recordings={recordings}
              onPlay={handlePlayRecording}
              onDownload={handleDownloadRecording}
              onShare={handleShareRecording}
              onCreateClip={handleCreateClip}
            />
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Recordings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recordings.reduce((sum, r) => sum + (r.viewCount || 0), 0)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recordings.reduce((sum, r) => sum + (r.downloadCount || 0), 0)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recordings.filter((r) => r.isProcessing).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div>
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Prev
            </Button>
            <Button onClick={() => setPage((p) => p + 1)} disabled={page * limit >= total}>
              Next
            </Button>
          </div>
        </div>

        {/* Player modal */}
        {playing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={playing.thumbnailUrl} alt="thumb" className="w-20 h-12 object-cover rounded" />
                  <div>
                    <div className="font-semibold">{playing.title}</div>
                    <div className="text-sm text-muted-foreground">{playing.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => handleDownloadRecording(playing)}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => handleClosePlayer()}>Close</Button>
                </div>
              </div>
              <div className="p-4">
                <video key={playing.recordingUrl} src={playing.recordingUrl} controls className="w-full h-96 bg-black" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
