import { type NextRequest, NextResponse } from "next/server"
import { getUsageSummary, incrementUsage, type UsageMetric } from "@/lib/billing-usage"

async function getUserIdFromSession(req: NextRequest): Promise<string | null> {
  return req.headers.get("x-user-id") // placeholder; integrate with your auth
}

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromSession(req)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const plan = (req.nextUrl.searchParams.get("plan") || "free") as any
  const period = req.nextUrl.searchParams.get("period") || undefined
  const summary = await getUsageSummary(userId, plan, period)
  return NextResponse.json(summary)
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromSession(req)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body || typeof body.metric !== "string" || typeof body.amount !== "number") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
  const metric = body.metric as UsageMetric
  const amount = body.amount
  const period = body.period as string | undefined

  await incrementUsage({ userId, metric, amount, period })
  return NextResponse.json({ ok: true })
}

export const dynamic = "force-dynamic"
