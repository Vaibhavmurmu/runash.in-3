"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, MoreHorizontal, Edit, Trash2, Calendar } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { StreamTemplate } from "@/types/stream-scheduler"

interface StreamTemplatesProps {
  templates: StreamTemplate[]
  onCreateTemplate: () => void
  onEditTemplate: (template: StreamTemplate) => void
  onDeleteTemplate: (templateId: string) => void
  onUseTemplate: (template: StreamTemplate) => void
  onDeleteTemplate: (templateId: string) => void
  onUseTemplate: (template: StreamTemplate) => void
}

export default function StreamTemplates({
  templates,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onUseTemplate,
}: StreamTemplatesProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = (templateId: string) => {
    if (isDeleting === templateId) {
      onDeleteTemplate(templateId)
      setIsDeleting(null)
    } else {
      setIsDeleting(templateId)
      setTimeout(() => {
        setIsDeleting(null)
      }, 3000)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Stream Templates</CardTitle>
        <Button
          onClick={onCreateTemplate}
          className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mb-2" />
            <h3 className="text-lg font-medium mb-1">No templates yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create templates to quickly schedule streams with predefined settings
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100%-1rem)] px-4">
            <div className="space-y-4 py-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border rounded-lg p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {template.duration} min • {template.platforms.length} platform(s)
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onUseTemplate(template)}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule with Template
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditTemplate(template)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Template
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={isDeleting === template.id ? "text-red-600 dark:text-red-400" : ""}
                          onClick={() => handleDelete(template.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {isDeleting === template.id ? "Confirm Delete" : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {template.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">{template.description}</p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
