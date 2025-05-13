"use client"

import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

import type { ConversionSettings } from "@/types/conversion"

interface ConversionSettingsProps {
  settings: ConversionSettings
  onUpdateSettings: (settings: ConversionSettings) => void
  selectedFormat: string
  selectedFileType: string
}

export default function ConversionSettings({
  settings,
  onUpdateSettings,
  selectedFormat,
  selectedFileType,
}: ConversionSettingsProps) {
  const isAudioFormat = ["mp3", "wav", "aac", "ogg", "flac"].includes(selectedFormat)
  const isVideoFormat = ["mp4", "webm", "mov", "avi", "mkv"].includes(selectedFormat)

  const handleResolutionChange = (dimension: "width" | "height", value: number) => {
    onUpdateSettings({
      ...settings,
      resolution: {
        ...settings.resolution,
        [dimension]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Video Settings */}
      {isVideoFormat && selectedFileType !== "audio" && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Video Settings</h4>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="resolution">Resolution</Label>
                <span className="text-sm text-muted-foreground">
                  {settings.resolution?.width}x{settings.resolution?.height}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width" className="text-xs">
                    Width
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    value={settings.resolution?.width || 1280}
                    onChange={(e) => handleResolutionChange("width", Number.parseInt(e.target.value))}
                    min={240}
                    max={3840}
                    step={16}
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-xs">
                    Height
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={settings.resolution?.height || 720}
                    onChange={(e) => handleResolutionChange("height", Number.parseInt(e.target.value))}
                    min={240}
                    max={2160}
                    step={16}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="videoBitrate">Video Bitrate</Label>
                <span className="text-sm text-muted-foreground">{settings.videoBitrate} kbps</span>
              </div>
              <Slider
                id="videoBitrate"
                min={500}
                max={20000}
                step={500}
                value={[settings.videoBitrate || 2500]}
                onValueChange={(value) => onUpdateSettings({ ...settings, videoBitrate: value[0] })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="framerate">Frame Rate</Label>
                <span className="text-sm text-muted-foreground">{settings.framerate} fps</span>
              </div>
              <Select
                value={settings.framerate?.toString() || "30"}
                onValueChange={(value) => onUpdateSettings({ ...settings, framerate: Number.parseInt(value) })}
              >
                <SelectTrigger id="framerate">
                  <SelectValue placeholder="Select framerate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 fps (Film)</SelectItem>
                  <SelectItem value="25">25 fps (PAL)</SelectItem>
                  <SelectItem value="30">30 fps (Standard)</SelectItem>
                  <SelectItem value="50">50 fps (High Motion)</SelectItem>
                  <SelectItem value="60">60 fps (Gaming/Sports)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="videoCodec">Video Codec</Label>
              </div>
              <Select
                value={settings.videoCodec || "h264"}
                onValueChange={(value) => onUpdateSettings({ ...settings, videoCodec: value })}
              >
                <SelectTrigger id="videoCodec">
                  <SelectValue placeholder="Select video codec" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h264">H.264 (AVC)</SelectItem>
                  <SelectItem value="h265">H.265 (HEVC)</SelectItem>
                  <SelectItem value="vp9">VP9</SelectItem>
                  <SelectItem value="av1">AV1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />
        </div>
      )}

      {/* Audio Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Audio Settings</h4>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="audioBitrate">Audio Bitrate</Label>
              <span className="text-sm text-muted-foreground">{settings.audioBitrate} kbps</span>
            </div>
            <Slider
              id="audioBitrate"
              min={32}
              max={isAudioFormat ? 320 : 256}
              step={16}
              value={[settings.audioBitrate || 128]}
              onValueChange={(value) => onUpdateSettings({ ...settings, audioBitrate: value[0] })}
            />
          </div>

          {isAudioFormat && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="audioCodec">Audio Codec</Label>
                </div>
                <Select
                  value={settings.audioCodec || "aac"}
                  onValueChange={(value) => onUpdateSettings({ ...settings, audioCodec: value })}
                >
                  <SelectTrigger id="audioCodec">
                    <SelectValue placeholder="Select audio codec" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aac">AAC</SelectItem>
                    <SelectItem value="mp3">MP3</SelectItem>
                    <SelectItem value="opus">Opus</SelectItem>
                    <SelectItem value="flac">FLAC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="sampleRate">Sample Rate</Label>
                </div>
                <Select
                  value={settings.sampleRate?.toString() || "44100"}
                  onValueChange={(value) => onUpdateSettings({ ...settings, sampleRate: Number.parseInt(value) })}
                >
                  <SelectTrigger id="sampleRate">
                    <SelectValue placeholder="Select sample rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="22050">22.05 kHz (Low)</SelectItem>
                    <SelectItem value="44100">44.1 kHz (Standard)</SelectItem>
                    <SelectItem value="48000">48 kHz (Professional)</SelectItem>
                    <SelectItem value="96000">96 kHz (High-Res)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="channels">Audio Channels</Label>
                </div>
                <Select
                  value={settings.channels?.toString() || "2"}
                  onValueChange={(value) => onUpdateSettings({ ...settings, channels: Number.parseInt(value) })}
                >
                  <SelectTrigger id="channels">
                    <SelectValue placeholder="Select channels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Mono (1)</SelectItem>
                    <SelectItem value="2">Stereo (2)</SelectItem>
                    <SelectItem value="6">5.1 Surround (6)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <Separator />
      </div>

      {/* General Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">General Settings</h4>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="quality">Quality</Label>
              <span className="text-sm text-muted-foreground">{settings.quality}%</span>
            </div>
            <Slider
              id="quality"
              min={10}
              max={100}
              step={5}
              value={[settings.quality || 80]}
              onValueChange={(value) => onUpdateSettings({ ...settings, quality: value[0] })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="preserveMetadata"
              checked={settings.preserveMetadata}
              onCheckedChange={(checked) => onUpdateSettings({ ...settings, preserveMetadata: checked })}
            />
            <Label htmlFor="preserveMetadata">Preserve metadata</Label>
          </div>

          {isVideoFormat && selectedFileType === "video" && (
            <div className="flex items-center space-x-2">
              <Switch
                id="stripAudio"
                checked={settings.stripAudio}
                onCheckedChange={(checked) => onUpdateSettings({ ...settings, stripAudio: checked })}
              />
              <Label htmlFor="stripAudio">Remove audio track</Label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
