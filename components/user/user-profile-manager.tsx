"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Camera,
  Save,
  Upload,
  MapPin,
  Globe,
  Calendar,
  Users,
  Video,
  Eye,
  Heart,
  Settings,
  Activity,
  Shield,
} from "lucide-react"
import { UserManagementService, type UserProfile, type UserActivity } from "@/lib/user-management-service"
import { useToast } from "@/hooks/use-toast"

interface UserProfileManagerProps {
  userId: string
  isOwnProfile?: boolean
}

export function UserProfileManager({ userId, isOwnProfile = false }: UserProfileManagerProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({})

  const userService = UserManagementService.getInstance()
  const { toast } = useToast()

  useEffect(() => {
    loadUserData()
  }, [userId])

  const loadUserData = async () => {
    try {
      setLoading(true)
      const [userProfile, userActivities] = await Promise.all([
        userService.getUserProfile(userId),
        isOwnProfile ? userService.getUserActivity(userId, 10) : Promise.resolve({ activities: [], total: 0 }),
      ])

      setProfile(userProfile)
      setActivities(userActivities.activities)
      setEditedProfile(userProfile || {})
    } catch (error) {
      console.error("Failed to load user data:", error)
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return

    try {
      setSaving(true)
      const updatedProfile = await userService.updateUserProfile(userId, editedProfile)
      setProfile(updatedProfile)
      setIsEditing(false)

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      const avatarUrl = await userService.uploadAvatar(userId, file)
      setProfile((prev) => (prev ? { ...prev, avatar_url: avatarUrl } : null))

      toast({
        title: "Success",
        description: "Avatar updated successfully",
      })
    } catch (error) {
      console.error("Failed to upload avatar:", error)
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      })
    }
  }

  const handleFollowToggle = async () => {
    if (!profile) return

    try {
      // Implementation would depend on follow status
      // await userService.followUser(userId) or unfollowUser
      toast({
        title: "Success",
        description: "Follow status updated",
      })
    } catch (error) {
      console.error("Failed to update follow status:", error)
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      })
    }
  }

  if (loading || !profile) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  const profileCompletion = calculateProfileCompletion(profile)

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.name} />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isOwnProfile && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  onClick={() => document.getElementById("avatar-upload")?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleAvatarUpload(file)
                }}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <Badge variant={profile.status === "active" ? "default" : "secondary"}>{profile.status}</Badge>
                {profile.email_verified && (
                  <Badge className="bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              <p className="text-muted-foreground mb-2">@{profile.username}</p>

              {profile.bio && <p className="text-sm mb-4">{profile.bio}</p>}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {profile.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(profile.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">{profile.follower_count}</span> followers
                </div>
                <div className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  <span className="font-medium">{profile.stream_count}</span> streams
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">{profile.total_views.toLocaleString()}</span> views
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {isOwnProfile ? (
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className={isEditing ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleFollowToggle}>
                  <Heart className="h-4 w-4 mr-2" />
                  Follow
                </Button>
              )}
            </div>
          </div>

          {isOwnProfile && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Profile Completion</span>
                <span className="font-medium">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      value={editedProfile.name || ""}
                      onChange={(e) => setEditedProfile((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={editedProfile.username || ""}
                      onChange={(e) => setEditedProfile((prev) => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    value={editedProfile.bio || ""}
                    onChange={(e) => setEditedProfile((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editedProfile.location || ""}
                      onChange={(e) => setEditedProfile((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editedProfile.website || ""}
                      onChange={(e) => setEditedProfile((prev) => ({ ...prev, website: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Profile Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{profile.follower_count}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{profile.following_count}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{profile.stream_count}</div>
                    <div className="text-sm text-muted-foreground">Streams</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{profile.total_views.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Views</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Library</CardTitle>
              <CardDescription>Manage your uploaded content and streams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Content management will be available soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and privacy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Settings panel will be available soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function calculateProfileCompletion(profile: UserProfile): number {
  const fields = [
    profile.name,
    profile.username,
    profile.bio,
    profile.location,
    profile.website,
    profile.avatar_url,
    profile.email_verified,
  ]

  const completedFields = fields.filter((field) => field && field !== "").length
  return Math.round((completedFields / fields.length) * 100)
}
