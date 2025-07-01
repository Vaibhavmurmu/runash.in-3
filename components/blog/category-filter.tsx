"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  postCounts?: Record<string, number>
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  postCounts = {},
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange(null)}
        className={selectedCategory === null ? "bg-gradient-to-r from-orange-600 to-yellow-600" : ""}
      >
        All Posts
        {postCounts.all && (
          <Badge variant="secondary" className="ml-2 text-xs">
            {postCounts.all}
          </Badge>
        )}
      </Button>

      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={selectedCategory === category ? "bg-gradient-to-r from-orange-600 to-yellow-600" : ""}
        >
          {category}
          {postCounts[category] && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {postCounts[category]}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  )
}
