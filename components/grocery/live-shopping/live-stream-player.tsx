"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  MessageSquare,
  Users,
  Heart,
  Share2,
  ShoppingBag,
} from "lucide-react"
import type { LiveStream } from "@/types/live-shopping"

interface LiveStreamPlayerProps {
  stream: LiveStream
  onLeave: () => void
}

export default function LiveStreamPlayer({ stream, onLeave }: LiveStreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isBuffering, setIsBuffering] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [likes, setLikes] = useState(stream.likeCount)
  const [hasLiked, setHasLiked] = useState(false)

  // Control visibility timer
  useEffect(() => {
    let timer: NodeJS.Timeout

    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(timer)

      timer = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      container.addEventListener("touchstart", handleMouseMove)
    }

    return () => {
      clearTimeout(timer)
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove)
        container.removeEventListener("touchstart", handleMouseMove)
      }
    }
  }, [isPlaying])

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleDurationChange = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleWaiting = () => setIsBuffering(true)
    const handlePlaying = () => setIsBuffering(false)

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("durationchange", handleDurationChange)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("playing", handlePlaying)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("durationchange", handleDurationChange)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("playing", handlePlaying)
    }
  }, [])

  // Play/Pause
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play().catch((error) => {
        console.error("Error playing video:", error)
      })
    }
  }

  // Mute/Unmute
  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    const newMuted = !isMuted
    video.muted = newMuted
    setIsMuted(newMuted)
  }

  // Volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)

    const video = videoRef.current
    if (video) {
      video.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }

  // Fullscreen toggle
  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Like handler
  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1)
      setHasLiked(true)
    }
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div ref={containerRef} className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        autoPlay
        playsInline
        poster={stream.thumbnailUrl}
        src="/placeholder.svg?height=720&width=1280" // In a real app, this would be the actual stream URL
      />

      {/* Live Indicator */}
      <div className="absolute top-4 left-4 flex items-center space-x-4 z-20">
        <Badge
          variant="outline"
          className="flex items-center space-x-1 bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
        >
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
          <span>LIVE</span>
        </Badge>

        <Badge variant="outline" className="flex items-center space-x-1 bg-black/30 border-white/20 text-white">
          <Users className="h-3 w-3" />
          <span>{stream.viewerCount.toLocaleString()}</span>
        </Badge>
      </div>

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={onLeave}>
              Back
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={handleLike}>
              <Heart className={`h-4 w-4 ${hasLiked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>

            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8">
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Center Play/Pause */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 h-16 w-16 rounded-full"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Progress Bar */}
          <div className="flex items-center space-x-2">
            <div className="text-xs text-white/80">{formatTime(currentTime)}</div>
            <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
            </div>
            <div className="text-xs text-white/80">{formatTime(duration)}</div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <div
                className="relative"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>

                {showVolumeSlider && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black/80 rounded-lg w-24">
                    <Slider value={[volume]} min={0} max={1} step={0.01} onValueChange={handleVolumeChange} />
                  </div>
                )}
              </div>

              <div className="text-xs text-white/80">Live</div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8">
                <MessageSquare className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8"
                onClick={toggleFullscreen}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
