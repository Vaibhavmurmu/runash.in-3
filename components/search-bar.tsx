"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, Filter, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  onSearch: (query: string, filters?: any) => void
  placeholder?: string
  className?: string
  showFilters?: boolean
  defaultQuery?: string
}

interface SearchSuggestion {
  text: string
  type: "query" | "content"
  score: number
}

export function SearchBar({
  onSearch,
  placeholder = "Search...",
  className,
  showFilters = true,
  defaultQuery = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultQuery)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<{
    contentType?: string
    searchType?: string
  }>({})

  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Fetch suggestions when query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      fetchSuggestions(debouncedQuery)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [debouncedQuery])

  // Handle clicks outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchSuggestions = async (searchQuery: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (data.suggestions) {
        setSuggestions(data.suggestions)
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query
    if (finalQuery.trim()) {
      onSearch(finalQuery, selectedFilters)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    handleSearch(suggestion.text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const clearQuery = () => {
    setQuery("")
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const removeFilter = (filterType: string) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev }
      delete updated[filterType as keyof typeof updated]
      return updated
    })
  }

  const contentTypes = [
    { value: "user", label: "Users" },
    { value: "stream", label: "Streams" },
    { value: "file", label: "Files" },
    { value: "content", label: "Content" },
  ]

  const searchTypes = [
    { value: "hybrid", label: "Smart Search" },
    { value: "semantic", label: "AI Search" },
    { value: "keyword", label: "Exact Match" },
  ]

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className="pl-10 pr-20"
        />

        {/* Loading indicator */}
        {isLoading && (
          <Loader2 className="absolute right-12 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}

        {/* Clear button */}
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearQuery}
            className="absolute right-8 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}

        {/* Filters dropdown */}
        {showFilters && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0">
                <Filter className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Content Type</DropdownMenuLabel>
              {contentTypes.map((type) => (
                <DropdownMenuItem
                  key={type.value}
                  onClick={() =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      contentType: type.value,
                    }))
                  }
                >
                  {type.label}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Search Type</DropdownMenuLabel>
              {searchTypes.map((type) => (
                <DropdownMenuItem
                  key={type.value}
                  onClick={() =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      searchType: type.value,
                    }))
                  }
                >
                  {type.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Active Filters */}
      {(selectedFilters.contentType || selectedFilters.searchType) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedFilters.contentType && (
            <Badge variant="secondary" className="text-xs">
              {contentTypes.find((t) => t.value === selectedFilters.contentType)?.label}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter("contentType")}
                className="ml-1 h-3 w-3 p-0"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
          {selectedFilters.searchType && (
            <Badge variant="secondary" className="text-xs">
              {searchTypes.find((t) => t.value === selectedFilters.searchType)?.label}
              <Button variant="ghost" size="sm" onClick={() => removeFilter("searchType")} className="ml-1 h-3 w-3 p-0">
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              <Search className="h-3 w-3 text-muted-foreground" />
              <span className="flex-1 text-left">{suggestion.text}</span>
              <Badge variant="outline" className="text-xs">
                {suggestion.type}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
