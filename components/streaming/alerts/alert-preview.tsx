"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import type { AlertTemplate } from "@/types/alerts"

interface AlertPreviewProps {
  template: AlertTemplate | null
}

export default function AlertPreview({ template }: AlertPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [previewData, setPreviewData] = useState({
    username: "ViewerName",
    amount: "10.00",
    message: "Great stream! Keep up the good work!",
    months: "3",
    viewers: "25",
    tier: "Tier 1",
  })

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(
        () => {
          setIsPlaying(false)
        },
        (template?.duration || 5) * 1000,
      )
      return () => clearTimeout(timer)
    }
  }, [isPlaying, template?.duration])

  if (!template) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-100 dark:bg-gray-800 rounded-md">
        <p className="text-muted-foreground">No template selected</p>
      </div>
    )
  }

  const formatMessage = (message: string) => {
    return message
      .replace(/{{username}}/g, previewData.username)
      .replace(/{{amount}}/g, previewData.amount)
      .replace(/{{message}}/g, previewData.message)
      .replace(/{{months}}/g, previewData.months)
      .replace(/{{viewers}}/g, previewData.viewers)
      .replace(/{{tier}}/g, previewData.tier)
  }

  const getAnimationClass = () => {
    switch (template.animation) {
      case "fade":
        return "animate-fade-in"
      case "slide-in":
        return "animate-slide-in"
      case "bounce":
        return "animate-bounce"
      case "pulse":
        return "animate-pulse"
      case "shake":
        return "animate-shake"
      case "flip":
        return "animate-flip"
      case "zoom":
        return "animate-zoom"
      default:
        return "animate-fade-in"
    }
  }

  const getPositionClass = () => {
    switch (template.position) {
      case "top-left":
        return "top-4 left-4"
      case "top-center":
        return "top-4 left-1/2 -translate-x-1/2"
      case "top-right":
        return "top-4 right-4"
      case "middle-left":
        return "top-1/2 -translate-y-1/2 left-4"
      case "middle-center":
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      case "middle-right":
        return "top-1/2 -translate-y-1/2 right-4"
      case "bottom-left":
        return "bottom-4 left-4"
      case "bottom-center":
        return "bottom-4 left-1/2 -translate-x-1/2"
      case "bottom-right":
        return "bottom-4 right-4"
      default:
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-md h-[300px] overflow-hidden">
        {isPlaying && (
          <div className={`absolute ${getPositionClass()} max-w-[80%] ${getAnimationClass()}`}>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
              {template.imageUrl && (
                <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">[Alert Image]</span>
                </div>
              )}
              <div className="p-4">
                <p className="font-medium text-center">{formatMessage(template.message)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          {!isPlaying && (
            <Button
              onClick={() => setIsPlaying(true)}
              className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Preview Alert
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Preview Data</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Username</label>
            <input
              type="text"
              value={previewData.username}
              onChange={(e) => setPreviewData({ ...previewData, username: e.target.value })}
              className="w-full p-2 text-xs rounded border border-gray-300 dark:border-gray-700 bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Amount</label>
            <input
              type="text"
              value={previewData.amount}
              onChange={(e) => setPreviewData({ ...previewData, amount: e.target.value })}
              className="w-full p-2 text-xs rounded border border-gray-300 dark:border-gray-700 bg-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
