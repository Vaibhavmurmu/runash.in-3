"use server"

import { sql, getUserByEmail, getUserByUsername } from "@/lib/db"
import { createSession, deleteSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { z } from "zod"
import { ratelimit } from "@/lib/redis"
import { headers } from "next/headers"

const loginSchema = z.object({
  identifier: z.string().min(3, "Username or email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function login(formData: FormData) {
  const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1"
  const { success } = await ratelimit.limit(`login_${ip}`)

  if (!success) {
    return { error: "Too many attempts. Please try again later." }
  }

  const data = loginSchema.parse(Object.fromEntries(formData))

  // Note: In production, use bcrypt.compare here
  const user = data.identifier.includes("@")
    ? await getUserByEmail(data.identifier)
    : await getUserByUsername(data.identifier)

  if (!user || user.password_hash !== data.password) {
    return { error: "Invalid credentials" }
  }

  await createSession(user.id)
  redirect("/dashboard")
}

export async function signup(formData: FormData) {
  const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1"
  const { success } = await ratelimit.limit(`signup_${ip}`)

  if (!success) {
    return { error: "Too many attempts. Please try again later." }
  }

  const data = signupSchema.parse(Object.fromEntries(formData))

  const existingEmail = await getUserByEmail(data.email)
  if (existingEmail) return { error: "Email already exists" }

  const existingUsername = await getUserByUsername(data.username)
  if (existingUsername) return { error: "Username already exists" }

  const result = await sql<{ id: number }[]>`
    INSERT INTO users (email, username, name, password_hash, role)
    VALUES (${data.email}, ${data.username}, ${data.name}, ${data.password}, 'user')
    RETURNING id
  `

  const user = result[0]
  if (!user) return { error: "Failed to create user" }

  await createSession(user.id)
  redirect("/dashboard")
}

export async function logout() {
  await deleteSession()
  redirect("/login")
}
