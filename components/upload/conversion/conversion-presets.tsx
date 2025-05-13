"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

interface ConversionPresetsProps {
  presets: any[]
  onApplyPreset: (presetId: string) => void
}

export default function ConversionPresets({ presets, onApplyPreset }: ConversionPresetsProps) {
  return (
    <div className="space-y-4">
      {presets.map((preset) => (
        <Card key={preset.id} className="overflow-hidden">
          <CardContent className="p-4">
            <CardTitle className="text-base flex items-center justify-between">
              {preset.name}
              <Badge variant="outline">{preset.targetFormat.toUpperCase()}</Badge>
            </CardTitle>
            <CardDescription className="mt-1">{preset.description}</CardDescription>

            <div className="mt-3 text-xs text-muted-foreground space-y-1">
              {preset.settings.resolution && (
                <div className="flex justify-between">
                  <span>Resolution:</span>
                  <span>
                    {preset.settings.resolution.width}x{preset.settings.resolution.height}
                  </span>
                </div>
              )}

              {preset.settings.videoBitrate && (
                <div className="flex justify-between">
                  <span>Video Bitrate:</span>
                  <span>{preset.settings.videoBitrate} kbps</span>
                </div>
              )}

              {preset.settings.framerate && (
                <div className="flex justify-between">
                  <span>Framerate:</span>
                  <span>{preset.settings.framerate} fps</span>
                </div>
              )}

              {preset.settings.audioBitrate && (
                <div className="flex justify-between">
                  <span>Audio Bitrate:</span>
                  <span>{preset.settings.audioBitrate} kbps</span>
                </div>
              )}

              {preset.settings.quality && (
                <div className="flex justify-between">
                  <span>Quality:</span>
                  <span>{preset.settings.quality}%</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-0">
            <Button
              variant="ghost"
              className="w-full rounded-none h-10 hover:bg-orange-50 dark:hover:bg-orange-950/20"
              onClick={() => onApplyPreset(preset.id)}
            >
              <Check className="mr-2 h-4 w-4" />
              Apply Preset
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
