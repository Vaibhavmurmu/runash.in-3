"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, Users, Shield, Camera, ScreenShare, MessageSquare, Bell, Save, RotateCcw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function MultiHostSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    maxHosts: 4,
    autoAcceptInvitations: false,
    allowGuestControls: true,
    recordIndividualTracks: true,
    enableHostChat: true,

    // Permission Defaults
    defaultHostRole: "co-host",
    defaultPermissions: {
      canShareScreen: true,
      canManageChat: false,
      canInviteOthers: false,
      canUseAnnotations: true,
      canTriggerAlerts: false,
      canControlLayout: false,
      canMuteOthers: false,
    },

    // Audio/Video Settings
    audioQuality: "high",
    videoQuality: "1080p",
    enableNoiseSuppression: true,
    enableEchoCancellation: true,
    autoMuteNewHosts: false,

    // Layout Settings
    defaultLayout: "grid",
    allowLayoutChanges: true,
    showHostNames: true,
    showHostRoles: true,

    // Notification Settings
    notifyOnHostJoin: true,
    notifyOnHostLeave: true,
    notifyOnPermissionChange: false,
    emailNotifications: true,

    // Security Settings
    requireApproval: true,
    allowAnonymousGuests: false,
    sessionTimeout: 240, // minutes
    invitationExpiry: 24, // hours
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handlePermissionChange = (permission: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      defaultPermissions: {
        ...prev.defaultPermissions,
        [permission]: value,
      },
    }))
  }

  const handleSaveSettings = () => {
    // In a real app, this would save to an API
    toast({
      title: "Settings Saved",
      description: "Your multi-host settings have been updated.",
    })
  }

  const handleResetSettings = () => {
    // Reset to default values
    toast({
      title: "Settings Reset",
      description: "Settings have been reset to default values.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Multi-Host Settings</h2>
          <p className="text-muted-foreground">Configure collaboration preferences and permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxHosts">Maximum Hosts per Session</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="maxHosts"
                  min={2}
                  max={10}
                  step={1}
                  value={[settings.maxHosts]}
                  onValueChange={(value) => handleSettingChange("maxHosts", value[0])}
                  className="flex-1"
                />
                <Badge variant="outline">{settings.maxHosts} hosts</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoAccept">Auto-accept invitations</Label>
                  <p className="text-sm text-muted-foreground">Automatically accept host invitations</p>
                </div>
                <Switch
                  id="autoAccept"
                  checked={settings.autoAcceptInvitations}
                  onCheckedChange={(checked) => handleSettingChange("autoAcceptInvitations", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="guestControls">Allow guest controls</Label>
                  <p className="text-sm text-muted-foreground">Let guests control their own audio/video</p>
                </div>
                <Switch
                  id="guestControls"
                  checked={settings.allowGuestControls}
                  onCheckedChange={(checked) => handleSettingChange("allowGuestControls", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="recordTracks">Record individual tracks</Label>
                  <p className="text-sm text-muted-foreground">Save separate audio tracks for each host</p>
                </div>
                <Switch
                  id="recordTracks"
                  checked={settings.recordIndividualTracks}
                  onCheckedChange={(checked) => handleSettingChange("recordIndividualTracks", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hostChat">Enable host chat</Label>
                  <p className="text-sm text-muted-foreground">Private chat between hosts during stream</p>
                </div>
                <Switch
                  id="hostChat"
                  checked={settings.enableHostChat}
                  onCheckedChange={(checked) => handleSettingChange("enableHostChat", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Default Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Default Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultRole">Default Host Role</Label>
              <Select
                value={settings.defaultHostRole}
                onValueChange={(value) => handleSettingChange("defaultHostRole", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="co-host">Co-Host</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Default Permissions for New Hosts</Label>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ScreenShare className="h-4 w-4" />
                    <span className="text-sm">Can share screen</span>
                  </div>
                  <Switch
                    checked={settings.defaultPermissions.canShareScreen}
                    onCheckedChange={(checked) => handlePermissionChange("canShareScreen", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm">Can manage chat</span>
                  </div>
                  <Switch
                    checked={settings.defaultPermissions.canManageChat}
                    onCheckedChange={(checked) => handlePermissionChange("canManageChat", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Can invite others</span>
                  </div>
                  <Switch
                    checked={settings.defaultPermissions.canInviteOthers}
                    onCheckedChange={(checked) => handlePermissionChange("canInviteOthers", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Can use annotations</span>
                  </div>
                  <Switch
                    checked={settings.defaultPermissions.canUseAnnotations}
                    onCheckedChange={(checked) => handlePermissionChange("canUseAnnotations", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm">Can trigger alerts</span>
                  </div>
                  <Switch
                    checked={settings.defaultPermissions.canTriggerAlerts}
                    onCheckedChange={(checked) => handlePermissionChange("canTriggerAlerts", checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audio/Video Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Audio/Video Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="audioQuality">Audio Quality</Label>
                <Select
                  value={settings.audioQuality}
                  onValueChange={(value) => handleSettingChange("audioQuality", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (64 kbps)</SelectItem>
                    <SelectItem value="medium">Medium (128 kbps)</SelectItem>
                    <SelectItem value="high">High (256 kbps)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoQuality">Video Quality</Label>
                <Select
                  value={settings.videoQuality}
                  onValueChange={(value) => handleSettingChange("videoQuality", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="480p">480p</SelectItem>
                    <SelectItem value="720p">720p</SelectItem>
                    <SelectItem value="1080p">1080p</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="noiseSuppression">Noise suppression</Label>
                  <p className="text-sm text-muted-foreground">Reduce background noise</p>
                </div>
                <Switch
                  id="noiseSuppression"
                  checked={settings.enableNoiseSuppression}
                  onCheckedChange={(checked) => handleSettingChange("enableNoiseSuppression", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="echoCancellation">Echo cancellation</Label>
                  <p className="text-sm text-muted-foreground">Prevent audio feedback</p>
                </div>
                <Switch
                  id="echoCancellation"
                  checked={settings.enableEchoCancellation}
                  onCheckedChange={(checked) => handleSettingChange("enableEchoCancellation", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoMute">Auto-mute new hosts</Label>
                  <p className="text-sm text-muted-foreground">Mute hosts when they join</p>
                </div>
                <Switch
                  id="autoMute"
                  checked={settings.autoMuteNewHosts}
                  onCheckedChange={(checked) => handleSettingChange("autoMuteNewHosts", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireApproval">Require approval</Label>
                  <p className="text-sm text-muted-foreground">Manually approve host invitations</p>
                </div>
                <Switch
                  id="requireApproval"
                  checked={settings.requireApproval}
                  onCheckedChange={(checked) => handleSettingChange("requireApproval", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymousGuests">Allow anonymous guests</Label>
                  <p className="text-sm text-muted-foreground">Let users join without registration</p>
                </div>
                <Switch
                  id="anonymousGuests"
                  checked={settings.allowAnonymousGuests}
                  onCheckedChange={(checked) => handleSettingChange("allowAnonymousGuests", checked)}
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange("sessionTimeout", Number.parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invitationExpiry">Invitation Expiry (hours)</Label>
                <Input
                  id="invitationExpiry"
                  type="number"
                  value={settings.invitationExpiry}
                  onChange={(e) => handleSettingChange("invitationExpiry", Number.parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
