"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchBar } from "@/components/search-bar"
import { useSearch } from "@/hooks/use-search"
import { Clock, Users, FileText, Video, Music, ImageIcon, ExternalLink } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const { results, isLoading, error, totalResults, searchType, responseTime, search } = useSearch()
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  useEffect(() => {
    if (initialQuery) {
      search({ query: initialQuery })
    }
  }, [initialQuery, search])

  const handleSearch = (query: string, filters?: any) => {
    search({
      query,
      searchType: filters?.searchType || "hybrid",
      filters: {
        contentType: filters?.contentType ? [filters.contentType] : undefined,
      },
    })
  }

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case "user":
        return <Users className="h-4 w-4" />
      case "stream":
        return <Video className="h-4 w-4" />
      case "file":
        return <FileText className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const formatContentType = (contentType: string) => {
    return contentType.charAt(0).toUpperCase() + contentType.slice(1)
  }

  const highlightText = (text: string, query: string) => {
    if (!query) return text

    const regex = new RegExp(`(${query})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Search Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Search</h1>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
            </div>
          </div>

          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for users, streams, files, and content..."
            defaultQuery={initialQuery}
            showFilters={true}
          />
        </div>

        {/* Search Results */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Searching...</p>
            </div>
          </div>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && results.length === 0 && initialQuery && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No results found for "{initialQuery}"</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your search terms or filters</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && results.length > 0 && (
          <div className="space-y-4">
            {/* Search Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>
                  {totalResults} result{totalResults !== 1 ? "s" : ""} found
                </span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{responseTime}ms</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {searchType === "hybrid" ? "Smart Search" : searchType === "semantic" ? "AI Search" : "Exact Match"}
                </Badge>
              </div>
            </div>

            {/* Results */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
                <TabsTrigger value="users">
                  Users ({results.filter((r) => r.contentType === "user").length})
                </TabsTrigger>
                <TabsTrigger value="streams">
                  Streams ({results.filter((r) => r.contentType === "stream").length})
                </TabsTrigger>
                <TabsTrigger value="files">
                  Files ({results.filter((r) => r.contentType === "file").length})
                </TabsTrigger>
                <TabsTrigger value="content">
                  Content ({results.filter((r) => r.contentType === "content").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div
                  className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}
                >
                  {results.map((result) => (
                    <Card key={result.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getContentIcon(result.contentType)}
                            <Badge variant="secondary" className="text-xs">
                              {formatContentType(result.contentType)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Progress value={result.relevanceScore * 100} className="w-12 h-2" />
                            <span className="text-xs text-muted-foreground">
                              {Math.round(result.relevanceScore * 100)}%
                            </span>
                          </div>
                        </div>
                        <CardTitle className="text-lg">{highlightText(result.title, initialQuery)}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="line-clamp-3 mb-3">
                          {highlightText(result.content, initialQuery)}
                        </CardDescription>

                        {result.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {result.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {result.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{result.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                          {result.url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={result.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Filtered tabs */}
              {["users", "streams", "files", "content"].map((contentType) => (
                <TabsContent key={contentType} value={contentType} className="mt-4">
                  <div
                    className={
                      viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"
                    }
                  >
                    {results
                      .filter((result) => result.contentType === contentType)
                      .map((result) => (
                        <Card key={result.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                {getContentIcon(result.contentType)}
                                <Badge variant="secondary" className="text-xs">
                                  {formatContentType(result.contentType)}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                <Progress value={result.relevanceScore * 100} className="w-12 h-2" />
                                <span className="text-xs text-muted-foreground">
                                  {Math.round(result.relevanceScore * 100)}%
                                </span>
                              </div>
                            </div>
                            <CardTitle className="text-lg">{highlightText(result.title, initialQuery)}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="line-clamp-3 mb-3">
                              {highlightText(result.content, initialQuery)}
                            </CardDescription>

                            {result.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {result.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {result.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{result.tags.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                              {result.url && (
                                <Button variant="ghost" size="sm" asChild>
                                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
