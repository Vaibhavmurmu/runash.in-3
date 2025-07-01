"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SlidersHorizontal } from "lucide-react"
import type { AnalyticsFilters as AnalyticsFiltersType } from "@/types/analytics"
import { Badge } from "@/components/ui/badge"

interface AnalyticsFiltersProps {
  filters: AnalyticsFiltersType
  onChange: (filters: Partial<AnalyticsFiltersType>) => void
}

export function AnalyticsFilters({ filters, onChange }: AnalyticsFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<AnalyticsFiltersType>(filters)

  const platforms = [
    { id: "twitch", name: "Twitch" },
    { id: "youtube", name: "YouTube" },
    { id: "facebook", name: "Facebook" },
    { id: "tiktok", name: "TikTok" },
    { id: "instagram", name: "Instagram" },
  ]

  const categories = [
    { id: "gaming", name: "Gaming" },
    { id: "irl", name: "IRL" },
    { id: "music", name: "Music" },
    { id: "creative", name: "Creative" },
    { id: "talk_shows", name: "Talk Shows" },
  ]

  const streamTypes = [
    { id: "live", name: "Live" },
    { id: "vod", name: "VOD" },
    { id: "premiere", name: "Premiere" },
    { id: "clip", name: "Clip" },
  ]

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    let newPlatforms = [...localFilters.platforms]

    if (checked) {
      newPlatforms.push(platformId)
    } else {
      newPlatforms = newPlatforms.filter((p) => p !== platformId)
    }

    setLocalFilters({
      ...localFilters,
      platforms: newPlatforms,
    })
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    let newCategories = [...(localFilters.categories || [])]

    if (checked) {
      newCategories.push(categoryId)
    } else {
      newCategories = newCategories.filter((c) => c !== categoryId)
    }

    setLocalFilters({
      ...localFilters,
      categories: newCategories,
    })
  }

  const handleStreamTypeChange = (typeId: string, checked: boolean) => {
    let newTypes = [...(localFilters.streamTypes || [])]

    if (checked) {
      newTypes.push(typeId)
    } else {
      newTypes = newTypes.filter((t) => t !== typeId)
    }

    setLocalFilters({
      ...localFilters,
      streamTypes: newTypes,
    })
  }

  const handleApply = () => {
    onChange(localFilters)
    setIsOpen(false)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (localFilters.platforms.length < platforms.length) count += localFilters.platforms.length
    if (localFilters.categories?.length) count += localFilters.categories.length
    if (localFilters.streamTypes?.length) count += localFilters.streamTypes.length
    return count
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Platforms</h4>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`platform-${platform.id}`}
                    checked={localFilters.platforms.includes(platform.id)}
                    onCheckedChange={(checked) => handlePlatformChange(platform.id, checked as boolean)}
                  />
                  <Label htmlFor={`platform-${platform.id}`}>{platform.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={localFilters.categories?.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                  />
                  <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Stream Types</h4>
            <div className="grid grid-cols-2 gap-2">
              {streamTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={localFilters.streamTypes?.includes(type.id)}
                    onCheckedChange={(checked) => handleStreamTypeChange(type.id, checked as boolean)}
                  />
                  <Label htmlFor={`type-${type.id}`}>{type.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setLocalFilters(filters)}>
              Reset
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
