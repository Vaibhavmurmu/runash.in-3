"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Rnd } from "react-rnd"
import AnnotationToolbar from "./annotation-toolbar"
import AnnotationCanvas from "./annotation-canvas"
import type { DrawingMode, DrawingColor, StrokeWidth, DrawingObject } from "@/utils/drawing-utils"

interface AnnotationManagerProps {
  containerRef: React.RefObject<HTMLDivElement>
  isActive: boolean
}

export default function AnnotationManager({ containerRef, isActive }: AnnotationManagerProps) {
  // Drawing state
  const [mode, setMode] = useState<DrawingMode>("pen")
  const [color, setColor] = useState<DrawingColor>("#ff5722")
  const [strokeWidth, setStrokeWidth] = useState<StrokeWidth>(3)
  const [visible, setVisible] = useState(true)

  // History state
  const [drawings, setDrawings] = useState<DrawingObject[]>([])
  const [redoStack, setRedoStack] = useState<DrawingObject[]>([])

  // Toolbar position state
  const [toolbarPosition, setToolbarPosition] = useState({ x: 20, y: 20 })

  // Container dimensions
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 })

  // Canvas ref for rendering drawings
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Update container dimensions when container changes or on resize
  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (!containerRef.current) return

      const { width, height } = containerRef.current.getBoundingClientRect()
      setContainerDimensions({ width, height })
    }

    updateDimensions()

    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [containerRef])

  // Render all drawings to the canvas
  useEffect(() => {
    if (!canvasRef.current || !visible) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Render all drawings
    drawings.forEach((drawing) => {
      if (drawing.points.length < 1) return

      if (drawing.type === "pen" || drawing.type === "eraser") {
        ctx.beginPath()
        ctx.moveTo(drawing.points[0].x, drawing.points[0].y)

        for (let i = 1; i < drawing.points.length; i++) {
          ctx.lineTo(drawing.points[i].x, drawing.points[i].y)
        }

        ctx.strokeStyle = drawing.color
        ctx.lineWidth = drawing.width
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        if (drawing.type === "eraser") {
          ctx.globalCompositeOperation = "destination-out"
        } else {
          ctx.globalCompositeOperation = "source-over"
        }

        ctx.stroke()
        ctx.globalCompositeOperation = "source-over"
      } else if (drawing.type === "highlighter") {
        ctx.beginPath()
        ctx.moveTo(drawing.points[0].x, drawing.points[0].y)

        for (let i = 1; i < drawing.points.length; i++) {
          ctx.lineTo(drawing.points[i].x, drawing.points[i].y)
        }

        ctx.strokeStyle = drawing.color
        ctx.lineWidth = drawing.width * 2
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.globalAlpha = 0.3
        ctx.stroke()
        ctx.globalAlpha = 1
      } else if (drawing.type === "arrow" && drawing.points.length >= 2) {
        const start = drawing.points[0]
        const end = drawing.points[drawing.points.length - 1]

        // Draw arrow
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.strokeStyle = drawing.color
        ctx.lineWidth = drawing.width
        ctx.stroke()

        // Draw arrowhead
        const headLength = 15
        const angle = Math.atan2(end.y - start.y, end.x - start.x)

        ctx.beginPath()
        ctx.moveTo(end.x, end.y)
        ctx.lineTo(
          end.x - headLength * Math.cos(angle - Math.PI / 6),
          end.y - headLength * Math.sin(angle - Math.PI / 6),
        )
        ctx.lineTo(
          end.x - headLength * Math.cos(angle + Math.PI / 6),
          end.y - headLength * Math.sin(angle + Math.PI / 6),
        )
        ctx.closePath()
        ctx.fillStyle = drawing.color
        ctx.fill()
      } else if (drawing.type === "rectangle" && drawing.points.length >= 2) {
        const start = drawing.points[0]
        const end = drawing.points[drawing.points.length - 1]

        ctx.beginPath()
        ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y)
        ctx.strokeStyle = drawing.color
        ctx.lineWidth = drawing.width
        ctx.stroke()
      } else if (drawing.type === "circle" && drawing.points.length >= 2) {
        const start = drawing.points[0]
        const end = drawing.points[drawing.points.length - 1]

        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))

        ctx.beginPath()
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI)
        ctx.strokeStyle = drawing.color
        ctx.lineWidth = drawing.width
        ctx.stroke()
      } else if (drawing.type === "text" && drawing.text) {
        const position = drawing.points[0]

        ctx.font = `${Math.max(12, drawing.width * 2)}px sans-serif`
        ctx.fillStyle = drawing.color
        ctx.fillText(drawing.text, position.x, position.y)
      }
    })
  }, [drawings, visible])

  // Add a new drawing
  const handleAddDrawing = (drawing: DrawingObject) => {
    setDrawings((prev) => [...prev, drawing])
    setRedoStack([]) // Clear redo stack when a new drawing is added
  }

  // Undo the last drawing
  const handleUndo = () => {
    if (drawings.length === 0) return

    const lastDrawing = drawings[drawings.length - 1]
    const newDrawings = drawings.slice(0, -1)

    setDrawings(newDrawings)
    setRedoStack((prev) => [...prev, lastDrawing])
  }

  // Redo the last undone drawing
  const handleRedo = () => {
    if (redoStack.length === 0) return

    const lastUndone = redoStack[redoStack.length - 1]
    const newRedoStack = redoStack.slice(0, -1)

    setDrawings((prev) => [...prev, lastUndone])
    setRedoStack(newRedoStack)
  }

  // Clear all drawings
  const handleClear = () => {
    setDrawings([])
    setRedoStack([])
  }

  // Save the current canvas as an image
  const handleSave = () => {
    if (!canvasRef.current) return

    // Create a temporary canvas to combine the screen and annotations
    const tempCanvas = document.createElement("canvas")
    tempCanvas.width = containerDimensions.width
    tempCanvas.height = containerDimensions.height

    const tempCtx = tempCanvas.getContext("2d")
    if (!tempCtx) return

    // First, try to capture the screen content
    if (containerRef.current) {
      try {
        // Use html2canvas or similar library in a real implementation
        // For now, we'll just use the annotations
        tempCtx.fillStyle = "#f0f0f0"
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
        tempCtx.drawImage(canvasRef.current, 0, 0)
      } catch (error) {
        console.error("Error capturing screen:", error)
        // Fallback to just annotations
        tempCtx.drawImage(canvasRef.current, 0, 0)
      }
    } else {
      // Just use annotations
      tempCtx.drawImage(canvasRef.current, 0, 0)
    }

    // Create download link
    const link = document.createElement("a")
    link.download = `runash-annotation-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.png`
    link.href = tempCanvas.toDataURL("image/png")
    link.click()
  }

  // Toggle annotation visibility
  const toggleVisibility = () => {
    setVisible((prev) => !prev)
  }

  if (!isActive) return null

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Canvas for rendering all drawings */}
      <canvas
        ref={canvasRef}
        width={containerDimensions.width}
        height={containerDimensions.height}
        className={`absolute inset-0 ${visible ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}
      />

      {/* Active drawing canvas */}
      <AnnotationCanvas
        width={containerDimensions.width}
        height={containerDimensions.height}
        mode={mode}
        color={color}
        strokeWidth={strokeWidth}
        visible={visible}
        onAddDrawing={handleAddDrawing}
      />

      {/* Toolbar */}
      <div className="pointer-events-auto">
        <Rnd
          default={{
            x: toolbarPosition.x,
            y: toolbarPosition.y,
            width: "auto",
            height: "auto",
          }}
          onDragStop={(e, d) => {
            setToolbarPosition({ x: d.x, y: d.y })
          }}
          bounds="parent"
          dragHandleClassName="annotation-toolbar-handle"
        >
          <div className="annotation-toolbar-handle cursor-move">
            <AnnotationToolbar
              activeMode={mode}
              setActiveMode={setMode}
              activeColor={color}
              setActiveColor={setColor}
              strokeWidth={strokeWidth}
              setStrokeWidth={setStrokeWidth}
              canUndo={drawings.length > 0}
              canRedo={redoStack.length > 0}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onClear={handleClear}
              onSave={handleSave}
              visible={visible}
              toggleVisibility={toggleVisibility}
            />
          </div>
        </Rnd>
      </div>
    </div>
  )
}
