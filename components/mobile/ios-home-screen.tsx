"use client"

import { Play, TrendingUp, Video } from "lucide-react"

interface IosHomeScreenProps {
  onNavigate: (screen: string) => void
}

export default function IosHomeScreen({ onNavigate }: IosHomeScreenProps) {
  return (
    <div className="p-4 space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Anything.</h1>
        <h1 className="text-3xl font-bold mb-4">Anyone.</h1>
        <p className="text-sm opacity-90 mb-4">Stream live with AI-powered editing in real-time</p>
        <button
          onClick={() => onNavigate("stream")}
          className="bg-white text-primary rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2 w-fit"
        >
          <Play className="w-4 h-4" />
          Start Stream
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate("editing")}
          className="bg-card rounded-xl p-4 flex flex-col items-start gap-3 hover:bg-card/80 transition-colors"
        >
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <Video className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-medium">Live Edit</span>
        </button>

        <button
          onClick={() => onNavigate("ai")}
          className="bg-card rounded-xl p-4 flex flex-col items-start gap-3 hover:bg-card/80 transition-colors"
        >
          <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
            <span className="text-primary text-lg">✨</span>
          </div>
          <span className="text-sm font-medium">AI Magic</span>
        </button>
      </div>

      {/* Recent Streams */}
      <div>
        <h2 className="font-semibold text-sm mb-3">Recent Streams</h2>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card rounded-lg p-3 flex items-center justify-between hover:bg-card/80 transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">Stream {i}</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
