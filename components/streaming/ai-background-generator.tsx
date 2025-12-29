"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2 } from "lucide-react"

interface AIBackgroundGeneratorProps {
  onBackgroundGenerated: (background: string) => void
}

export default function AIBackgroundGenerator({ onBackgroundGenerated }: AIBackgroundGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBackgrounds, setGeneratedBackgrounds] = useState<Array<{ id: string; url: string }>>([])

  const handleGenerate = () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      const newBackground = {
        id: `ai-${Date.now()}`,
        url: "/backgrounds/ai-generated.jpg", // This would be a real AI-generated image in production
      }

      setGeneratedBackgrounds((prev) => [newBackground, ...prev])
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="ai-prompt" className="text-sm font-medium">
          Describe the background you want
        </label>
        <Textarea
          id="ai-prompt"
          placeholder="E.g., A modern office with a city view, soft lighting, professional setting"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="resize-none"
          rows={3}
        />
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!prompt.trim() || isGenerating}
        className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-white"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Background
          </>
        )}
      </Button>

      {generatedBackgrounds.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Generated Backgrounds</h4>
          <div className="grid grid-cols-2 gap-2">
            {generatedBackgrounds.map((bg) => (
              <div
                key={bg.id}
                className="relative aspect-video rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => onBackgroundGenerated(bg.url)}
              >
                <img
                  src={bg.url || "/placeholder.svg"}
                  alt="AI-generated background"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
