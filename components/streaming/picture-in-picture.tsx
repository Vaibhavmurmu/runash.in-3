"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Rnd } from "react-rnd"
import { X, Minimize, Maximize } from "lucide-react"

interface PictureInPictureProps {
  cameraStream: MediaStream | null
  isMinimized: boolean
  onToggleMinimize: () => void
  onClose: () => void
}

export default function PictureInPicture({
  cameraStream,
  isMinimized,
  onToggleMinimize,
  onClose,
}: PictureInPictureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [size, setSize] = useState({ width: 240, height: 180 })
  const [position, setPosition] = useState({ x: 16, y: 16 })

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream
    }
  }, [cameraStream])

  if (!cameraStream) return null

  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={{ x: position.x, y: position.y }}
      onDragStop={(e, d) => {
        setPosition({ x: d.x, y: d.y })
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSize({
          width: Number.parseInt(ref.style.width),
          height: Number.parseInt(ref.style.height),
        })
        setPosition(position)
      }}
      minWidth={160}
      minHeight={120}
      bounds="parent"
      className={`${isMinimized ? "w-12 h-12 overflow-hidden" : ""}`}
    >
      <div className="relative w-full h-full bg-black rounded-lg overflow-hidden shadow-lg border border-gray-800">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />

        <div className="absolute top-2 right-2 flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 bg-black/50 hover:bg-black/70 text-white"
            onClick={onToggleMinimize}
          >
            {isMinimized ? <Maximize className="h-3 w-3" /> : <Minimize className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 bg-black/50 hover:bg-black/70 text-white"
            onClick={onClose}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Rnd>
  )
}
