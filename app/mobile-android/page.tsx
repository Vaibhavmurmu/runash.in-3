"use client"

import { useState } from "react"
import AndroidStatusBar from "@/components/mobile/android-status-bar"
import AndroidHomeScreen from "@/components/mobile/android-home-screen"
import AndroidEditingScreen from "@/components/mobile/android-editing-screen"
import AndroidLiveStream from "@/components/mobile/android-live-stream"
import AndroidAiFeatures from "@/components/mobile/android-ai-features"
import AndroidBottomNav from "@/components/mobile/android-bottom-nav"

export default function AndroidApp() {
  const [currentScreen, setCurrentScreen] = useState("home")

  const screens = {
    home: <AndroidHomeScreen onNavigate={setCurrentScreen} />,
    editing: <AndroidEditingScreen onNavigate={setCurrentScreen} />,
    stream: <AndroidLiveStream onNavigate={setCurrentScreen} />,
    ai: <AndroidAiFeatures onNavigate={setCurrentScreen} />,
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Android Phone Frame */}
      <div className="w-full max-w-sm">
        <div
          className="relative bg-black rounded-2xl border-8 border-black shadow-2xl overflow-hidden"
          style={{ aspectRatio: "9/19.5" }}
        >
          {/* Status Bar */}
          <AndroidStatusBar />

          {/* Screen Content */}
          <div className="w-full h-[calc(100%-25px)] bg-background text-foreground overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto">{screens[currentScreen as keyof typeof screens]}</div>
            <AndroidBottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
          </div>
        </div>
      </div>
    </div>
  )
}
