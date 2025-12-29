"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, X } from "lucide-react"

export interface PlatformFormData {
  id?: string
  platform: string
  name: string
  streamKey: string
  serverUrl?: string
}

interface PlatformFormProps {
  isOpen: boolean
  initialData?: PlatformFormData
  onClose: () => void
  onSave: (data: PlatformFormData) => void
}

export default function PlatformForm({ isOpen, initialData, onClose, onSave }: PlatformFormProps) {
  const [formData, setFormData] = useState<PlatformFormData>(
    initialData || {
      platform: "twitch",
      name: "",
      streamKey: "",
      serverUrl: "",
    },
  )

  const handleChange = (field: keyof PlatformFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Platform Connection" : "Add Platform Connection"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={formData.platform} onValueChange={(value) => handleChange("platform", value)}>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitch">Twitch</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="custom">Custom RTMP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Connection Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={`My ${formData.platform.charAt(0).toUpperCase() + formData.platform.slice(1)} Channel`}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="streamKey">
                Stream Key
                <span className="ml-1 text-gray-500 text-xs">(encrypted & securely stored)</span>
              </Label>
              <Input
                id="streamKey"
                type="password"
                value={formData.streamKey}
                onChange={(e) => handleChange("streamKey", e.target.value)}
                placeholder="Enter your stream key"
                required
              />
            </div>

            {(formData.platform === "custom" || formData.platform === "facebook") && (
              <div className="space-y-2">
                <Label htmlFor="serverUrl">Server URL</Label>
                <Input
                  id="serverUrl"
                  value={formData.serverUrl || ""}
                  onChange={(e) => handleChange("serverUrl", e.target.value)}
                  placeholder="rtmp://server.example.com/live"
                  required={formData.platform === "custom"}
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex space-x-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90">
              <Check className="h-4 w-4 mr-2" />
              {initialData ? "Update" : "Add"} Connection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
