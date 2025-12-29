"use client"

import { useRef, useEffect } from "react"

interface BackgroundProcessorProps {
  videoStream: MediaStream | null
  backgroundImage: string | null
  blurAmount: number
  onProcessedStream: (stream: MediaStream) => void
}

export default function BackgroundProcessor({
  videoStream,
  backgroundImage,
  blurAmount,
  onProcessedStream,
}: BackgroundProcessorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const outputStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (!videoStream || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    video.srcObject = videoStream
    video.play().catch(console.error)

    // Set canvas dimensions
    canvas.width = 1280 // Standard HD width
    canvas.height = 720 // Standard HD height

    let backgroundImg: HTMLImageElement | null = null

    if (backgroundImage) {
      backgroundImg = new HTMLImageElement()
      backgroundImg.crossOrigin = "anonymous"
      backgroundImg.src = backgroundImage
    }

    // Create output stream from canvas
    outputStreamRef.current = canvas.captureStream(30) // 30 FPS

    // Add audio tracks from original stream to output stream
    videoStream.getAudioTracks().forEach((track) => {
      outputStreamRef.current?.addTrack(track)
    })

    // Pass the processed stream to parent component
    onProcessedStream(outputStreamRef.current)

    // Animation loop for processing frames
    let animationFrame: number
    const processFrame = () => {
      if (video.paused || video.ended) return

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Apply background replacement or blur
      if (backgroundImage && backgroundImg && backgroundImg.complete) {
        // In a real implementation, this would use a segmentation model
        // to separate the person from the background
        // For this demo, we'll just draw the background image
        ctx.globalCompositeOperation = "destination-over"
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height)
        ctx.globalCompositeOperation = "source-over"
      } else if (blurAmount > 0) {
        // In a real implementation, this would use a segmentation model
        // and apply blur only to the background
        // For this demo, we'll just apply a simple filter
        ctx.filter = `blur(${blurAmount}px)`
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height)
        ctx.filter = "none"
      }

      animationFrame = requestAnimationFrame(processFrame)
    }

    processFrame()

    return () => {
      cancelAnimationFrame(animationFrame)
      if (outputStreamRef.current) {
        outputStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [videoStream, backgroundImage, blurAmount, onProcessedStream])

  return (
    <div className="hidden">
      <video ref={videoRef} autoPlay playsInline muted />
      <canvas ref={canvasRef} />
    </div>
  )
}
