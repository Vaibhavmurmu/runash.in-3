"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, HardDrive, Cloud, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { RecordingSettings } from "@/types/recording"

interface RecordingSettingsProps {
  initialSettings: RecordingSettings
  onSave: (settings: RecordingSettings) => void
}

export default function RecordingSettingsComponent({ initialSettings, onSave }: RecordingSettingsProps) {
  const [settings, setSettings] = useState<RecordingSettings>(initialSettings)
  const [activeTab, setActiveTab] = useState("general")

  const handleSave = () => {
    onSave(settings)
  }

  const updateSettings = (key: keyof RecordingSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const formatStorageSize = (gb: number) => {
    if (gb < 1) {
      return `${Math.round(gb * 1000)} MB`
    }
    return `${gb.toFixed(1)} GB`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recording Settings</CardTitle>
        <CardDescription>Configure how your streams are recorded and stored</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-record">Automatic Recording</Label>
                <p className="text-sm text-muted-foreground">Automatically record all streams</p>
              </div>
              <Switch
                id="auto-record"
                checked={settings.autoRecord}
                onCheckedChange={(checked) => updateSettings("autoRecord", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="record-audio">Record Audio</Label>
                <p className="text-sm text-muted-foreground">Include audio in recordings</p>
              </div>
              <Switch
                id="record-audio"
                checked={settings.recordAudio}
                onCheckedChange={(checked) => updateSettings("recordAudio", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="record-video">Record Video</Label>
                <p className="text-sm text-muted-foreground">Include video in recordings</p>
              </div>
              <Switch
                id="record-video"
                checked={settings.recordVideo}
                onCheckedChange={(checked) => updateSettings("recordVideo", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="save-chat">Save Chat</Label>
                <p className="text-sm text-muted-foreground">Save chat messages with recordings</p>
              </div>
              <Switch
                id="save-chat"
                checked={settings.saveChat}
                onCheckedChange={(checked) => updateSettings("saveChat", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="create-highlights">Auto-generate Highlights</Label>
                <p className="text-sm text-muted-foreground">AI-powered highlight detection</p>
              </div>
              <Switch
                id="create-highlights"
                checked={settings.createHighlights}
                onCheckedChange={(checked) => updateSettings("createHighlights", checked)}
              />
            </div>
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quality">Recording Quality</Label>
              <Select
                value={settings.quality}
                onValueChange={(value: "low" | "medium" | "high" | "source") => updateSettings("quality", value)}
              >
                <SelectTrigger id="quality">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (480p)</SelectItem>
                  <SelectItem value="medium">Medium (720p)</SelectItem>
                  <SelectItem value="high">High (1080p)</SelectItem>
                  <SelectItem value="source">Source Quality</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Higher quality requires more storage space and processing power
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Recording Format</Label>
              <Select
                value={settings.format}
                onValueChange={(value: "mp4" | "webm" | "mkv") => updateSettings("format", value)}
              >
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp4">MP4 (H.264)</SelectItem>
                  <SelectItem value="webm">WebM (VP9)</SelectItem>
                  <SelectItem value="mkv">MKV (H.265)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Different formats offer various compatibility and compression options
              </p>
            </div>
          </TabsContent>

          <TabsContent value="storage" className="space-y-4">
            <div className="space-y-2">
              <Label>Storage Location</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={settings.storage === "local" ? "default" : "outline"}
                  className={
                    settings.storage === "local"
                      ? "bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
                      : ""
                  }
                  onClick={() => updateSettings("storage", "local")}
                >
                  <HardDrive className="mr-2 h-4 w-4" />
                  Local Storage
                </Button>
                <Button
                  type="button"
                  variant={settings.storage === "cloud" ? "default" : "outline"}
                  className={
                    settings.storage === "cloud"
                      ? "bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
                      : ""
                  }
                  onClick={() => updateSettings("storage", "cloud")}
                >
                  <Cloud className="mr-2 h-4 w-4" />
                  Cloud Storage
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="max-storage">Maximum Storage</Label>
                <span className="text-sm font-medium">{formatStorageSize(settings.maxStorageGB)}</span>
              </div>
              <Slider
                id="max-storage"
                min={1}
                max={500}
                step={1}
                value={[settings.maxStorageGB]}
                onValueChange={(value) => updateSettings("maxStorageGB", value[0])}
              />
              <p className="text-sm text-muted-foreground">
                Limit the amount of storage used for recordings (1GB - 500GB)
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-delete">Auto-delete Old Recordings</Label>
                <p className="text-sm text-muted-foreground">Automatically delete recordings after a period</p>
              </div>
              <Switch
                id="auto-delete"
                checked={settings.autoDelete}
                onCheckedChange={(checked) => updateSettings("autoDelete", checked)}
              />
            </div>

            {settings.autoDelete && (
              <div className="space-y-2">
                <Label htmlFor="auto-delete-days">Delete After (days)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="auto-delete-days"
                    type="number"
                    min={1}
                    max={365}
                    value={settings.autoDeleteAfterDays}
                    onChange={(e) => updateSettings("autoDeleteAfterDays", Number.parseInt(e.target.value) || 30)}
                  />
                  <span>days</span>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-muted-foreground">
                <Info className="h-4 w-4 mr-1" />
                Storage usage info
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>1 hour of recording at 1080p uses approximately 2GB of storage</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button onClick={handleSave} className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  )
}
