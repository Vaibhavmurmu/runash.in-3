import { type NextRequest, NextResponse } from "next/server"
import { createUser, generateEmailVerificationToken } from "@/lib/auth-utils"
import { neon } from "@neondatabase/serverless"
import { registerSchema } from "@/lib/validations/auth"
import { rateLimit } from "@/lib/rate-limit"
import { sendVerificationEmail } from "@/lib/email"
import bcrypt from "bcryptjs"
import pool from "@/lib/db"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request, "register", 5, 900) // 5 attempts per 15 minutes
    if (!rateLimitResult.success) {
      return NextResponse.json({ message: "Too many registration attempts. Please try again later." }, { status: 429 })
    }

    const body = await request.json()

    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { email, password, name, username } = validationResult.data

    const [existingUser] = await sql`
      SELECT id, email, username FROM users 
      WHERE email = ${email} OR username = ${username}
    `

    if (existingUser) {
      const conflictField = existingUser.email === email ? "email" : "username"
      return NextResponse.json({ message: `User with this ${conflictField} already exists` }, { status: 409 })
    }

    const user = await createUser({
      email,
      password,
      name,
      username,
      role: "user",
    })

    const verificationToken = await generateEmailVerificationToken(user.id)
    await sendVerificationEmail(email, name, verificationToken)

    return NextResponse.json(
      {
        message: "User created successfully. Please check your email to verify your account.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          emailVerified: false,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }

  const body = await req.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      const exists = await client.query("SELECT id FROM users WHERE email = $1 LIMIT 1", [email.toLowerCase()])
      if (exists.rowCount > 0) {
        return NextResponse.json({ error: "Email already registered" }, { status: 400 })
      }

      const hashed = bcrypt.hashSync(password, 10)
      const insert = await client.query(
        "INSERT INTO users (email, password_hash, name, created_at) VALUES ($1, $2, $3, now()) RETURNING id, email, name",
        [email.toLowerCase(), hashed, name || null]
      )

      const user = insert.rows[0]
      return NextResponse.json({ message: "Registered", user }, { status: 201 })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error("Register error", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}





    
      
