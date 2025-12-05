"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Hero from "@/components/home/hero"
import ProductCarousel from "@/components/home/product-carousel"
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
          const msgs = await fetch(`/api/messages/session/${data.id}?limit=4`)
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

  function startChatWithPrompt(initialPrompt?: string) {
    // ensure there's a session and navigate into chat with the session id
    (async () => {
      try {
        let sid = sessionId
        if (!sid) {
          const res = await fetch("/api/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "Live Agent" }) })
          const created = await res.json()
          sid = created?.id
          setSessionId(sid ?? null)
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
      }
    })()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
      <header className="border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-r from-orange-600 to-yellow-500 p-3">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 text-transparent bg-clip-text">
                RunAsh Live Commerce
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Agentic shopping experiences — live demos, recommendations, and checkout assist</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => startChatWithPrompt()} className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white">
              Continue Chat
            </Button>
            <Button variant="ghost" onClick={() => router.push("/pricing")}>
              Upgrade
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        <aside className="space-y-6">
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Mini Chat Preview</h4>
            <div className="text-xs text-gray-500 mb-3">Recent conversation (click Continue to open full chat)</div>
            <ScrollArea className="max-h-64">
              <div className="space-y-3">
                {loadingSession && <div className="text-sm text-gray-500">Loading preview...</div>}
                {!loadingSession && messagesPreview.length === 0 && <div className="text-sm text-gray-600">No messages yet — start a session to see previews</div>}
                {messagesPreview.map((m: any) => (
                  <ChatMessageComponent
                    key={m.id}
                    message={{
                      id: String(m.id),
                      role: m.role,
                      content: m.content,
                      timestamp: m.created_at ? new Date(m.created_at) : new Date(),
                      type: m.message_type ?? "text",
                    }}
                  />
                ))}
              </div>
            </ScrollArea>

            <div className="mt-4 flex gap-2">
              <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask the agent something..." />
              <Button
                onClick={() => {
                  localStorage.setItem("runash_initial_prompt", prompt)
                  startChatWithPrompt(prompt)
                }}
                className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white"
              >
                Ask & Continue
              </Button>
            </div>

            <div className="mt-3 text-xs text-gray-500 flex gap-3">
              <span className="flex items-center"><Leaf className="h-3 w-3 mr-1 text-green-500" /> Organic Focus</span>
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
