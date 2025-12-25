import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  // Would normally generate a short share token and persist it with expiry
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://runash.in'
  const shareUrl = `${origin}/grocery/live/recordings/${id}`
  return NextResponse.json({ shareUrl })
}
