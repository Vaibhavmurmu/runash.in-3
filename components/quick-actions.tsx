"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Upload, Settings, Users, BarChart3, Calendar, Zap, Mic, Camera, Bell } from "lucide-react"
import { GoLiveDialog } from "./go-live-dialog"

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  variant?: "default" | "secondary" | "outline"
  badge?: string
  color?: string
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      id: "schedule-stream",
      title: "Schedule Stream",
      description: "Plan your next broadcast",
      icon: Calendar,
      action: () => console.log("Scheduling stream..."),
      variant: "outline",
    },
    {
      id: "upload-content",
      title: "Upload Content",
      description: "Add videos, images, or files",
      icon: Upload,
      action: () => console.log("Opening upload..."),
      variant: "outline",
    },
    {
      id: "view-analytics",
      title: "View Analytics",
      description: "Check your performance",
      icon: BarChart3,
      action: () => console.log("Opening analytics..."),
      variant: "outline",
    },
    {
      id: "manage-community",
      title: "Community",
      description: "Manage followers and chat",
      icon: Users,
      action: () => console.log("Opening community..."),
      variant: "outline",
      badge: "3 new",
    },
    {
      id: "ai-tools",
      title: "AI Tools",
      description: "Generate content with AI",
      icon: Zap,
      action: () => console.log("Opening AI tools..."),
      variant: "outline",
      badge: "New",
      color: "border-orange-200 hover:bg-orange-50",
    },
  ]

  const streamingTools = [
    {
      id: "test-camera",
      title: "Test Camera",
      icon: Camera,
      action: () => console.log("Testing camera..."),
    },
    {
      id: "test-microphone",
      title: "Test Microphone",
      icon: Mic,
      action: () => console.log("Testing microphone..."),
    },
    {
      id: "stream-settings",
      title: "Stream Settings",
      icon: Settings,
      action: () => console.log("Opening stream settings..."),
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      action: () => console.log("Opening notifications..."),
    },
  ]

  return (
    <div className="space-y-4">
      {/* Main Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <GoLiveDialog>
              <Button
                variant="default"
                className="h-auto p-4 flex flex-col items-start space-y-2 relative bg-red-500 hover:bg-red-600"
              >
                <Badge
                  variant="secondary"
                  className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 bg-orange-500 text-white border-0"
                >
                  Popular
                </Badge>
                <div className="flex items-center space-x-2 w-full">
                  <Play className="h-5 w-5" />
                  <span className="font-medium">Go Live</span>
                </div>
                <span className="text-xs text-muted-foreground text-left">Start streaming instantly</span>
              </Button>
            </GoLiveDialog>
            {actions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant}
                onClick={action.action}
                className={`h-auto p-4 flex flex-col items-start space-y-2 relative ${action.color || ""}`}
              >
                {action.badge && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 bg-orange-500 text-white border-0"
                  >
                    {action.badge}
                  </Badge>
                )}
                <div className="flex items-center space-x-2 w-full">
                  <action.icon className="h-5 w-5" />
                  <span className="font-medium">{action.title}</span>
                </div>
                <span className="text-xs text-muted-foreground text-left">{action.description}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Streaming Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Streaming Tools</CardTitle>
          <CardDescription>Test and configure your streaming setup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {streamingTools.map((tool) => (
              <Button
                key={tool.id}
                variant="outline"
                onClick={tool.action}
                className="h-auto p-3 flex flex-col items-center space-y-2 bg-transparent"
              >
                <tool.icon className="h-5 w-5" />
                <span className="text-xs font-medium text-center">{tool.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
