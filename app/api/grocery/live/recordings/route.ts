import { NextResponse } from 'next/server'

// Simple in-memory mock dataset. In a real production app replace with DB calls.
const MOCK_RECORDINGS = [
  {
    id: 'rec-1',
    streamId: 'stream-1',
    title: 'Organic Produce Showcase - Fresh Spring Vegetables',
    description: 'Featuring the best organic vegetables of the season with special discounts',
    thumbnailUrl: '/placeholder.svg?height=720&width=1280',
    recordingUrl: 'https://example.com/recordings/rec-1.mp4',
    duration: 3600,
    fileSize: 2.5 * 1024 * 1024 * 1024,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
    isProcessing: false,
    isPublic: true,
    viewCount: 245,
    downloadCount: 12,
    highlights: [],
    chapters: [],
    quality: 'high',
    format: 'mp4',
  },
  {
    id: 'rec-2',
    streamId: 'stream-2',
    title: 'Healthy Cooking with Organic Ingredients',
    description: 'Live cooking demonstration using fresh organic ingredients',
    thumbnailUrl: '/placeholder.svg?height=720&width=1280',
    recordingUrl: 'https://example.com/recordings/rec-2.mp4',
    duration: 2700,
    fileSize: 1.8 * 1024 * 1024 * 1024,
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 2700000).toISOString(),
    isProcessing: false,
    isPublic: true,
    viewCount: 187,
    downloadCount: 8,
    highlights: [],
    chapters: [],
    quality: 'medium',
    format: 'mp4',
  },
  {
    id: 'rec-3',
    streamId: 'stream-3',
    title: 'Farm Tour - Behind the Scenes',
    description: 'Virtual tour of our organic farm and growing practices',
    thumbnailUrl: '/placeholder.svg?height=720&width=1280',
    recordingUrl: 'https://example.com/recordings/rec-3.mp4',
    duration: 4500,
    fileSize: 3.2 * 1024 * 1024 * 1024,
    startTime: new Date().toISOString(),
    isProcessing: true,
    isPublic: false,
    viewCount: 0,
    downloadCount: 0,
    highlights: [],
    chapters: [],
    quality: 'high',
    format: 'mp4',
  },
]

export async function GET(request: Request) {
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1', 10)
  const limit = parseInt(url.searchParams.get('limit') || '12', 10)
  const q = url.searchParams.get('q') || ''
  const filter = url.searchParams.get('filter') || 'all'

  let items = MOCK_RECORDINGS.slice()

  if (filter === 'public') items = items.filter((r) => r.isPublic)
  if (filter === 'private') items = items.filter((r) => !r.isPublic)
  if (filter === 'processing') items = items.filter((r) => r.isProcessing)

  if (q) {
    const lower = q.toLowerCase()
    items = items.filter((r) => r.title.toLowerCase().includes(lower) || (r.description || '').toLowerCase().includes(lower))
  }

  const total = items.length
  const start = (page - 1) * limit
  const paged = items.slice(start, start + limit)

  return NextResponse.json({ recordings: paged, total })
}
