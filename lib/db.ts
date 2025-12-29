"use server"

import { Pool } from "pg"

// Use DATABASE_URL (Neon connection string). Neon often requires ssl.rejectUnauthorized = false
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL is not set")
}

declare global {
  // allow global pooling during development to avoid exhausting connections
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined
}

const pool: Pool = global._pgPool || new Pool({ connectionString, ssl: { rejectUnauthorized: false } as any })

if (process.env.NODE_ENV !== "production") global._pgPool = pool

export default pool
