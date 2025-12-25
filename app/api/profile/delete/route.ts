import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = body
    if (!email) return NextResponse.json({ message: "Missing email" }, { status: 400 })

    // You should require re-authentication or verify current user in real apps.
    const deleted = await sql`
      DELETE FROM users WHERE email = ${email} RETURNING id
    `
    if (!deleted[0]) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User deleted" }, { status: 200 })
  } catch (err) {
    console.error("profile.delete error:", err)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
