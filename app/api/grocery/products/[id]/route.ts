import { type NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const key = (id: string) => `grocery:product:${id}`

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const data = await redis.get(key(params.id))
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ item: data })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  if (!body?.title || typeof body.price !== "number") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
  await redis.set(key(params.id), { id: params.id, ...body })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await redis.del(key(params.id))
  return NextResponse.json({ ok: true })
}
