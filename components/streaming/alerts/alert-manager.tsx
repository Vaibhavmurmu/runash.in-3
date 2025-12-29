"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Bell, Settings, History, Plus, Volume2, Sparkles } from "lucide-react"
import AlertTemplateList from "./alert-template-list"
import AlertEditor from "./alert-editor"
import AlertHistory from "./alert-history"
import AlertSettings from "./alert-settings"
import AlertPreview from "./alert-preview"
import AlertSuggestions from "./alert-suggestions"
import type { AlertTemplate, AlertSettings as AlertSettingsType } from "@/types/alerts"

// Mock data for initial templates
const initialTemplates: AlertTemplate[] = [
  {
    id: "1",
    name: "New Follower",
    type: "follow",
    message: "Thanks for following, {{username}}!",
    imageUrl: "/alerts/follow.gif",
    soundUrl: "/alerts/follow.mp3",
    animation: "slide-in",
    duration: 5,
    position: "top-right",
    enabled: true,
  },
  {
    id: "2",
    name: "New Subscription",
    type: "subscription",
    message: "{{username}} just subscribed! Thank you for your support!",
    imageUrl: "/alerts/subscription.gif",
    soundUrl: "/alerts/subscription.mp3",
    animation: "bounce",
    duration: 8,
    position: "middle-center",
    enabled: true,
  },
  {
    id: "3",
    name: "Donation",
    type: "donation",
    message: "{{username}} donated ${{amount}}! {{message}}",
    imageUrl: "/alerts/donation.gif",
    soundUrl: "/alerts/donation.mp3",
    animation: "pulse",
    duration: 10,
    position: "bottom-center",
    enabled: true,
    minAmount: 1,
  },
]

const initialSettings: AlertSettingsType = {
  globalVolume: 75,
  queueAlerts: true,
  alertDelay: 2,
  alertsEnabled: true,
  testMode: false,
}

export default function AlertManager() {
  const [templates, setTemplates] = useState<AlertTemplate[]>(initialTemplates)
  const [settings, setSettings] = useState<AlertSettingsType>(initialSettings)
  const [activeTab, setActiveTab] = useState("templates")
  const [selectedTemplate, setSelectedTemplate] = useState<AlertTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleSaveTemplate = (template: AlertTemplate) => {
    if (template.id) {
      // Update existing template
      setTemplates(templates.map((t) => (t.id === template.id ? template : t)))
    } else {
      // Add new template
      const newTemplate = {
        ...template,
        id: Date.now().toString(),
      }
      setTemplates([...templates, newTemplate])
    }
    setSelectedTemplate(null)
    setIsEditing(false)
  }

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id))
    if (selectedTemplate?.id === id) {
      setSelectedTemplate(null)
      setIsEditing(false)
    }
  }

  const handleEditTemplate = (template: AlertTemplate) => {
    setSelectedTemplate(template)
    setIsEditing(true)
  }

  const handleCreateTemplate = () => {
    const newTemplate: AlertTemplate = {
      id: "",
      name: "New Alert",
      type: "custom",
      message: "This is a custom alert!",
      animation: "fade",
      duration: 5,
      position: "middle-center",
      enabled: true,
    }
    setSelectedTemplate(newTemplate)
    setIsEditing(true)
  }

  const handleSaveSettings = (newSettings: AlertSettingsType) => {
    setSettings(newSettings)
  }

  const handleTestAlert = (template: AlertTemplate) => {
    // In a real implementation, this would trigger the alert to display
    console.log("Testing alert:", template)
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Stream Alerts</h2>
          <p className="text-muted-foreground">Create and manage alerts for your stream</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="alerts-enabled">Alerts Enabled</Label>
            <Switch
              id="alerts-enabled"
              checked={settings.alertsEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, alertsEnabled: checked })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4" />
            <Slider
              className="w-24"
              value={[settings.globalVolume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setSettings({ ...settings, globalVolume: value[0] })}
            />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="templates">
            <Bell className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Suggestions
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="templates" className="space-y-6">
            {isEditing ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AlertEditor
                  template={selectedTemplate}
                  onSave={handleSaveTemplate}
                  onCancel={() => {
                    setSelectedTemplate(null)
                    setIsEditing(false)
                  }}
                />
                <div className="flex flex-col space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preview</CardTitle>
                      <CardDescription>See how your alert will look</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AlertPreview template={selectedTemplate} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <div className="flex justify-end">
                  <Button onClick={handleCreateTemplate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
                </div>
                <AlertTemplateList
                  templates={templates}
                  onEdit={handleEditTemplate}
                  onDelete={handleDeleteTemplate}
                  onTest={handleTestAlert}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai">
            <AlertSuggestions templates={templates} onUpdateTemplate={handleSaveTemplate} />
          </TabsContent>

          <TabsContent value="settings">
            <AlertSettings settings={settings} onSave={handleSaveSettings} />
          </TabsContent>

          <TabsContent value="history">
            <AlertHistory />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
