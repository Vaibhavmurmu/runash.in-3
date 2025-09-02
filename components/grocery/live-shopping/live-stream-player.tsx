"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Users } from "lucide-react"
import DVRControls from "./dvr-controls"
import type { DVRState } from "@/types/live-shopping"

interface LiveStreamPlayerProps {
  stream?: {
    id: string
    isLive: boolean
    hlsUrl?: string
    title: string
    hostName: string
    viewerCount?: number
  }
  onViewerJoin?: (streamId: string) => void
  onViewerLeave?: (streamId: string) => void
}

const LiveStreamPlayer: React.FC<LiveStreamPlayerProps> = ({ stream, onViewerJoin, onViewerLeave }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [dvrState, setDvrState] = useState<DVRState>({
    isEnabled: true,
    bufferDuration: 0,
    currentPosition: 0,
    isRewinding: false,
    playbackSpeed: 1.0,
    availableQualities: ["Auto", "1080p", "720p", "480p"],
    currentQuality: "Auto",
  })
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (stream?.hlsUrl && videoRef.current) {
      const video = videoRef.current

      // Check if HLS is supported natively
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream.hlsUrl
      } else {
        // Use HLS.js for browsers that don't support HLS natively
        import("hls.js").then(({ default: Hls }) => {
          if (Hls.isSupported()) {
            const hls = new Hls()
            hls.loadSource(stream.hlsUrl!)
            hls.attachMedia(video)

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              setIsLoading(false)
              if (isPlaying) {
                video.play().catch(console.error)
              }
            })

            hls.on(Hls.Events.ERROR, (event, data) => {
              console.error("HLS Error:", data)
              setError("Failed to load stream")
              setIsLoading(false)
            })

            return () => {
              hls.destroy()
            }
          } else {
            setError("HLS not supported in this browser")
            setIsLoading(false)
          }
        })
      }

      // Join stream as viewer
      if (stream.id && onViewerJoin) {
        onViewerJoin(stream.id)
      }

      return () => {
        // Leave stream when component unmounts
        if (stream.id && onViewerLeave) {
          onViewerLeave(stream.id)
        }
      }
    }
  }, [stream?.hlsUrl, stream?.id])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleError = () => {
      setError("Failed to load video")
      setIsLoading(false)
    }
    const handleTimeUpdate = () => {
      if (stream?.isLive) {
        setDvrState((prev) => ({
          ...prev,
          currentPosition: video.currentTime,
          bufferDuration: video.buffered.length > 0 ? video.buffered.end(0) : 0,
        }))
      }
    }

    video.addEventListener("loadstart", handleLoadStart)
    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("error", handleError)
    video.addEventListener("timeupdate", handleTimeUpdate)

    return () => {
      video.removeEventListener("loadstart", handleLoadStart)
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("error", handleError)
      video.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [stream?.isLive])

  const handleSeek = (position: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = position
    }
    setDvrState((prev) => ({ ...prev, currentPosition: position }))
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(console.error)
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleGoLive = () => {
    if (videoRef.current && stream?.isLive) {
      // Jump to live position (end of buffer)
      const buffered = videoRef.current.buffered
      if (buffered.length > 0) {
        videoRef.current.currentTime = buffered.end(0)
      }
    }
    setDvrState((prev) => ({ ...prev, currentPosition: prev.bufferDuration }))
  }

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
    setDvrState((prev) => ({ ...prev, playbackSpeed: speed }))
  }

  const handleQualityChange = (quality: string) => {
    setDvrState((prev) => ({ ...prev, currentQuality: quality }))
    // In a real implementation, this would change the HLS quality level
  }

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
    setIsMuted(!isMuted)
  }

  const handleToggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen?.()
      } else {
        document.exitFullscreen?.()
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  if (!stream) {
    return (
      <Card className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No stream available</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          controls={false}
          autoPlay
          muted={isMuted}
          playsInline
        />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Loading stream...</p>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-red-400 mb-2">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setError(null)
                  setIsLoading(true)
                }}
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Live indicator */}
        {stream.isLive && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-600 text-white">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              LIVE
            </Badge>
          </div>
        )}

        {/* Viewer count */}
        {stream.viewerCount !== undefined && (
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-black/50 text-white">
              <Users className="h-3 w-3 mr-1" />
              {stream.viewerCount.toLocaleString()}
            </Badge>
          </div>
        )}

        {/* Stream info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg mb-1">{stream.title}</h3>
          <p className="text-white/80 text-sm">Hosted by {stream.hostName}</p>
        </div>
      </div>

      {stream.isLive && (
        <DVRControls
          dvrState={dvrState}
          isLive={dvrState.currentPosition >= dvrState.bufferDuration - 5}
          onSeek={handleSeek}
          onPlayPause={handlePlayPause}
          onGoLive={handleGoLive}
          onSpeedChange={handleSpeedChange}
          onQualityChange={handleQualityChange}
          onVolumeChange={handleVolumeChange}
          onToggleMute={handleToggleMute}
          onToggleFullscreen={handleToggleFullscreen}
          volume={volume}
          isMuted={isMuted}
          isPlaying={isPlaying}
          isFullscreen={isFullscreen}
        />
      )}
    </Card>
  )
}

export default LiveStreamPlayer
