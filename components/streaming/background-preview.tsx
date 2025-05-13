"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface BackgroundPreviewProps {
  background: string
  onSelect: (background: string) => void
  onCancel: () => void
  videoStream: MediaStream | null
}

export default function BackgroundPreview({ background, onSelect, onCancel, videoStream }: BackgroundPreviewProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for preview generation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-4">
      <div className="aspect-video rounded-lg overflow-hidden bg-black relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* This would be a real preview in a production app */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <img src="/placeholder.svg?height=720&width=1280" alt="Preview" className="w-full h-full object-cover" />
            </div>
            <img
              src={background || "/placeholder.svg"}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-white"
          onClick={() => onSelect(background)}
          disabled={isLoading}
        >
          <Check className="mr-2 h-4 w-4" />
          Apply Background
        </Button>
      </div>
    </div>
  )
}
