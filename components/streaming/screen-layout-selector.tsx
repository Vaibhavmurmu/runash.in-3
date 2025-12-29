"use client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Monitor, Camera, Grid2X2 } from "lucide-react"

interface ScreenLayoutSelectorProps {
  onLayoutChange: (layout: "screen-only" | "pip" | "side-by-side" | "camera-only") => void
  currentLayout: "screen-only" | "pip" | "side-by-side" | "camera-only"
}

export default function ScreenLayoutSelector({ onLayoutChange, currentLayout }: ScreenLayoutSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Grid2X2 className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-medium">Layout Options</h3>
      </div>

      <RadioGroup value={currentLayout} onValueChange={(value) => onLayoutChange(value as any)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center space-y-2">
            <div
              className={`
              border-2 rounded-lg p-2 w-full aspect-video flex items-center justify-center
              ${currentLayout === "screen-only" ? "border-orange-500" : "border-gray-200 dark:border-gray-800"}
            `}
            >
              <Monitor className="h-8 w-8 text-gray-400" />
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="screen-only" id="screen-only" />
              <Label htmlFor="screen-only">Screen Only</Label>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div
              className={`
              border-2 rounded-lg p-2 w-full aspect-video relative
              ${currentLayout === "pip" ? "border-orange-500" : "border-gray-200 dark:border-gray-800"}
            `}
            >
              <Monitor className="h-8 w-8 text-gray-400 absolute inset-0 m-auto" />
              <div className="absolute bottom-2 right-2 h-6 w-8 bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center">
                <Camera className="h-3 w-3 text-gray-500" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pip" id="pip" />
              <Label htmlFor="pip">Picture in Picture</Label>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div
              className={`
              border-2 rounded-lg p-2 w-full aspect-video flex
              ${currentLayout === "side-by-side" ? "border-orange-500" : "border-gray-200 dark:border-gray-800"}
            `}
            >
              <div className="flex-1 flex items-center justify-center border-r border-gray-200 dark:border-gray-800">
                <Monitor className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <Camera className="h-6 w-6 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="side-by-side" id="side-by-side" />
              <Label htmlFor="side-by-side">Side by Side</Label>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div
              className={`
              border-2 rounded-lg p-2 w-full aspect-video flex items-center justify-center
              ${currentLayout === "camera-only" ? "border-orange-500" : "border-gray-200 dark:border-gray-800"}
            `}
            >
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="camera-only" id="camera-only" />
              <Label htmlFor="camera-only">Camera Only</Label>
            </div>
          </div>
        </div>
      </RadioGroup>
    </div>
  )
}
