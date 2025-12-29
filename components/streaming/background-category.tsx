"use client"

import type React from "react"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BackgroundCategoryProps {
  title: string
  description: string
  icon: React.ReactNode
  backgrounds: Array<{ id: string; url: string; name: string }>
  onSelectBackground: (background: string) => void
}

export default function BackgroundCategory({
  title,
  description,
  icon,
  backgrounds,
  onSelectBackground,
}: BackgroundCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center">
          <div className="mr-3 text-orange-500">{icon}</div>
          <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>
        <ChevronRight className={cn("h-5 w-5 transition-transform", isExpanded ? "rotate-90" : "")} />
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 grid grid-cols-2 gap-2">
          {backgrounds.map((background) => (
            <div
              key={background.id}
              className="relative aspect-video rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onSelectBackground(background.url)}
            >
              <img
                src={background.url || "/placeholder.svg"}
                alt={background.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium">{background.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
