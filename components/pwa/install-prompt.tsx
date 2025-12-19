"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Download, Smartphone, Share } from "lucide-react"
import { toast } from "sonner"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function InstallPrompt() {
  const [mounted, setMounted] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (typeof window === "undefined") return

    // Check if already installed
    const isStandaloneMode = window.matchMedia("(display-mode: standalone)").matches
    const isIOSStandalone = (window.navigator as any).standalone === true
    setIsStandalone(isStandaloneMode || isIOSStandalone)

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Check if already dismissed
    const dismissed = localStorage.getItem("pwa-install-dismissed")
    const dismissedTime = dismissed ? Number.parseInt(dismissed) : 0
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000

    if (dismissedTime > oneDayAgo) {
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after a delay
      setTimeout(() => {
        if (!isStandaloneMode && !isIOSStandalone) {
          setShowPrompt(true)
        }
      }, 3000)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      toast.success("App installed successfully!")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        toast.success("Installing app...")
      } else {
        toast.info("Installation cancelled")
      }

      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error("Installation error:", error)
      toast.error("Installation failed")
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-install-dismissed", Date.now().toString())
    toast.info("You can install the app later from your browser menu")
  }

  const handleIOSInstall = () => {
    setShowPrompt(false)
    toast.info('Tap the Share button and then "Add to Home Screen"')
  }

  if (!mounted || isStandalone || isInstalled || !showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="glass-white border-orange-200/50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-orange-900 text-sm">Install RunAsh AI Pay</h3>
              <p className="text-xs text-orange-700 mt-1">
                Get quick access and offline features by installing our app
              </p>

              <div className="flex items-center space-x-2 mt-3">
                {isIOS ? (
                  <Button
                    size="sm"
                    onClick={handleIOSInstall}
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-xs"
                  >
                    <Share className="w-3 h-3 mr-1" />
                    Install
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleInstall}
                    disabled={!deferredPrompt}
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Install
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-orange-600 hover:text-orange-700 text-xs"
                >
                  Later
                </Button>
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="text-orange-400 hover:text-orange-600 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Alternative export name for backward compatibility
export const PWAInstallPrompt = InstallPrompt
