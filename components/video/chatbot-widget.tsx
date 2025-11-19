'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, X, MessageCircle } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

export default function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m RunAsh AI Assistant. How can I help you with video generation today?',
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Thanks for your message! I\'m processing your request with our AI engines. This is a demo response.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <section id="chat" className="relative py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-20 animate-neuron-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 animate-neuron-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            AI-Powered <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Chat Assistant</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Interact with RunAsh AI in real-time. Get instant answers about video generation, streaming, and AI agents
          </p>
        </div>

        {/* Chat Widget */}
        <div className="max-w-2xl mx-auto">
          {isOpen ? (
            <div className="bg-card border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col h-96 backdrop-blur-sm">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/20 to-accent/20 border-b border-border px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <MessageCircle size={20} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">RunAsh Assistant</h3>
                    <p className="text-xs text-foreground/60">Always ready to help</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-background/50 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted px-4 py-2 rounded-lg">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="border-t border-border p-4 bg-background/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-input border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent/50 transition"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setIsOpen(true)}
              className="w-full py-12 bg-card border border-border rounded-lg hover:border-accent/50 transition group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition">
                  <MessageCircle size={32} className="text-accent" />
                </div>
                <h3 className="font-semibold text-lg">Chat with RunAsh AI</h3>
                <p className="text-foreground/60 text-sm">Click to open the assistant</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
