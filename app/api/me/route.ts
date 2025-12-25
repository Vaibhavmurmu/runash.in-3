import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const email = (url.searchParams.get("email") || "").trim()

    if (!email) {
      return NextResponse.json({ message: "Missing email" }, { status: 400 })
    }

    const rows = await sql`
      SELECT id, email, name, username, platforms, content_types, role, created_at
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `
    const user = rows[0] ?? null
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (err) {
    console.error("profile.me error:", err)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
