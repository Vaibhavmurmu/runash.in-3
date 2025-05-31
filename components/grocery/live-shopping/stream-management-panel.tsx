"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Video,
  Calendar,
  Users,
  DollarSign,
  Edit,
  Trash2,
  Copy,
  Share2,
  Play,
  Pause,
  Square,
  Settings,
  Plus,
  Eye,
  Download,
  Bell,
  Star,
} from "lucide-react"

interface StreamManagementPanelProps {
  hostId: string
}

export function StreamManagementPanel({ hostId }: StreamManagementPanelProps) {
  const [activeTab, setActiveTab] = useState("live")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Mock stream data
  const streams = {
    live: [
      {
        id: "1",
        title: "Organic Produce Showcase",
        status: "live",
        viewers: 156,
        duration: "2h 15m",
        revenue: 420,
        startTime: "2:00 PM",
        category: "Organic Produce",
        isRecording: true,
      },
    ],
    scheduled: [
      {
        id: "2",
        title: "Weekend Meal Prep",
        scheduledTime: "Tomorrow 2:00 PM",
        expectedViewers: 200,
        featuredProducts: 8,
        category: "Meal Planning",
        notifications: 45,
      },
      {
        id: "3",
        title: "Seasonal Vegetables Guide",
        scheduledTime: "Sunday 10:00 AM",
        expectedViewers: 150,
        featuredProducts: 12,
        category: "Seasonal",
        notifications: 32,
      },
    ],
    past: [
      {
        id: "4",
        title: "Healthy Cooking Tips",
        date: "Yesterday",
        viewers: 203,
        revenue: 680,
        duration: "1h 45m",
        rating: 4.8,
        recordingUrl: "/recordings/4",
      },
      {
        id: "5",
        title: "Farm Fresh Friday",
        date: "2 days ago",
        viewers: 189,
        revenue: 520,
        duration: "2h 30m",
        rating: 4.6,
        recordingUrl: "/recordings/5",
      },
    ],
  }

  const streamTemplates = [
    {
      id: "1",
      name: "Product Showcase",
      description: "Feature new or popular products",
      duration: 60,
      category: "Product Demo",
    },
    {
      id: "2",
      name: "Cooking Demo",
      description: "Live cooking demonstration",
      duration: 90,
      category: "Cooking",
    },
    {
      id: "3",
      name: "Q&A Session",
      description: "Answer viewer questions",
      duration: 45,
      category: "Interactive",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Stream Management</h2>
          <p className="text-muted-foreground">Manage your live streams, schedule new ones, and view past broadcasts</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Stream
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Stream</DialogTitle>
              <DialogDescription>Create a new scheduled stream or go live immediately</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stream-title">Stream Title</Label>
                <Input id="stream-title" placeholder="Enter stream title..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stream-description">Description</Label>
                <Textarea id="stream-description" placeholder="Describe your stream..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stream-date">Date</Label>
                  <Input id="stream-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stream-time">Time</Label>
                  <Input id="stream-time" type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stream-category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="organic">Organic Produce</SelectItem>
                    <SelectItem value="cooking">Cooking Demo</SelectItem>
                    <SelectItem value="nutrition">Nutrition Tips</SelectItem>
                    <SelectItem value="seasonal">Seasonal Products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-record">Auto-record stream</Label>
                <Switch id="auto-record" defaultChecked />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500">
                  Schedule Stream
                </Button>
                <Button variant="outline" className="flex-1">
                  Go Live Now
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stream Templates */}
      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Templates
          </CardTitle>
          <CardDescription>Use pre-configured templates to quickly set up streams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {streamTemplates.map((template) => (
              <div key={template.id} className="p-4 rounded-lg border bg-muted/50 hover:bg-muted/70 transition-colors">
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {template.duration} min
                  </Badge>
                  <Button size="sm" variant="outline">
                    Use Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stream Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live">Live Streams ({streams.live.length})</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled ({streams.scheduled.length})</TabsTrigger>
          <TabsTrigger value="past">Past Streams ({streams.past.length})</TabsTrigger>
        </TabsList>

        {/* Live Streams */}
        <TabsContent value="live" className="space-y-4">
          {streams.live.length === 0 ? (
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardContent className="p-8 text-center">
                <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No live streams</h3>
                <p className="text-muted-foreground mb-4">You don't have any active live streams right now</p>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500">
                  <Play className="h-4 w-4 mr-2" />
                  Go Live Now
                </Button>
              </CardContent>
            </Card>
          ) : (
            streams.live.map((stream) => (
              <Card key={stream.id} className="border-border/40 bg-card/50 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-amber-400/20 rounded-lg flex items-center justify-center">
                          <Video className="h-8 w-8 text-orange-500" />
                        </div>
                        <Badge className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white text-xs">
                          <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                          LIVE
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{stream.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Started at {stream.startTime} • {stream.duration} • {stream.category}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="h-4 w-4" />
                            {stream.viewers} viewers
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <DollarSign className="h-4 w-4" />${stream.revenue} revenue
                          </div>
                          {stream.isRecording && (
                            <Badge variant="outline" className="text-xs">
                              Recording
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Square className="h-4 w-4 mr-1" />
                        End
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Scheduled Streams */}
        <TabsContent value="scheduled" className="space-y-4">
          {streams.scheduled.map((stream) => (
            <Card key={stream.id} className="border-border/40 bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-400/20 rounded-lg flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{stream.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {stream.scheduledTime} • {stream.category}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4" />~{stream.expectedViewers} expected
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Video className="h-4 w-4" />
                          {stream.featuredProducts} products
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Bell className="h-4 w-4" />
                          {stream.notifications} notifications
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-1" />
                      Duplicate
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Past Streams */}
        <TabsContent value="past" className="space-y-4">
          {streams.past.map((stream) => (
            <Card key={stream.id} className="border-border/40 bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-gray-400/20 rounded-lg flex items-center justify-center">
                      <Video className="h-8 w-8 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{stream.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {stream.date} • {stream.duration}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4" />
                          {stream.viewers} viewers
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="h-4 w-4" />${stream.revenue} revenue
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4" />
                          {stream.rating} rating
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Recording
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
