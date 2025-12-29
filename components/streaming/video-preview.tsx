"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Camera, CameraOff, Maximize2, Monitor } from "lucide-react"

interface VideoPreviewProps {
  isStreaming: boolean
  selectedCamera: string
  activeSource?: "camera" | "screen"
  screenStream?: MediaStream | null
  onCameraStream?: (stream: MediaStream) => void
  virtualBackground?: string | null
  backgroundBlur?: number
}

export default function VideoPreview({
  isStreaming,
  selectedCamera,
  activeSource = "camera",
  screenStream = null,
  onCameraStream,
  virtualBackground = null,
  backgroundBlur = 0,
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const backgroundRef = useRef<HTMLImageElement | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // In a real implementation, we would use the actual camera stream
  // This is a simplified version for demonstration purposes
  useEffect(() => {
    if (isCameraOff || activeSource === "screen") {
      if (videoRef.current && activeSource === "camera") {
        videoRef.current.srcObject = null
      }
      return
    }

    // Simulate camera stream with a placeholder
    const getVideoStream = async () => {
      try {
        // In a real app, we would use:
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

        if (videoRef.current && activeSource === "camera") {
          videoRef.current.srcObject = stream
        }

        // Pass the camera stream up to the parent component
        if (onCameraStream) {
          onCameraStream(stream)
        }
      } catch (error) {
        console.error("Error accessing camera:", error)
      }
    }

    getVideoStream()
  }, [isCameraOff, selectedCamera, activeSource, onCameraStream])

  // Handle screen stream
  useEffect(() => {
    if (activeSource === "screen" && screenStream && videoRef.current) {
      videoRef.current.srcObject = screenStream
    }
  }, [activeSource, screenStream])

  // Load virtual background image
  useEffect(() => {
    if (virtualBackground) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = virtualBackground
      backgroundRef.current = img
    } else {
      backgroundRef.current = null
    }
  }, [virtualBackground])

  // Apply AI effects and virtual background to the video stream
  useEffect(() => {
    if (isCameraOff || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    let animationFrame: number

    const drawVideoFrame = () => {
      if (video.paused || video.ended) return

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 1280
      canvas.height = video.videoHeight || 720

      // Draw the current video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Apply virtual background if available
      if (backgroundRef.current && backgroundRef.current.complete && virtualBackground) {
        // In a real implementation, this would use a segmentation model
        // to separate the person from the background
        // For this demo, we'll just draw the background image behind the person
        ctx.globalCompositeOperation = "destination-over"
        ctx.drawImage(backgroundRef.current, 0, 0, canvas.width, canvas.height)
        ctx.globalCompositeOperation = "source-over"
      }
      // Apply background blur if enabled
      else if (backgroundBlur > 0) {
        // In a real implementation, this would use a segmentation model
        // and apply blur only to the background
        // For this demo, we'll just apply a simple filter
        const tempCanvas = document.createElement("canvas")
        tempCanvas.width = canvas.width
        tempCanvas.height = canvas.height
        const tempCtx = tempCanvas.getContext("2d")

        if (tempCtx) {
          tempCtx.filter = `blur(${backgroundBlur}px)`
          tempCtx.drawImage(canvas, 0, 0)
          ctx.drawImage(tempCanvas, 0, 0)
        }
      }

      // Apply other AI effects here (simplified for demo)
      // In a real app, we would use WebGL or WASM-based libraries for effects

      // Request next frame
      animationFrame = requestAnimationFrame(drawVideoFrame)
    }

    video.addEventListener("play", () => {
      drawVideoFrame()
    })

    // Start the video if it's not already playing
    if (video.paused) {
      video.play().catch(console.error)
    }

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isCameraOff, selectedCamera, virtualBackground, backgroundBlur])

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-xl"
    >
      {/* Hidden video element for source */}
      <video
        ref={videoRef}
        className="hidden"
        muted={isMuted}
        loop
        playsInline
        src="/placeholder.svg?height=720&width=1280"
      />

      {/* Canvas for rendering with effects */}
      <canvas ref={canvasRef} className={`w-full h-full object-cover ${isCameraOff ? "hidden" : "block"}`} />

      {/* Camera off placeholder */}
      {isCameraOff && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <CameraOff className="h-16 w-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">Camera is turned off</p>
          </div>
        </div>
      )}

      {/* Virtual background indicator */}
      {virtualBackground && !isCameraOff && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
          Virtual Background
        </div>
      )}

      {/* Stream indicator */}
      {isStreaming && (
        <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 text-white px-3 py-1 rounded-full">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-sm font-medium">Live</span>
        </div>
      )}

      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {activeSource === "camera" && (
              <>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={toggleMute}>
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={toggleCamera}>
                  {isCameraOff ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
                </Button>
              </>
            )}

            {activeSource === "screen" && (
              <div className="flex items-center space-x-2 bg-black/50 text-white px-3 py-1 rounded-full">
                <Monitor className="h-4 w-4" />
                <span className="text-sm font-medium">Screen Sharing</span>
              </div>
            )}
          </div>

          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={toggleFullscreen}>
            <Maximize2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
