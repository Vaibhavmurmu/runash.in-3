"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Pencil,
  Highlighter,
  Square,
  Circle,
  ArrowRight,
  Type,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Eye,
  EyeOff,
  Palette,
} from "lucide-react"
import type { DrawingMode, DrawingColor, StrokeWidth } from "@/utils/drawing-utils"

interface AnnotationToolbarProps {
  activeMode: DrawingMode
  setActiveMode: (mode: DrawingMode) => void
  activeColor: DrawingColor
  setActiveColor: (color: DrawingColor) => void
  strokeWidth: StrokeWidth
  setStrokeWidth: (width: StrokeWidth) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
  onSave: () => void
  visible: boolean
  toggleVisibility: () => void
}

const COLORS = [
  "#ff5722", // Orange (primary)
  "#ff9800", // Light Orange
  "#e91e63", // Pink
  "#f44336", // Red
  "#4caf50", // Green
  "#2196f3", // Blue
  "#9c27b0", // Purple
  "#ffeb3b", // Yellow
  "#ffffff", // White
  "#000000", // Black
]

export default function AnnotationToolbar({
  activeMode,
  setActiveMode,
  activeColor,
  setActiveColor,
  strokeWidth,
  setStrokeWidth,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  onSave,
  visible,
  toggleVisibility,
}: AnnotationToolbarProps) {
  const [isVertical, setIsVertical] = useState(false)

  const tools = [
    { mode: "pen" as DrawingMode, icon: <Pencil size={18} />, tooltip: "Pen" },
    { mode: "highlighter" as DrawingMode, icon: <Highlighter size={18} />, tooltip: "Highlighter" },
    { mode: "arrow" as DrawingMode, icon: <ArrowRight size={18} />, tooltip: "Arrow" },
    { mode: "rectangle" as DrawingMode, icon: <Square size={18} />, tooltip: "Rectangle" },
    { mode: "circle" as DrawingMode, icon: <Circle size={18} />, tooltip: "Circle" },
    { mode: "text" as DrawingMode, icon: <Type size={18} />, tooltip: "Text" },
    { mode: "eraser" as DrawingMode, icon: <Eraser size={18} />, tooltip: "Eraser" },
  ]

  return (
    <TooltipProvider>
      <div
        className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-2 ${isVertical ? "flex flex-col space-y-2" : "flex space-x-2"}`}
      >
        {/* Drawing Tools */}
        <div className={`flex ${isVertical ? "flex-col space-y-2" : "space-x-2"}`}>
          {tools.map((tool) => (
            <Tooltip key={tool.mode}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeMode === tool.mode ? "default" : "ghost"}
                  size="icon"
                  className={
                    activeMode === tool.mode
                      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                      : ""
                  }
                  onClick={() => setActiveMode(tool.mode)}
                >
                  {tool.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tool.tooltip}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Divider */}
        <div
          className={
            isVertical ? "h-px w-full bg-gray-200 dark:bg-gray-800 my-2" : "w-px h-8 bg-gray-200 dark:bg-gray-800 mx-2"
          }
        />

        {/* Color Picker */}
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Palette size={18} className="absolute" />
                  <div
                    className="w-4 h-4 rounded-full absolute bottom-1 right-1"
                    style={{ backgroundColor: activeColor }}
                  />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>Color</TooltipContent>
          </Tooltip>
          <PopoverContent className="w-64 p-3">
            <div className="grid grid-cols-5 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${activeColor === color ? "border-gray-900 dark:border-white" : "border-transparent"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setActiveColor(color)}
                />
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <label className="text-sm font-medium">Stroke Width: {strokeWidth}px</label>
              <Slider
                value={[strokeWidth]}
                min={1}
                max={20}
                step={1}
                onValueChange={(value) => setStrokeWidth(value[0])}
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* Divider */}
        <div
          className={
            isVertical ? "h-px w-full bg-gray-200 dark:bg-gray-800 my-2" : "w-px h-8 bg-gray-200 dark:bg-gray-800 mx-2"
          }
        />

        {/* Actions */}
        <div className={`flex ${isVertical ? "flex-col space-y-2" : "space-x-2"}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!canUndo} onClick={onUndo}>
                <Undo2 size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!canRedo} onClick={onRedo}>
                <Redo2 size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onClear}>
                <Trash2 size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear All</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onSave}>
                <Download size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save Screenshot</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleVisibility}>
                {visible ? <Eye size={18} /> : <EyeOff size={18} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{visible ? "Hide Annotations" : "Show Annotations"}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
