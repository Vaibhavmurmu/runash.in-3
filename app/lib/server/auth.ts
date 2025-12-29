// Server-side helper to verify JWTs in Next.js API routes
import jwt from "jsonwebtoken"

type TokenPayload = {
  sub: string
  email?: string
  iat?: number
  exp?: number
  [k: string]: any
}

const JWT_SECRET = process.env.JWT_SECRET || "change-me"

export function verifyAuthToken(authHeader?: string): { userId: string } | null {
  if (!authHeader) return null
  const m = authHeader.match(/^Bearer (.+)$/)
  if (!m) return null
  const token = m[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload
    if (!payload || !payload.sub) return null
    return { userId: String(payload.sub) }
  } catch (err) {
    return null
  }
}
