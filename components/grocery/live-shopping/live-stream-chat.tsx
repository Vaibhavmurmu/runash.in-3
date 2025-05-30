"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, ShoppingBag, Users, Heart, Send, PinIcon, ShoppingCart, Star } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"
import { useCart } from "@/contexts/cart-context"
import type { LiveChatMessage, FeaturedProduct } from "@/types/live-shopping"

interface LiveStreamChatProps {
  streamId: string
  isJoined: boolean
  featuredProducts: FeaturedProduct[]
  currentProductId?: string
}

export default function LiveStreamChat({
  streamId,
  isJoined,
  featuredProducts,
  currentProductId,
}: LiveStreamChatProps) {
  const { formatPrice } = useCurrency()
  const { addToCart } = useCart()
  const [messages, setMessages] = useState<LiveChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState("chat")
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Generate mock messages
  useEffect(() => {
    if (!isJoined) return

    const initialMessages: LiveChatMessage[] = [
      {
        id: "1",
        userId: "system",
        userName: "System",
        message: "Welcome to the live stream! Please be respectful in the chat.",
        timestamp: new Date(Date.now() - 60000 * 10),
        isHost: false,
        isAdmin: true,
        isPinned: false,
        containsQuestion: false,
      },
      {
        id: "2",
        userId: "host",
        userName: "Priya Sharma",
        userAvatar: "/placeholder.svg?height=40&width=40",
        message:
          "Hi everyone! Welcome to today's organic produce showcase. We have some amazing fresh items to show you today!",
        timestamp: new Date(Date.now() - 60000 * 5),
        isHost: true,
        isAdmin: false,
        isPinned: true,
        containsQuestion: false,
      },
    ]

    setMessages(initialMessages)

    // Simulate incoming messages
    const userNames = ["Rahul", "Ananya", "Vikram", "Meera", "Arjun", "Divya", "Karthik", "Nisha"]
    let count = 3

    const interval = setInterval(() => {
      if (count > 20) {
        clearInterval(interval)
        return
      }

      const randomUser = userNames[Math.floor(Math.random() * userNames.length)]
      const randomMessages = [
        "These mangoes look amazing! Are they sweet?",
        "I love organic produce!",
        "How long do the vegetables stay fresh?",
        "Is the rice pesticide-free?",
        "Can you show the spinach again?",
        "What's the best way to store turmeric?",
        "Are these products available for delivery today?",
        "The quinoa looks great, how do you cook it?",
        "❤️❤️❤️",
        "👍 Great products!",
        "I bought these last week, they're excellent!",
        "Is there a discount for bulk orders?",
        "How sustainable is the packaging?",
        "Can you ship internationally?",
        "What's the shelf life of the spices?",
      ]

      const newMsg: LiveChatMessage = {
        id: count.toString(),
        userId: `user-${randomUser.toLowerCase()}`,
        userName: randomUser,
        userAvatar: `/placeholder.svg?height=40&width=40&text=${randomUser[0]}`,
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        timestamp: new Date(),
        isHost: false,
        isAdmin: false,
        isPinned: false,
        containsQuestion: Math.random() > 0.7,
      }

      setMessages((prev) => [...prev, newMsg])
      count++

      // Occasionally add host responses
      if (count % 5 === 0) {
        setTimeout(() => {
          const hostResponses = [
            "Thanks for your question! Yes, the mangoes are perfectly sweet and juicy right now.",
            "Great question! The vegetables stay fresh for about a week when stored properly in the refrigerator.",
            "Yes, all our rice is 100% pesticide-free and certified organic.",
            "The spinach is harvested just yesterday from local farms!",
            "For turmeric, store it in an airtight container away from direct sunlight to preserve its potency.",
            "Yes, we offer same-day delivery for orders placed before 2 PM.",
            "To cook quinoa, use a 1:2 ratio of quinoa to water and simmer for about 15 minutes until fluffy.",
          ]

          const hostMsg: LiveChatMessage = {
            id: (count + 100).toString(),
            userId: "host",
            userName: "Priya Sharma",
            userAvatar: "/placeholder.svg?height=40&width=40",
            message: hostResponses[Math.floor(Math.random() * hostResponses.length)],
            timestamp: new Date(),
            isHost: true,
            isAdmin: false,
            isPinned: false,
            containsQuestion: false,
          }

          setMessages((prev) => [...prev, hostMsg])
        }, 2000)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isJoined])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !isJoined) return

    const userMessage: LiveChatMessage = {
      id: `user-${Date.now()}`,
      userId: "current-user",
      userName: "You",
      message: newMessage,
      timestamp: new Date(),
      isHost: false,
      isAdmin: false,
      isPinned: false,
      containsQuestion: newMessage.includes("?"),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
  }

  // Get current featured product
  const currentProduct = featuredProducts.find((fp) => fp.id === currentProductId)?.product

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="p-3 border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 h-9">
            <TabsTrigger value="chat" className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-1">
              <ShoppingBag className="h-4 w-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="viewers" className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>Viewers</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-hidden">
        <TabsContent value="chat" className="m-0 h-full flex flex-col">
          {!isJoined ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Join the stream to participate in chat</p>
              </div>
            </div>
          ) : (
            <>
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="group relative">
                    <div
                      className={`flex items-start space-x-2 ${msg.isPinned ? "bg-green-50 dark:bg-green-900/20 p-2 rounded-md" : ""}`}
                    >
                      {msg.userAvatar ? (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={msg.userAvatar || "/placeholder.svg"} alt={msg.userName} />
                          <AvatarFallback>{msg.userName[0]}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-xs text-primary-foreground">{msg.userName[0]}</span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs font-medium ${
                              msg.isHost
                                ? "text-green-600 dark:text-green-400"
                                : msg.isAdmin
                                  ? "text-blue-600 dark:text-blue-400"
                                  : ""
                            }`}
                          >
                            {msg.userName}
                          </span>

                          {msg.isHost && (
                            <Badge
                              variant="outline"
                              className="text-[10px] py-0 h-4 bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                            >
                              Host
                            </Badge>
                          )}

                          {msg.isAdmin && (
                            <Badge
                              variant="outline"
                              className="text-[10px] py-0 h-4 bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                            >
                              Admin
                            </Badge>
                          )}

                          {msg.isPinned && <PinIcon className="h-3 w-3 text-green-600 dark:text-green-400" />}
                        </div>

                        <p className="text-sm">{msg.message}</p>

                        <div className="text-[10px] text-muted-foreground">
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Heart className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="products" className="m-0 h-full">
          <div className="h-full overflow-y-auto p-4 space-y-4">
            <h3 className="font-semibold">Featured Products</h3>

            {featuredProducts.map(({ product, discountPercentage, specialPrice, spotlight }) => (
              <Card
                key={product.id}
                className={`overflow-hidden ${spotlight ? "border-green-500 dark:border-green-600" : ""}`}
              >
                <div className="flex items-center p-3">
                  <div className="w-16 h-16 rounded-md overflow-hidden mr-3">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>

                    <div className="flex items-center space-x-2 mt-1">
                      {discountPercentage ? (
                        <>
                          <span className="text-sm font-bold text-green-600">
                            {formatPrice(specialPrice || product.price * (1 - discountPercentage / 100))}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.price)}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                          >
                            {discountPercentage}% OFF
                          </Badge>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-green-600">{formatPrice(product.price)}</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs">{product.averageRating}</span>
                      <span className="text-xs text-muted-foreground">({product.totalReviews})</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() =>
                      addToCart(
                        {
                          id: product.id,
                          name: product.name,
                          price: specialPrice || product.price,
                          image: product.images[0],
                          description: product.description,
                        },
                        1,
                      )
                    }
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>

                {spotlight && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 text-center text-xs text-green-800 dark:text-green-400">
                    Currently Featured in Stream
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="viewers" className="m-0 h-full">
          <div className="h-full overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Live Viewers</h3>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>342</span>
              </Badge>
            </div>

            <div className="space-y-2">
              {[
                "Priya Sharma",
                "Rahul",
                "Ananya",
                "Vikram",
                "Meera",
                "Arjun",
                "Divya",
                "Karthik",
                "Nisha",
                "Sanjay",
                "Pooja",
                "Raj",
                "Neha",
                "Amit",
                "Sunita",
              ].map((name, i) => (
                <div key={i} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${name[0]}`} alt={name} />
                    <AvatarFallback>{name[0]}</AvatarFallback>
                  </Avatar>

                  <span className="text-sm">{name}</span>

                  {i === 0 && (
                    <Badge
                      variant="outline"
                      className="ml-auto text-[10px] py-0 h-4 bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                    >
                      Host
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  )
}
