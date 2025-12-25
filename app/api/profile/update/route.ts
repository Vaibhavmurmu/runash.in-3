import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name, username, platforms, contentTypes, role } = body

    if (!email) return NextResponse.json({ message: "Missing email" }, { status: 400 })

    // basic username validation when provided
    if (username && !/^[a-zA-Z0-9\-_]{3,30}$/.test(username)) {
      return NextResponse.json({ message: "Invalid username" }, { status: 400 })
    }

    // ensure username is not taken by another account if provided
    if (username) {
      const existing = await sql`
        SELECT id, email FROM users WHERE username = ${username} LIMIT 1
      `
      if (existing[0] && existing[0].email.toLowerCase() !== email.toLowerCase()) {
        return NextResponse.json({ message: "Username already taken" }, { status: 409 })
      }
    }

    const updated = await sql`
      UPDATE users
      SET
        name = ${name ?? null},
        username = ${username ?? null},
        platforms = ${platforms ? JSON.stringify(platforms) : null},
        content_types = ${contentTypes ? JSON.stringify(contentTypes) : null},
        role = ${role ?? null}
      WHERE email = ${email}
      RETURNING id, email, name, username, platforms, content_types, role
    `

    if (!updated[0]) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Profile updated", user: updated[0] }, { status: 200 })
  } catch (err) {
    console.error("profile.update error:", err)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
