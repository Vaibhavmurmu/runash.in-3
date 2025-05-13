"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ChatSettings, StreamingPlatform } from "@/types/platform-chat"
import { getPlatformColor, getPlatformIcon } from "./platform-utils"

interface PlatformSelectorProps {
  selectedPlatform: StreamingPlatform | "all"
  onSelectPlatform: (platform: StreamingPlatform | "all") => void
  connectedPlatforms: StreamingPlatform[]
  platformSettings: ChatSettings["platformSettings"]
}

export default function PlatformSelector({
  selectedPlatform,
  onSelectPlatform,
  connectedPlatforms,
  platformSettings,
}: PlatformSelectorProps) {
  return (
    <ScrollArea className="w-full" orientation="horizontal">
      <div className="flex space-x-1 pb-1">
        <Button
          variant={selectedPlatform === "all" ? "default" : "outline"}
          size="sm"
          className={`rounded-full text-xs h-7 ${
            selectedPlatform === "all" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""
          }`}
          onClick={() => onSelectPlatform("all")}
        >
          All Platforms
        </Button>

        {connectedPlatforms.map((platform) => {
          const isEnabled = platformSettings[platform]?.enabled !== false
          if (!isEnabled) return null

          const PlatformIcon = getPlatformIcon(platform)
          const platformColor = platformSettings[platform]?.color || getPlatformColor(platform)

          return (
            <Button
              key={platform}
              variant={selectedPlatform === platform ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-xs h-7 ${
                selectedPlatform === platform ? "" : "border-gray-200 dark:border-gray-800"
              }`}
              style={{
                backgroundColor: selectedPlatform === platform ? platformColor : "transparent",
                borderColor: selectedPlatform !== platform ? platformColor : "transparent",
                color: selectedPlatform === platform ? "white" : platformColor,
              }}
              onClick={() => onSelectPlatform(platform)}
            >
              <PlatformIcon className="h-3.5 w-3.5 mr-1" />
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </Button>
          )
        })}
      </div>
    </ScrollArea>
  )
}
