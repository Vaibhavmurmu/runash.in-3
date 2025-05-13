"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import type { AlertTemplate, AlertType, AlertAnimation, AlertPosition } from "@/types/alerts"

interface AlertEditorProps {
  template: AlertTemplate | null
  onSave: (template: AlertTemplate) => void
  onCancel: () => void
}

export default function AlertEditor({ template, onSave, onCancel }: AlertEditorProps) {
  const [editedTemplate, setEditedTemplate] = useState<AlertTemplate>({
    id: "",
    name: "",
    type: "custom",
    message: "",
    animation: "fade",
    duration: 5,
    position: "middle-center",
    enabled: true,
  })

  useEffect(() => {
    if (template) {
      setEditedTemplate(template)
    }
  }, [template])

  const handleChange = (field: keyof AlertTemplate, newValue: any) => {
    setEditedTemplate({
      ...editedTemplate,
      [field]: newValue,
    })
  }

  const alertTypes: { value: AlertType; label: string }[] = [
    { value: "follow", label: "Follow" },
    { value: "subscription", label: "Subscription" },
    { value: "donation", label: "Donation" },
    { value: "cheer", label: "Cheer/Bits" },
    { value: "host", label: "Host" },
    { value: "raid", label: "Raid" },
    { value: "milestone", label: "Milestone" },
    { value: "custom", label: "Custom" },
  ]

  const alertAnimations: { value: AlertAnimation; label: string }[] = [
    { value: "fade", label: "Fade" },
    { value: "slide-in", label: "Slide In" },
    { value: "bounce", label: "Bounce" },
    { value: "pulse", label: "Pulse" },
    { value: "shake", label: "Shake" },
    { value: "flip", label: "Flip" },
    { value: "zoom", label: "Zoom" },
    { value: "custom", label: "Custom" },
  ]

  const alertPositions: { value: AlertPosition; label: string }[] = [
    { value: "top-left", label: "Top Left" },
    { value: "top-center", label: "Top Center" },
    { value: "top-right", label: "Top Right" },
    { value: "middle-left", label: "Middle Left" },
    { value: "middle-center", label: "Middle Center" },
    { value: "middle-right", label: "Middle Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-center", label: "Bottom Center" },
    { value: "bottom-right", label: "Bottom Right" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editedTemplate)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{template?.id ? "Edit Alert" : "Create Alert"}</CardTitle>
        <CardDescription>Customize how your alert will appear during streams</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Alert Name</Label>
            <Input
              id="name"
              value={editedTemplate.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter alert name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Alert Type</Label>
            <Select value={editedTemplate.type} onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select alert type" />
              </SelectTrigger>
              <SelectContent>
                {alertTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Alert Message</Label>
            <Textarea
              id="message"
              value={editedTemplate.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Enter alert message"
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              Use variables like {"{{username}}"}, {"{{amount}}"}, {"{{message}}"} in your message
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={editedTemplate.imageUrl || ""}
                onChange={(e) => handleChange("imageUrl", e.target.value)}
                placeholder="https://example.com/image.gif"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="soundUrl">Sound URL</Label>
              <Input
                id="soundUrl"
                value={editedTemplate.soundUrl || ""}
                onChange={(e) => handleChange("soundUrl", e.target.value)}
                placeholder="https://example.com/sound.mp3"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="animation">Animation</Label>
            <Select value={editedTemplate.animation} onValueChange={(value) => handleChange("animation", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select animation" />
              </SelectTrigger>
              <SelectContent>
                {alertAnimations.map((animation) => (
                  <SelectItem key={animation.value} value={animation.value}>
                    {animation.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Select value={editedTemplate.position} onValueChange={(value) => handleChange("position", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {alertPositions.map((position) => (
                  <SelectItem key={position.value} value={position.value}>
                    {position.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <span className="text-sm text-muted-foreground">{editedTemplate.duration}s</span>
            </div>
            <Slider
              id="duration"
              value={[editedTemplate.duration]}
              min={1}
              max={30}
              step={1}
              onValueChange={(value) => handleChange("duration", value[0])}
            />
          </div>

          {(editedTemplate.type === "donation" || editedTemplate.type === "cheer") && (
            <div className="space-y-2">
              <Label htmlFor="minAmount">Minimum Amount</Label>
              <Input
                id="minAmount"
                type="number"
                value={editedTemplate.minAmount || 1}
                onChange={(e) => handleChange("minAmount", Number.parseFloat(e.target.value))}
                min={0}
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={editedTemplate.enabled}
              onCheckedChange={(checked) => handleChange("enabled", checked)}
            />
            <Label htmlFor="enabled">Enabled</Label>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-white"
        >
          Save Alert
        </Button>
      </CardFooter>
    </Card>
  )
}
