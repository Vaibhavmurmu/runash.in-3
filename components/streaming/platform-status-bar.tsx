"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { TwitchIcon, YouTubeIcon, FacebookIcon, TikTokIcon } from "./platform-icons"

interface PlatformStatusProps {
  isStreaming: boolean
  activePlatforms: string[]
}

export default function PlatformStatusBar({ isStreaming, activePlatforms = [] }: PlatformStatusProps) {
  const [stats, setStats] = useState<{ [key: string]: { viewers: number; status: string } }>({
    twitch: { viewers: 0, status: "connecting" },
    youtube: { viewers: 0, status: "connecting" },
    facebook: { viewers: 0, status: "connecting" },
    tiktok: { viewers: 0, status: "connecting" },
  })

  useEffect(() => {
    if (!isStreaming || activePlatforms.length === 0) return

    // Simulate platforms connecting and getting viewers
    const platformTimers: NodeJS.Timeout[] = []

    activePlatforms.forEach((platform) => {
      // Simulate connection process
      const connectionTimer = setTimeout(
        () => {
          setStats((prev) => ({
            ...prev,
            [platform]: { ...prev[platform], status: "connected" },
          }))

          // Simulate viewer count increasing
          const viewerInterval = setInterval(() => {
            setStats((prev) => {
              const currentViewers = prev[platform]?.viewers || 0
              const increment = Math.floor(Math.random() * 3) + 1
              return {
                ...prev,
                [platform]: {
                  ...prev[platform],
                  viewers: currentViewers + increment,
                },
              }
            })
          }, 10000) // Increment viewers every 10 seconds

          platformTimers.push(viewerInterval)
        },
        Math.random() * 3000 + 1000,
      ) // Random connection time between 1-4 seconds

      platformTimers.push(connectionTimer)
    })

    return () => {
      platformTimers.forEach((timer) => clearTimeout(timer))
    }
  }, [isStreaming, activePlatforms])

  if (!isStreaming || activePlatforms.length === 0) return null

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitch":
        return <TwitchIcon className="h-4 w-4" />
      case "youtube":
        return <YouTubeIcon className="h-4 w-4" />
      case "facebook":
        return <FacebookIcon className="h-4 w-4" />
      case "tiktok":
        return <TikTokIcon className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
      case "connecting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800"
      case "error":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
    }
  }

  return (
    <div className="flex gap-2 items-center h-6">
      {activePlatforms.map(
        (platform) =>
          stats[platform] && (
            <Badge
              key={platform}
              variant="outline"
              className={`flex items-center gap-1 py-0 h-6 ${getStatusColor(stats[platform].status)}`}
            >
              {getPlatformIcon(platform)}
              <span>{stats[platform].viewers}</span>
            </Badge>
          ),
      )}
    </div>
  )
}
