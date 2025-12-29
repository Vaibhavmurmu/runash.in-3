"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ThumbsUp, Ban, UserX, Trash2, MessageSquare, Pin, Copy } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import type { ChatMessage, ChatSettings } from "@/types/platform-chat"
import { getPlatformColor, getPlatformIcon } from "./platform-utils"

interface PlatformChatMessageProps {
  message: ChatMessage
  settings: ChatSettings
}

export default function PlatformChatMessage({ message, settings }: PlatformChatMessageProps) {
  const [isHighlighted, setIsHighlighted] = useState(message.isHighlighted)
  const [isPinned, setIsPinned] = useState(message.isPinned)
  const [isDeleted, setIsDeleted] = useState(message.isDeleted)

  const platformSettings = settings.platformSettings[message.platform]
  const platformColor = platformSettings?.color || getPlatformColor(message.platform)
  const PlatformIcon = getPlatformIcon(message.platform)

  const handleHighlight = () => {
    setIsHighlighted(!isHighlighted)
  }

  const handlePin = () => {
    setIsPinned(!isPinned)
  }

  const handleDelete = () => {
    setIsDeleted(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
  }

  if (isDeleted && !settings.showDeletedMessages) {
    return null
  }

  return (
    <div
      className={`relative rounded-lg p-2 transition-colors ${
        isHighlighted
          ? `bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800`
          : isPinned
            ? `bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800`
            : `hover:bg-gray-50 dark:hover:bg-gray-900/50`
      }`}
    >
      {isPinned && (
        <div className="absolute -top-1 -right-1">
          <Badge className="bg-blue-500">Pinned</Badge>
        </div>
      )}

      <div className="flex items-start gap-2">
        {settings.showAvatars && (
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: message.user.color || platformColor }}
          >
            <span className="text-xs font-medium text-white">{message.user.displayName.charAt(0).toUpperCase()}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-1">
            <span className="font-medium text-sm" style={{ color: message.user.color }}>
              {message.user.displayName}
            </span>

            {platformSettings?.showPlatformIcon && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <PlatformIcon className="h-3.5 w-3.5" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{message.platform.charAt(0).toUpperCase() + message.platform.slice(1)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {message.user.badges.map((badge) => (
              <TooltipProvider key={badge.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <img src={badge.imageUrl || "/placeholder.svg"} alt={badge.name} className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{badge.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}

            {message.user.roles.includes("moderator") && (
              <Badge
                variant="outline"
                className="text-[10px] py-0 h-4 border-green-500 text-green-700 dark:text-green-400"
              >
                Mod
              </Badge>
            )}

            {message.user.roles.includes("subscriber") && (
              <Badge
                variant="outline"
                className="text-[10px] py-0 h-4 border-purple-500 text-purple-700 dark:text-purple-400"
              >
                Sub
              </Badge>
            )}

            {message.user.roles.includes("broadcaster") && (
              <Badge className="text-[10px] py-0 h-4 bg-orange-500">Host</Badge>
            )}
          </div>

          <div
            className={`mt-1 break-words ${
              settings.fontSize === "small" ? "text-xs" : settings.fontSize === "large" ? "text-base" : "text-sm"
            } ${isDeleted ? "italic text-gray-500 dark:text-gray-400" : ""}`}
          >
            {isDeleted ? "This message was deleted" : message.content}
          </div>

          {settings.showTimestamps && (
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleHighlight}>
              <ThumbsUp className="h-4 w-4 mr-2" />
              {isHighlighted ? "Remove Highlight" : "Highlight"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePin}>
              <Pin className="h-4 w-4 mr-2" />
              {isPinned ? "Unpin Message" : "Pin Message"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Text
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="h-4 w-4 mr-2" />
              Reply
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserX className="h-4 w-4 mr-2" />
              Timeout User
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Ban className="h-4 w-4 mr-2" />
              Ban User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Message
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
