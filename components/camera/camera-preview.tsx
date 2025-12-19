"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, FlipHorizontal, Zap, ZapOff, X } from "lucide-react"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card"

export function CameraPreview() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Unable to access camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsActive(false)
  }

  const switchCamera = async () => {
    stopCamera()
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
    setTimeout(startCamera, 100)
  }

  const toggleFlash = async () => {
    if (stream) {
      const track = stream.getVideoTracks()[0]
      if (track && "torch" in track.getCapabilities()) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashEnabled } as any],
          })
          setFlashEnabled(!flashEnabled)
        } catch (err) {
          console.error("Flash not supported:", err)
        }
      }
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Camera Controls */}
      <div className="flex justify-center gap-3">
        <GlassButton
          variant={isActive ? "orange" : "white"}
          size="sm"
          onClick={isActive ? stopCamera : startCamera}
          effect="shimmer"
        >
          <Camera className="w-4 h-4 mr-2" />
          {isActive ? "Stop" : "Start"} Camera
        </GlassButton>

        {isActive && (
          <>
            <GlassButton variant="yellow" size="sm" onClick={switchCamera} effect="glow">
              <FlipHorizontal className="w-4 h-4 mr-2" />
              Flip
            </GlassButton>

            <GlassButton variant={flashEnabled ? "orange" : "white"} size="sm" onClick={toggleFlash}>
              {flashEnabled ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
            </GlassButton>
          </>
        )}
      </div>

      {/* Camera Preview */}
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <GlassCard variant="orange" className="m-4">
              <GlassCardContent className="p-4 text-center">
                <X className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <p className="text-sm text-white">{error}</p>
                <GlassButton variant="white" size="sm" className="mt-3" onClick={startCamera}>
                  Try Again
                </GlassButton>
              </GlassCardContent>
            </GlassCard>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

            {/* QR Scanning Overlay */}
            {isActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Scanning Frame */}
                  <div className="w-64 h-64 border-4 border-orange-400 rounded-2xl relative">
                    {/* Corner Indicators */}
                    <div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-yellow-400 rounded-tl-lg"></div>
                    <div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-yellow-400 rounded-tr-lg"></div>
                    <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-yellow-400 rounded-bl-lg"></div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-yellow-400 rounded-br-lg"></div>

                    {/* Scanning Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse"></div>
                  </div>

                  {/* Instructions */}
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                    <div className="glass-white px-4 py-2 rounded-xl">
                      <p className="text-sm text-orange-800 text-center whitespace-nowrap">
                        Position QR code within the frame
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Camera Info */}
            {isActive && (
              <div className="absolute top-4 left-4">
                <div className="glass-orange px-3 py-1 rounded-lg">
                  <p className="text-xs text-white">{facingMode === "user" ? "Front" : "Back"} Camera</p>
                </div>
              </div>
            )}

            {/* Flash Indicator */}
            {flashEnabled && (
              <div className="absolute top-4 right-4">
                <div className="glass-yellow px-3 py-1 rounded-lg">
                  <Zap className="w-4 h-4 text-orange-800" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Camera Status */}
      <div className="text-center">
        <p className="text-sm text-orange-600/70">
          {isActive ? "Camera is active - Ready to scan QR codes" : "Camera is inactive"}
        </p>
      </div>
    </div>
  )
}
