import type { NextApiRequest, NextApiResponse } from "next"
import { readData, writeData } from "./utils"
import { v4 as uuidv4 } from "uuid"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).end("Method Not Allowed")
  }

  const { streamId, email } = req.body || {}
  if (!streamId || !email) return res.status(400).send("Missing streamId or email")

  const data = await readData()
  const invite = { id: uuidv4(), streamId, email, sentAt: new Date().toISOString() }

  data.invites = [invite, ...(data.invites || [])]
  await writeData(data)

  // Simulate sending an email (replace with SendGrid / SES in prod)
  console.log(`Invite sent to ${email} for stream ${streamId}`)

  res.status(201).json({ ok: true })
}
