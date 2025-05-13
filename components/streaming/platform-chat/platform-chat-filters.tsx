"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, Plus, Trash2 } from "lucide-react"
import type { ChatFilter, StreamingPlatform } from "@/types/platform-chat"
import { getPlatformIcon, getPlatformName } from "./platform-utils"

interface PlatformChatFiltersProps {
  onBack: () => void
}

export default function PlatformChatFilters({ onBack }: PlatformChatFiltersProps) {
  const [filters, setFilters] = useState<ChatFilter[]>([
    {
      id: "filter-1",
      type: "keyword",
      value: "bad-word",
      action: "delete",
      platforms: ["twitch", "youtube", "facebook"],
      isEnabled: true,
    },
    {
      id: "filter-2",
      type: "regex",
      value: "\\b(spam|scam)\\b",
      action: "timeout",
      platforms: ["twitch", "youtube", "facebook", "tiktok"],
      isEnabled: true,
    },
    {
      id: "filter-3",
      type: "user",
      value: "spambot123",
      action: "ban",
      platforms: ["twitch"],
      isEnabled: true,
    },
  ])

  const [isAddingFilter, setIsAddingFilter] = useState(false)
  const [newFilter, setNewFilter] = useState<Partial<ChatFilter>>({
    type: "keyword",
    value: "",
    action: "delete",
    platforms: ["twitch", "youtube", "facebook", "tiktok"],
    isEnabled: true,
  })

  const handleAddFilter = () => {
    if (!newFilter.value) return

    const filter: ChatFilter = {
      id: `filter-${Date.now()}`,
      type: newFilter.type as "keyword" | "regex" | "user",
      value: newFilter.value,
      action: newFilter.action as "highlight" | "hide" | "delete" | "timeout" | "ban",
      platforms: newFilter.platforms as StreamingPlatform[],
      isEnabled: true,
    }

    setFilters([...filters, filter])
    setNewFilter({
      type: "keyword",
      value: "",
      action: "delete",
      platforms: ["twitch", "youtube", "facebook", "tiktok"],
      isEnabled: true,
    })
    setIsAddingFilter(false)
  }

  const handleDeleteFilter = (id: string) => {
    setFilters(filters.filter((filter) => filter.id !== id))
  }

  const handleToggleFilter = (id: string, enabled: boolean) => {
    setFilters(filters.map((filter) => (filter.id === id ? { ...filter, isEnabled: enabled } : filter)))
  }

  const togglePlatform = (platform: StreamingPlatform) => {
    setNewFilter((prev) => {
      const platforms = prev.platforms || []
      return {
        ...prev,
        platforms: platforms.includes(platform) ? platforms.filter((p) => p !== platform) : [...platforms, platform],
      }
    })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-medium">Chat Filters</h3>
      </div>

      <ScrollArea className="flex-1 p-3">
        {isAddingFilter ? (
          <div className="border rounded-lg p-3 mb-4">
            <h4 className="font-medium mb-3">Add New Filter</h4>

            <div className="space-y-3">
              <div>
                <Label htmlFor="filter-type">Filter Type</Label>
                <RadioGroup
                  id="filter-type"
                  value={newFilter.type}
                  onValueChange={(value) => setNewFilter({ ...newFilter, type: value })}
                  className="flex space-x-4 mt-1"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="keyword" id="keyword" />
                    <Label htmlFor="keyword">Keyword</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="regex" id="regex" />
                    <Label htmlFor="regex">Regex</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user">User</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="filter-value">
                  {newFilter.type === "keyword"
                    ? "Keyword"
                    : newFilter.type === "regex"
                      ? "Regular Expression"
                      : "Username"}
                </Label>
                <Input
                  id="filter-value"
                  value={newFilter.value}
                  onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                  placeholder={
                    newFilter.type === "keyword"
                      ? "Enter keyword to filter"
                      : newFilter.type === "regex"
                        ? "Enter regex pattern"
                        : "Enter username to filter"
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="filter-action">Action</Label>
                <RadioGroup
                  id="filter-action"
                  value={newFilter.action}
                  onValueChange={(value) => setNewFilter({ ...newFilter, action: value })}
                  className="grid grid-cols-2 gap-2 mt-1"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="highlight" id="highlight" />
                    <Label htmlFor="highlight">Highlight</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="hide" id="hide" />
                    <Label htmlFor="hide">Hide</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="delete" id="delete" />
                    <Label htmlFor="delete">Delete</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="timeout" id="timeout" />
                    <Label htmlFor="timeout">Timeout User</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="ban" id="ban" />
                    <Label htmlFor="ban">Ban User</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Platforms</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(["twitch", "youtube", "facebook", "tiktok", "instagram", "custom"] as StreamingPlatform[]).map(
                    (platform) => {
                      const PlatformIcon = getPlatformIcon(platform)
                      const isSelected = (newFilter.platforms || []).includes(platform)

                      return (
                        <Button
                          key={platform}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className="h-8"
                          onClick={() => togglePlatform(platform)}
                        >
                          <PlatformIcon className="h-3.5 w-3.5 mr-1" />
                          <span className="text-xs">{getPlatformName(platform)}</span>
                        </Button>
                      )
                    },
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsAddingFilter(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddFilter} disabled={!newFilter.value}>
                  Add Filter
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button onClick={() => setIsAddingFilter(true)} className="w-full mb-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Filter
          </Button>
        )}

        <div className="space-y-2">
          {filters.map((filter) => (
            <div key={filter.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {filter.type === "keyword" ? "Keyword" : filter.type === "regex" ? "Regex" : "User"}
                  </Badge>
                  <span className="font-medium">{filter.value}</span>
                </div>
                <Switch
                  checked={filter.isEnabled}
                  onCheckedChange={(checked) => handleToggleFilter(filter.id, checked)}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Action: </span>
                  <span
                    className={`
                    ${filter.action === "highlight" ? "text-blue-600 dark:text-blue-400" : ""}
                    ${filter.action === "hide" ? "text-gray-600 dark:text-gray-400" : ""}
                    ${filter.action === "delete" ? "text-orange-600 dark:text-orange-400" : ""}
                    ${filter.action === "timeout" ? "text-yellow-600 dark:text-yellow-400" : ""}
                    ${filter.action === "ban" ? "text-red-600 dark:text-red-400" : ""}
                  `}
                  >
                    {filter.action.charAt(0).toUpperCase() + filter.action.slice(1)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={() => handleDeleteFilter(filter.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {filter.platforms.map((platform) => {
                  const PlatformIcon = getPlatformIcon(platform)

                  return (
                    <div key={platform} className="flex items-center bg-gray-100 dark:bg-gray-800 rounded px-2 py-1">
                      <PlatformIcon className="h-3 w-3 mr-1" />
                      <span className="text-xs">{getPlatformName(platform)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
