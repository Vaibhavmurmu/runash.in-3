"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Eye, Download, Star } from "lucide-react"
import { TemplateEngine, type TemplateLayout } from "@/lib/template-engine"
import TemplateEditor from "./template-editor"
import TemplatePreview from "./template-preview"

export default function TemplateManager() {
  const [templates, setTemplates] = useState<TemplateLayout[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<TemplateLayout[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateLayout | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const templateEngine = TemplateEngine.getInstance()

  useEffect(() => {
    loadTemplates()
  }, [])

  useEffect(() => {
    filterTemplates()
  }, [templates, searchQuery, selectedCategory])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const allTemplates = await templateEngine.getTemplates()
      setTemplates(allTemplates)
    } catch (error) {
      console.error("Failed to load templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterTemplates = () => {
    let filtered = [...templates]

    if (searchQuery) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((template) => template.category === selectedCategory)
    }

    setFilteredTemplates(filtered)
  }

  const handleTemplateSelect = (template: TemplateLayout) => {
    setSelectedTemplate(template)
    setIsPreviewOpen(true)
  }

  const handleCreateTemplate = () => {
    setSelectedTemplate(null)
    setIsEditing(true)
  }

  const handleEditTemplate = (template: TemplateLayout) => {
    setSelectedTemplate(template)
    setIsEditing(true)
  }

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "overlay", name: "Overlays" },
    { id: "alert", name: "Alerts" },
    { id: "background", name: "Backgrounds" },
    { id: "transition", name: "Transitions" },
    { id: "frame", name: "Frames" },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "overlay":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "alert":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "background":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      case "transition":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "frame":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  if (isEditing) {
    return (
      <TemplateEditor
        template={selectedTemplate}
        onSave={(template) => {
          loadTemplates()
          setIsEditing(false)
          setSelectedTemplate(null)
        }}
        onCancel={() => {
          setIsEditing(false)
          setSelectedTemplate(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Template Manager</h2>
          <p className="text-muted-foreground">Create and manage streaming templates</p>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted rounded-t-lg" />
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                </CardHeader>
              </Card>
            ))
          : filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                  <img
                    src={template.thumbnailUrl || "/placeholder.svg"}
                    alt={template.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/abstract-template.png"
                    }}
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Badge className={`mb-2 ${getCategoryColor(template.category)}`}>
                        {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                      </Badge>
                      <CardTitle className="text-lg line-clamp-1">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{template.description}</p>
                    </div>
                    {template.isPremium && (
                      <Badge variant="outline" className="text-amber-600 border-amber-600">
                        <Star className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{template.downloadCount.toLocaleString()} downloads</span>
                      <span>•</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-current text-amber-500 mr-1" />
                        <span>{template.rating}</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">by {template.author}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Use
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Template Preview Modal */}
      {isPreviewOpen && selectedTemplate && (
        <TemplatePreview
          template={selectedTemplate}
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false)
            setSelectedTemplate(null)
          }}
          onUse={(template) => {
            // Handle template usage
            console.log("Using template:", template)
            setIsPreviewOpen(false)
            setSelectedTemplate(null)
          }}
        />
      )}
    </div>
  )
}
