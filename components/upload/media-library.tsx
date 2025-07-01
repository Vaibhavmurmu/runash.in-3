"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FolderPlus,
  Search,
  Grid3X3,
  List,
  MoreVertical,
  Folder,
  ArrowLeft,
  FileVideo,
  FileImage,
  FileAudio,
  File,
  Edit,
  Trash2,
  Download,
  Eye,
  EyeOff,
  Tag,
} from "lucide-react"
import Image from "next/image"
import type { MediaFile, MediaFolder } from "@/types/upload"

interface MediaLibraryProps {
  files: MediaFile[]
  folders: MediaFolder[]
  onDeleteFile: (fileId: string) => void
  onCreateFolder: (name: string, parentId?: string) => void
  onDeleteFolder: (folderId: string) => void
}

export default function MediaLibrary({
  files,
  folders,
  onDeleteFile,
  onCreateFolder,
  onDeleteFolder,
}: MediaLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("date-desc")
  const [filterType, setFilterType] = useState<string>("all")
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [isFileDetailsOpen, setIsFileDetailsOpen] = useState(false)

  // Get current folder name
  const currentFolderName = currentFolder
    ? folders.find((f) => f.id === currentFolder)?.name || "Unknown Folder"
    : "All Files"

  // Filter files and folders based on current folder and search query
  const filteredFolders = folders.filter(
    (folder) => folder.parentId === currentFolder && folder.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredFiles = files.filter((file) => {
    const matchesFolder = file.folderId === currentFolder
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || file.type === filterType
    return matchesFolder && matchesSearch && matchesType
  })

  // Sort files
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "date-asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "date-desc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "size-asc":
        return a.size - b.size
      case "size-desc":
        return b.size - a.size
      default:
        return 0
    }
  })

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), currentFolder)
      setNewFolderName("")
      setIsCreateFolderOpen(false)
    }
  }

  const handleNavigateToFolder = (folderId: string) => {
    setCurrentFolder(folderId)
  }

  const handleNavigateUp = () => {
    if (currentFolder) {
      const parentFolder = folders.find((f) => f.id === currentFolder)?.parentId
      setCurrentFolder(parentFolder || null)
    }
  }

  const handleViewFile = (file: MediaFile) => {
    setSelectedFile(file)
    setIsFileDetailsOpen(true)
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getFileIcon = (fileType: string, size = 5) => {
    switch (fileType) {
      case "video":
        return <FileVideo className={`h-${size} w-${size} text-purple-500`} />
      case "image":
        return <FileImage className={`h-${size} w-${size} text-blue-500`} />
      case "audio":
        return <FileAudio className={`h-${size} w-${size} text-green-500`} />
      default:
        return <File className={`h-${size} w-${size} text-gray-500`} />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center space-x-2">
          {currentFolder && (
            <Button variant="ghost" size="icon" onClick={handleNavigateUp}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-xl font-semibold">{currentFolderName}</h2>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="File Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="size-desc">Size (Largest)</SelectItem>
              <SelectItem value="size-asc">Size (Smallest)</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "subtle" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-none rounded-l-md"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "subtle" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-none rounded-r-md"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={() => setIsCreateFolderOpen(true)}
            className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </div>
      </div>

      {filteredFolders.length === 0 && sortedFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Folder className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-1">No files or folders found</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {searchQuery
              ? "No items match your search criteria. Try different keywords."
              : "Upload files or create a new folder to get started."}
          </p>
        </div>
      ) : (
        <>
          {/* Folders */}
          {filteredFolders.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Folders</h3>
              <div
                className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4" : "space-y-2"}
              >
                {filteredFolders.map((folder) => (
                  <div
                    key={folder.id}
                    className={
                      viewMode === "grid"
                        ? "cursor-pointer group"
                        : "flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    }
                    onClick={() => handleNavigateToFolder(folder.id)}
                  >
                    {viewMode === "grid" ? (
                      <div className="flex flex-col items-center p-4 rounded-lg border group-hover:bg-gray-50 dark:group-hover:bg-gray-800 text-center">
                        <Folder className="h-12 w-12 text-orange-500 mb-2" />
                        <p className="text-sm font-medium truncate w-full">{folder.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {folder.fileCount} file{folder.fileCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center">
                          <Folder className="h-5 w-5 text-orange-500 mr-3" />
                          <div>
                            <p className="text-sm font-medium">{folder.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {folder.fileCount} file{folder.fileCount !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{formatDate(folder.createdAt)}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {sortedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Files</h3>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {sortedFiles.map((file) => (
                    <Card key={file.id} className="overflow-hidden group cursor-pointer">
                      <CardContent className="p-0">
                        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {file.type === "image" ? (
                            <div className="w-full h-full">
                              <Image
                                src={file.url || "/placeholder.svg"}
                                alt={file.name}
                                fill
                                style={{ objectFit: "cover" }}
                                className="group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : file.type === "video" && file.thumbnailUrl ? (
                            <div className="w-full h-full">
                              <Image
                                src={file.thumbnailUrl || "/placeholder.svg"}
                                alt={file.name}
                                fill
                                style={{ objectFit: "cover" }}
                                className="group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-12 w-12 rounded-full bg-black/50 flex items-center justify-center">
                                  <FileVideo className="h-6 w-6 text-white" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center p-4">
                              {getFileIcon(file.type, 8)}
                              <p className="text-xs text-muted-foreground mt-2">{file.type.toUpperCase()}</p>
                            </div>
                          )}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className="h-8 w-8 bg-black/50 text-white hover:bg-black/70"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewFile(file)
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onDeleteFile(file.id)
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                            <p className="text-xs text-muted-foreground">
                              {file.isPublic ? (
                                <Eye className="h-3 w-3 inline-block ml-1" />
                              ) : (
                                <EyeOff className="h-3 w-3 inline-block ml-1" />
                              )}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => handleViewFile(file)}
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        {getFileIcon(file.type)}
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <div className="flex items-center mt-1">
                            <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                            {file.tags.length > 0 && (
                              <div className="flex items-center ml-2">
                                <Tag className="h-3 w-3 text-muted-foreground mr-1" />
                                <p className="text-xs text-muted-foreground">
                                  {file.tags.slice(0, 2).join(", ")}
                                  {file.tags.length > 2 && "..."}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="text-xs text-muted-foreground mr-4">{formatDate(file.createdAt)}</p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewFile(file)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeleteFile(file.id)
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>Enter a name for your new folder.</DialogDescription>
          </DialogHeader>
          <Input placeholder="Folder name" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Details Dialog */}
      {selectedFile && (
        <Dialog open={isFileDetailsOpen} onOpenChange={setIsFileDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedFile.name}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center p-4">
                {selectedFile.type === "image" ? (
                  <div className="relative w-full aspect-video">
                    <Image
                      src={selectedFile.url || "/placeholder.svg"}
                      alt={selectedFile.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                ) : selectedFile.type === "video" && selectedFile.thumbnailUrl ? (
                  <div className="relative w-full aspect-video">
                    <Image
                      src={selectedFile.thumbnailUrl || "/placeholder.svg"}
                      alt={selectedFile.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-black/50 flex items-center justify-center">
                        <FileVideo className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8">
                    {getFileIcon(selectedFile.type, 16)}
                    <p className="text-lg font-medium mt-4">{selectedFile.type.toUpperCase()}</p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">File Details</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm">Type:</div>
                    <div className="text-sm font-medium">{selectedFile.type.toUpperCase()}</div>

                    <div className="text-sm">Size:</div>
                    <div className="text-sm font-medium">{formatBytes(selectedFile.size)}</div>

                    <div className="text-sm">Created:</div>
                    <div className="text-sm font-medium">{formatDate(selectedFile.createdAt)}</div>

                    <div className="text-sm">Modified:</div>
                    <div className="text-sm font-medium">{formatDate(selectedFile.updatedAt)}</div>

                    <div className="text-sm">Visibility:</div>
                    <div className="text-sm font-medium flex items-center">
                      {selectedFile.isPublic ? (
                        <>
                          <Eye className="h-4 w-4 mr-1 text-green-500" />
                          Public
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4 mr-1 text-amber-500" />
                          Private
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {selectedFile.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Tags</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedFile.tags.map((tag, index) => (
                        <div key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFile.description && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                    <p className="text-sm">{selectedFile.description}</p>
                  </div>
                )}

                <div className="pt-4 flex flex-wrap gap-2">
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      onDeleteFile(selectedFile.id)
                      setIsFileDetailsOpen(false)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
