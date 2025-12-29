"use client"

import { Home, Video, Sparkles, Settings, Plus } from "lucide-react"

interface AndroidBottomNavProps {
  currentScreen: string
  onNavigate: (screen: string) => void
}

export default function AndroidBottomNav({ currentScreen, onNavigate }: AndroidBottomNavProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "editing", label: "Edit", icon: Video },
    { id: "plus", label: "Create", icon: Plus },
    { id: "ai", label: "AI", icon: Sparkles },
    { id: "stream", label: "Stream", icon: Settings },
  ]

  return (
    <div className="border-t border-border/20 bg-card flex items-center justify-around h-16 px-2">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = currentScreen === item.id
        return (
          <button
            key={item.id}
            onClick={() => item.id !== "plus" && onNavigate(item.id)}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {item.id === "plus" ? (
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white">
                <Icon className="w-6 h-6" />
              </div>
            ) : (
              <>
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}
