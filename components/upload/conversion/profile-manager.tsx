"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookmarkIcon, Edit, Trash2, Plus, Check, Star } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

import type { ConversionSettings } from "@/types/conversion"
import type { ConversionProfile } from "@/types/conversion-profiles"
import {
  getUserProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  setProfileAsDefault,
} from "@/services/conversion-profiles-service"
import { availableFormats } from "@/services/conversion-service"

interface ProfileManagerProps {
  currentSettings: ConversionSettings
  currentFormat: string
  onApplyProfile: (profile: ConversionProfile) => void
}

export default function ProfileManager({ currentSettings, currentFormat, onApplyProfile }: ProfileManagerProps) {
  const [profiles, setProfiles] = useState<ConversionProfile[]>(() => getUserProfiles("user-1"))
  const [newProfileName, setNewProfileName] = useState("")
  const [newProfileDescription, setNewProfileDescription] = useState("")
  const [makeDefault, setMakeDefault] = useState(false)
  const [editingProfile, setEditingProfile] = useState<ConversionProfile | null>(null)
  const [showNewProfileDialog, setShowNewProfileDialog] = useState(false)
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false)
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null)

  const { toast } = useToast()

  // Get format name
  const getFormatName = (formatId: string) => {
    return availableFormats.find((f) => f.id === formatId)?.name || formatId
  }

  // Handle saving a new profile
  const handleSaveNewProfile = () => {
    if (!newProfileName.trim()) {
      toast({
        title: "Profile name required",
        description: "Please enter a name for your profile.",
        variant: "destructive",
      })
      return
    }

    if (!currentFormat) {
      toast({
        title: "No format selected",
        description: "Please select a target format before saving a profile.",
        variant: "destructive",
      })
      return
    }

    const newProfile = createProfile({
      name: newProfileName,
      description: newProfileDescription,
      targetFormat: currentFormat,
      settings: currentSettings,
      isDefault: makeDefault,
      userId: "user-1",
    })

    setProfiles(getUserProfiles("user-1"))
    setShowNewProfileDialog(false)
    setNewProfileName("")
    setNewProfileDescription("")
    setMakeDefault(false)

    toast({
      title: "Profile saved",
      description: `Your profile "${newProfile.name}" has been saved.`,
    })
  }

  // Handle updating a profile
  const handleUpdateProfile = () => {
    if (!editingProfile) return

    if (!editingProfile.name.trim()) {
      toast({
        title: "Profile name required",
        description: "Please enter a name for your profile.",
        variant: "destructive",
      })
      return
    }

    const updated = updateProfile(editingProfile.id, {
      name: editingProfile.name,
      description: editingProfile.description,
      isDefault: editingProfile.isDefault,
    })

    if (updated) {
      setProfiles(getUserProfiles("user-1"))
      setShowEditProfileDialog(false)
      setEditingProfile(null)

      toast({
        title: "Profile updated",
        description: `Your profile "${updated.name}" has been updated.`,
      })
    }
  }

  // Handle deleting a profile
  const handleDeleteProfile = () => {
    if (!profileToDelete) return

    const deleted = deleteProfile(profileToDelete)
    if (deleted) {
      setProfiles(getUserProfiles("user-1"))
      setProfileToDelete(null)

      toast({
        title: "Profile deleted",
        description: "Your profile has been deleted.",
      })
    }
  }

  // Handle setting a profile as default
  const handleSetAsDefault = (profileId: string) => {
    const updated = setProfileAsDefault(profileId, "user-1")
    if (updated) {
      setProfiles(getUserProfiles("user-1"))

      toast({
        title: "Default profile set",
        description: `"${updated.name}" is now your default profile.`,
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">My Conversion Profiles</h3>

        <Dialog open={showNewProfileDialog} onOpenChange={setShowNewProfileDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" />
              Save Current
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Conversion Profile</DialogTitle>
              <DialogDescription>Save your current conversion settings as a profile for future use.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Profile Name</Label>
                <Input
                  id="profile-name"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="e.g., YouTube 1080p"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-description">Description (Optional)</Label>
                <Textarea
                  id="profile-description"
                  value={newProfileDescription}
                  onChange={(e) => setNewProfileDescription(e.target.value)}
                  placeholder="Describe what this profile is optimized for"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Target Format</Label>
                <div className="p-2 bg-muted rounded-md">{getFormatName(currentFormat)}</div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="make-default" checked={makeDefault} onCheckedChange={setMakeDefault} />
                <Label htmlFor="make-default">Set as default profile</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewProfileDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveNewProfile}
                className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
              >
                Save Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {profiles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <BookmarkIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Profiles Yet</h3>
            <p className="text-muted-foreground mb-4">
              Save your current conversion settings as a profile for quick access in the future.
            </p>
            <Button
              onClick={() => setShowNewProfileDialog(true)}
              className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Profile
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {profiles.map((profile) => (
              <Card key={profile.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {profile.name}
                      {profile.isDefault && (
                        <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/20">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingProfile(profile)
                          setShowEditProfileDialog(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog
                        open={profileToDelete === profile.id}
                        onOpenChange={(open) => !open && setProfileToDelete(null)}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                            onClick={() => setProfileToDelete(profile.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Profile</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the profile "{profile.name}"? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteProfile} className="bg-red-500 hover:bg-red-600">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {profile.description && <p className="text-sm text-muted-foreground mb-2">{profile.description}</p>}

                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline">Format: {getFormatName(profile.targetFormat)}</Badge>

                    {profile.settings.resolution && (
                      <Badge variant="outline">
                        {profile.settings.resolution.width}x{profile.settings.resolution.height}
                      </Badge>
                    )}

                    {profile.settings.videoBitrate && (
                      <Badge variant="outline">{profile.settings.videoBitrate} kbps</Badge>
                    )}

                    {profile.settings.audioBitrate && (
                      <Badge variant="outline">Audio: {profile.settings.audioBitrate} kbps</Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
                <Separator />
                <CardFooter className="p-2 flex justify-between">
                  {!profile.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleSetAsDefault(profile.id)}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Set as Default
                    </Button>
                  )}

                  <Button
                    className="ml-auto bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-xs"
                    size="sm"
                    onClick={() => onApplyProfile(profile)}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Apply
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfileDialog} onOpenChange={setShowEditProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your conversion profile details.</DialogDescription>
          </DialogHeader>

          {editingProfile && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-profile-name">Profile Name</Label>
                <Input
                  id="edit-profile-name"
                  value={editingProfile.name}
                  onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-profile-description">Description (Optional)</Label>
                <Textarea
                  id="edit-profile-description"
                  value={editingProfile.description || ""}
                  onChange={(e) => setEditingProfile({ ...editingProfile, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-make-default"
                  checked={editingProfile.isDefault || false}
                  onCheckedChange={(checked) => setEditingProfile({ ...editingProfile, isDefault: checked })}
                />
                <Label htmlFor="edit-make-default">Set as default profile</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditProfileDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProfile}
              className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
            >
              Update Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
