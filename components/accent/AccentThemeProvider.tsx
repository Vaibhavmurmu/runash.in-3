"use client"

import React, { useEffect, useState } from "react"

const ACCENT_MAP: Record<string, string> = {
  blue: "#3b82f6", // bg-blue-500
  purple: "#8b5cf6", // bg-purple-500
  green: "#10b981", // bg-green-500
  orange: "#f97316", // bg-orange-500
  red: "#ef4444", // bg-red-500
  pink: "#ec4899", // bg-pink-500
}

export function AccentThemeProvider() {
  const [accent, setAccent] = useState<string>("orange")

  useEffect(() => {
    // Read saved accent from localStorage or from data-accent attribute,
    // ensure documentElement has the attribute set so CSS can react.
    try {
      const savedAccent = typeof window !== "undefined" ? localStorage.getItem("accent-color") : null
      const attrAccent = typeof document !== "undefined" ? document.documentElement.getAttribute("data-accent") : null
      const initial = savedAccent || attrAccent || "orange"
      setAccent(initial)
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-accent", initial)
      }
    } catch (e) {
      // ignore - defensive for SSR or private mode
      setAccent("orange")
    }
  }, [])

  const color = ACCENT_MAP[accent] ?? ACCENT_MAP["orange"]

  // Render a small circle that visually indicates the currently selected accent.
  // Keep it very small so it fits inline in buttons (used by ThemeSelector).
  return (
    <span className="ml-2 inline-block align-middle" aria-hidden>
      <span
        className="inline-block w-3 h-3 rounded-full ring-1 ring-inset"
        style={{ backgroundColor: color }}
      />
    </span>
  )
}
