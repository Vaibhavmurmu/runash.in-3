"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Send,
  MessageCircle,
  ShoppingCart,
  Heart,
  Gift,
  Crown,
  Settings,
  Shield,
  Clock,
  Trash2,
  BarChart3,
} from "lucide-react"
import type { ChatMessage, ChatUser, ChatSettings } from "@/lib/live-chat-service"

interface EnhancedLiveStreamChatProps {
  streamId: string
  currentUser?: {
    id: string
    username: string
    displayName: string
    role: "viewer" | "moderator" | "host" | "admin"
    avatar?: string
  }
  onProductHighlight?: (productId: string) => void
}

export default function EnhancedLiveStreamChat({
  streamId,
  currentUser,
  onProductHighlight,
}: EnhancedLiveStreamChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [users, setUsers] = useState<ChatUser[]>([])
  const [settings, setSettings] = useState<ChatSettings | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [showSettings, setShowSettings] = useState(false)
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  // Initialize chat and connect to real-time updates
  useEffect(() => {
    initializeChat()
    connectToRealTime()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [streamId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const initializeChat = async () => {
    try {
      // Join chat if user is provided
      if (currentUser) {
        await fetch(`/api/live-chat/${streamId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "join",
            user: {
              ...currentUser,
              badges: [],
              isSubscriber: false,
            },
          }),
        })
      }

      // Load initial data
      const response = await fetch(`/api/live-chat/${streamId}`)
      const data = await response.json()

      if (data.success) {
        setMessages(data.messages || [])
        setUsers(data.users || [])
        setSettings(data.settings)
      }
    } catch (error) {
      console.error("Failed to initialize chat:", error)
    }
  }

  const connectToRealTime = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const eventSource = new EventSource(`/api/live-chat/${streamId}/realtime`)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        switch (data.type) {
          case "message":
            setMessages((prev) => [...prev, data.data.message])
            break
          case "user_joined":
            setUsers((prev) => [...prev, data.data.user])
            break
          case "user_left":
            setUsers((prev) => prev.filter((u) => u.id !== data.data.userId))
            break
          case "message_deleted":
            setMessages((prev) => prev.map((m) => (m.id === data.data.messageId ? { ...m, isDeleted: true } : m)))
            break
          case "settings_updated":
            setSettings(data.data.settings)
            break
        }
      } catch (error) {
        console.error("Error processing real-time message:", error)
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        connectToRealTime()
      }, 5000)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return

    try {
      const response = await fetch(`/api/live-chat/${streamId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_message",
          userId: currentUser.id,
          content: newMessage,
          type: "message",
        }),
      })

      if (response.ok) {
        setNewMessage("")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (
      !currentUser ||
      (currentUser.role !== "moderator" && currentUser.role !== "host" && currentUser.role !== "admin")
    ) {
      return
    }

    try {
      await fetch(`/api/live-chat/${streamId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_message",
          messageId,
          moderatorId: currentUser.id,
        }),
      })
    } catch (error) {
      console.error("Failed to delete message:", error)
    }
  }

  const timeoutUser = async (targetUserId: string, duration: number) => {
    if (
      !currentUser ||
      (currentUser.role !== "moderator" && currentUser.role !== "host" && currentUser.role !== "admin")
    ) {
      return
    }

    try {
      await fetch(`/api/live-chat/${streamId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "timeout_user",
          moderatorId: currentUser.id,
          targetUserId,
          duration,
          reason: "Timeout by moderator",
        }),
      })
    } catch (error) {
      console.error("Failed to timeout user:", error)
    }
  }

  const getMessageIcon = (type: ChatMessage["type"]) => {
    switch (type) {
      case "purchase":
        return <ShoppingCart className="h-3 w-3 text-green-500" />
      case "product_highlight":
        return <Gift className="h-3 w-3 text-purple-500" />
      case "system":
        return <Crown className="h-3 w-3 text-yellow-500" />
      case "reaction":
        return <Heart className="h-3 w-3 text-red-500" />
      default:
        return <MessageCircle className="h-3 w-3 text-blue-500" />
    }
  }

  const formatMessage = (message: ChatMessage) => {
    if (message.isDeleted) {
      return <span className="italic text-gray-500">Message deleted</span>
    }

    if (message.type === "purchase" && message.metadata) {
      return (
        <div className="space-y-1">
          <div>{message.content}</div>
          <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
            Purchased: {message.metadata.productName} - ${message.metadata.price}
          </div>
        </div>
      )
    }

    // Process mentions and emotes
    let processedContent = message.content
    message.mentions.forEach((mention) => {
      processedContent = processedContent.replace(
        new RegExp(`@${mention}`, "gi"),
        `<span class="text-blue-600 font-medium">@${mention}</span>`,
      )
    })

    return <div dangerouslySetInnerHTML={{ __html: processedContent }} />
  }

  const canModerate =
    currentUser && (currentUser.role === "moderator" || currentUser.role === "host" || currentUser.role === "admin")

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-base">
            <MessageCircle className="h-4 w-4" />
            <span>Live Chat</span>
            <Badge variant="secondary" className="text-xs">
              {messages.length}
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
            {canModerate && (
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Chat Settings</DialogTitle>
                  </DialogHeader>
                  {settings && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <Label>Slow Mode</Label>
                          <Switch checked={settings.slowMode} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Followers Only</Label>
                          <Switch checked={settings.followersOnly} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Subscribers Only</Label>
                          <Switch checked={settings.subscribersOnly} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Auto Moderation</Label>
                          <Switch checked={settings.autoModeration} />
                        </div>
                      </div>
                      <div>
                        <Label>Slow Mode Delay: {settings.slowModeDelay}s</Label>
                        <Slider value={[settings.slowModeDelay]} max={60} step={1} className="mt-2" />
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat" className="text-xs">
              Chat
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs">
              Users ({users.length})
            </TabsTrigger>
            {canModerate && (
              <TabsTrigger value="analytics" className="text-xs">
                Analytics
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <Tabs value={activeTab} className="flex-1 flex flex-col">
          <TabsContent value="chat" className="flex-1 flex flex-col m-0">
            <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
              <div className="space-y-3 pb-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-2 text-sm group">
                    <div className="flex-shrink-0 mt-1">{getMessageIcon(message.type)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {message.avatar && (
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={message.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{message.displayName[0]}</AvatarFallback>
                          </Avatar>
                        )}
                        <span
                          className={`font-medium text-xs ${
                            message.userId === "system"
                              ? "text-yellow-600"
                              : message.userId === currentUser?.id
                                ? "text-purple-600"
                                : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {message.displayName}
                          {message.userId === currentUser?.id && (
                            <Crown className="inline h-3 w-3 ml-1 text-purple-500" />
                          )}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div
                        className={`text-xs ${
                          message.type === "system"
                            ? "text-yellow-700 dark:text-yellow-300 font-medium"
                            : "text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {formatMessage(message)}
                      </div>
                    </div>

                    {canModerate && message.userId !== "system" && message.userId !== currentUser?.id && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => deleteMessage(message.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => timeoutUser(message.userId, 300)}>
                          <Clock className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="users" className="flex-1 m-0">
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-2 pb-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{user.displayName}</div>
                        <div className="text-xs text-gray-500">{user.messageCount} messages</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {user.role === "host" && <Crown className="h-3 w-3 text-purple-500" />}
                      {user.role === "moderator" && <Shield className="h-3 w-3 text-blue-500" />}
                      {user.isSubscriber && <Heart className="h-3 w-3 text-red-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {canModerate && (
            <TabsContent value="analytics" className="flex-1 m-0">
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{messages.length}</div>
                    <div className="text-xs text-gray-500">Total Messages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                    <div className="text-xs text-gray-500">Active Users</div>
                  </div>
                </div>
                <div className="text-center">
                  <BarChart3 className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <div className="text-sm text-gray-600">Detailed analytics coming soon</div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {activeTab === "chat" && (
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={currentUser ? "Type a message..." : "Sign in to chat"}
                className="flex-1 text-sm"
                maxLength={settings?.maxMessageLength || 500}
                disabled={!currentUser}
              />
              <Button size="sm" onClick={sendMessage} disabled={!newMessage.trim() || !currentUser}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>
                {newMessage.length}/{settings?.maxMessageLength || 500}
              </span>
              <div className="flex items-center space-x-2">
                <Heart className="h-3 w-3" />
                <span>Be kind and respectful</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
