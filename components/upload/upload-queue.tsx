"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, CheckCircle, AlertCircle, Clock, ArrowUpCircle } from "lucide-react"
import type { UploadProgress } from "@/types/upload"

interface UploadQueueProps {
  queue: UploadProgress[]
  onRemove: (fileId: string) => void
  onClearCompleted: () => void
}

export default function UploadQueue({ queue, onRemove, onClearCompleted }: UploadQueueProps) {
  const getStatusIcon = (status: UploadProgress["status"]) => {
    switch (status) {
      case "queued":
        return <Clock className="h-4 w-4 text-gray-500" />
      case "uploading":
        return <ArrowUpCircle className="h-4 w-4 text-blue-500 animate-pulse" />
      case "processing":
        return <ArrowUpCircle className="h-4 w-4 text-amber-500 animate-pulse" />
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusText = (status: UploadProgress["status"]) => {
    switch (status) {
      case "queued":
        return "Queued"
      case "uploading":
        return "Uploading"
      case "processing":
        return "Processing"
      case "complete":
        return "Complete"
      case "error":
        return "Error"
    }
  }

  const completedCount = queue.filter((item) => item.status === "complete").length

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          Upload Queue
          <span className="text-sm font-normal text-muted-foreground">
            {queue.length} file{queue.length !== 1 ? "s" : ""}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {queue.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p>No files in queue</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {queue.map((item) => (
              <div key={item.fileId} className="p-3 border-b last:border-b-0 flex items-start">
                <div className="flex-1 min-w-0 mr-2">
                  <div className="flex items-center mb-1">
                    {getStatusIcon(item.status)}
                    <span className="text-sm font-medium ml-2 truncate">{item.fileName}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{getStatusText(item.status)}</span>
                    <span className="text-xs font-medium">{Math.round(item.progress)}%</span>
                  </div>
                  <Progress value={item.progress} className="h-1" />
                  {item.error && <p className="text-xs text-red-500 mt-1">{item.error}</p>}
                </div>
                {item.status !== "complete" && (
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemove(item.fileId)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {completedCount > 0 && (
        <CardFooter className="pt-2">
          <Button variant="outline" size="sm" className="w-full" onClick={onClearCompleted}>
            Clear Completed ({completedCount})
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
