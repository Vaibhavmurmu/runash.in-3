"use client"

import { useState } from "react"
import { FileIcon, FileVideo, FileAudio, Filter, ChevronDown } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { formatFileSize } from "@/utils/format-utils"

import type { MediaFile } from "@/types/upload"

interface FileSelectorProps {
  files: MediaFile[]
  selectedFiles: MediaFile[]
  onSelectFiles: (files: MediaFile[]) => void
}

export default function FileSelector({ files, selectedFiles, onSelectFiles }: FileSelectorProps) {
  const [filterType, setFilterType] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"name" | "size" | "date">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Filter files by type
  const filteredFiles = filterType ? files.filter((file) => file.type === filterType) : files

  // Sort files
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortBy === "size") {
      return sortOrder === "asc" ? a.size - b.size : b.size - a.size
    } else {
      // date
      return sortOrder === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  // Check if all files are selected
  const allSelected = filteredFiles.length > 0 && filteredFiles.every((file) => selectedFiles.includes(file))

  // Check if some files are selected
  const someSelected = selectedFiles.length > 0 && !allSelected

  // Handle select all
  const handleSelectAll = () => {
    if (allSelected) {
      onSelectFiles([])
    } else {
      // Only select files of the same type to ensure compatibility
      if (filteredFiles.length > 0) {
        const firstType = filteredFiles[0].type
        const sameTypeFiles = filteredFiles.filter((file) => file.type === firstType)
        onSelectFiles(sameTypeFiles)
      } else {
        onSelectFiles(filteredFiles)
      }
    }
  }

  // Handle select single file
  const handleSelectFile = (file: MediaFile) => {
    if (selectedFiles.includes(file)) {
      onSelectFiles(selectedFiles.filter((f) => f.id !== file.id))
    } else {
      // If this is the first file being selected, or if it's the same type as already selected files
      if (selectedFiles.length === 0 || selectedFiles[0].type === file.type) {
        onSelectFiles([...selectedFiles, file])
      } else {
        // Replace selection with this file if it's a different type
        onSelectFiles([file])
      }
    }
  }

  // Get file counts by type
  const videosCount = files.filter((file) => file.type === "video").length
  const audiosCount = files.filter((file) => file.type === "audio").length

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={!filterType ? "bg-orange-100 dark:bg-orange-900/20" : ""}
            onClick={() => setFilterType(null)}
          >
            All ({files.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={filterType === "video" ? "bg-orange-100 dark:bg-orange-900/20" : ""}
            onClick={() => setFilterType("video")}
          >
            Videos ({videosCount})
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={filterType === "audio" ? "bg-orange-100 dark:bg-orange-900/20" : ""}
            onClick={() => setFilterType("audio")}
          >
            Audio ({audiosCount})
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Sort</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem checked={sortBy === "date"} onCheckedChange={() => setSortBy("date")}>
                Date
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={sortBy === "name"} onCheckedChange={() => setSortBy("name")}>
                Name
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={sortBy === "size"} onCheckedChange={() => setSortBy("size")}>
                Size
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortOrder === "asc"}
                onCheckedChange={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                Ascending
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <Checkbox
              id="select-all"
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm cursor-pointer">
              {allSelected ? "Deselect All" : "Select All"}
            </label>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/20">
            {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""} selected
          </Badge>
          <span className="text-muted-foreground">{selectedFiles[0].type === "video" ? "Video" : "Audio"} files</span>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-1 divide-y">
              {sortedFiles.length > 0 ? (
                sortedFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center gap-3 p-3 hover:bg-muted/50 ${
                      selectedFiles.includes(file) ? "bg-orange-50 dark:bg-orange-900/10" : ""
                    }`}
                  >
                    <Checkbox
                      checked={selectedFiles.includes(file)}
                      onCheckedChange={() => handleSelectFile(file)}
                      id={`file-${file.id}`}
                      disabled={selectedFiles.length > 0 && selectedFiles[0].type !== file.type}
                    />
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                      {file.type === "video" ? (
                        <FileVideo className="h-8 w-8 text-orange-500" />
                      ) : file.type === "audio" ? (
                        <FileAudio className="h-8 w-8 text-orange-500" />
                      ) : (
                        <FileIcon className="h-8 w-8 text-orange-500" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">No files found</div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
