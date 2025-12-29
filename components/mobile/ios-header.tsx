"use client"

import { Zap, Home, Video, Sparkles } from "lucide-react"

interface IosHeaderProps {
  onNavigate: (screen: string) => void
}

export default function IosHeader({ onNavigate }: IosHeaderProps) {
  return (
    <div className="px-4 py-2 border-b border-border/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-bold text-sm">RunAsh</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onNavigate("home")} className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors">
            <Home className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate("editing")}
            className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Video className="w-4 h-4" />
          </button>
          <button onClick={() => onNavigate("ai")} className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors">
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
