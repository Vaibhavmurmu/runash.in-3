"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, Loader, Copy, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isLoading?: boolean
}

interface AIChatPanelProps {
  isOpen: boolean
}

export default function AIChatPanel({ isOpen }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI assistant. How can I help you with your video today?",
      timestamp: new Date(Date.now() - 5000),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(input),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  const generateAIResponse = (userInput: string): string => {
    const responses: Record<string, string> = {
      generate: "I'll generate a video based on your prompt. Let me create something awesome!",
      edit: "I can help you edit your video. What changes would you like to make?",
      style: "I can apply different styles to your video. Try cinematic, documentary, or animated.",
      duration: "I can adjust the video duration. What length would you like?",
      default: "That's a great idea! I can help you with that. Just let me know what you'd like to do.",
    }

    const key = Object.keys(responses).find((k) => userInput.toLowerCase().includes(k)) as string | undefined

    return responses[key || "default"]
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Chat cleared. How can I help you?",
        timestamp: new Date(),
      },
    ])
  }

  if (!isOpen) return null

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">AI Assistant</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={handleClearChat} title="Clear chat">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              ref={message.id === messages[messages.length - 1].id ? scrollRef : null}
            >
              <div
                className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none border border-border"
                }`}
              >
                <p className="leading-relaxed text-balance">{message.content}</p>
                <div className="flex items-center justify-between mt-2 gap-2">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {message.role === "assistant" && (
                    <button
                      onClick={() => handleCopyMessage(message.content)}
                      className="opacity-50 hover:opacity-100 transition-opacity"
                      title="Copy message"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg rounded-bl-none px-4 py-2 border border-border">
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t border-border p-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading} size="sm" className="gap-2">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Press Enter to send • Shift+Enter for new line</p>
      </div>
    </div>
  )
}
