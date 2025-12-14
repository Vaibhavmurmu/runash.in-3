"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Accent = "orange" | "teal" | "violet" | "red" | "green"

const AccentContext = createContext({
  accent: "orange" as Accent,
  setAccent: (a: Accent) => {},
})

export function AccentThemeProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccent] = useState<Accent>(() => {
    if (typeof window === "undefined") return "orange"
    return (localStorage.getItem("accent") as Accent) || "orange"
  })

  useEffect(() => {
    // Apply CSS variables or classes for accent
    const root = document.documentElement
    root.dataset.accent = accent
    try {
      localStorage.setItem("accent", accent)
    } catch (e) {}
  }, [accent])

  return <AccentContext.Provider value={{ accent, setAccent }}>{children}</AccentContext.Provider>
}

export function useAccent() {
  return useContext(AccentContext)
}

export function AccentThemeToggle() {
  const { accent, setAccent } = useAccent()
  const accents: Accent[] = ["orange", "teal", "violet", "red", "green"]
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-gray-600 dark:text-gray-300 mr-2">Accent</div>
      <div className="flex items-center gap-2">
        {accents.map((a) => (
          <button
            key={a}
            onClick={() => setAccent(a)}
            aria-pressed={accent === a}
            className={`h-6 w-6 rounded-full ring-2 ring-offset-1 ${accent === a ? "ring-black/20 dark:ring-white/20" : "opacity-70" }`}
            style={{
              background:
                a === "orange"
                  ? "linear-gradient(45deg,#fb923c,#f59e0b)"
                  : a === "teal"
                  ? "linear-gradient(45deg,#06b6d4,#14b8a6)"
                  : a === "violet"
                  ? "linear-gradient(45deg,#8b5cf6,#a78bfa)"
                  : a === "red"
                  ? "linear-gradient(45deg,#ef4444,#f97316)"
                  : "linear-gradient(45deg,#10b981,#34d399)",
            }}
          />
        ))}
      </div>
    </div>
  )
}
