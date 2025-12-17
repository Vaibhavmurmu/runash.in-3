import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"

const DATA_DIR = path.join(process.cwd(), "data")
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json")

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR)
  if (!fs.existsSync(SESSIONS_FILE)) fs.writeFileSync(SESSIONS_FILE, "[]")
}

function readSessions() {
  ensureDataDir()
  try {
    const raw = fs.readFileSync(SESSIONS_FILE, "utf-8")
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

function writeSessions(data: any[]) {
  ensureDataDir()
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  const sessions = readSessions()
  return NextResponse.json(sessions)
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const sessions = readSessions()
  const newSession = { id: `s-${Date.now()}`, title: body.title ?? "Session", created_at: new Date().toISOString() }
  sessions.unshift(newSession)
  writeSessions(sessions)
  return NextResponse.json(newSession)
}
