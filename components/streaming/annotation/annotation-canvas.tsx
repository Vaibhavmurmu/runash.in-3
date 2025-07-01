"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import {
  type DrawingMode,
  type DrawingColor,
  type StrokeWidth,
  type Point,
  type DrawingObject,
  drawArrow,
  drawRectangle,
  drawCircle,
  generateId,
} from "@/utils/drawing-utils"

interface AnnotationCanvasProps {
  width: number
  height: number
  mode: DrawingMode
  color: DrawingColor
  strokeWidth: StrokeWidth
  visible: boolean
  onAddDrawing: (drawing: DrawingObject) => void
}

export default function AnnotationCanvas({
  width,
  height,
  mode,
  color,
  strokeWidth,
  visible,
  onAddDrawing,
}: AnnotationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPoints, setCurrentPoints] = useState<Point[]>([])
  const [textPosition, setTextPosition] = useState<Point | null>(null)
  const [textValue, setTextValue] = useState<string>("")
  const [textInputVisible, setTextInputVisible] = useState(false)
  const textInputRef = useRef<HTMLInputElement>(null)

  // Set up canvas context
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [width, height])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      // Save current drawing
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // Resize canvas
      canvas.width = width
      canvas.height = height

      // Restore drawing
      ctx.putImageData(imageData, 0, 0)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [width, height])

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode === "text") {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setTextPosition({ x, y })
      setTextInputVisible(true)
      setTextValue("")

      // Focus the text input after it becomes visible
      setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus()
        }
      }, 100)

      return
    }

    setIsDrawing(true)

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setCurrentPoints([{ x, y }])
  }

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setCurrentPoints((prev) => [...prev, { x, y }])

    // Draw current stroke
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (mode === "pen" || mode === "highlighter" || mode === "eraser") {
      ctx.beginPath()
      ctx.moveTo(currentPoints[0].x, currentPoints[0].y)

      for (let i = 1; i < currentPoints.length; i++) {
        ctx.lineTo(currentPoints[i].x, currentPoints[i].y)
      }

      if (mode === "highlighter") {
        ctx.globalAlpha = 0.3
        ctx.lineWidth = strokeWidth * 2
      } else if (mode === "eraser") {
        ctx.globalCompositeOperation = "destination-out"
        ctx.lineWidth = strokeWidth * 2
      } else {
        ctx.globalAlpha = 1
        ctx.lineWidth = strokeWidth
      }

      ctx.strokeStyle = color
      ctx.stroke()

      // Reset composite operation
      ctx.globalCompositeOperation = "source-over"
      ctx.globalAlpha = 1
    } else if (mode === "arrow") {
      drawArrow(ctx, currentPoints[0].x, currentPoints[0].y, x, y, color, strokeWidth)
    } else if (mode === "rectangle") {
      drawRectangle(ctx, currentPoints[0].x, currentPoints[0].y, x, y, color, strokeWidth)
    } else if (mode === "circle") {
      drawCircle(ctx, currentPoints[0].x, currentPoints[0].y, x, y, color, strokeWidth)
    }
  }

  // Handle mouse up
  const handleMouseUp = () => {
    if (!isDrawing) return

    setIsDrawing(false)

    // Add drawing to history
    if (currentPoints.length > 1) {
      const newDrawing: DrawingObject = {
        id: generateId(),
        type: mode,
        points: [...currentPoints],
        color,
        width: strokeWidth,
      }

      onAddDrawing(newDrawing)
    }

    setCurrentPoints([])
  }

  // Handle text input
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!textPosition || !textValue.trim()) {
      setTextInputVisible(false)
      return
    }

    const newDrawing: DrawingObject = {
      id: generateId(),
      type: "text",
      points: [textPosition],
      color,
      width: strokeWidth,
      text: textValue,
    }

    onAddDrawing(newDrawing)

    setTextInputVisible(false)
    setTextPosition(null)
    setTextValue("")
  }

  return (
    <div className="relative" style={{ width, height }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`absolute top-0 left-0 ${visible ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: mode === "text" ? "text" : "crosshair" }}
      />

      {textInputVisible && textPosition && (
        <form
          onSubmit={handleTextSubmit}
          className="absolute z-10"
          style={{
            left: textPosition.x,
            top: textPosition.y,
          }}
        >
          <input
            ref={textInputRef}
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm"
            style={{
              color,
              fontSize: `${Math.max(12, strokeWidth * 2)}px`,
              background: "rgba(255, 255, 255, 0.8)",
            }}
            onBlur={handleTextSubmit}
            autoFocus
          />
        </form>
      )}
    </div>
  )
}
