import type { NextApiRequest, NextApiResponse } from "next"
import { addSchedule, listSchedules, removeSchedule } from "@/lib/scheduler"

/**
 * API to manage scheduled reports from the frontend.
 * - GET -> list existing schedules
 * - POST -> create a new schedule (body must include: name, frequency, recipients, format)
 * - DELETE -> remove by id (query param ?id=)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const s = await listSchedules()
      return res.status(200).json(s)
    }

    if (req.method === "POST") {
      const { name, frequency, recipients, format } = req.body
      if (!name || !frequency) return res.status(400).json({ error: "name and frequency required" })
      const created = await addSchedule({ name, frequency, recipients, format })
      return res.status(201).json(created)
    }

    if (req.method === "DELETE") {
      const { id } = req.query
      if (!id || typeof id !== "string") return res.status(400).json({ error: "id required" })
      const removed = await removeSchedule(id)
      return res.status(200).json({ removed })
    }

    res.setHeader("Allow", "GET, POST, DELETE")
    return res.status(405).end("Method Not Allowed")
  } catch (err) {
    console.error("schedules api error", err)
    res.status(500).json({ error: "internal error" })
  }
}
