"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HardDrive, AlertTriangle, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { StorageUsage } from "@/types/recording"

interface StorageUsageProps {
  usage: StorageUsage
}

export default function StorageUsageComponent({ usage }: StorageUsageProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const usagePercentage = (usage.used / usage.total) * 100
  const isLow = usagePercentage > 80

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <HardDrive className="h-5 w-5 mr-2" />
          Storage Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>
              {formatBytes(usage.used)} of {formatBytes(usage.total)} used
            </span>
            <span>{Math.round(usagePercentage)}%</span>
          </div>
          <Progress
            value={usagePercentage}
            className={`h-2 ${isLow ? "bg-red-100 dark:bg-red-900/20" : "bg-gray-100 dark:bg-gray-800"}`}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span>Total recordings</span>
          <span>{usage.recordings}</span>
        </div>

        {usage.oldestRecordingDate && (
          <div className="flex items-center justify-between text-sm">
            <span>Oldest recording</span>
            <span>
              {new Date(usage.oldestRecordingDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        )}

        {isLow && (
          <div className="flex items-center text-amber-600 text-sm bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
            <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Storage space is running low. Consider upgrading your plan or deleting old recordings.</span>
          </div>
        )}

        <TooltipProvider>
          <div className="flex items-center text-sm text-gray-500">
            <Tooltip>
              <TooltipTrigger className="flex items-center">
                <Info className="h-4 w-4 mr-1" />
                <span>Storage estimate</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>1 hour of recording at 1080p uses approximately 2GB of storage</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
