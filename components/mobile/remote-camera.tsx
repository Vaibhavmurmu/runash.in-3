"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Camera, CameraOff, Mic, MicOff, Smartphone, RotateCw } from "lucide-react"

interface RemoteCameraProps {
  isActive: boolean
  onToggle: () => void
}

export default function RemoteCamera({ isActive, onToggle }: RemoteCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [streamId, setStreamId] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (isActive && isCameraOn) {
      startCamera()
    } else if (videoRef.current && videoRef.current.srcObject) {
      stopCamera()
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        stopCamera()
      }
    }
  }, [isActive, isCameraOn])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: isMicOn,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      // In a real app, we would send this stream to the server
      setStreamId(`mobile-camera-${Date.now()}`)
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setStreamId(null)
    }
  }

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn)
  }

  const toggleMic = () => {
    setIsMicOn(!isMicOn)
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !isMicOn
      })
    }
  }

  const handleSwitchCamera = async () => {
    // In a real app, this would switch between front and back cameras
    if (videoRef.current && videoRef.current.srcObject) {
      stopCamera()
      setTimeout(() => {
        if (isCameraOn) startCamera()
      }, 500)
    }
  }

  const simulateConnection = () => {
    setIsConnecting(true)
    setTimeout(() => {
      onToggle()
      setIsConnecting(false)
    }, 2000)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {isActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{
                filter: `brightness(${brightness}%) contrast(${contrast}%)`,
              }}
            />
            {!isCameraOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <CameraOff className="h-12 w-12 text-gray-400" />
              </div>
            )}
            {streamId && (
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                Connected
              </div>
            )}
            {isMicOn ? (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white p-1 rounded-full">
                <Mic className="h-4 w-4" />
              </div>
            ) : (
              <div className="absolute bottom-2 right-2 bg-red-500/80 text-white p-1 rounded-full">
                <MicOff className="h-4 w-4" />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Smartphone className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-400 text-sm">Remote camera inactive</p>
            <Button
              onClick={simulateConnection}
              className="mt-4 bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect to Stream"}
            </Button>
          </div>
        )}
      </div>

      {isActive && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={isCameraOn ? "outline" : "destructive"}
              className="flex flex-col py-4"
              onClick={toggleCamera}
            >
              {isCameraOn ? <Camera className="h-5 w-5 mb-1" /> : <CameraOff className="h-5 w-5 mb-1" />}
              <span className="text-xs">{isCameraOn ? "Camera Off" : "Camera On"}</span>
            </Button>
            <Button variant={isMicOn ? "outline" : "destructive"} className="flex flex-col py-4" onClick={toggleMic}>
              {isMicOn ? <Mic className="h-5 w-5 mb-1" /> : <MicOff className="h-5 w-5 mb-1" />}
              <span className="text-xs">{isMicOn ? "Mic Off" : "Mic On"}</span>
            </Button>
            <Button variant="outline" className="flex flex-col py-4" onClick={handleSwitchCamera}>
              <RotateCw className="h-5 w-5 mb-1" />
              <span className="text-xs">Switch</span>
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Brightness</span>
                <span className="text-sm text-gray-500">{brightness}%</span>
              </div>
              <Slider value={[brightness]} onValueChange={(values) => setBrightness(values[0])} max={200} step={5} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Contrast</span>
                <span className="text-sm text-gray-500">{contrast}%</span>
              </div>
              <Slider value={[contrast]} onValueChange={(values) => setContrast(values[0])} max={200} step={5} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-adjust lighting</span>
              <Switch />
            </div>
          </div>

          <Button variant="destructive" className="w-full" onClick={onToggle}>
            Disconnect Camera
          </Button>
        </div>
      )}
    </div>
  )
}
