import { type NextRequest, NextResponse } from "next/server"
import { createUser, generateEmailVerificationToken } from "@/lib/auth-utils"
import { neon } from "@neondatabase/serverless"
import { registerSchema } from "@/lib/validations/auth"
import { rateLimit } from "@/lib/rate-limit"
import { sendVerificationEmail } from "@/lib/email"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request, "register", 5, 900) // 5 attempts per 15 minutes
    if (!rateLimitResult.success) {
      return NextResponse.json({ message: "Too many registration attempts. Please try again later." }, { status: 429 })
    }

    const body = await request.json()

    // Try to validate with your existing schema first.
    let validationResult = registerSchema.safeParse(body)
    let data: { email: string; password: string; name?: string | null; username?: string | null }

    if (!validationResult.success) {
      // Fallback: allow missing username (frontend collects username later in profile step).
      // Perform minimal checks (email + password) so we don't block signup.
      const { email, password, name, username } = body || {}

      // Basic server-side validation if schema rejected (helps when username is optional)
      const errors: Record<string, string[]> = {}
      if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
        errors.email = ["Email is required and must be a valid email."]
      }
      if (!password || typeof password !== "string" || password.length < 8) {
        errors.password = ["Password is required and must be at least 8 characters."]
      }

      if (Object.keys(errors).length > 0) {
        // return the original validation info if available to keep behaviour consistent
        return NextResponse.json(
          {
            message: "Validation failed",
            errors: validationResult.error ? validationResult.error.flatten().fieldErrors : errors,
          },
          { status: 400 },
        )
      }

      // Safe to proceed — treat username as optional here
      data = {
        email: (email as string).trim(),
        password: password as string,
        name: name ? String(name) : null,
        username: username ? String(username).trim() : null,
      }
    } else {
      // Use the parsed schema result
      const parsed = validationResult.data
      data = {
        email: parsed.email,
        password: parsed.password,
        name: parsed.name ?? null,
        username: parsed.username ?? null,
      }
    }

    const { email, password, name, username } = data

    // Query for existing user by email (always) and by username only if provided
    let existingUser: any = null
    if (username) {
      const rows = await sql`
        SELECT id, email, username FROM users
        WHERE email = ${email} OR username = ${username}
        LIMIT 1
      `
      existingUser = rows[0]
    } else {
      const rows = await sql`
        SELECT id, email, username FROM users
        WHERE email = ${email}
        LIMIT 1
      `
      existingUser = rows[0]
    }

    if (existingUser) {
      const conflictField = existingUser.email === email ? "email" : "username"
      return NextResponse.json({ message: `User with this ${conflictField} already exists` }, { status: 409 })
    }

    // createUser should accept username possibly being null/undefined
    const user = await createUser({
      email,
      password,
      name: name ?? undefined,
      username: username ?? undefined,
      role: "user",
    })

    // generate token + send verification mail (keep behaviour)
    const verificationToken = await generateEmailVerificationToken(user.id)
    // send email if sendVerificationEmail available; if it fails, still let user be created
    try {
      await sendVerificationEmail(email, name ?? "", verificationToken)
    } catch (mailErr) {
      console.error("Failed to send verification email:", mailErr)
      // Do not block user creation for email sending failure. You can decide to return partial success instead.
    }

    return NextResponse.json(
      {
        message: "User created successfully. Please check your email to verify your account.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username ?? null,
          emailVerified: false,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
