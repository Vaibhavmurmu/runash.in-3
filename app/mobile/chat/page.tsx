"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Filter, MoreVertical, ThumbsUp, Ban, Flag } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import MobileLayout from "@/components/mobile/layout"
import type { ChatMessage } from "@/types/mobile-app"

export default function MobileChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [messageInput, setMessageInput] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockMessages: ChatMessage[] = [
        {
          id: "msg-1",
          platform: "twitch",
          username: "StreamFan123",
          message: "Hey everyone! Just joined the stream.",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          isSubscriber: true,
        },
        {
          id: "msg-2",
          platform: "youtube",
          username: "GamingPro",
          message: "What game are you playing today?",
          timestamp: new Date(Date.now() - 240000).toISOString(),
        },
        {
          id: "msg-3",
          platform: "twitch",
          username: "ModeratorUser",
          message: "Welcome to the stream everyone!",
          timestamp: new Date(Date.now() - 180000).toISOString(),
          isModerator: true,
        },
        {
          id: "msg-4",
          platform: "youtube",
          username: "NewViewer",
          message: "First time watching, this is awesome!",
          timestamp: new Date(Date.now() - 120000).toISOString(),
        },
        {
          id: "msg-5",
          platform: "twitch",
          username: "RegularFan",
          message: "Can't wait to see what happens next!",
          timestamp: new Date(Date.now() - 60000).toISOString(),
          isSubscriber: true,
        },
      ]

      setMessages(mockMessages)
      setIsLoading(false)
    }

    loadData()

    // Simulate receiving new messages
    const interval = setInterval(() => {
      if (!isLoading) {
        const platforms = ["twitch", "youtube"]
        const platform = platforms[Math.floor(Math.random() * platforms.length)]
        const newMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          platform,
          username: `User${Math.floor(Math.random() * 1000)}`,
          message: `This is a simulated message ${Math.floor(Math.random() * 100)}`,
          timestamp: new Date().toISOString(),
          isSubscriber: Math.random() > 0.7,
        }
        setMessages((prev) => [...prev, newMessage])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isLoading])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim()) {
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        platform: "twitch", // Default to twitch for sent messages
        username: "You (Streamer)",
        message: messageInput,
        timestamp: new Date().toISOString(),
        isModerator: true,
      }
      setMessages((prev) => [...prev, newMessage])
      setMessageInput("")
    }
  }

  const handleHighlightMessage = (id: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, isHighlighted: !msg.isHighlighted } : msg)))
  }

  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
  }

  const filteredMessages = activeTab === "all" ? messages : messages.filter((msg) => msg.platform === activeTab)

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading chat...</p>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="p-4 border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Live Chat</h2>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="twitch">Twitch</TabsTrigger>
              <TabsTrigger value="youtube">YouTube</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredMessages.map((message) => (
            <Card
              key={message.id}
              className={`${
                message.isHighlighted
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <CardContent className="p-3">
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                    <span className="text-xs font-medium">{message.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-wrap gap-1">
                        <span className="font-medium text-sm">{message.username}</span>
                        <Badge variant="outline" className="text-xs">
                          {message.platform}
                        </Badge>
                        {message.isModerator && (
                          <Badge variant="secondary" className="text-xs">
                            Mod
                          </Badge>
                        )}
                        {message.isSubscriber && <Badge className="bg-purple-500 text-xs">Sub</Badge>}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleHighlightMessage(message.id)}>
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            {message.isHighlighted ? "Unhighlight" : "Highlight"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Flag className="h-4 w-4 mr-2" />
                            Report
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMessage(message.id)}>
                            <Ban className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm mt-1">{message.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit" disabled={!messageInput.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </MobileLayout>
  )
}
