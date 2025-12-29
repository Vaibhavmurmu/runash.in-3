import { query } from "./db"
import type { DashboardSettings } from "./types/dashboard-settings"

const TABLE_NAME = "dashboard_settings"

/**
 * Ensure the table exists. This is idempotent and safe for Neon/Postgres.
 */
export async function ensureTable() {
  await query(
    `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      user_id TEXT PRIMARY KEY,
      settings JSONB NOT NULL DEFAULT '{}',
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )`
  )
}

export async function getSettings(userId: string) {
  await ensureTable()
  const res = await query(`SELECT settings, updated_at FROM ${TABLE_NAME} WHERE user_id = $1`, [userId])
  if (res.rowCount === 0) return null
  const row = res.rows[0]
  const settings: DashboardSettings = { ...(row.settings || {}), updatedAt: row.updated_at?.toISOString?.() }
  return settings
}

export async function upsertSettings(userId: string, settings: DashboardSettings) {
  await ensureTable()
  // Use jsonb_set/COALESCE to merge existing JSON if desired, for now replace
  const res = await query(
    `INSERT INTO ${TABLE_NAME} (user_id, settings, updated_at)
     VALUES ($1, $2::jsonb, now())
     ON CONFLICT (user_id) DO UPDATE SET settings = $2::jsonb, updated_at = now()
     RETURNING settings, updated_at`,
    [userId, JSON.stringify(settings)]
  )
  if (res.rowCount === 0) return null
  const row = res.rows[0]
  const s: DashboardSettings = { ...(row.settings || {}), updatedAt: row.updated_at?.toISOString?.() }
  return s
}
