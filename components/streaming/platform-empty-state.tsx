"use client"

import { Plus, Share, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlatformEmptyStateProps {
  onAddPlatform: () => void
}

export default function PlatformEmptyState({ onAddPlatform }: PlatformEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
      <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full mb-4">
        <Share className="h-6 w-6 text-orange-600 dark:text-orange-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">No platforms connected</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
        Connect to streaming platforms like Twitch, YouTube, Facebook, and more to broadcast your content to a wider
        audience.
      </p>

      <div className="space-y-3 w-full max-w-xs">
        <Button
          onClick={onAddPlatform}
          className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Platform Connection
        </Button>
        <Button variant="link" className="text-orange-600 dark:text-orange-400">
          Learn about multi-platform streaming
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
