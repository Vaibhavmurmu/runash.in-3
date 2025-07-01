"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Trash2, Edit, AlertCircle } from "lucide-react"

interface PlatformConnectionProps {
  id: string
  platform: string
  name: string
  icon: React.ReactNode
  isActive: boolean
  isConnected: boolean
  onToggle: (id: string, active: boolean) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function PlatformConnection({
  id,
  platform,
  name,
  icon,
  isActive,
  isConnected,
  onToggle,
  onEdit,
  onDelete,
}: PlatformConnectionProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    if (isDeleting) {
      onDelete(id)
    } else {
      setIsDeleting(true)
      setTimeout(() => {
        setIsDeleting(false)
      }, 3000)
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
          <div>
            <h4 className="font-medium">{name}</h4>
            <p className="text-xs text-gray-500">{platform}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
            >
              Connected
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
            >
              Disconnected
            </Badge>
          )}
        </div>
      </div>

      {!isConnected && (
        <Alert className="mt-3 bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/50">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>Connection issue detected. Please check your stream key.</AlertDescription>
        </Alert>
      )}

      <div className="mt-4 pt-3 border-t flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id={`platform-${id}`}
            checked={isActive}
            onCheckedChange={(checked) => onToggle(id, checked)}
            disabled={!isConnected}
          />
          <label htmlFor={`platform-${id}`} className="text-sm cursor-pointer">
            {isActive ? "Active" : "Inactive"}
          </label>
        </div>

        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant={isDeleting ? "destructive" : "ghost"} size="sm" onClick={handleDelete}>
            {isDeleting ? "Confirm" : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
