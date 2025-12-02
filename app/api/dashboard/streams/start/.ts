import type { NextApiRequest, NextApiResponse } from "next"
import { readData, writeData } from "./utils"
import { v4 as uuidv4 } from "uuid"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).end("Method Not Allowed")
  }

  const { title, category } = req.body || {}
  if (!title) return res.status(400).send("Missing title")

  const data = await readData()
  const id = uuidv4()
  const url = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/stream/${id}`

  const newStream = {
    id,
    title,
    category,
    date: new Date().toISOString(),
    viewers: 0,
    duration: null,
    url,
  }

  data.recent = [newStream, ...(data.recent || [])].slice(0, 20)
  await writeData(data)

  // NOTE: In a real app you'd create a live session, generate RTMP keys, auth, etc.
  res.status(201).json({ id, url })
}
