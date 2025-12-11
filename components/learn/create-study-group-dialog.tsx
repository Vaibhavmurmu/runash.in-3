"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, X, Users, Calendar, Target, Shield, Globe, Lock, UserPlus } from "lucide-react"

interface CreateStudyGroupDialogProps {
  onClose: () => void
}

export default function CreateStudyGroupDialog({ onClose }: CreateStudyGroupDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    difficulty: "",
    privacy: "public",
    maxMembers: 25,
    language: "English",
    region: "",
    tags: [] as string[],
    goals: [] as string[],
    rules: [] as string[],
    meetingSchedule: {
      enabled: false,
      frequency: "weekly",
      dayOfWeek: 0,
      time: "19:00",
      timezone: "IST",
      duration: 60,
    },
  })

  const [newTag, setNewTag] = useState("")
  const [newGoal, setNewGoal] = useState("")
  const [newRule, setNewRule] = useState("")

  const categories = [
    "Soil Health",
    "Pest Management",
    "Water Management",
    "Crop Management",
    "Composting",
    "Biodiversity",
    "Certification",
    "Marketing",
    "Technology",
    "Community & Support",
    "General Organic Farming",
  ]

  const difficulties = ["beginner", "intermediate", "advanced", "mixed"]
  const frequencies = ["weekly", "bi-weekly", "monthly", "custom"]
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((tag) => tag !== tagToRemove) })
  }

  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData({ ...formData, goals: [...formData.goals, newGoal.trim()] })
      setNewGoal("")
    }
  }

  const removeGoal = (index: number) => {
    setFormData({ ...formData, goals: formData.goals.filter((_, i) => i !== index) })
  }

  const addRule = () => {
    if (newRule.trim()) {
      setFormData({ ...formData, rules: [...formData.rules, newRule.trim()] })
      setNewRule("")
    }
  }

  const removeRule = (index: number) => {
    setFormData({ ...formData, rules: formData.rules.filter((_, i) => i !== index) })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating study group:", formData)
    onClose()
  }

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case "public":
        return <Globe className="h-4 w-4" />
      case "private":
        return <Lock className="h-4 w-4" />
      case "invite-only":
        return <UserPlus className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Create Study Group
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="mt-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="rules">Rules & Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Group Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Soil Health Masters"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what your group is about, who should join, and what members can expect..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level *</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map((difficulty) => (
                          <SelectItem key={difficulty} value={difficulty}>
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Group Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="privacy">Privacy Setting</Label>
                    <Select
                      value={formData.privacy}
                      onValueChange={(value) => setFormData({ ...formData, privacy: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span>Public - Anyone can join</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            <span>Private - Invitation only</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="invite-only">
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            <span>Invite-only - Request to join</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxMembers">Maximum Members</Label>
                    <Input
                      id="maxMembers"
                      type="number"
                      min="5"
                      max="500"
                      value={formData.maxMembers}
                      onChange={(e) => setFormData({ ...formData, maxMembers: Number.parseInt(e.target.value) || 25 })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => setFormData({ ...formData, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Tamil">Tamil</SelectItem>
                        <SelectItem value="Telugu">Telugu</SelectItem>
                        <SelectItem value="Bengali">Bengali</SelectItem>
                        <SelectItem value="Marathi">Marathi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">Region (Optional)</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      placeholder="e.g., Maharashtra, India"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Meeting Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enableSchedule"
                    checked={formData.meetingSchedule.enabled}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        meetingSchedule: { ...formData.meetingSchedule, enabled: !!checked },
                      })
                    }
                  />
                  <Label htmlFor="enableSchedule">Enable regular meeting schedule</Label>
                </div>

                {formData.meetingSchedule.enabled && (
                  <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Select
                          value={formData.meetingSchedule.frequency}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              meetingSchedule: { ...formData.meetingSchedule, frequency: value as any },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {frequencies.map((freq) => (
                              <SelectItem key={freq} value={freq}>
                                {freq.charAt(0).toUpperCase() + freq.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Day of Week</Label>
                        <Select
                          value={formData.meetingSchedule.dayOfWeek.toString()}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              meetingSchedule: { ...formData.meetingSchedule, dayOfWeek: Number.parseInt(value) },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {days.map((day, index) => (
                              <SelectItem key={day} value={index.toString()}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input
                          type="time"
                          value={formData.meetingSchedule.time}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              meetingSchedule: { ...formData.meetingSchedule, time: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Duration (minutes)</Label>
                        <Input
                          type="number"
                          min="30"
                          max="180"
                          value={formData.meetingSchedule.duration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              meetingSchedule: {
                                ...formData.meetingSchedule,
                                duration: Number.parseInt(e.target.value) || 60,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Select
                          value={formData.meetingSchedule.timezone}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              meetingSchedule: { ...formData.meetingSchedule, timezone: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IST">IST (India)</SelectItem>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="EST">EST (US East)</SelectItem>
                            <SelectItem value="PST">PST (US West)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goals & Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Group Goals</Label>
                    <p className="text-sm text-gray-600 mb-2">What do you want members to achieve?</p>
                    <div className="flex gap-2">
                      <Input
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Add a learning goal..."
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addGoal())}
                      />
                      <Button type="button" onClick={addGoal} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 mt-3">
                      {formData.goals.map((goal, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{goal}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeGoal(index)}>
                            <X className="h-4 w-4" />
                              </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Group Rules</Label>
                    <p className="text-sm text-gray-600 mb-2">Set guidelines for group behavior</p>
                    <div className="flex gap-2">
                      <Input
                        value={newRule}
                        onChange={(e) => setNewRule(e.target.value)}
                        placeholder="Add a group rule..."
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRule())}
                      />
                      <Button type="button" onClick={addRule} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 mt-3">
                      {formData.rules.map((rule, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{rule}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeRule(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Create Study Group
          </Button>
        </div>
      </form>
    </div>
  )
}
