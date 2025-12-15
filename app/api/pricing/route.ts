import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const PRICING_FILE = path.join(DATA_DIR, 'pricing.json')

const DEFAULT = {
  starter: 19,
  professional: 49,
  enterprise: 99,
  updated_at: new Date().toISOString(),
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readPricing() {
  try {
    if (!fs.existsSync(PRICING_FILE)) {
      return DEFAULT
    }
    const raw = fs.readFileSync(PRICING_FILE, 'utf8')
    return JSON.parse(raw)
  } catch (e) {
    return DEFAULT
  }
}

function writePricing(data: any) {
  ensureDataDir()
  fs.writeFileSync(PRICING_FILE, JSON.stringify(data, null, 2), 'utf8')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const pricing = readPricing()
    return res.status(200).json(pricing)
  }

  // Simple admin update endpoint (POST)
  if (req.method === 'POST') {
    try {
      const body = req.body || {}
      // require update key if set in env
      const KEY = process.env.PRICING_UPDATE_KEY
      if (KEY) {
        if (!body.key || body.key !== KEY) {
          return res.status(401).json({ error: 'unauthorized' })
        }
      }

      const current = readPricing()
      const updated = {
        starter: Number(body.starter ?? current.starter),
        professional: Number(body.professional ?? current.professional),
        enterprise: Number(body.enterprise ?? current.enterprise),
        updated_at: new Date().toISOString(),
      }
      writePricing(updated)
      return res.status(200).json(updated)
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: 'failed' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end('Method Not Allowed')
}
