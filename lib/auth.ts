import { cookies } from "next/headers"
import { sql, getUserById, type User, type UserSession } from "@/lib/db"

const SESSION_COOKIE_NAME = "auth_session"

export async function getSession(): Promise<{ user: User | null; session: UserSession | null }> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) return { user: null, session: null }

  try {
    const sessionResult = await sql<UserSession[]>`
      SELECT * FROM user_sessions 
      WHERE session_token = ${sessionToken} 
      AND expires_at > NOW() 
      LIMIT 1
    `
    const session = sessionResult[0] || null

    if (!session) return { user: null, session: null }

    const user = await getUserById(session.user_id)
    return { user, session }
  } catch (error) {
    console.error("[v0] Session verification error:", error)
    return { user: null, session: null }
  }
}

export async function createSession(userId: number): Promise<string> {
  const sessionToken = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days

  await sql`
    INSERT INTO user_sessions (user_id, session_token, expires_at)
    VALUES (${userId}, ${sessionToken}, ${expiresAt})
  `

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })

  return sessionToken
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (sessionToken) {
    await sql`DELETE FROM user_sessions WHERE session_token = ${sessionToken}`
    cookieStore.delete(SESSION_COOKIE_NAME)
  }
}
