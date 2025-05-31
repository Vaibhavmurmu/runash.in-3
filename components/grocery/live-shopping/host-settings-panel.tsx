"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Video, Bell, Shield, DollarSign, Save, Upload, Smartphone, Mail } from "lucide-react"

interface HostSettingsPanelProps {
  hostId: string
}

export function HostSettingsPanel({ hostId }: HostSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState("profile")

  // Mock settings data
  const [settings, setSettings] = useState({
    profile: {
      displayName: "Sarah Johnson",
      bio: "Organic food enthusiast and cooking expert. Sharing healthy recipes and sustainable living tips.",
      avatar: "/placeholder.svg",
      website: "https://sarahjohnson.com",
      location: "San Francisco, CA",
    },
    streaming: {
      defaultQuality: "1080p",
      autoRecord: true,
      chatModeration: true,
      allowGuestHosts: false,
      defaultCategory: "organic",
      streamDelay: "low",
      enableDVR: true,
    },
    notifications: {
      email: {
        newFollowers: true,
        streamComments: false,
        purchases: true,
        milestones: true,
      },
      push: {
        streamStarted: true,
        highEngagement: true,
        technicalIssues: true,
        chatMentions: true,
      },
      sms: {
        emergencyOnly: true,
        streamIssues: false,
      },
    },
    privacy: {
      profileVisibility: "public",
      showViewerCount: true,
      showRevenue: false,
      allowDirectMessages: true,
      moderationLevel: "medium",
    },
    monetization: {
      subscriptionTier: "pro",
      commissionRate: 15,
      payoutMethod: "bank",
      taxId: "***-**-1234",
      autoPayouts: true,
    },
  })

  const handleSave = () => {
    // Save settings logic here
    console.log("Saving settings:", settings)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Host Settings</h2>
          <p className="text-muted-foreground">Manage your profile, streaming preferences, and account settings</p>
        </div>
        <Button onClick={handleSave} className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="streaming">Streaming</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your public profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={settings.profile.avatar || "/placeholder.svg"} alt={settings.profile.displayName} />
                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-amber-400 text-white text-xl">
                    {settings.profile.displayName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Avatar
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Recommended: Square image, at least 400x400px
                  </p>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={settings.profile.displayName}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, displayName: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={settings.profile.location}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, location: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={settings.profile.website}
                  onChange={(e) => setSettings({
                    ...settings,
                    profile: { ...settings.profile, website: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={settings.profile.bio}
                  onChange={(e) => setSettings({
                    ...settings,
                    profile: { ...settings.profile, bio: e.target.value }
                  })}
                />
                <p className="text-sm text-muted-foreground">
                  {settings.profile.bio.length}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Streaming Settings */}
        <TabsContent value="streaming" className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Streaming Preferences
              </CardTitle>
              <CardDescription>Configure your default streaming settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="defaultQuality">Default Stream Quality</Label>
                  <Select
                    value={settings.streaming.defaultQuality}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      streaming: { ...settings.streaming, defaultQuality: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p (HD)</SelectItem>
                      <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                      <SelectItem value="1440p">1440p (QHD)</SelectItem>
                      <SelectItem value="4K">4K (Ultra HD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultCategory">Default Category</Label>
                  <Select
                    value={settings.streaming.defaultCategory}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      streaming: { ...settings.streaming, defaultCategory: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organic">Organic Produce</SelectItem>
                      <SelectItem value="cooking">Cooking Demo</SelectItem>
                      <SelectItem value="nutrition">Nutrition Tips</SelectItem>
                      <SelectItem value="seasonal">Seasonal Products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoRecord">Auto-record streams</Label>
                    <p className="text-sm text-muted-foreground">Automatically record all your live streams</p>
                  </div>
                  <Switch
                    id="autoRecord"
                    checked={settings.streaming.autoRecord}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      streaming: { ...settings.streaming, autoRecord: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="chatModeration">Chat moderation</Label>
                    <p className="text-sm text-muted-foreground">Enable AI-powered chat moderation</p>
                  </div>
                  <Switch
                    id="chatModeration"
                    checked={settings.streaming.chatModeration}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      streaming: { ...settings.streaming, chatModeration: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowGuestHosts">Allow guest hosts</Label>
                    <p className="text-sm text-muted-foreground">Let other users co-host your streams</p>
                  </div>
                  <Switch
                    id="allowGuestHosts"
                    checked={settings.streaming.allowGuestHosts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      streaming: { ...settings.streaming, allowGuestHosts: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableDVR">Enable DVR</Label>
                    <p className="text-sm text-muted-foreground">Allow viewers to rewind and replay</p>
                  </div>
                  <Switch
                    id="enableDVR"
                    checked={settings.streaming.enableDVR}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      streaming: { ...settings.streaming, enableDVR: checked }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Notifications
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New followers</Label>
                      <p className="text-sm text-muted-foreground">When someone follows your channel</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email.newFollowers}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          email: { ...settings.notifications.email, newFollowers: checked }
                        }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Stream comments</Label>
                      <p className="text-sm text-muted-foreground">When someone comments on your stream</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email.streamComments}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          email: { ...settings.notifications.email, streamComments: checked }
                        }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Purchases</Label>
                      <p className="text-sm text-muted-foreground">When someone makes a purchase during your stream</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email.purchases}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          email: { ...settings.notifications.email, purchases: checked }
                        }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Push Notifications */}
              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Push Notifications
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Stream started</Label>
                      <p className="text-sm text-muted-foreground">Confirm when your stream goes live</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push.streamStarted}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          push: { ...settings.notifications.push, streamStarted: checked }
                        }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>High engagement</Label>
                      <p className="text-sm text-muted-foreground">When your stream has high viewer engagement</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push.highEngagement}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          push: { ...settings.notifications.push, highEngagement: checked }
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Control your privacy and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profileVisibility">Profile Visibility</Label>
                  <Select
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, profileVisibility: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="followers">Followers Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show viewer count</Label>
                    <p className="text-sm text-muted-foreground">Display live viewer count on streams</p>
                  </div>
                  <Switch
                    checked={settings.privacy.showViewerCount}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, showViewerCount: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show revenue</Label>
                    <p className="text-sm text-muted-foreground">Display revenue information publicly</p>
                  </div>
                  <Switch
                    checked={settings.privacy.showRevenue}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, showRevenue: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow direct messages</Label>
                    <p className="text-sm text-muted-foreground">Let viewers send you private messages</p>
                  </div>
                  <Switch
                    checked={settings.privacy.allowDirectMessages}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, allowDirectMessages: checked }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monetization Settings */}
        <TabsContent value="monetization" className="space-y-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Monetization Settings
              </CardTitle>
              <CardDescription>Manage your earnings and payout preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="subscriptionTier">Subscription Tier</Label>
                  <Select
                    value={settings.monetization.subscriptionTier}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      monetization: { ...settings.monetization, subscriptionTier: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (10% commission)</SelectItem>
                      <SelectItem value="pro">Pro (15% commission)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (20% commission)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payoutMethod">Payout Method</Label>
                  <Select
                    value={settings.monetization.payoutMethod}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      monetization: { ...settings.monetization, payoutMethod: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  value={settings.monetization.taxId}
                  onChange={(e) => setSettings({
                    ...settings,
                    monetization: { ...settings
