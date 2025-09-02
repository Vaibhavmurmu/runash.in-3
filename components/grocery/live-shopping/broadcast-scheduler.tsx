"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, Clock, Plus, Settings, Play, Square, Trash2, Copy, Bell, Zap, BarChart3 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface BroadcastSchedulerProps {
  hostId: string
  hostName: string
}

interface ScheduledBroadcast {
  id: string
  title: string
  description?: string
  scheduledStartTime: Date
  duration: number
  status: "scheduled" | "preparing" | "live" | "ended" | "cancelled"
  platforms: string[]
  category: string
  tags: string[]
  isPublic: boolean
  isRecurring: boolean
  autoStartEnabled: boolean
  notificationsEnabled: boolean
  viewerCount?: number
  revenue?: number
}

export default function BroadcastScheduler({ hostId, hostName }: BroadcastSchedulerProps) {
  const [broadcasts, setBroadcasts] = useState<ScheduledBroadcast[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [loading, setLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledDate: new Date(),
    scheduledTime: "18:00",
    duration: 60,
    platforms: [] as string[],
    category: "Organic Products",
    tags: [] as string[],
    isPublic: true,
    isRecurring: false,
    autoStartEnabled: false,
    notificationsEnabled: true,
    notifyBefore: [15, 60],
    streamQuality: "1080p",
    enableChat: true,
    enableRecording: true,
    chatModeration: true,
  })

  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    loadBroadcasts()
  }, [hostId])

  const loadBroadcasts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/broadcasts?hostId=${hostId}&limit=20`)
      const data = await response.json()

      if (data.success) {
        setBroadcasts(data.broadcasts || [])
      }
    } catch (error) {
      console.error("Failed to load broadcasts:", error)
    } finally {
      setLoading(false)
    }
  }

  const createBroadcast = async () => {
    try {
      const scheduledStartTime = new Date(formData.scheduledDate)
      const [hours, minutes] = formData.scheduledTime.split(":").map(Number)
      scheduledStartTime.setHours(hours, minutes, 0, 0)

      const response = await fetch("/api/broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          hostId,
          hostName,
          scheduledStartTime: scheduledStartTime.toISOString(),
          duration: formData.duration,
          platforms: formData.platforms,
          category: formData.category,
          tags: formData.tags,
          isPublic: formData.isPublic,
          isRecurring: formData.isRecurring,
          notificationSettings: {
            enabled: formData.notificationsEnabled,
            notifyBefore: formData.notifyBefore,
            channels: ["push", "email"],
            audienceNotification: true,
          },
          autoStartSettings: {
            enabled: formData.autoStartEnabled,
            prepareMinutesBefore: 5,
            autoGoLive: formData.autoStartEnabled,
            autoEndAfterDuration: true,
            fallbackActions: {
              onHostAbsent: "delay",
              onTechnicalIssue: "retry",
            },
          },
          streamSettings: {
            quality: formData.streamQuality,
            bitrate: formData.streamQuality === "4K" ? 8000 : formData.streamQuality === "1080p" ? 4500 : 2500,
            fps: 30,
            enableChat: formData.enableChat,
            enableRecording: formData.enableRecording,
            enableTranscription: false,
            chatModeration: {
              enabled: formData.chatModeration,
              autoMod: formData.chatModeration,
              slowMode: false,
              followersOnly: false,
            },
          },
        }),
      })

      if (response.ok) {
        setIsCreateDialogOpen(false)
        resetForm()
        loadBroadcasts()
      }
    } catch (error) {
      console.error("Failed to create broadcast:", error)
    }
  }

  const startBroadcast = async (broadcastId: string) => {
    try {
      const response = await fetch(`/api/broadcasts/${broadcastId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      })

      if (response.ok) {
        loadBroadcasts()
      }
    } catch (error) {
      console.error("Failed to start broadcast:", error)
    }
  }

  const endBroadcast = async (broadcastId: string) => {
    try {
      const response = await fetch(`/api/broadcasts/${broadcastId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end" }),
      })

      if (response.ok) {
        loadBroadcasts()
      }
    } catch (error) {
      console.error("Failed to end broadcast:", error)
    }
  }

  const cancelBroadcast = async (broadcastId: string) => {
    try {
      const response = await fetch(`/api/broadcasts/${broadcastId}?reason=Cancelled by host`, {
        method: "DELETE",
      })

      if (response.ok) {
        loadBroadcasts()
      }
    } catch (error) {
      console.error("Failed to cancel broadcast:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      scheduledDate: new Date(),
      scheduledTime: "18:00",
      duration: 60,
      platforms: [],
      category: "Organic Products",
      tags: [],
      isPublic: true,
      isRecurring: false,
      autoStartEnabled: false,
      notificationsEnabled: true,
      notifyBefore: [15, 60],
      streamQuality: "1080p",
      enableChat: true,
      enableRecording: true,
      chatModeration: true,
    })
    setTagInput("")
  }

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput] }))
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  const togglePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500 text-white"
      case "scheduled":
        return "bg-blue-500 text-white"
      case "preparing":
        return "bg-yellow-500 text-white"
      case "ended":
        return "bg-gray-500 text-white"
      case "cancelled":
        return "bg-gray-400 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const upcomingBroadcasts = broadcasts.filter((b) => b.status === "scheduled" || b.status === "preparing")
  const liveBroadcasts = broadcasts.filter((b) => b.status === "live")
  const pastBroadcasts = broadcasts.filter((b) => b.status === "ended" || b.status === "cancelled")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Broadcast Scheduler</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Broadcast
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule New Broadcast</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Broadcast Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Weekly Organic Products Showcase"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Organic Products">Organic Products</SelectItem>
                      <SelectItem value="Cooking Demo">Cooking Demo</SelectItem>
                      <SelectItem value="Farm Tour">Farm Tour</SelectItem>
                      <SelectItem value="Q&A Session">Q&A Session</SelectItem>
                      <SelectItem value="Product Launch">Product Launch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what viewers can expect from this broadcast..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.scheduledDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.scheduledDate}
                        onSelect={(date) => date && setFormData((prev) => ({ ...prev, scheduledDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, scheduledTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    max="480"
                    value={formData.duration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Platforms</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["YouTube", "Facebook", "Instagram"].map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform}
                        checked={formData.platforms.includes(platform)}
                        onCheckedChange={() => togglePlatform(platform)}
                      />
                      <Label htmlFor={platform}>{platform}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex space-x-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag}>
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Broadcast Settings</h4>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="public">Public Broadcast</Label>
                    <Switch
                      id="public"
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublic: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recurring">Recurring</Label>
                    <Switch
                      id="recurring"
                      checked={formData.isRecurring}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isRecurring: checked }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quality">Stream Quality</Label>
                    <Select
                      value={formData.streamQuality}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, streamQuality: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="720p">720p HD</SelectItem>
                        <SelectItem value="1080p">1080p Full HD</SelectItem>
                        <SelectItem value="4K">4K Ultra HD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Automation</h4>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autostart">Auto Start</Label>
                    <Switch
                      id="autostart"
                      checked={formData.autoStartEnabled}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, autoStartEnabled: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Notifications</Label>
                    <Switch
                      id="notifications"
                      checked={formData.notificationsEnabled}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, notificationsEnabled: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chat">Enable Chat</Label>
                    <Switch
                      id="chat"
                      checked={formData.enableChat}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, enableChat: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recording">Record Stream</Label>
                    <Switch
                      id="recording"
                      checked={formData.enableRecording}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, enableRecording: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createBroadcast} className="bg-gradient-to-r from-green-600 to-emerald-600">
                  Schedule Broadcast
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="upcoming">Upcoming ({upcomingBroadcasts.length})</TabsTrigger>
          <TabsTrigger value="live">Live ({liveBroadcasts.length})</TabsTrigger>
          <TabsTrigger value="history">History ({pastBroadcasts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBroadcasts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarIcon className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No upcoming broadcasts</h3>
                <p className="text-gray-600 text-center mb-4">
                  Schedule your first broadcast to start engaging with your audience
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>Schedule Broadcast</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {upcomingBroadcasts.map((broadcast) => (
                <Card key={broadcast.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{broadcast.title}</h3>
                          <Badge className={getStatusColor(broadcast.status)}>{broadcast.status}</Badge>
                          {broadcast.autoStartEnabled && (
                            <Badge variant="outline">
                              <Zap className="h-3 w-3 mr-1" />
                              Auto
                            </Badge>
                          )}
                          {broadcast.notificationsEnabled && (
                            <Badge variant="outline">
                              <Bell className="h-3 w-3 mr-1" />
                              Notify
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{broadcast.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {format(broadcast.scheduledStartTime, "PPP")}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {format(broadcast.scheduledStartTime, "p")} ({broadcast.duration}min)
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {broadcast.platforms.map((platform) => (
                            <Badge key={platform} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                          {broadcast.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => startBroadcast(broadcast.id)}>
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => cancelBroadcast(broadcast.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="live" className="space-y-4">
          {liveBroadcasts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Play className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No live broadcasts</h3>
                <p className="text-gray-600 text-center">Start a scheduled broadcast to see it here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {liveBroadcasts.map((broadcast) => (
                <Card key={broadcast.id} className="border-red-200 bg-red-50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{broadcast.title}</h3>
                          <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{broadcast.viewerCount || 0}</div>
                            <div className="text-sm text-gray-600">Viewers</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">${broadcast.revenue || 0}</div>
                            <div className="text-sm text-gray-600">Revenue</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {Math.floor((Date.now() - broadcast.scheduledStartTime.getTime()) / 60000)}m
                            </div>
                            <div className="text-sm text-gray-600">Duration</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Analytics
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => endBroadcast(broadcast.id)}>
                          <Square className="h-4 w-4 mr-1" />
                          End Stream
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {pastBroadcasts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No broadcast history</h3>
                <p className="text-gray-600 text-center">Complete your first broadcast to see analytics here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pastBroadcasts.map((broadcast) => (
                <Card key={broadcast.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{broadcast.title}</h3>
                          <Badge className={getStatusColor(broadcast.status)}>{broadcast.status}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-4">
                          <div className="text-center">
                            <div className="text-xl font-bold">{broadcast.viewerCount || 0}</div>
                            <div className="text-sm text-gray-600">Peak Viewers</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold">{broadcast.duration}m</div>
                            <div className="text-sm text-gray-600">Duration</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold">${broadcast.revenue || 0}</div>
                            <div className="text-sm text-gray-600">Revenue</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold">{format(broadcast.scheduledStartTime, "MMM d")}</div>
                            <div className="text-sm text-gray-600">Date</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          View Analytics
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4 mr-1" />
                          Duplicate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
