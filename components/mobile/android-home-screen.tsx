"use client"

import { Play, Zap } from "lucide-react"

interface AndroidHomeScreenProps {
  onNavigate: (screen: string) => void
}

export default function AndroidHomeScreen({ onNavigate }: AndroidHomeScreenProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-primary via-accent to-orange-600 rounded-lg p-6 text-white">
        <Zap className="w-8 h-8 mb-3" />
        <h1 className="text-3xl font-bold mb-2">Stream Live</h1>
        <p className="text-sm opacity-90 mb-4">With AI-powered real-time editing</p>
        <button
          onClick={() => onNavigate("stream")}
          className="bg-white text-primary rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2 w-fit"
        >
          <Play className="w-4 h-4" />
          Start
        </button>
      </div>

      {/* Quick Start */}
      <div>
        <h2 className="text-sm font-semibold mb-2">Quick Start</h2>
        <div className="space-y-2">
          {[
            { title: "Record Video", icon: "📹" },
            { title: "AI Edit", icon: "✨" },
            { title: "Go Live", icon: "🔴" },
          ].map((item, i) => (
            <div key={i} className="bg-card rounded-lg p-3 flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium flex-1">{item.title}</span>
              <span className="text-primary text-lg">→</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-primary">2.5M</p>
          <p className="text-xs text-muted-foreground">Total Viewers</p>
        </div>
        <div className="bg-card rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-accent">450+</p>
          <p className="text-xs text-muted-foreground">Active Users</p>
        </div>
      </div>
    </div>
  )
}
