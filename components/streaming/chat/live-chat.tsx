"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ChatMessage = {
  id: string
  username: string
  text: string
  createdAt: number
}

export function LiveChat({ streamId, username = "Guest" }: { streamId: string; username?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState("")
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const es = new EventSource(`/api/streams/${streamId}/chat/sse`)
    es.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data)
        if (payload?.type === "messages") {
          setMessages((prev) => [...prev, ...payload.data])
        }
      } catch {}
    }
    return () => es.close()
  }, [streamId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function send() {
    const t = text.trim()
    if (!t) return
    setText("")
    await fetch(`/api/streams/${streamId}/chat`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-user-id": "demo-user" },
      body: JSON.stringify({ text: t, username }),
    })
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Live Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 h-full">
        <div className="grow overflow-auto border rounded p-2 space-y-2 bg-background">
          {messages.map((m) => (
            <div key={m.id} className="text-sm">
              <span className="font-medium">{m.username}</span>: <span>{m.text}</span>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? send() : undefined)}
          />
          <Button onClick={send}>Send</Button>
        </div>
      </CardContent>
    </Card>
  )
}
