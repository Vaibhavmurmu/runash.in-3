"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import type { AlertSettings as AlertSettingsType } from "@/types/alerts"

interface AlertSettingsProps {
  settings: AlertSettingsType
  onSave: (settings: AlertSettingsType) => void
}

export default function AlertSettings({ settings, onSave }: AlertSettingsProps) {
  const [editedSettings, setEditedSettings] = useState<AlertSettingsType>(settings)

  const handleChange = (field: keyof AlertSettingsType, value: any) => {
    setEditedSettings({
      ...editedSettings,
      [field]: value,
    })
  }

  const handleSave = () => {
    onSave(editedSettings)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Settings</CardTitle>
        <CardDescription>Configure global settings for all alerts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="globalVolume">Global Volume</Label>
            <span className="text-sm text-muted-foreground">{editedSettings.globalVolume}%</span>
          </div>
          <Slider
            id="globalVolume"
            value={[editedSettings.globalVolume]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => handleChange("globalVolume", value[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="alertDelay">Alert Delay (seconds)</Label>
            <span className="text-sm text-muted-foreground">{editedSettings.alertDelay}s</span>
          </div>
          <Slider
            id="alertDelay"
            value={[editedSettings.alertDelay]}
            min={0}
            max={10}
            step={0.5}
            onValueChange={(value) => handleChange("alertDelay", value[0])}
          />
          <p className="text-xs text-muted-foreground">Time to wait between showing multiple alerts</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="queueAlerts" className="block mb-1">
              Queue Alerts
            </Label>
            <p className="text-xs text-muted-foreground">Show alerts one after another instead of all at once</p>
          </div>
          <Switch
            id="queueAlerts"
            checked={editedSettings.queueAlerts}
            onCheckedChange={(checked) => handleChange("queueAlerts", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="alertsEnabled" className="block mb-1">
              Alerts Enabled
            </Label>
            <p className="text-xs text-muted-foreground">Master switch to enable or disable all alerts</p>
          </div>
          <Switch
            id="alertsEnabled"
            checked={editedSettings.alertsEnabled}
            onCheckedChange={(checked) => handleChange("alertsEnabled", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="testMode" className="block mb-1">
              Test Mode
            </Label>
            <p className="text-xs text-muted-foreground">Alerts will only be visible to you, not your viewers</p>
          </div>
          <Switch
            id="testMode"
            checked={editedSettings.testMode}
            onCheckedChange={(checked) => handleChange("testMode", checked)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-white ml-auto"
        >
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  )
}
