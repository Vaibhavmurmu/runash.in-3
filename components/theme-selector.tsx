"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Monitor, Moon, Sun, Palette } from "lucide-react"
import { useTheme } from "next-themes"
import { AccentThemeProvider } from "@/components/accent/AccentThemeProvider" 

const themes = [
  { name: "Light", value: "light", icon: Sun },
  { name: "Dark", value: "dark", icon: Moon },
  { name: "System", value: "system", icon: Monitor },
]

const accentColors = [
  { name: "Blue", value: "blue", color: "bg-blue-500" },
  { name: "Purple", value: "purple", color: "bg-purple-500" },
  { name: "Green", value: "green", color: "bg-green-500" },
  { name: "Orange", value: "orange", color: "bg-orange-500" },
  { name: "Red", value: "red", color: "bg-red-500" },
  { name: "Pink", value: "pink", color: "bg-pink-500" },
]

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [accentColor, setAccentColor] = useState("orange")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedAccent = localStorage.getItem("accent-color")
    if (savedAccent) {
      setAccentColor(savedAccent)
      document.documentElement.setAttribute("data-accent", savedAccent)
    }
  }, [])

  const handleAccentChange = (color: string) => {
    setAccentColor(color)
    localStorage.setItem("accent-color", color)
    document.documentElement.setAttribute("data-accent", color)
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm">
        <Palette className="h-4 w-4" />
        <AccentThemeProvider />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        {themes.map((themeOption) => {
          const Icon = themeOption.icon
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={theme === themeOption.value ? "bg-accent" : ""}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{themeOption.name}</span>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Accent Color</DropdownMenuLabel>
        <div className="grid grid-cols-3 gap-2 p-2">
          {accentColors.map((color) => (
            <button
              key={color.value}
              onClick={() => handleAccentChange(color.value)}
              className={`w-8 h-8 rounded-full ${color.color} border-2 transition-all ${
                accentColor === color.value ? "border-foreground scale-110" : "border-transparent hover:scale-105"
              }`}
              title={color.name}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
