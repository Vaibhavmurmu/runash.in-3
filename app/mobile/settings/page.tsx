"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sun, Wifi, Battery, Lock, Camera, Mic, Monitor, HelpCircle, LogOut } from "lucide-react"
import MobileLayout from "@/components/mobile/layout"
import type { MobileSettings, NotificationSettings } from "@/types/mobile-app"

export default function MobileSettingsPage() {
  const [settings, setSettings] = useState<MobileSettings>({
    darkMode: "system",
    notifications: {
      streamStart: true,
      highViewerCount: true,
      chatMentions: true,
      newFollowers: false,
      scheduledStreams: true,
    },
    dataUsage: "medium",
    chatDelay: 0,
    biometricAuth: false,
  })

  const [activeTab, setActiveTab] = useState("general")

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))
  }

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h2 className="text-lg font-bold">Settings</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4 space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Sun className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">Appearance</p>
                      <p className="text-sm text-gray-500">Choose your preferred theme</p>
                    </div>
                  </div>
                  <Select
                    value={settings.darkMode}
                    onValueChange={(value) => setSettings((prev) => ({ ...prev, darkMode: value as any }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Wifi className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">Data Usage</p>
                      <p className="text-sm text-gray-500">Adjust streaming quality</p>
                    </div>
                  </div>
                  <Select
                    value={settings.dataUsage}
                    onValueChange={(value) => setSettings((prev) => ({ ...prev, dataUsage: value as any }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Data Usage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Battery className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">Battery Saver</p>
                      <p className="text-sm text-gray-500">Reduce quality to save battery</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.dataUsage === "low"}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({ ...prev, dataUsage: checked ? "low" : "medium" }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">Biometric Authentication</p>
                      <p className="text-sm text-gray-500">Secure app access</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.biometricAuth}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, biometricAuth: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Button variant="destructive" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4 space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Stream Start</p>
                    <p className="text-sm text-gray-500">When your stream goes live</p>
                  </div>
                  <Switch
                    checked={settings.notifications.streamStart}
                    onCheckedChange={(checked) => handleNotificationChange("streamStart", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">High Viewer Count</p>
                    <p className="text-sm text-gray-500">When your stream reaches a milestone</p>
                  </div>
                  <Switch
                    checked={settings.notifications.highViewerCount}
                    onCheckedChange={(checked) => handleNotificationChange("highViewerCount", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Chat Mentions</p>
                    <p className="text-sm text-gray-500">When someone mentions you in chat</p>
                  </div>
                  <Switch
                    checked={settings.notifications.chatMentions}
                    onCheckedChange={(checked) => handleNotificationChange("chatMentions", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Followers</p>
                    <p className="text-sm text-gray-500">When someone follows your channel</p>
                  </div>
                  <Switch
                    checked={settings.notifications.newFollowers}
                    onCheckedChange={(checked) => handleNotificationChange("newFollowers", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Scheduled Streams</p>
                    <p className="text-sm text-gray-500">Reminders for your scheduled streams</p>
                  </div>
                  <Switch
                    checked={settings.notifications.scheduledStreams}
                    onCheckedChange={(checked) => handleNotificationChange("scheduledStreams", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="mt-4 space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Monitor className="h-5 w-5 mr-2 text-gray-500" />
                      <p className="font-medium">Remote Camera Mode</p>
                    </div>
                    <Switch />
                  </div>
                  <p className="text-sm text-gray-500 pl-7">Use this device as a camera source for your stream</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Camera className="h-5 w-5 mr-2 text-gray-500" />
                      <p className="font-medium">Camera Access</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <p className="text-sm text-gray-500 pl-7">Allow the app to access your camera</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mic className="h-5 w-5 mr-2 text-gray-500" />
                      <p className="font-medium">Microphone Access</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <p className="text-sm text-gray-500 pl-7">Allow the app to access your microphone</p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Chat Delay (seconds)</p>
                  <Slider
                    value={[settings.chatDelay]}
                    onValueChange={(values) => setSettings((prev) => ({ ...prev, chatDelay: values[0] }))}
                    max={10}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>No delay</span>
                    <span>{settings.chatDelay} sec</span>
                    <span>10 sec</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">About RunAsh Mobile</p>
                      <p className="text-sm text-gray-500">Version 1.0.0</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Check for Updates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  )
}
