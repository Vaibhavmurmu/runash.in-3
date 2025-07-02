"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Category {
  id: string
  name: string
  count: number
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
  totalPosts: number
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange, totalPosts }: CategoryFilterProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className={selectedCategory === null ? "bg-gradient-to-r from-orange-600 to-yellow-500" : ""}
        >
          All Posts
          <Badge variant="secondary" className="ml-2">
            {totalPosts}
          </Badge>
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={selectedCategory === category.id ? "bg-gradient-to-r from-orange-600 to-yellow-500" : ""}
          >
            {category.name}
            <Badge variant="secondary" className="ml-2">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  )
}
