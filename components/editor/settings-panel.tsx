"use client"

import { useState } from "react"
import { Settings, X, Volume2, Monitor, Zap, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [settings, setSettings] = useState({
    // Audio/Video
    audioVolume: 80,
    videoQuality: "1080p",
    frameRate: 60,
    bitrate: 8000,
    // Display
    theme: "dark",
    layout: "default",
    showGridlines: true,
    showTimecodes: true,
    // Performance
    hardwareAccel: true,
    autoSave: true,
    autoSaveInterval: 5,
    // Notifications
    soundNotif: true,
    visualNotif: true,
    // Export
    defaultFormat: "mp4",
    defaultCodec: "h264",
    preserveMetadata: true,
  })

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="audio" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full rounded-none border-b bg-transparent px-6 pt-4 justify-start">
            <TabsTrigger value="audio" className="gap-2">
              <Volume2 className="w-4 h-4" />
              Audio/Video
            </TabsTrigger>
            <TabsTrigger value="display" className="gap-2">
              <Monitor className="w-4 h-4" />
              Display
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-2">
              <Zap className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="export" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </TabsTrigger>
          </TabsList>

          {/* Audio/Video Tab */}
          <TabsContent value="audio" className="flex-1 overflow-auto p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Audio Settings</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="volume" className="text-sm">
                    Master Volume
                  </Label>
                  <span className="text-sm font-medium text-muted-foreground">{settings.audioVolume}%</span>
                </div>
                <Slider
                  id="volume"
                  min={0}
                  max={100}
                  step={5}
                  value={[settings.audioVolume]}
                  onValueChange={(value) => updateSetting("audioVolume", value[0])}
                  className="w-full"
                />
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Video Settings</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quality" className="text-sm">
                      Resolution
                    </Label>
                    <Select value={settings.videoQuality} onValueChange={(v) => updateSetting("videoQuality", v)}>
                      <SelectTrigger id="quality" className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="480p">480p (SD)</SelectItem>
                        <SelectItem value="720p">720p (HD)</SelectItem>
                        <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                        <SelectItem value="1440p">1440p (2K)</SelectItem>
                        <SelectItem value="2160p">2160p (4K)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fps" className="text-sm">
                      Frame Rate
                    </Label>
                    <Select
                      value={settings.frameRate.toString()}
                      onValueChange={(v) => updateSetting("frameRate", Number.parseInt(v))}
                    >
                      <SelectTrigger id="fps" className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24">24 FPS</SelectItem>
                        <SelectItem value="30">30 FPS</SelectItem>
                        <SelectItem value="60">60 FPS</SelectItem>
                        <SelectItem value="120">120 FPS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bitrate" className="text-sm">
                      Bitrate
                    </Label>
                    <span className="text-sm font-medium text-muted-foreground">{settings.bitrate} kbps</span>
                  </div>
                  <Slider
                    id="bitrate"
                    min={1000}
                    max={15000}
                    step={500}
                    value={[settings.bitrate]}
                    onValueChange={(value) => updateSetting("bitrate", value[0])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Display Tab */}
          <TabsContent value="display" className="flex-1 overflow-auto p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Appearance</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme" className="text-sm">
                    Theme
                  </Label>
                  <Select value={settings.theme} onValueChange={(v) => updateSetting("theme", v)}>
                    <SelectTrigger id="theme" className="w-32 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="layout" className="text-sm">
                    Layout
                  </Label>
                  <Select value={settings.layout} onValueChange={(v) => updateSetting("layout", v)}>
                    <SelectTrigger id="layout" className="w-32 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="wide">Wide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="font-semibold text-foreground">Canvas Display</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <Label htmlFor="gridlines" className="text-sm cursor-pointer">
                    Show Gridlines
                  </Label>
                  <Switch
                    id="gridlines"
                    checked={settings.showGridlines}
                    onCheckedChange={(v) => updateSetting("showGridlines", v)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <Label htmlFor="timecodes" className="text-sm cursor-pointer">
                    Show Timecodes
                  </Label>
                  <Switch
                    id="timecodes"
                    checked={settings.showTimecodes}
                    onCheckedChange={(v) => updateSetting("showTimecodes", v)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="flex-1 overflow-auto p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Rendering</h3>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <Label htmlFor="hwaccel" className="text-sm cursor-pointer">
                  Hardware Acceleration
                </Label>
                <Switch
                  id="hwaccel"
                  checked={settings.hardwareAccel}
                  onCheckedChange={(v) => updateSetting("hardwareAccel", v)}
                />
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="font-semibold text-foreground">Auto Save</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <Label htmlFor="autosave" className="text-sm cursor-pointer">
                    Enable Auto Save
                  </Label>
                  <Switch
                    id="autosave"
                    checked={settings.autoSave}
                    onCheckedChange={(v) => updateSetting("autoSave", v)}
                  />
                </div>

                {settings.autoSave && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="interval" className="text-sm">
                        Auto Save Interval
                      </Label>
                      <span className="text-sm font-medium text-muted-foreground">{settings.autoSaveInterval} min</span>
                    </div>
                    <Slider
                      id="interval"
                      min={1}
                      max={60}
                      step={1}
                      value={[settings.autoSaveInterval]}
                      onValueChange={(value) => updateSetting("autoSaveInterval", value[0])}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="flex-1 overflow-auto p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Export Settings</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="format" className="text-sm">
                    Default Format
                  </Label>
                  <Select value={settings.defaultFormat} onValueChange={(v) => updateSetting("defaultFormat", v)}>
                    <SelectTrigger id="format" className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp4">MP4</SelectItem>
                      <SelectItem value="webm">WebM</SelectItem>
                      <SelectItem value="mov">MOV</SelectItem>
                      <SelectItem value="mkv">MKV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codec" className="text-sm">
                    Video Codec
                  </Label>
                  <Select value={settings.defaultCodec} onValueChange={(v) => updateSetting("defaultCodec", v)}>
                    <SelectTrigger id="codec" className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="h264">H.264</SelectItem>
                      <SelectItem value="h265">H.265</SelectItem>
                      <SelectItem value="vp9">VP9</SelectItem>
                      <SelectItem value="av1">AV1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <Label htmlFor="metadata" className="text-sm cursor-pointer">
                  Preserve Metadata
                </Label>
                <Switch
                  id="metadata"
                  checked={settings.preserveMetadata}
                  onCheckedChange={(v) => updateSetting("preserveMetadata", v)}
                />
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <Button className="w-full gap-2 bg-gradient-to-r from-primary to-accent">
                <Download className="w-4 h-4" />
                Apply Export Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-muted/30">
          <p className="text-xs text-muted-foreground">Settings are saved automatically</p>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
