import { NextResponse } from 'next/server'

const RECORDING_URLS: Record<string, string> = {
  'rec-1': 'https://example.com/recordings/rec-1.mp4',
  'rec-2': 'https://example.com/recordings/rec-2.mp4',
  'rec-3': 'https://example.com/recordings/rec-3.mp4',
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const url = RECORDING_URLS[id]
  if (!url) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // In real app generate signed URL e.g., from S3 or Cloud provider
  return NextResponse.json({ url })
}
