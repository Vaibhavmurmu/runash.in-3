"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle, Clock, RotateCw, XCircle, FileIcon, FileVideo, FileAudio } from "lucide-react"
import { formatFileSize } from "@/utils/format-utils"

import type { MediaFile } from "@/types/upload"
import type { ConversionJob, ConversionSettings } from "@/types/conversion"
import {
  availableFormats,
  startConversion,
  createConversionJob,
  estimateOutputSize,
} from "@/services/conversion-service"

interface BatchProcessorProps {
  files: MediaFile[]
  targetFormat: string
  settings: ConversionSettings
  onComplete: (jobs: ConversionJob[], outputFiles: MediaFile[]) => void
  onCancel: () => void
}

export default function BatchProcessor({ files, targetFormat, settings, onComplete, onCancel }: BatchProcessorProps) {
  const [jobs, setJobs] = useState<ConversionJob[]>([])
  const [outputFiles, setOutputFiles] = useState<MediaFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentJobIndex, setCurrentJobIndex] = useState(0)
  const [batchProgress, setBatchProgress] = useState(0)
  const [concurrentLimit, setConcurrentLimit] = useState(2) // Process 2 files at a time by default

  // Initialize jobs
  useEffect(() => {
    const initialJobs = files.map((file) => createConversionJob(file, targetFormat, settings))
    setJobs(initialJobs)
  }, [files, targetFormat, settings])

  // Start batch processing
  const startBatchProcessing = () => {
    setIsProcessing(true)
    setCurrentJobIndex(0)
    setBatchProgress(0)
    setOutputFiles([])

    // Start processing the first batch of files
    processNextBatch(0)
  }

  // Process the next batch of files
  const processNextBatch = (startIndex: number) => {
    if (startIndex >= jobs.length) {
      // All jobs completed
      setIsProcessing(false)
      onComplete(jobs, outputFiles)
      return
    }

    // Get the next batch of jobs to process
    const endIndex = Math.min(startIndex + concurrentLimit, jobs.length)
    const currentBatch = jobs.slice(startIndex, endIndex)

    // Start conversion for each job in the batch
    currentBatch.forEach((job, index) => {
      const jobIndex = startIndex + index

      // Update job status to queued
      updateJobStatus(jobIndex, "queued", 0)

      // Start conversion
      startConversion(
        job,
        (progress) => {
          // Update job progress
          updateJobStatus(jobIndex, "converting", progress)
          updateBatchProgress()
        },
        (outputFileId) => {
          // Mark job as complete
          updateJobStatus(jobIndex, "complete", 100, outputFileId)
          updateBatchProgress()

          // Create output file
          const sourceFile = files.find((f) => f.id === job.fileId)
          if (sourceFile) {
            const format = availableFormats.find((f) => f.id === targetFormat)
            if (format) {
              const outputFileName = sourceFile.name.replace(/\.[^/.]+$/, "") + format.extension

              // Create a new media file for the converted output
              const outputFile: MediaFile = {
                id: outputFileId,
                name: outputFileName,
                type: format.category as any,
                size: estimateOutputSize(sourceFile.size, sourceFile.type, targetFormat, settings),
                url: sourceFile.url, // In a real app, this would be a new URL
                thumbnailUrl: sourceFile.thumbnailUrl,
                duration: sourceFile.duration,
                width: settings.resolution?.width || sourceFile.width,
                height: settings.resolution?.height || sourceFile.height,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tags: [...(sourceFile.tags || []), "converted"],
                description: sourceFile.description,
                isPublic: sourceFile.isPublic,
              }

              setOutputFiles((prev) => [...prev, outputFile])
            }
          }

          // Check if all jobs in the current batch are complete
          const allBatchComplete = currentBatch.every((_, i) => {
            const job = jobs[startIndex + i]
            return job.status === "complete" || job.status === "failed"
          })

          if (allBatchComplete) {
            // Process the next batch
            processNextBatch(endIndex)
          }
        },
        (error) => {
          // Mark job as failed
          updateJobStatus(jobIndex, "failed", 0, undefined, error)
          updateBatchProgress()

          // Check if all jobs in the current batch are complete
          const allBatchComplete = currentBatch.every((_, i) => {
            const job = jobs[startIndex + i]
            return job.status === "complete" || job.status === "failed"
          })

          if (allBatchComplete) {
            // Process the next batch
            processNextBatch(endIndex)
          }
        },
      )
    })
  }

  // Update job status
  const updateJobStatus = (
    index: number,
    status: "queued" | "converting" | "complete" | "failed",
    progress: number,
    outputFileId?: string,
    error?: string,
  ) => {
    setJobs((prev) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        status,
        progress,
        ...(outputFileId && { outputFileId }),
        ...(error && { error }),
        ...(status === "complete" && { endTime: new Date().toISOString() }),
      }
      return updated
    })
  }

  // Update overall batch progress
  const updateBatchProgress = () => {
    setJobs((prev) => {
      const totalProgress = prev.reduce((sum, job) => sum + job.progress, 0)
      const overallProgress = Math.floor(totalProgress / prev.length)
      setBatchProgress(overallProgress)
      return prev
    })
  }

  // Cancel batch processing
  const cancelBatchProcessing = () => {
    setIsProcessing(false)
    onCancel()
  }

  // Get batch statistics
  const completedCount = jobs.filter((job) => job.status === "complete").length
  const failedCount = jobs.filter((job) => job.status === "failed").length
  const pendingCount = jobs.filter((job) => job.status === "queued").length
  const processingCount = jobs.filter((job) => job.status === "converting").length

  // Get format name
  const formatName = availableFormats.find((f) => f.id === targetFormat)?.name || targetFormat

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Batch Conversion</CardTitle>
        <CardDescription>
          Converting {files.length} file{files.length !== 1 ? "s" : ""} to {formatName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{batchProgress}%</span>
          </div>
          <Progress value={batchProgress} className="h-2" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-3 w-3 mr-1" /> {completedCount} Complete
          </Badge>
          {processingCount > 0 && (
            <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/20">
              <RotateCw className="h-3 w-3 mr-1 animate-spin" /> {processingCount} Processing
            </Badge>
          )}
          {pendingCount > 0 && (
            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/20">
              <Clock className="h-3 w-3 mr-1" /> {pendingCount} Pending
            </Badge>
          )}
          {failedCount > 0 && (
            <Badge variant="outline" className="bg-red-100 dark:bg-red-900/20">
              <XCircle className="h-3 w-3 mr-1" /> {failedCount} Failed
            </Badge>
          )}
        </div>

        <Separator />

        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {jobs.map((job, index) => {
              const file = files.find((f) => f.id === job.fileId)
              if (!file) return null

              return (
                <div
                  key={job.id}
                  className={`p-3 rounded-md border ${
                    job.status === "complete"
                      ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                      : job.status === "failed"
                        ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
                        : job.status === "converting"
                          ? "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800"
                          : "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {file.type === "video" ? (
                      <FileVideo className="h-8 w-8 text-orange-500" />
                    ) : file.type === "audio" ? (
                      <FileAudio className="h-8 w-8 text-orange-500" />
                    ) : (
                      <FileIcon className="h-8 w-8 text-orange-500" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <div className="flex items-center">
                          {job.status === "complete" && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {job.status === "failed" && <AlertCircle className="h-4 w-4 text-red-500" />}
                          {job.status === "converting" && <RotateCw className="h-4 w-4 text-orange-500 animate-spin" />}
                          {job.status === "queued" && <Clock className="h-4 w-4 text-blue-500" />}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} •{" "}
                          {job.status === "complete"
                            ? "Completed"
                            : job.status === "failed"
                              ? "Failed"
                              : job.status === "converting"
                                ? "Converting"
                                : "Queued"}
                        </p>
                        <p className="text-xs font-medium">{job.progress}%</p>
                      </div>
                      <Progress value={job.progress} className="h-1 mt-1" />

                      {job.error && <p className="text-xs text-red-500 mt-1">{job.error}</p>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {isProcessing ? (
            <Button variant="outline" onClick={cancelBatchProcessing}>
              Cancel
            </Button>
          ) : (
            <Button variant="outline" onClick={onCancel}>
              Back
            </Button>
          )}
        </div>

        {!isProcessing && (
          <Button
            onClick={startBatchProcessing}
            className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Start Batch Conversion
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
