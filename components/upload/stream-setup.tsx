"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Clock, ImageIcon, Tag, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { MediaFile, StreamSettings } from "@/types/upload"

interface StreamSetupProps {
  mediaFiles: MediaFile[]
}

export default function StreamSetup({ mediaFiles }: StreamSetupProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [streamSettings, setStreamSettings] = useState<StreamSettings>({
    title: "",
    description: "",
    isPrivate: false,
    tags: [],
    platforms: [
      { platform: "twitch", enabled: true },
      { platform: "youtube", enabled: false },
      { platform: "facebook", enabled: false },
      { platform: "tiktok", enabled: false },
      { platform: "instagram", enabled: false },
    ],
    chatSettings: {
      enabled: true,
      moderationLevel: "medium",
      subscribersOnly: false,
      slowMode: false,
    },
  })
  const [tagInput, setTagInput] = useState("")

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!streamSettings.tags.includes(tagInput.trim())) {
        setStreamSettings({
          ...streamSettings,
          tags: [...streamSettings.tags, tagInput.trim()],
        })
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setStreamSettings({
      ...streamSettings,
      tags: streamSettings.tags.filter((t) => t !== tag),
    })
  }

  const handleTogglePlatform = (platform: string, enabled: boolean) => {
    setStreamSettings({
      ...streamSettings,
      platforms: streamSettings.platforms.map((p) => (p.platform === platform ? { ...p, enabled } : p)),
    })
  }

  const handleToggleChatSetting = (key: keyof StreamSettings["chatSettings"], value: boolean) => {
    setStreamSettings({
      ...streamSettings,
      chatSettings: {
        ...streamSettings.chatSettings,
        [key]: value,
      },
    })
  }

  const handleChangeModerationLevel = (level: "low" | "medium" | "high") => {
    setStreamSettings({
      ...streamSettings,
      chatSettings: {
        ...streamSettings.chatSettings,
        moderationLevel: level,
      },
    })
  }

  const thumbnailImages = mediaFiles.filter((file) => file.type === "image")

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="chat">Chat Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stream Details</CardTitle>
              <CardDescription>Set up the basic information for your stream</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Stream Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a title for your stream"
                  value={streamSettings.title}
                  onChange={(e) => setStreamSettings({ ...streamSettings, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your stream..."
                  rows={4}
                  value={streamSettings.description || ""}
                  onChange={(e) => setStreamSettings({ ...streamSettings, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="tags"
                    placeholder="Add tags (press Enter)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (tagInput.trim() && !streamSettings.tags.includes(tagInput.trim())) {
                        setStreamSettings({
                          ...streamSettings,
                          tags: [...streamSettings.tags, tagInput.trim()],
                        })
                        setTagInput("")
                      }
                    }}
                  >
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                {streamSettings.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {streamSettings.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Schedule Stream</Label>
                <div className="flex flex-wrap gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[120px] justify-start text-left font-normal">
                        <Clock className="mr-2 h-4 w-4" />
                        Set time
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4">
                      <div className="grid gap-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label htmlFor="hours">Hours</Label>
                            <Input id="hours" type="number" min={0} max={23} placeholder="HH" />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="minutes">Minutes</Label>
                            <Input id="minutes" type="number" min={0} max={59} placeholder="MM" />
                          </div>
                        </div>
                        <Button className="mt-2">Set Time</Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Thumbnail</Label>
                <div className="grid grid-cols-3 gap-2">
                  {thumbnailImages.slice(0, 3).map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-orange-500"
                    >
                      <ImageIcon
                        src={image.url || "/placeholder.svg"}
                        alt={image.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ))}
                  <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-gray-500" />
                    <span className="text-xs text-gray-500 ml-1">Upload</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="private">Private Stream</Label>
                  <p className="text-sm text-muted-foreground">Only people with the link can watch</p>
                </div>
                <Switch
                  id="private"
                  checked={streamSettings.isPrivate}
                  onCheckedChange={(checked) => setStreamSettings({ ...streamSettings, isPrivate: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Streaming Platforms</CardTitle>
              <CardDescription>Select which platforms to stream to</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {streamSettings.platforms.map((platform) => (
                <div key={platform.platform} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor={`platform-${platform.platform}`} className="capitalize">
                      {platform.platform}
                    </Label>
                    <p className="text-sm text-muted-foreground">Stream to {platform.platform}</p>
                  </div>
                  <Switch
                    id={`platform-${platform.platform}`}
                    checked={platform.enabled}
                    onCheckedChange={(checked) => handleTogglePlatform(platform.platform, checked)}
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Connect More Platforms
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chat Settings</CardTitle>
              <CardDescription>Configure chat moderation and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="chat-enabled">Enable Chat</Label>
                  <p className="text-sm text-muted-foreground">Allow viewers to chat during the stream</p>
                </div>
                <Switch
                  id="chat-enabled"
                  checked={streamSettings.chatSettings.enabled}
                  onCheckedChange={(checked) => handleToggleChatSetting("enabled", checked)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Moderation Level</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={streamSettings.chatSettings.moderationLevel === "low" ? "default" : "outline"}
                    className={
                      streamSettings.chatSettings.moderationLevel === "low"
                        ? "bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
                        : ""
                    }
                    onClick={() => handleChangeModerationLevel("low")}
                  >
                    Low
                  </Button>
                  <Button
                    variant={streamSettings.chatSettings.moderationLevel === "medium" ? "default" : "outline"}
                    className={
                      streamSettings.chatSettings.moderationLevel === "medium"
                        ? "bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
                        : ""
                    }
                    onClick={() => handleChangeModerationLevel("medium")}
                  >
                    Medium
                  </Button>
                  <Button
                    variant={streamSettings.chatSettings.moderationLevel === "high" ? "default" : "outline"}
                    className={
                      streamSettings.chatSettings.moderationLevel === "high"
                        ? "bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
                        : ""
                    }
                    onClick={() => handleChangeModerationLevel("high")}
                  >
                    High
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {streamSettings.chatSettings.moderationLevel === "low"
                    ? "Basic filtering of offensive content"
                    : streamSettings.chatSettings.moderationLevel === "medium"
                      ? "Standard filtering with spam protection"
                      : "Strict filtering with approval required for new chatters"}
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="subscribers-only">Subscribers Only</Label>
                  <p className="text-sm text-muted-foreground">Only subscribers can chat</p>
                </div>
                <Switch
                  id="subscribers-only"
                  checked={streamSettings.chatSettings.subscribersOnly}
                  onCheckedChange={(checked) => handleToggleChatSetting("subscribersOnly", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="slow-mode">Slow Mode</Label>
                  <p className="text-sm text-muted-foreground">Limit how often users can send messages</p>
                </div>
                <Switch
                  id="slow-mode"
                  checked={streamSettings.chatSettings.slowMode}
                  onCheckedChange={(checked) => handleToggleChatSetting("slowMode", checked)}
                />
              </div>

              {streamSettings.chatSettings.slowMode && (
                <div className="space-y-2">
                  <Label htmlFor="slow-mode-interval">Slow Mode Interval (seconds)</Label>
                  <Input
                    id="slow-mode-interval"
                    type="number"
                    min={1}
                    max={120}
                    defaultValue={streamSettings.chatSettings.slowModeInterval || 5}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value)
                      if (!isNaN(value) && value > 0) {
                        setStreamSettings({
                          ...streamSettings,
                          chatSettings: {
                            ...streamSettings.chatSettings,
                            slowModeInterval: value,
                          },
                        })
                      }
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Save as Draft</Button>
        <Button className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90">
          {date ? "Schedule Stream" : "Go Live Now"}
        </Button>
      </div>
    </div>
  )
}
