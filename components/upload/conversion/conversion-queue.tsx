"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trash2, CheckCircle, AlertCircle, Clock, RotateCw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"

import type { ConversionJob } from "@/types/conversion"

interface ConversionQueueProps {
  jobs: ConversionJob[]
  onRemoveJob: (jobId: string) => void
  onClearCompleted: () => void
}

export default function ConversionQueue({ jobs, onRemoveJob, onClearCompleted }: ConversionQueueProps) {
  if (jobs.length === 0) {
    return (
      <Alert>
        <AlertDescription>No conversion jobs in the queue.</AlertDescription>
      </Alert>
    )
  }

  const activeJobs = jobs.filter((job) => job.status === "queued" || job.status === "converting")
  const completedJobs = jobs.filter((job) => job.status === "complete" || job.status === "failed")

  return (
    <div className="space-y-4">
      {activeJobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Active Conversions</h3>
            <Badge variant="outline">{activeJobs.length}</Badge>
          </div>

          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              {activeJobs.map((job) => (
                <div key={job.id} className="border rounded-md p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {job.status === "queued" ? (
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      ) : (
                        <RotateCw className="h-4 w-4 text-orange-500 mr-2 animate-spin" />
                      )}
                      <span className="text-sm font-medium truncate max-w-[200px]">{job.fileName}</span>
                    </div>
                    <Badge>
                      {job.sourceFormat} → {job.targetFormat.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{job.status === "queued" ? "Queued" : "Converting..."}</span>
                      <span>{Math.round(job.progress)}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveJob(job.id)}
                      className="h-8 px-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {completedJobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Completed Conversions</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{completedJobs.length}</Badge>
              <Button variant="outline" size="sm" onClick={onClearCompleted}>
                Clear All
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              {completedJobs.map((job) => (
                <div
                  key={job.id}
                  className={`border rounded-md p-3 space-y-2 ${
                    job.status === "failed" ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {job.status === "complete" ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className="text-sm font-medium truncate max-w-[200px]">{job.fileName}</span>
                    </div>
                    <Badge variant={job.status === "failed" ? "destructive" : "outline"}>
                      {job.status === "complete" ? "Completed" : "Failed"}
                    </Badge>
                  </div>

                  {job.status === "failed" && job.error && (
                    <div className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded">{job.error}</div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveJob(job.id)}
                      className="h-8 px-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
