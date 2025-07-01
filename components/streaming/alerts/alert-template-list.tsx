"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Play, MoreVertical, Copy, Eye, EyeOff } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { AlertTemplate } from "@/types/alerts"

interface AlertTemplateListProps {
  templates: AlertTemplate[]
  onEdit: (template: AlertTemplate) => void
  onDelete: (id: string) => void
  onTest: (template: AlertTemplate) => void
}

export default function AlertTemplateList({ templates, onEdit, onDelete, onTest }: AlertTemplateListProps) {
  const [enabledTemplates, setEnabledTemplates] = useState<Record<string, boolean>>(
    templates.reduce((acc, template) => ({ ...acc, [template.id]: template.enabled }), {}),
  )

  const handleToggleEnabled = (id: string) => {
    setEnabledTemplates({
      ...enabledTemplates,
      [id]: !enabledTemplates[id],
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "follow":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "subscription":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      case "donation":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "cheer":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "host":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400"
      case "raid":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
      case "milestone":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const duplicateTemplate = (template: AlertTemplate) => {
    const duplicatedTemplate = {
      ...template,
      id: "",
      name: `${template.name} (Copy)`,
    }
    onEdit(duplicatedTemplate)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card key={template.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <Badge className={`mb-2 ${getTypeColor(template.type)}`}>
                  {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                </Badge>
                <CardTitle className="text-lg">{template.name}</CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(template)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => duplicateTemplate(template)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onTest(template)}>
                    <Play className="h-4 w-4 mr-2" />
                    Test
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleToggleEnabled(template.id)}
                    className="text-amber-600 dark:text-amber-400"
                  >
                    {enabledTemplates[template.id] ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Disable
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Enable
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(template.id)} className="text-red-600 dark:text-red-400">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-3 line-clamp-2">{template.message}</div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{template.animation}</span>
                <span>•</span>
                <span>{template.duration}s</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onTest(template)}>
                  <Play className="h-4 w-4" />
                </Button>
                <Switch
                  checked={enabledTemplates[template.id]}
                  onCheckedChange={() => handleToggleEnabled(template.id)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
