"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Calendar,
  Tag,
  Plus,
  Zap,
  Bug,
  Shield,
  ArrowRight,
  Bell,
  Download,
  Star,
  GitBranch,
  Info,
  Loader2,
  ExternalLink,
} from "lucide-react"
import { useRouter } from "next/navigation"

type GitHubAsset = {
  id: number
  name: string
  browser_download_url: string
  download_count: number
  content_type?: string
}

type GitHubRelease = {
  id: number
  tag_name: string
  name: string | null
  body: string | null
  html_url: string
  published_at: string | null
  assets: GitHubAsset[]
  draft: boolean
  prerelease: boolean
}

type ChangelogEntry = {
  id: number
  version: string
  date: string
  type: "major" | "minor" | "patch" | "other"
  title: string
  description: string
  categories: string[]
  changes: { type: string; title: string; description: string; impact?: "low" | "medium" | "high" }[]
  downloads: number
  feedback?: { positive: number; negative: number }
  url: string
}

export default function ChangelogPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)
  const [releases, setReleases] = useState<GitHubRelease[]>([])
  const [page, setPage] = useState(1)
  const [perPage] = useState(6)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  // Fetch releases from GitHub Releases API for this repository
  useEffect(() => {
    const abortController = new AbortController()
    async function fetchReleases() {
      setError(null)
      setIsLoading(true)
      try {
        const resp = await fetch(
          `https://api.github.com/repos/rammurmu/runash.in/releases?per_page=${perPage}&page=${page}`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
            signal: abortController.signal,
          },
        )
        if (!resp.ok) {
          const msg =
            resp.status === 403
              ? "GitHub API rate limit reached. Try again later or provide an authenticated request."
              : `Failed to load releases: ${resp.status} ${resp.statusText}`
          throw new Error(msg)
        }
        const data: GitHubRelease[] = await resp.json()
        // When page === 1, replace; otherwise append
        setReleases((prev) => (page === 1 ? data : [...prev, ...data]))
        setHasMore(data.length === perPage)
      } catch (err: any) {
        if (!abortController.signal.aborted) {
          setError(err.message ?? "Unknown error while fetching releases")
        }
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    }

    // when page changes we set isLoadingMore for >1
    if (page === 1) {
      fetchReleases()
    } else {
      setIsLoadingMore(true)
      fetchReleases()
    }

    return () => abortController.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage])

  // Map GitHub releases to our ChangelogEntry structure
  const changelogEntries: ChangelogEntry[] = useMemo(() => {
    return releases
      .filter((r) => !r.draft) // skip drafts
      .map((r) => {
        const title = r.name ?? r.tag_name
        const date = r.published_at ?? new Date().toISOString()
        const body = r.body ?? ""
        // Derive simple categories from tag name and body keywords
        const categories = new Set<string>()
        const low = body.toLowerCase()
        const tag = r.tag_name.toLowerCase()
        if (tag.includes("alpha") || tag.includes("beta") || r.prerelease) categories.add("pre-release")
        if (tag.includes("security") || low.includes("security")) categories.add("security")
        if (low.includes("fix") || low.includes("bug") || low.includes("hotfix")) categories.add("fix")
        if (low.includes("improv") || low.includes("perf") || low.includes("optimi")) categories.add("improvement")
        if (low.includes("ai") || low.includes("llm") || low.includes("machine learning")) categories.add("ai")
        if (low.includes("stream") || low.includes("record") || low.includes("analytics")) categories.add("streaming")
        if (low.includes("breaking") || low.includes("major")) categories.add("breaking")
        // fallback
        if (categories.size === 0) categories.add("other")

        // Try to extract changes from the body bullet lists (simple heuristics)
        const changes: ChangelogEntry["changes"] = []
        const lines = body.split("\n").map((l) => l.trim())
        for (const l of lines) {
          // bullet point like "- Fixed xyz" or "* Added abc"
          if (/^[-*+]\s+/.test(l)) {
            const text = l.replace(/^[-*+]\s+/, "")
            // derive type
            let t = "other"
            if (/(fix|fixed|bug)/i.test(text)) t = "fix"
            else if (/(add|new|introduc|support)/i.test(text)) t = "new"
            else if (/(improv|optimi|perf|speed|reduc)/i.test(text)) t = "improvement"
            else if (/(security|auth|encryp|oauth)/i.test(text)) t = "security"
            const impact: any = /high|critical|breaking/i.test(text) ? "high" : /medium/i.test(text) ? "medium" : "low"
            changes.push({ type: t, title: text, description: text, impact })
          }
        }

        // If no parsed changes, use a short summary
        if (changes.length === 0 && body.length > 0) {
          const summary = body.split("\n\n")[0].split("\n")[0].slice(0, 250)
          changes.push({ type: "other", title: summary, description: summary })
        }

        // Download counts: sum asset download_count, fallback to 0
        const downloads = r.assets?.reduce((s, a) => s + (a.download_count || 0), 0) ?? 0

        // Type: derive from tag version pattern (semver major.minor.patch) - if major changed mark major
        let type: ChangelogEntry["type"] = "other"
        const semver = r.tag_name.match(/v?(\d+)\.(\d+)\.(\d+)/)
        if (semver) {
          const [, major, minor] = semver.map(Number)
          // simple heuristic: if major > 0 and minor === 0 then minor or major? Keep minor default.
          if (major > 0 && minor === 0) type = "major"
          else if (minor > 0) type = "minor"
          else type = "patch"
        }

        return {
          id: r.id,
          version: r.tag_name,
          date,
          type,
          title,
          description: body ? body.split("\n")[0] : title,
          categories: Array.from(categories),
          changes,
          downloads,
          feedback: undefined,
          url: r.html_url,
        }
      })
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  }, [releases])

  // Derived categories with counts
  const categories = useMemo(() => {
    const counts: Record<string, number> = { all: changelogEntries.length }
    for (const e of changelogEntries) {
      for (const c of e.categories) {
        counts[c] = (counts[c] || 0) + 1
      }
    }
    // convert to array with some friendly names
    const mapName: Record<string, string> = {
      all: "All Changes",
      new: "New Features",
      improvement: "Improvements",
      fix: "Bug Fixes",
      security: "Security",
      ai: "AI Features",
      "pre-release": "Pre-releases",
      streaming: "Streaming",
      breaking: "Breaking Changes",
      other: "Other",
    }
    const result = Object.keys(counts).map((id) => ({
      id,
      name: mapName[id] ?? id,
      count: counts[id],
    }))
    // keep a consistent order: all first, then common ones, then rest
    const order = ["all", "new", "improvement", "fix", "security", "ai", "streaming", "pre-release", "breaking", "other"]
    result.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
    return result
  }, [changelogEntries])

  // Filtering
  const filteredEntries = changelogEntries.filter((entry) => {
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch =
      q.length === 0 ||
      entry.title.toLowerCase().includes(q) ||
      entry.description.toLowerCase().includes(q) ||
      entry.changes.some((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    const matchesCategory = selectedCategory === "all" || entry.categories.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "new":
        return <Plus className="h-4 w-4 text-green-600" />
      case "improvement":
        return <Zap className="h-4 w-4 text-blue-600" />
      case "fix":
        return <Bug className="h-4 w-4 text-orange-600" />
      case "security":
        return <Shield className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getChangeColor = (type: string) => {
    switch (type) {
      case "new":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "improvement":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "fix":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      case "security":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getVersionBadgeColor = (type: string) => {
    switch (type) {
      case "major":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "minor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "patch":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  // Expand / collapse details panel using selectedVersion (id)
  const toggleDetails = (id: number) => {
    setSelectedVersion((prev) => (prev === id ? null : id))
  }

  // Load more handler: increments page, fetch effect will append
  const loadMore = () => {
    if (!hasMore) return
    setPage((p) => p + 1)
  }

  // New "open on GitHub" action
  const openOnGitHub = (url: string) => {
    window.open(url, "_blank", "noopener")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-purple-600/10 to-blue-600/10 dark:from-purple-600/5 dark:to-blue-600/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
              Changelog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Releases and notes pulled directly from our GitHub Releases. Search, filter and explore the details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search release notes, titles, and changes..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setPage(1) // reset paging for search clarity
                  }}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={() => setSelectedCategory("all")}>
                <Bell className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 space-y-6 sticky top-24 self-start">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id)
                      setPage(1)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category.id
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="capitalize">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Release Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fetched Releases</span>
                  <span className="text-sm font-medium">{releases.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Downloaded Assets</span>
                  <span className="text-sm font-medium">
                    {releases.reduce((sum, r) => sum + (r.assets?.reduce((s, a) => s + (a.download_count || 0), 0) || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Unique Categories</span>
                  <span className="text-sm font-medium">{categories.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subscribe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Get notified about releases. Subscribe to GitHub releases or RSS.
                </p>
                <div className="space-y-2">
                  <Button className="w-full" size="sm" onClick={() => openOnGitHub("https://github.com/rammurmu/runash.in/releases")}>
                    <GitBranch className="h-4 w-4 mr-2" />
                    View on GitHub
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="sm" onClick={() => openOnGitHub("/rss.xml")}>
                    <Star className="h-4 w-4 mr-2" />
                    RSS Feed
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {selectedCategory === "all"
                  ? "All Releases"
                  : categories.find((c) => c.id === selectedCategory)?.name ?? "Filtered Releases"}
              </h2>
              <div className="text-sm text-gray-600">
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                  </span>
                ) : (
                  <span>{filteredEntries.length} updates found</span>
                )}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 rounded-md bg-red-50 text-red-700">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="space-y-6">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getVersionBadgeColor(entry.type)}>v{entry.version}</Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                            <Calendar className="h-4 w-4" />
                            {new Date(entry.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>

                        <CardTitle className="text-lg md:text-xl mb-1">{entry.title}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{entry.description}</p>
                      </div>

                      <div className="flex flex-col items-end gap-2 ml-4">
                        <div className="text-right text-sm">
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                            <Download className="h-4 w-4" />
                            {entry.downloads.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1 text-green-600">
                            <Star className="h-4 w-4" />
                            {entry.feedback?.positive ?? "—"}%
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => toggleDetails(entry.id)}>
                            {selectedVersion === entry.id ? "Hide" : "View"} Details
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openOnGitHub(entry.url)}>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            GitHub
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {entry.changes.map((change, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <div className="mt-0.5">{getChangeIcon(change.type)}</div>
                          <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                              <Badge className={`text-xs ${getChangeColor(change.type)}`}>{change.type}</Badge>
                              {change.impact === "high" && (
                                <Badge variant="outline" className="text-xs border-red-300 text-red-600">
                                  High Impact
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-medium mb-1">{change.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{change.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedVersion === entry.id && (
                      <div className="mt-6 pt-4 border-t space-y-4">
                        <div className="prose max-w-none dark:prose-invert text-sm leading-relaxed whitespace-pre-wrap">
                          {/* We show the full description/body for the item */}
                          {entry.description ? entry.description : "No release notes available."}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {entry.categories.map((c, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {c}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={() => openOnGitHub(entry.url)}>Open on GitHub</Button>
                          <Button variant="outline" onClick={() => navigator.clipboard?.writeText(entry.url)}>
                            Copy Link
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No results */}
            {!isLoading && filteredEntries.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No updates found</h3>
                <p className="text-gray-600 dark:text-gray-300">Try adjusting your search query or category filter</p>
              </div>
            )}

            {/* Load More */}
            <div className="text-center mt-8">
              {isLoadingMore ? (
                <Button variant="outline" disabled>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </Button>
              ) : hasMore ? (
                <Button variant="outline" onClick={loadMore}>
                  Load More Releases
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <div className="text-sm text-gray-500">No more releases</div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Never Miss an Update</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Subscribe to our releases on GitHub to receive notifications for new releases and important fixes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input placeholder="Enter your email" className="bg-white/10 border-white/20 text-white placeholder:text-white/70" />
            <Button className="bg-white text-purple-600 hover:bg-gray-100">Subscribe</Button>
          </div>
          <p className="mt-4 text-sm opacity-75">No spam, unsubscribe at any time</p>
        </div>
      </section>
    </div>
  )
}
