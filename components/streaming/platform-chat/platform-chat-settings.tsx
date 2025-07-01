"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ChatSettings, StreamingPlatform } from "@/types/platform-chat"
import { getPlatformColor, getPlatformIcon, getPlatformName } from "./platform-utils"

interface PlatformChatSettingsProps {
  settings: ChatSettings
  onSettingsChange: (settings: ChatSettings) => void
  onClose: () => void
}

export default function PlatformChatSettings({ settings, onSettingsChange, onClose }: PlatformChatSettingsProps) {
  const [localSettings, setLocalSettings] = useState<ChatSettings>({ ...settings })

  const handleSave = () => {
    onSettingsChange(localSettings)
    onClose()
  }

  const updateSettings = (partialSettings: Partial<ChatSettings>) => {
    setLocalSettings((prev) => ({
      ...prev,
      ...partialSettings,
    }))
  }

  const updatePlatformSettings = (
    platform: StreamingPlatform,
    settings: Partial<ChatSettings["platformSettings"][StreamingPlatform]>,
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      platformSettings: {
        ...prev.platformSettings,
        [platform]: {
          ...prev.platformSettings[platform],
          ...settings,
        },
      },
    }))
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chat Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-timestamps">Show Timestamps</Label>
                  <Switch
                    id="show-timestamps"
                    checked={localSettings.showTimestamps}
                    onCheckedChange={(checked) => updateSettings({ showTimestamps: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-badges">Show Badges</Label>
                  <Switch
                    id="show-badges"
                    checked={localSettings.showBadges}
                    onCheckedChange={(checked) => updateSettings({ showBadges: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-avatars">Show Avatars</Label>
                  <Switch
                    id="show-avatars"
                    checked={localSettings.showAvatars}
                    onCheckedChange={(checked) => updateSettings({ showAvatars: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="highlight-mentions">Highlight Mentions</Label>
                  <Switch
                    id="highlight-mentions"
                    checked={localSettings.highlightMentions}
                    onCheckedChange={(checked) => updateSettings({ highlightMentions: checked })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Font Size</Label>
                  <RadioGroup
                    value={localSettings.fontSize}
                    onValueChange={(value) => updateSettings({ fontSize: value as "small" | "medium" | "large" })}
                    className="flex space-x-2 mt-2"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="small" id="font-small" />
                      <Label htmlFor="font-small" className="text-xs">
                        Small
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="medium" id="font-medium" />
                      <Label htmlFor="font-medium" className="text-sm">
                        Medium
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="large" id="font-large" />
                      <Label htmlFor="font-large" className="text-base">
                        Large
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="chat-delay">Chat Delay (seconds)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="chat-delay"
                      min={0}
                      max={30}
                      step={1}
                      value={[localSettings.chatDelay]}
                      onValueChange={([value]) => updateSettings({ chatDelay: value })}
                      className="flex-1"
                    />
                    <span className="w-8 text-center">{localSettings.chatDelay}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional Settings</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-deleted-messages">Show Deleted Messages</Label>
                  <Switch
                    id="show-deleted-messages"
                    checked={localSettings.showDeletedMessages}
                    onCheckedChange={(checked) => updateSettings({ showDeletedMessages: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-chat-commands">Enable Chat Commands</Label>
                  <Switch
                    id="enable-chat-commands"
                    checked={localSettings.enableChatCommands}
                    onCheckedChange={(checked) => updateSettings({ enableChatCommands: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-emotes">Enable Emotes</Label>
                  <Switch
                    id="enable-emotes"
                    checked={localSettings.enableEmotes}
                    onCheckedChange={(checked) => updateSettings({ enableEmotes: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-auto-mod">Enable Auto Moderation</Label>
                  <Switch
                    id="enable-auto-mod"
                    checked={localSettings.enableAutoMod}
                    onCheckedChange={(checked) => updateSettings({ enableAutoMod: checked })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-4 mt-4">
            {(Object.keys(localSettings.platformSettings) as StreamingPlatform[]).map((platform) => {
              const platformSetting = localSettings.platformSettings[platform] || {
                enabled: true,
                color: getPlatformColor(platform),
                showPlatformIcon: true,
              }
              const PlatformIcon = getPlatformIcon(platform)

              return (
                <div key={platform} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <PlatformIcon className="h-5 w-5 mr-2" />
                      <h3 className="font-medium">{getPlatformName(platform)}</h3>
                    </div>
                    <Switch
                      checked={platformSetting.enabled}
                      onCheckedChange={(checked) => updatePlatformSettings(platform, { enabled: checked })}
                    />
                  </div>

                  {platformSetting.enabled && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <Label htmlFor={`${platform}-color`}>Platform Color</Label>
                        <div className="flex mt-1">
                          <Input
                            id={`${platform}-color`}
                            type="color"
                            value={platformSetting.color}
                            onChange={(e) => updatePlatformSettings(platform, { color: e.target.value })}
                            className="w-10 h-10 p-1 mr-2"
                          />
                          <Input
                            value={platformSetting.color}
                            onChange={(e) => updatePlatformSettings(platform, { color: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor={`${platform}-icon`}>Show Platform Icon</Label>
                        <Switch
                          id={`${platform}-icon`}
                          checked={platformSetting.showPlatformIcon}
                          onCheckedChange={(checked) => updatePlatformSettings(platform, { showPlatformIcon: checked })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Chat Commands</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Configure custom chat commands that can be used across all platforms.
              </p>
              <Button variant="outline" size="sm">
                Manage Commands
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Auto Moderation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Configure auto moderation settings to filter inappropriate content.
              </p>
              <Button variant="outline" size="sm">
                Configure Auto Mod
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Chat Export</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Export chat logs for analysis or record keeping.
              </p>
              <Button variant="outline" size="sm">
                Export Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
