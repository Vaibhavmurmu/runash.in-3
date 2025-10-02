import { NextResponse } from "next/server"
import { getSql } from "@/lib/db/neon"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getSql()
    const [order] = await sql /* sql */`
      SELECT o.*, COALESCE(json_agg(json_build_object('name', oi.name, 'quantity', oi.quantity, 'price', oi.price))
                           FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
      FROM public.orders o
      LEFT JOIN public.order_items oi ON oi.order_id = o.id
      WHERE o.id = ${Number(params.id)}
      GROUP BY o.id
    `
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(order)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json()
    const sql = getSql()
    const [row] = await sql /* sql */`UPDATE public.orders SET status = COALESCE(${status}, status), updated_at = now()
                          WHERE id = ${Number(params.id)} RETURNING id, status`
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(row)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
