"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75
    }
  }, [])

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white dark:from-gray-950/70 dark:via-gray-950/50 dark:to-gray-950 z-10"></div>
      <video ref={videoRef} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/video-background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,white_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_30%,#030712_100%)]"></div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -left-24 w-96 h-96 bg-yellow-500/10 dark:bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>
    </>
  )
}
