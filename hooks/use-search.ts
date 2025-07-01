"use client"

import { useState, useCallback } from "react"
import type { SearchResult, SearchOptions } from "@/lib/search-types"

interface UseSearchReturn {
  results: SearchResult[]
  isLoading: boolean
  error: string | null
  totalResults: number
  searchType: string
  responseTime: number
  suggestions: string[]
  search: (options: SearchOptions) => Promise<void>
  clearResults: () => void
}

export function useSearch(): UseSearchReturn {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)
  const [searchType, setSearchType] = useState("hybrid")
  const [responseTime, setResponseTime] = useState(0)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const search = useCallback(async (options: SearchOptions) => {
    if (!options.query.trim()) {
      setResults([])
      setTotalResults(0)
      return
    }

    setIsLoading(true)
    setError(null)

    const startTime = Date.now()

    try {
      const searchParams = new URLSearchParams({
        q: options.query,
        type: options.searchType || "hybrid",
        limit: (options.limit || 20).toString(),
        offset: (options.offset || 0).toString(),
      })

      if (options.filters?.contentType?.length) {
        searchParams.set("contentType", options.filters.contentType.join(","))
      }

      if (options.filters?.tags?.length) {
        searchParams.set("tags", options.filters.tags.join(","))
      }

      const response = await fetch(`/api/search?${searchParams}`)

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
      }

      const data = await response.json()

      setResults(data.results || [])
      setTotalResults(data.total || 0)
      setSearchType(data.searchType || "hybrid")
      setSuggestions(data.suggestions || [])
      setResponseTime(Date.now() - startTime)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
      setResults([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
    setTotalResults(0)
    setError(null)
    setSuggestions([])
    setResponseTime(0)
  }, [])

  return {
    results,
    isLoading,
    error,
    totalResults,
    searchType,
    responseTime,
    suggestions,
    search,
    clearResults,
  }
}
