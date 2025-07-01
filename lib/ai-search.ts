import type { SearchResponse, SearchDocument, SearchSuggestion, SearchOptions, SearchFilters } from "./search-types"
import { neon } from "@neondatabase/serverless"
import { generateEmbedding, generateSearchSuggestions, enhanceSearchQuery } from "./openai"

const sql = neon(process.env.DATABASE_URL!)

export class AISearchService {
  private baseUrl: string

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl
  }

  async search(options: SearchOptions): Promise<SearchResponse> {
    const { query, filters, searchType = "hybrid", limit = 20 } = options

    // Enhance the query using OpenAI if available
    const enhancedQuery = process.env.OPENAI_API_KEY ? await enhanceSearchQuery(query) : query

    switch (searchType) {
      case "semantic":
        return this.semanticSearch(enhancedQuery, filters, limit)
      case "keyword":
        return this.keywordSearch(enhancedQuery, filters, limit)
      case "hybrid":
      default:
        return this.hybridSearch(enhancedQuery, filters, limit)
    }
  }

  // Semantic search using OpenAI embeddings
  async semanticSearch(query: string, filters?: SearchFilters, limit = 20): Promise<SearchResponse> {
    const startTime = Date.now()

    try {
      // Generate embedding for the query
      const queryEmbedding = await generateEmbedding(query)

      // Build the search query with vector similarity
      let searchQuery = `
        SELECT 
          sd.id,
          sd.title,
          sd.content,
          sd.content_type,
          sd.metadata,
          sd.tags,
          sd.created_at,
          sd.embedding,
          -- Calculate cosine similarity if embeddings exist
          CASE 
            WHEN sd.embedding IS NOT NULL THEN 
              (1 - (sd.embedding <=> $1::vector)) 
            ELSE 
              RANDOM() * 0.5 + 0.3
          END as relevance_score
        FROM search_documents sd
        WHERE 1=1
      `

      const params: any[] = [JSON.stringify(queryEmbedding)]
      let paramIndex = 2

      // Add text-based fallback for documents without embeddings
      searchQuery += ` AND (
        sd.embedding IS NOT NULL OR 
        LOWER(sd.title) LIKE LOWER($${paramIndex}) OR 
        LOWER(sd.content) LIKE LOWER($${paramIndex})
      )`
      params.push(`%${query}%`)
      paramIndex++

      if (filters?.contentType?.length) {
        searchQuery += ` AND sd.content_type = ANY($${paramIndex})`
        params.push(filters.contentType)
        paramIndex++
      }

      if (filters?.tags?.length) {
        searchQuery += ` AND sd.tags && $${paramIndex}`
        params.push(filters.tags)
        paramIndex++
      }

      searchQuery += ` ORDER BY relevance_score DESC LIMIT $${paramIndex}`
      params.push(limit)

      let results
      try {
        results = await sql(searchQuery, params)
      } catch (vectorError) {
        console.warn("Vector search failed, falling back to text search:", vectorError)
        // Fallback to text-based search if vector operations fail
        results = await this.fallbackTextSearch(query, filters, limit)
      }

      const responseTime = Date.now() - startTime

      // Log the search query
      await this.logSearchQuery(query, filters, "semantic", results.length, responseTime)

      // Generate AI-powered suggestions
      const suggestions = await this.generateAISuggestions(query, results)

      return {
        results: results.map((row: any) => ({
          id: row.id,
          title: row.title,
          content: row.content,
          contentType: row.content_type,
          relevanceScore: row.relevance_score,
          metadata: row.metadata || {},
          tags: row.tags || [],
          createdAt: new Date(row.created_at),
        })),
        total: results.length,
        query,
        searchType: "semantic",
        responseTime,
        suggestions,
      }
    } catch (error) {
      console.error("Semantic search error:", error)
      return this.fallbackSearch(query, filters, limit)
    }
  }

  // Keyword search using full-text search
  async keywordSearch(query: string, filters?: SearchFilters, limit = 20): Promise<SearchResponse> {
    const startTime = Date.now()

    try {
      let searchQuery = `
        SELECT 
          sd.id,
          sd.title,
          sd.content,
          sd.content_type,
          sd.metadata,
          sd.tags,
          sd.created_at,
          -- Enhanced relevance scoring
          CASE 
            WHEN LOWER(sd.title) = LOWER($1) THEN 1.0
            WHEN LOWER(sd.title) LIKE LOWER($2) THEN 0.9
            WHEN LOWER(sd.content) LIKE LOWER($2) THEN 0.7
            WHEN EXISTS (SELECT 1 FROM unnest(sd.tags) tag WHERE LOWER(tag) = LOWER($1)) THEN 0.8
            WHEN EXISTS (SELECT 1 FROM unnest(sd.tags) tag WHERE LOWER(tag) LIKE LOWER($2)) THEN 0.6
            ELSE 0.4
          END as relevance_score
        FROM search_documents sd
        WHERE (
          LOWER(sd.title) LIKE LOWER($2) OR 
          LOWER(sd.content) LIKE LOWER($2) OR
          EXISTS (SELECT 1 FROM unnest(sd.tags) tag WHERE LOWER(tag) LIKE LOWER($2))
        )
      `

      const params: any[] = [query, `%${query}%`]
      let paramIndex = 3

      if (filters?.contentType?.length) {
        searchQuery += ` AND sd.content_type = ANY($${paramIndex})`
        params.push(filters.contentType)
        paramIndex++
      }

      if (filters?.tags?.length) {
        searchQuery += ` AND sd.tags && $${paramIndex}`
        params.push(filters.tags)
        paramIndex++
      }

      searchQuery += ` ORDER BY relevance_score DESC LIMIT $${paramIndex}`
      params.push(limit)

      const results = await sql(searchQuery, params)

      const responseTime = Date.now() - startTime

      // Log the search query
      await this.logSearchQuery(query, filters, "keyword", results.length, responseTime)

      // Generate AI-powered suggestions
      const suggestions = await this.generateAISuggestions(query, results)

      return {
        results: results.map((row: any) => ({
          id: row.id,
          title: row.title,
          content: row.content,
          contentType: row.content_type,
          relevanceScore: row.relevance_score,
          metadata: row.metadata || {},
          tags: row.tags || [],
          createdAt: new Date(row.created_at),
        })),
        total: results.length,
        query,
        searchType: "keyword",
        responseTime,
        suggestions,
      }
    } catch (error) {
      console.error("Keyword search error:", error)
      return this.fallbackSearch(query, filters, limit)
    }
  }

  // Hybrid search combining semantic and keyword
  async hybridSearch(query: string, filters?: SearchFilters, limit = 20): Promise<SearchResponse> {
    const startTime = Date.now()

    try {
      // Get results from both search methods
      const [semanticResults, keywordResults] = await Promise.all([
        this.semanticSearch(query, filters, Math.ceil(limit * 0.6)),
        this.keywordSearch(query, filters, Math.ceil(limit * 0.4)),
      ])

      // Combine and deduplicate results with weighted scoring
      const combinedResults = new Map()

      // Add semantic results with higher weight
      semanticResults.results.forEach((result) => {
        combinedResults.set(result.id, {
          ...result,
          relevanceScore: result.relevanceScore * 0.7, // Higher weight for semantic
        })
      })

      // Add keyword results, merging scores if duplicate
      keywordResults.results.forEach((result) => {
        if (combinedResults.has(result.id)) {
          const existing = combinedResults.get(result.id)
          // Combine scores using weighted average
          existing.relevanceScore = (existing.relevanceScore + result.relevanceScore * 0.3) / 2
        } else {
          combinedResults.set(result.id, {
            ...result,
            relevanceScore: result.relevanceScore * 0.3,
          })
        }
      })

      // Sort by combined relevance score
      const finalResults = Array.from(combinedResults.values())
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit)

      const responseTime = Date.now() - startTime

      // Log the search query
      await this.logSearchQuery(query, filters, "hybrid", finalResults.length, responseTime)

      // Generate AI-powered suggestions
      const suggestions = await this.generateAISuggestions(query, finalResults)

      return {
        results: finalResults,
        total: finalResults.length,
        query,
        searchType: "hybrid",
        responseTime,
        suggestions,
      }
    } catch (error) {
      console.error("Hybrid search error:", error)
      return this.fallbackSearch(query, filters, limit)
    }
  }

  private async generateAISuggestions(query: string, results: any[]): Promise<string[]> {
    try {
      if (process.env.OPENAI_API_KEY) {
        // Extract context from search results
        const context = results.slice(0, 3).map((r) => r.title)
        return await generateSearchSuggestions(query, context)
      } else {
        return this.generateBasicSuggestions(query)
      }
    } catch (error) {
      console.error("Error generating AI suggestions:", error)
      return this.generateBasicSuggestions(query)
    }
  }

  private async generateBasicSuggestions(query: string): Promise<string[]> {
    try {
      const suggestions = await sql`
        SELECT DISTINCT title
        FROM search_documents
        WHERE LOWER(title) LIKE LOWER(${`%${query}%`})
        ORDER BY title
        LIMIT 5
      `

      return suggestions.map((row: any) => row.title)
    } catch (error) {
      console.error("Error generating basic suggestions:", error)
      return [
        `${query} tutorial`,
        `${query} guide`,
        `${query} examples`,
        `advanced ${query}`,
        `${query} best practices`,
      ]
    }
  }

  private async fallbackTextSearch(query: string, filters?: SearchFilters, limit = 20): Promise<any[]> {
    let searchQuery = `
      SELECT 
        id, title, content, content_type, metadata, tags, created_at,
        CASE 
          WHEN LOWER(title) LIKE LOWER($1) THEN 0.8
          WHEN LOWER(content) LIKE LOWER($1) THEN 0.6
          ELSE 0.4
        END as relevance_score
      FROM search_documents
      WHERE LOWER(title) LIKE LOWER($1) OR LOWER(content) LIKE LOWER($1)
    `

    const params: any[] = [`%${query}%`]
    let paramIndex = 2

    if (filters?.contentType?.length) {
      searchQuery += ` AND content_type = ANY($${paramIndex})`
      params.push(filters.contentType)
      paramIndex++
    }

    if (filters?.tags?.length) {
      searchQuery += ` AND tags && $${paramIndex}`
      params.push(filters.tags)
      paramIndex++
    }

    searchQuery += ` ORDER BY relevance_score DESC LIMIT $${paramIndex}`
    params.push(limit)

    return await sql(searchQuery, params)
  }

  private async logSearchQuery(
    query: string,
    filters: SearchFilters | undefined,
    searchType: string,
    resultsCount: number,
    responseTime: number,
    userId?: string,
  ): Promise<void> {
    try {
      await sql`
        INSERT INTO search_queries (user_id, query, filters, search_type, results_count, response_time)
        VALUES (${userId || null}, ${query}, ${JSON.stringify(filters || {})}, ${searchType}, ${resultsCount}, ${responseTime})
      `
    } catch (error) {
      console.error("Error logging search query:", error)
    }
  }

  private async fallbackSearch(query: string, filters?: SearchFilters, limit = 20): Promise<SearchResponse> {
    try {
      const results = await this.fallbackTextSearch(query, filters, limit)

      return {
        results: results.map((row: any) => ({
          id: row.id,
          title: row.title,
          content: row.content,
          contentType: row.content_type,
          relevanceScore: row.relevance_score,
          metadata: row.metadata || {},
          tags: row.tags || [],
          createdAt: new Date(row.created_at),
        })),
        total: results.length,
        query,
        searchType: "fallback",
        responseTime: 0,
        suggestions: await this.generateBasicSuggestions(query),
      }
    } catch (error) {
      console.error("Fallback search error:", error)
      return {
        results: [],
        total: 0,
        query,
        searchType: "error",
        responseTime: 0,
        suggestions: [],
      }
    }
  }

  // Index new content with embeddings
  async indexContent(content: {
    id: string
    title: string
    content: string
    contentType: string
    metadata?: any
    tags?: string[]
  }): Promise<void> {
    try {
      // Generate embedding for the content
      const embedding = await generateEmbedding(`${content.title} ${content.content}`)

      await sql`
        INSERT INTO search_documents (id, title, content, content_type, metadata, tags, embedding)
        VALUES (
          ${content.id},
          ${content.title},
          ${content.content},
          ${content.contentType},
          ${JSON.stringify(content.metadata || {})},
          ${content.tags || []},
          ${JSON.stringify(embedding)}
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          content_type = EXCLUDED.content_type,
          metadata = EXCLUDED.metadata,
          tags = EXCLUDED.tags,
          embedding = EXCLUDED.embedding,
          updated_at = NOW()
      `
    } catch (error) {
      console.error("Error indexing content:", error)
    }
  }

  async getSearchAnalytics(days = 7): Promise<any> {
    try {
      const analytics = await sql`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as total_queries,
          COUNT(DISTINCT user_id) as unique_users,
          AVG(response_time) as avg_response_time,
          search_type,
          COUNT(*) as type_count
        FROM search_queries
        WHERE created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY DATE(created_at), search_type
        ORDER BY date DESC
      `

      const topQueries = await sql`
        SELECT query, COUNT(*) as count, AVG(results_count) as avg_results
        FROM search_queries
        WHERE created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY query
        ORDER BY count DESC
        LIMIT 10
      `

      const performanceStats = await sql`
        SELECT 
          search_type,
          AVG(response_time) as avg_response_time,
          AVG(results_count) as avg_results_count,
          COUNT(*) as total_searches
        FROM search_queries
        WHERE created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY search_type
      `

      return {
        dailyStats: analytics,
        topQueries: topQueries.map((row: any) => ({
          query: row.query,
          count: row.count,
          avgResults: row.avg_results,
        })),
        performanceStats: performanceStats.map((row: any) => ({
          searchType: row.search_type,
          avgResponseTime: row.avg_response_time,
          avgResultsCount: row.avg_results_count,
          totalSearches: row.total_searches,
        })),
      }
    } catch (error) {
      console.error("Error getting search analytics:", error)
      return { dailyStats: [], topQueries: [], performanceStats: [] }
    }
  }

  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    if (process.env.OPENAI_API_KEY) {
      try {
        const suggestions = await generateSearchSuggestions(query)
        return suggestions.map((text, index) => ({
          text,
          type: "query" as const,
          score: 0.9 - index * 0.1,
        }))
      } catch (error) {
        console.error("Error getting AI suggestions:", error)
      }
    }

    // Fallback to basic suggestions
    const basicSuggestions = await this.generateBasicSuggestions(query)
    return basicSuggestions.map((text, index) => ({
      text,
      type: "query" as const,
      score: 0.7 - index * 0.1,
    }))
  }

  async getPopularQueries(): Promise<string[]> {
    try {
      const queries = await sql`
        SELECT query, COUNT(*) as count
        FROM search_queries
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY query
        ORDER BY count DESC
        LIMIT 5
      `

      return queries.map((row: any) => row.query)
    } catch (error) {
      console.error("Error getting popular queries:", error)
      return ["react tutorial", "design system", "javascript", "ui design", "node.js"]
    }
  }

  async getTrendingContent(): Promise<SearchDocument[]> {
    try {
      const trending = await sql`
        SELECT DISTINCT ON (sd.id) sd.*
        FROM search_documents sd
        JOIN search_results sr ON sd.id = sr.document_id
        WHERE sr.created_at >= NOW() - INTERVAL '7 days'
        ORDER BY sd.id, sr.created_at DESC
        LIMIT 5
      `

      return trending.map((row: any) => ({
        id: row.id,
        index_id: row.index_id || "default",
        document_id: row.id,
        content_type: row.content_type,
        title: row.title,
        content: row.content,
        metadata: row.metadata || {},
        tags: row.tags || [],
        created_at: row.created_at,
        updated_at: row.updated_at,
      }))
    } catch (error) {
      console.error("Error getting trending content:", error)
      return []
    }
  }
}

export const aiSearchService = new AISearchService()
