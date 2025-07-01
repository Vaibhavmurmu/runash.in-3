"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Radio, MessageSquare, BarChart3, Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface MobileLayoutProps {
  children: React.ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const navigation = [
    { name: "Home", href: "/mobile", icon: Home },
    { name: "Stream", href: "/mobile/stream", icon: Radio },
    { name: "Chat", href: "/mobile/chat", icon: MessageSquare },
    { name: "Analytics", href: "/mobile/analytics", icon: BarChart3 },
    { name: "Settings", href: "/mobile/settings", icon: Settings },
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <div className="py-4 border-b">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 dark:from-orange-400 dark:to-yellow-300 text-transparent bg-clip-text">
                    RunAsh Mobile
                  </h2>
                </div>
                <nav className="flex-1 py-4">
                  <ul className="space-y-2">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                            pathname === item.href
                              ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                          )}
                          onClick={() => setIsSheetOpen(false)}
                        >
                          <item.icon className="h-5 w-5 mr-3" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="py-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      // In a real app, this would log the user out
                      console.log("Logout")
                      setIsSheetOpen(false)
                    }}
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-yellow-500 dark:from-orange-400 dark:to-yellow-300 text-transparent bg-clip-text ml-2">
            RunAsh
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          {pathname === "/mobile/stream" && (
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-1"></div>
              <span className="text-xs font-medium">Live</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* Mobile Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-5 h-16">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center",
                pathname === item.href
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
