import { NextResponse } from "next/server"
import { getSql } from "@/lib/db/neon"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getSql()
    const [row] = await sql`SELECT * FROM public.products WHERE id = ${Number(params.id)}`
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(row)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const fields = {
      name: body.name,
      description: body.description,
      price: body.price,
      stock: body.stock,
      category: body.category,
      status: body.status,
      image: body.image,
    }
    const sql = getSql()
    const [row] = await sql /* sql */`
      UPDATE public.products
      SET
        name = COALESCE(${fields.name}, name),
        description = COALESCE(${fields.description}, description),
        price = COALESCE(${fields.price}, price),
        stock = COALESCE(${fields.stock}, stock),
        category = COALESCE(${fields.category}, category),
        status = COALESCE(${fields.status}, status),
        image = COALESCE(${fields.image}, image),
        updated_at = now()
      WHERE id = ${Number(params.id)}
      RETURNING id, name, description, price, stock, category, status, rating, sales, image
    `
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(row)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getSql()
    const res = await sql`DELETE FROM public.products WHERE id = ${Number(params.id)}`
    return NextResponse.json({ ok: true, count: res.count ?? 1 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
