"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { UploadSettings as UploadSettingsType } from "@/types/upload"

interface UploadSettingsProps {
  settings: UploadSettingsType
  onUpdateSettings: (settings: UploadSettingsType) => void
}

export default function UploadSettings({ settings, onUpdateSettings }: UploadSettingsProps) {
  const handleToggleSetting = (key: keyof UploadSettingsType, value: boolean) => {
    onUpdateSettings({
      ...settings,
      [key]: value,
    })
  }

  const handleChangeMaxFileSize = (value: string) => {
    const sizeInMB = Number.parseInt(value, 10)
    if (!isNaN(sizeInMB) && sizeInMB > 0) {
      onUpdateSettings({
        ...settings,
        maxFileSize: sizeInMB * 1024 * 1024, // Convert MB to bytes
      })
    }
  }

  const handleChangeDefaultPrivacy = (value: "public" | "private") => {
    onUpdateSettings({
      ...settings,
      defaultPrivacy: value,
    })
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Settings</CardTitle>
          <CardDescription>Configure how files are uploaded and processed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Default Privacy</h3>
                <p className="text-sm text-muted-foreground">Set the default privacy setting for uploaded files</p>
              </div>
              <Select
                value={settings.defaultPrivacy}
                onValueChange={(value) => handleChangeDefaultPrivacy(value as "public" | "private")}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Auto-Tagging</h3>
                <p className="text-sm text-muted-foreground">Automatically generate tags for uploaded files</p>
              </div>
              <Switch
                checked={settings.autoTagging}
                onCheckedChange={(checked) => handleToggleSetting("autoTagging", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Auto-Generate Thumbnails</h3>
                <p className="text-sm text-muted-foreground">Automatically generate thumbnails for videos and images</p>
              </div>
              <Switch
                checked={settings.autoGenerateThumbnails}
                onCheckedChange={(checked) => handleToggleSetting("autoGenerateThumbnails", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Compression</h3>
                <p className="text-sm text-muted-foreground">Compress files to reduce storage usage</p>
              </div>
              <Switch
                checked={settings.compressionEnabled}
                onCheckedChange={(checked) => handleToggleSetting("compressionEnabled", checked)}
              />
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Maximum File Size</h3>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min="1"
                  value={Math.floor(settings.maxFileSize / (1024 * 1024))}
                  onChange={(e) => handleChangeMaxFileSize(e.target.value)}
                  className="w-24"
                />
                <Label>MB</Label>
                <Badge variant="outline" className="ml-2">
                  {formatBytes(settings.maxFileSize)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Maximum size for individual file uploads</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Allowed File Types</h3>
              <div className="flex flex-wrap gap-2">
                {settings.allowedFileTypes.map((type) => (
                  <Badge key={type} variant="secondary">
                    {type.split("/")[1].toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Reset to Defaults</Button>
          <Button className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90">Save Settings</Button>
        </CardFooter>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          These settings apply to all future uploads. Existing files will not be affected.
        </AlertDescription>
      </Alert>
    </div>
  )
}
