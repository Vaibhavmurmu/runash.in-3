"use client"

import React, { useEffect, useState, useCallback } from "react"
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
import { Bot, Leaf, Sparkles } from "lucide-react"

export default function RunashChatPage() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [messagesPreview, setMessagesPreview] = useState<any[]>([])
  const [loadingSession, setLoadingSession] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    // load recent session and preview messages
    (async () => {
      setLoadingSession(true)
      try {
        const res = await fetch("/api/sessions/recent")
        if (!res.ok) throw new Error("no recent session")
        const data = await res.json()
        if (data?.id) {
          setSessionId(data.id)
          // populate sessions list (simple UX improvement)
          setSessions((prev) => [{ id: data.id, title: data.title ?? "Recent session" }, ...prev])
          const msgs = await fetch(`/api/messages/session/${data.id}?limit=6`)
          if (msgs.ok) {
            const jl = await msgs.json()
            setMessagesPreview(Array.isArray(jl) ? jl : [])
          }
        }
      } catch (e) {
        // ignore - will create on start
      } finally {
        setLoadingSession(false)
      }
    })()

    // load sample products for carousel (fallback if no API)
    ;(async () => {
      try {
        const res = await fetch("/api/products?limit=8")
        if (!res.ok) throw new Error("no products")
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : [])
      } catch {
        // fallback sample
        setProducts([
          {
            id: "p-1",
            name: "Organic Quinoa",
            price: 12.99,
            image: "/placeholder.svg?height=160&width=240",
            sustainability_score: 9,
          },
          {
            id: "p-2",
            name: "Organic Avocado (2pcs)",
            price: 8.99,
            image: "/placeholder.svg?height=160&width=240",
            sustainability_score: 8,
          },
          {
            id: "p-3",
            name: "Reusable Produce Bags (5-pack)",
            price: 6.5,
            image: "/placeholder.svg?height=160&width=240",
            sustainability_score: 10,
          },
        ])
      }
    })()

    // load sample agents (could come from /api/agents)
    setAgents([
      { id: "a1", name: "Runa — Live Commerce Host", tagline: "Product discovery, live demos & upsells", avatar: "/placeholder.svg?height=96&width=96", online: true },
      { id: "a2", name: "Ash — Sustainability Expert", tagline: "Recipes, sourcing & carbon tips", avatar: "/placeholder.svg?height=96&width=96", online: false },
      { id: "a3", name: "Murmur — Retail Ops", tagline: "Inventory, pricing & automation", avatar: "/placeholder.svg?height=96&width=96", online: true },
    ])
  }, [])

  const startChatWithPrompt = useCallback(
    (initialPrompt?: string) => {
      // ensure there's a session and navigate into chat with the session id
      ;(async () => {
        try {
          setCreating(true)
          let sid = sessionId
          if (!sid) {
            const res = await fetch("/api/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "Live Agent" }) })
            const created = await res.json()
            sid = created?.id
            setSessionId(sid ?? null)
            if (sid) {
              setSessions((prev) => [{ id: sid, title: created?.title ?? "New session" }, ...prev])
            }
          }

          if (initialPrompt) {
            // store in localStorage so chat page picks it up and sends immediately
            localStorage.setItem("runash_initial_prompt", initialPrompt)
          }

          if (sid) {
            router.push(`/chat?sessionId=${sid}`)
          } else {
            // fallback - open chat root
            router.push("/chat")
          }
        } catch (err) {
          console.error("Failed to start chat:", err)
          router.push("/chat")
        } finally {
          setCreating(false)
        }
      })()
    },
    [router, sessionId]
  )

  // keyboard "Enter to send" to align with ChatGPT UX (Shift+Enter for newline)
  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const trimmed = prompt.trim()
      if (trimmed.length === 0) return
      localStorage.setItem("runash_initial_prompt", trimmed)
      startChatWithPrompt(trimmed)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
      <header className="border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-r from-orange-600 to-yellow-500 p-3 shadow-md">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight bg-gradient-to-r from-orange-600 to-yellow-500 text-transparent bg-clip-text">
                RunAsh Live Commerce
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Agentic shopping — live demos, recommendations, and checkout assist</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => startChatWithPrompt()} className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white" disabled={creating}>
              {creating ? "Starting..." : "Continue Chat"}
            </Button>
            <Button variant="ghost" onClick={() => router.push("/pricing")}>
              Upgrade
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar: sessions — ChatGPT like */}
        <aside className="hidden lg:block">
          <div className="flex flex-col gap-3 sticky top-20">
            <Button variant="ghost" className="justify-start" onClick={() => startChatWithPrompt()}>
              + New chat
            </Button>

            <Card className="p-3">
              <h4 className="font-semibold mb-2">Conversations</h4>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {sessions.length === 0 && <div className="text-sm text-gray-500">No conversations yet</div>}
                  {sessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => router.push(`/chat?sessionId=${s.id}`)}
                      className="w-full text-left p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3"
                    >
                      <div className="rounded-full bg-orange-100 dark:bg-orange-900 p-2">
                        <Bot className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{s.title ?? "Session"}</div>
                        <div className="text-xs text-gray-500">Tap to continue</div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            <Card className="p-3">
              <h4 className="font-semibold mb-2">Help & Shortcuts</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Press Enter to continue to chat</li>
                <li>Shift+Enter for newline</li>
                <li>Use the "New chat" button to start fresh</li>
              </ul>
            </Card>
          </div>
        </aside>

        {/* Main content (wider): hero, products, agents */}
        <section className="lg:col-span-2 space-y-6">
          <Hero
            title="Turn browsers into buyers with human-like live agents"
            subtitle="Host guided shopping sessions, demo products, recommend bundles, and convert with context-aware AI — all linked to your inventory."
            primaryAction={() => startChatWithPrompt("Start a live commerce session: show popular organic breakfast bundles and recommend upsells")}
            secondaryAction={() => startChatWithPrompt("Run a product demo for Organic Quinoa and show complementary items")}
          />

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">Featured products</h3>
            <ProductCarousel items={products} />
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Live Agents</h3>
              <div className="text-sm text-gray-500">Hosted & AI-assisted</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {agents.map((a) => (
                <AgentCard key={a.id} agent={a} onStart={() => startChatWithPrompt(`Connect me to ${a.name} for product recommendations and live demos`)} />
              ))}
            </div>
          </Card>

          <CTASection
            title="Go agentic — scale live commerce"
            bullets={[
              "AI-powered live selling: product demos, recommendations, and checkout assistance",
              "Seamless session continuity — switch from marketing to live support without losing context",
              "Integrate with Neon DB inventory, OpenAI, and your payment provider",
            ]}
            onAction={() => router.push("/pricing")}
          />
        </section>

        {/* Right aside: compact mini-chat preview + product highlights */}
        <aside className="space-y-6 lg:col-span-1">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold">Mini Chat</h4>
                <div className="text-xs text-gray-500">Preview — continue to full chat</div>
              </div>
              <div className="text-xs text-gray-500">{loadingSession ? "…" : `${messagesPreview.length} messages`}</div>
            </div>

            <ScrollArea className="max-h-64">
              <div className="space-y-3">
                {loadingSession && <div className="text-sm text-gray-500">Loading preview...</div>}
                {!loadingSession && messagesPreview.length === 0 && <div className="text-sm text-gray-600">No messages yet — start a session to see previews</div>}
                {messagesPreview.map((m: any) => (
                  <div key={m.id} className={m.role === "assistant" ? "flex justify-start" : "flex justify-end"}>
                    <div className={`max-w-[85%] p-3 rounded-lg text-sm leading-snug ${m.role === "assistant" ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100" : "bg-gradient-to-r from-orange-600 to-yellow-400 text-white"}`}>
                      <ChatMessageComponent
                        message={{
                          id: String(m.id),
                          role: m.role,
                          content: m.content,
                          timestamp: m.created_at ? new Date(m.created_at) : new Date(),
                          type: m.message_type ?? "text",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-4 flex gap-2">
              <Input
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Ask the agent something... (Enter → continue)"
                aria-label="Mini chat ask"
              />
              <Button
                onClick={() => {
                  const trimmed = prompt.trim()
                  if (!trimmed) return
                  localStorage.setItem("runash_initial_prompt", trimmed)
                  startChatWithPrompt(trimmed)
                }}
                className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white"
                aria-label="Ask and continue"
              >
                Ask
              </Button>
            </div>

            <div className="mt-3 text-xs text-gray-500 flex gap-3">
              <span className="flex items-center"><Leaf className="h-3 w-3 mr-1 text-green-500" /> Organic</span>
              <span className="flex items-center"><Sparkles className="h-3 w-3 mr-1 text-orange-500" /> Agentic AI</span>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold mb-2">Why RunAsh for Live Commerce?</h4>
            <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <li>Convert with guided shopping flows</li>
              <li>Reduce returns with live product education</li>
              <li>Boost AOV with context-aware upsells</li>
            </ul>
          </Card>
        </aside>
      </main>
    </div>
  )
    }
