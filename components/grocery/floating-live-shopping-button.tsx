"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, Users, X } from "lucide-react"

export default function FloatingLiveShoppingButton() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const [viewerCount, setViewerCount] = useState(342)

  // Simulate real-time viewer count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 10) - 5)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <Button
          onClick={() => router.push("/grocery/live")}
          className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full h-14 px-6"
          size="lg"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Video className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full animate-pulse"></div>
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold">Live Shopping</div>
              <div className="text-xs opacity-90 flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {viewerCount} watching
              </div>
            </div>
          </div>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 h-6 w-6 bg-white text-gray-600 hover:bg-gray-100 rounded-full shadow-md"
        >
          <X className="h-3 w-3" />
        </Button>

        <Badge className="absolute -top-2 -left-2 bg-red-500 text-white animate-pulse">LIVE</Badge>
      </div>
    </div>
  )
}
