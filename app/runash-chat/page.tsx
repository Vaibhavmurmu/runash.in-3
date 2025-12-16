"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Hero from "@/components/home/hero"
import ProductCarousel from "@/components/home/products-carousel"
import AgentCard from "@/components/home/agent-card"
import CTASection from "@/components/home/cta-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import ChatMessageComponent from "@/components/chat/chat-message"
import { Bot, File, Terminal, Search, Plus, X } from "lucide-react"

/**
 * Redesigned RunAsh "chat landing" page to mimic a Copilot-like chat UI:
 * - Left vertical conversations sidebar with search + new chat
 * - Center main chat preview area styled as a chat workspace (bubbles, timestamps)
 * - Bottom composer with rich affordances (textarea, send, attach)
 * - Right contextual panel (hidden on small screens) for product/agent quick actions
 *
 * This file keeps the original data-fetching behavior but reorganizes the UI and UX.
 */

export default function RunashChatPage() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [messagesPreview, setMessagesPreview] = useState<any[]>([])
  const [loadingSession, setLoadingSession] = useState(false)
  const [creating, setCreating] = useState(false)
  const [composerValue, setComposerValue] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [rightOpen, setRightOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // load recent session and preview messages
    ;(async () => {
      setLoadingSession(true)
      try {
        const res = await fetch("/api/sessions/recent")
        if (!res.ok) throw new Error("no recent session")
        const data = await res.json()
        if (data?.id) {
          setSessionId(data.id)
          setSessions((prev) => [{ id: data.id, title: data.title ?? "Recent session" }, ...prev])
          const msgs = await fetch(`/api/messages/session/${data.id}?limit=50`)
          if (msgs.ok) {
            const jl = await msgs.json()
            setMessages(Array.isArray(jl) ? jl : [])
            // small preview for the landing page
            setMessagesPreview(Array.isArray(jl) ? jl.slice(-6) : [])
          }
        }
      } catch (e) {
        // ignore - will create on start
      } finally {
        setLoadingSession(false)
      }
    })()

    // load sample products for right panel
    ;(async () => {
      try {
        const res = await fetch("/api/products?limit=8")
        if (!res.ok) throw new Error("no products")
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : [])
      } catch {
        setProducts([
          { id: "p-1", name: "Organic Quinoa", price: 12.99, image: "/placeholder.svg?height=160&width=240" },
          { id: "p-2", name: "Organic Avocado (2pcs)", price: 8.99, image: "/placeholder.svg?height=160&width=240" },
        ])
      }
    })()

    // sample agents
    setAgents([
      { id: "a1", name: "Runa", tagline: "Live host", online: true },
      { id: "a2", name: "Ash", tagline: "Sustainability", online: false },
    ])
  }, [])

  useEffect(() => {
    // auto-scroll on messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [messages, messagesPreview])

  const createOrGotoSession = useCallback(
    async (initialPrompt?: string) => {
      setCreating(true)
      try {
        let sid = sessionId
        if (!sid) {
          const res = await fetch("/api/sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "Copilot-like session" }),
          })
          const created = await res.json()
          sid = created?.id
          setSessionId(sid ?? null)
          if (sid) setSessions((prev) => [{ id: sid, title: created?.title ?? "New session" }, ...prev])
        }

        if (initialPrompt) {
          // keep behavior: store initial prompt for the /chat page
          localStorage.setItem("runash_initial_prompt", initialPrompt)
        }

        if (sid) {
          router.push(`/chat?sessionId=${sid}`)
        } else {
          router.push("/chat")
        }
      } catch (err) {
        console.error(err)
        router.push("/chat")
      } finally {
        setCreating(false)
      }
    },
    [router, sessionId]
  )

  function handleComposerKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter = send, Shift+Enter = newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const trimmed = composerValue.trim()
      if (trimmed.length === 0) return
      // store prompt and navigate like existing flow
      localStorage.setItem("runash_initial_prompt", trimmed)
      createOrGotoSession(trimmed)
    }
    // Escape to clear
    if (e.key === "Escape") {
      setComposerValue("")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Top header */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-gray-900/70 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-gradient-to-r from-sky-600 to-indigo-500 p-2 shadow-sm">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold">RunAsh</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Contextual assistant for agentic live commerce</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push("/pricing")}>Upgrade</Button>
            <Button onClick={() => createOrGotoSession()} disabled={creating}>
              {creating ? "Starting..." : "New Session"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main 3-column workspace */}
      <main className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr_360px] gap-6">
        {/* Left: conversations sidebar */}
        <aside className="hidden lg:flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Input placeholder="Search conversations" className="flex-1" />
            <Button variant="ghost" className="p-2" onClick={() => createOrGotoSession()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Card className="flex-1 overflow-hidden">
            <div className="p-3 border-b">
              <div className="text-sm font-medium">Conversations</div>
            </div>
            <ScrollArea className="h-[calc(100%-56px)]">
              <div className="p-3 space-y-2">
                {sessions.length === 0 && <div className="text-sm text-gray-500">No conversations yet — start one.</div>}
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => router.push(`/chat?sessionId=${s.id}`)}
                    className="w-full text-left rounded-md p-2 hover:bg-slate-100 dark:hover:bg-gray-800 flex items-start gap-3"
                  >
                    <div className="rounded-full bg-slate-200 dark:bg-gray-800 p-2">
                      <Bot className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{s.title ?? "Session"}</div>
                      <div className="text-xs text-gray-500">Continue conversation</div>
                    </div>
                    <div className="text-xs text-gray-400">· now</div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </aside>

        {/* Center: chat preview area */}
        <section className="flex flex-col h-[70vh]">
          <Card className="flex-1 flex flex-col overflow-hidden">
            {/* session header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-slate-100 dark:bg-gray-800 p-2">
                  <Bot className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <div className="font-semibold">Copilot Chat Preview</div>
                  <div className="text-xs text-gray-500">Preview messages and start a focused session</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-2 py-1 text-xs rounded-md border">Model: runash-gpt</button>
                <button className="px-2 py-1 text-xs rounded-md border" onClick={() => setRightOpen((v) => !v)}>
                  {rightOpen ? "Hide Panel" : "Show Panel"}
                </button>
                <Button variant="ghost" onClick={() => createOrGotoSession(composerValue.trim() || undefined)}>Open in Chat</Button>
              </div>
            </div>

            {/* messages area */}
            <div ref={scrollAreaRef} className="flex-1 overflow-auto p-4 space-y-4">
              {loadingSession && <div className="text-sm text-gray-500">Loading messages…</div>}

              {!loadingSession && messages.length === 0 && messagesPreview.length === 0 && (
                <div className="mx-auto max-w-xl text-center text-sm text-gray-500">
                  No conversation yet. Ask the assistant to help with product demos, bundles, or inventory flows.
                </div>
              )}

              {/* show preview messages if there's no full session loaded */}
              {(messages.length > 0 ? messages : messagesPreview).map((m: any) => (
                <div key={m.id} className={`flex ${m.role === "assistant" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${
                      m.role === "assistant"
                        ? "bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-900 dark:text-gray-100"
                        : "bg-gradient-to-r from-sky-600 to-indigo-500 text-white"
                    }`}
                  >
                    <ChatMessageComponent
                      message={{
                        id: String(m.id),
                        role: m.role,
                        content: m.content,
                        timestamp: m.created_at ? new Date(m.created_at) : new Date(),
                        type: m.message_type ?? "text",
                      }}
                    />
                    <div className="text-[10px] text-gray-400 mt-1">{new Date(m.created_at ?? Date.now()).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* composer */}
            <div className="border-t p-3">
              <div className="flex items-start gap-2">
                <textarea
                  value={composerValue}
                  onChange={(e) => setComposerValue(e.target.value)}
                  onKeyDown={handleComposerKeyDown}
                  placeholder="Ask RunAsh Copilot — e.g. 'Show me breakfast bundles under $25' (Enter → open in chat, Shift+Enter newline)"
                  rows={2}
                  className="flex-1 resize-none rounded-md p-3 bg-slate-50 dark:bg-gray-800 border dark:border-gray-700 focus:outline-none focus:ring"
                />
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" onClick={() => { /* future: attach file */ }}><File className="h-4 w-4" /></Button>
                  <Button onClick={() => { const trimmed = composerValue.trim(); if (!trimmed) return; localStorage.setItem("runash_initial_prompt", trimmed); createOrGotoSession(trimmed) }}>
                    Send
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">Tip: Use Shift+Enter for a newline. Open full chat to interact live.</div>
            </div>
          </Card>

          {/* optional: products carousel & CTA below the chat workspace for discovery */}
          <div className="mt-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">Featured Products</div>
                <div className="text-xs text-gray-500">Curated picks</div>
              </div>
              <ProductCarousel items={products} />
            </Card>
          </div>
        </section>

        {/* Right: contextual panel */}
        <aside className={`hidden lg:flex flex-col gap-3 ${rightOpen ? "" : "hidden"}`}>
          <Card className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Context</div>
              <button onClick={() => setRightOpen(false)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-gray-800"><X className="h-4 w-4" /></button>
            </div>

            <div className="text-sm text-gray-500 mb-2">Agents</div>
            <div className="space-y-2 mb-3">
              {agents.map((a) => (
                <div key={a.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{a.name}</div>
                    <div className="text-xs text-gray-500">{a.tagline}</div>
                  </div>
                  <div className={`text-xs ${a.online ? "text-green-500" : "text-gray-400"}`}>{a.online ? "online" : "offline"}</div>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-500 mb-2">Quick actions</div>
            <div className="flex flex-col gap-2">
              <Button variant="ghost" onClick={() => createOrGotoSession("Run a product demo for Organic Quinoa")}>
                <Terminal className="h-4 w-4 mr-2" /> Demo product
              </Button>
              <Button variant="ghost" onClick={() => createOrGotoSession("Show popular organic breakfast bundles and recommend upsells")}>
                <Bot className="h-4 w-4 mr-2" /> Recommend bundles
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold mb-2">Why RunAsh</h4>
            <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <li>Context-aware product suggestions</li>
              <li>Inventory-aware demos</li>
              <li>AI-assisted upsells</li>
            </ul>
            <div className="mt-3">
              <Button onClick={() => router.push("/pricing")}>Get started</Button>
            </div>
          </Card>
        </aside>
      </main>
    </div>
  )
}
