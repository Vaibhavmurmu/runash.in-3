import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const NEWS_FILE = path.join(DATA_DIR, 'newsletter.json')

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readList() {
  try {
    if (!fs.existsSync(NEWS_FILE)) return []
    const raw = fs.readFileSync(NEWS_FILE, 'utf8')
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

function writeList(list: any[]) {
  ensureDataDir()
  fs.writeFileSync(NEWS_FILE, JSON.stringify(list, null, 2), 'utf8')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, consent = true, location = null, timestamp = null } = req.body || {}
      if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ error: 'invalid_email' })
      }

      const list = readList()
      const exists = list.find((s: any) => s.email.toLowerCase() === email.toLowerCase())
      if (exists) {
        return res.status(200).json({ status: 'already_subscribed' })
      }

      const record = {
        email,
        consent: Boolean(consent),
        location,
        timestamp: timestamp || new Date().toISOString(),
        source: req.headers['x-forwarded-for'] || req.socket.remoteAddress || null,
      }

      list.push(record)
      writeList(list)

      return res.status(201).json({ status: 'subscribed' })
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: 'failed' })
    }
  }

  // For GET — return a safe summary count
  if (req.method === 'GET') {
    try {
      const list = readList()
      return res.status(200).json({ count: list.length })
    } catch (e) {
      return res.status(500).json({ error: 'failed' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end('Method Not Allowed')
}

