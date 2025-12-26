import { getAuthToken } from "@/lib/auth-client"

async function handleFetch(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    const json = (() => {
      try {
        return JSON.parse(text)
      } catch {
        return null
      }
    })()
    const message = json?.message || text || res.statusText || "API error"
    throw new Error(message)
  }
  // Try parse JSON, else return text
  try {
    return await res.json()
  } catch {
    return await res.text()
  }
}

// Build headers with Authorization if token exists
function buildHeaders(headers: Record<string, string> = {}) {
  const token = getAuthToken()
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {}
  return { "Content-Type": "application/json", ...authHeader, ...headers }
}

const API_BASE = typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL
  ? process.env.NEXT_PUBLIC_API_BASE_URL
  : ""

export async function fetchCurrentLiveStream() {
  const res = await fetch(`${API_BASE}/api/live/current`, { headers: buildHeaders(), cache: "no-store" })
  return handleFetch(res)
}

export async function fetchLiveStreamStats(streamId: string) {
  const res = await fetch(`${API_BASE}/api/live/${encodeURIComponent(streamId)}/stats`, { headers: buildHeaders(), cache: "no-store" })
  return handleFetch(res)
}

export async function getUpcomingStreams(limit = 5) {
  const res = await fetch(`${API_BASE}/api/live/upcoming?limit=${limit}`, { headers: buildHeaders(), cache: "no-store" })
  return handleFetch(res)
}

export async function followHost(hostId: string) {
  const res = await fetch(`${API_BASE}/api/hosts/${encodeURIComponent(hostId)}/follow`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({}),
  })
  return handleFetch(res)
}

// Add other helpers: featured products, add to cart, send chat (if you want HTTP fallback), etc.
export async function fetchFeaturedProducts(streamId: string) {
  const res = await fetch(`${API_BASE}/api/live/${encodeURIComponent(streamId)}/featured-products`, { headers: buildHeaders(), cache: "no-store" })
  return handleFetch(res)
}
