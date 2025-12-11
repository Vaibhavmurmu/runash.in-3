"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  BookOpen,
  Video,
  Clock,
  Users,
  Star,
  Play,
  FileText,
  Leaf,
  Droplets,
  Bug,
  Sprout,
  Sun,
  Recycle,
} from "lucide-react"

interface Practice {
  id: string
  title: string
  category: string
  type: "article" | "video" | "guide" | "case-study"
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  rating: number
  views: number
  description: string
  tags: string[]
  author: string
  publishDate: string
  icon: React.ReactNode
}

const practices: Practice[] = [
  {
    id: "companion-planting",
    title: "Companion Planting for Natural Pest Control",
    category: "Pest Management",
    type: "article",
    duration: "8 min read",
    difficulty: "Beginner",
    rating: 4.8,
    views: 2340,
    description:
      "Learn how to use companion planting to naturally repel pests and attract beneficial insects. Discover the best plant combinations for your organic garden.",
    tags: ["companion planting", "pest control", "biodiversity", "natural farming"],
    author: "Dr. Priya Sharma",
    publishDate: "2024-01-15",
    icon: <Bug className="h-5 w-5" />,
  },
  {
    id: "drip-irrigation-setup",
    title: "Setting Up Drip Irrigation Systems",
    category: "Water Management",
    type: "video",
    duration: "15 min",
    difficulty: "Intermediate",
    rating: 4.9,
    views: 1890,
    description:
      "Step-by-step video guide on installing and maintaining drip irrigation systems for water-efficient organic farming.",
    tags: ["drip irrigation", "water conservation", "sustainable farming", "efficiency"],
    author: "Rajesh Kumar",
    publishDate: "2024-01-10",
    icon: <Droplets className="h-5 w-5" />,
  },
  {
    id: "vermicomposting-guide",
    title: "Complete Vermicomposting Guide",
    category: "Soil Health",
    type: "guide",
    duration: "12 min read",
    difficulty: "Beginner",
    rating: 4.7,
    views: 3120,
    description:
      "Comprehensive guide to setting up and maintaining a vermicomposting system for nutrient-rich organic fertilizer.",
    tags: ["vermicomposting", "organic fertilizer", "soil health", "waste management"],
    author: "Meera Patel",
    publishDate: "2024-01-08",
    icon: <Recycle className="h-5 w-5" />,
  },
  {
    id: "crop-rotation-planning",
    title: "4-Year Crop Rotation Planning",
    category: "Crop Management",
    type: "guide",
    duration: "10 min read",
    difficulty: "Intermediate",
    rating: 4.6,
    views: 1560,
    description:
      "Learn how to plan effective crop rotations that maintain soil fertility and break pest cycles in organic farming.",
    tags: ["crop rotation", "soil fertility", "planning", "sustainable agriculture"],
    author: "Dr. Anil Verma",
    publishDate: "2024-01-05",
    icon: <Sun className="h-5 w-5" />,
  },
  {
    id: "organic-seed-saving",
    title: "Organic Seed Saving Techniques",
    category: "Seed Management",
    type: "article",
    duration: "6 min read",
    difficulty: "Advanced",
    rating: 4.8,
    views: 980,
    description:
      "Master the art of saving seeds from your organic crops to maintain genetic diversity and reduce costs.",
    tags: ["seed saving", "genetic diversity", "heirloom varieties", "sustainability"],
    author: "Sunita Devi",
    publishDate: "2024-01-03",
    icon: <Sprout className="h-5 w-5" />,
  },
  {
    id: "beneficial-insects",
    title: "Attracting Beneficial Insects to Your Farm",
    category: "Biodiversity",
    type: "video",
    duration: "12 min",
    difficulty: "Beginner",
    rating: 4.9,
    views: 2780,
    description:
      "Video tutorial on creating habitats and choosing plants that attract beneficial insects for natural pest control.",
    tags: ["beneficial insects", "biodiversity", "natural pest control", "pollination"],
    author: "Dr. Kavita Singh",
    publishDate: "2024-01-01",
    icon: <Leaf className="h-5 w-5" />,
  },
]

const categories = [
  "All",
  "Soil Health",
  "Pest Management",
  "Water Management",
  "Crop Management",
  "Biodiversity",
  "Seed Management",
]

export default function FarmingPracticesLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedType, setSelectedType] = useState("all")

  const filteredPractices = practices.filter((practice) => {
    const matchesSearch =
      practice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      practice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      practice.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || practice.category === selectedCategory
    const matchesType = selectedType === "all" || practice.type === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "guide":
        return <BookOpen className="h-4 w-4" />
      case "case-study":
        return <Users className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Farming Practices Library</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our comprehensive collection of organic farming techniques, tutorials, and best practices from
          experienced farmers and agricultural experts.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search practices, techniques, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <Tabs value={selectedType} onValueChange={setSelectedType}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All Types</TabsTrigger>
                <TabsTrigger value="article">Articles</TabsTrigger>
                <TabsTrigger value="video">Videos</TabsTrigger>
                <TabsTrigger value="guide">Guides</TabsTrigger>
                <TabsTrigger value="case-study">Case Studies</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredPractices.length} of {practices.length} practices
        </p>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Practices Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPractices.map((practice) => (
          <Card key={practice.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">{practice.icon}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    {getTypeIcon(practice.type)}
                    <span className="capitalize">{practice.type}</span>
                  </div>
                </div>
                <Badge className={getDifficultyColor(practice.difficulty)}>{practice.difficulty}</Badge>
              </div>
              <CardTitle className="text-lg leading-tight">{practice.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {practice.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {practice.rating}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {practice.views}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm leading-relaxed">{practice.description}</p>

              <div className="flex flex-wrap gap-1">
                {practice.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {practice.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{practice.tags.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-xs text-gray-500">
                  By {practice.author} • {new Date(practice.publishDate).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  {practice.type === "video" && (
                    <Button size="sm" variant="outline">
                      <Play className="h-3 w-3 mr-1" />
                      Watch
                    </Button>
                  )}
                  <Button size="sm">
                    {practice.type === "video" ? (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Play
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-3 w-3 mr-1" />
                        Read
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {filteredPractices.length > 0 && (
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Practices
          </Button>
        </div>
      )}

      {/* No Results */}
      {filteredPractices.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No practices found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or filters to find relevant farming practices.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
                setSelectedType("all")
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
