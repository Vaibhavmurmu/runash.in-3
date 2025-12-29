"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface TextAnnotationProps {
  initialText?: string
  position: { x: number; y: number }
  color: string
  fontSize: number
  onSave: (text: string) => void
  onCancel: () => void
}

export default function TextAnnotation({
  initialText = "",
  position,
  color,
  fontSize,
  onSave,
  onCancel,
}: TextAnnotationProps) {
  const [text, setText] = useState(initialText)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onSave(text)
    } else {
      onCancel()
    }
  }

  return (
    <div
      className="absolute"
      style={{
        left: position.x,
        top: position.y,
        zIndex: 1000,
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-md shadow-lg p-2">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">Add Text Annotation</div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onCancel}>
            <X size={14} />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full min-w-[200px] p-2 border border-gray-300 dark:border-gray-700 rounded-md mb-2"
            style={{
              color,
              fontSize: `${fontSize}px`,
            }}
            rows={3}
            autoFocus
          />

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
