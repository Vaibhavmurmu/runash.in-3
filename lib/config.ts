// Configuration for OpenAI and search features
export const searchConfig = {
  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    embeddingModel: "text-embedding-3-small",
    chatModel: "gpt-3.5-turbo",
    maxTokens: 150,
    temperature: 0.7,
  },

  // Search Configuration
  search: {
    defaultLimit: 20,
    maxLimit: 100,
    semanticWeight: 0.7,
    keywordWeight: 0.3,
    minQueryLength: 2,
    suggestionCount: 5,
  },

  // Vector Database Configuration
  vector: {
    dimensions: 1536, // text-embedding-3-small dimensions
    similarityThreshold: 0.7,
    indexLists: 100, // for ivfflat index
  },

  // Feature Flags
  features: {
    enableSemanticSearch: !!process.env.OPENAI_API_KEY,
    enableAISuggestions: !!process.env.OPENAI_API_KEY,
    enableQueryEnhancement: !!process.env.OPENAI_API_KEY,
    enableVectorSearch: true, // Enable if pgvector is available
  },
}

// Validate configuration
export function validateSearchConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (searchConfig.features.enableSemanticSearch && !searchConfig.openai.apiKey) {
    errors.push("OPENAI_API_KEY is required for semantic search")
  }

  if (!process.env.DATABASE_URL) {
    errors.push("DATABASE_URL is required")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Get configuration status for admin dashboard
export function getConfigStatus() {
  const config = validateSearchConfig()

  return {
    openaiConfigured: !!searchConfig.openai.apiKey,
    databaseConfigured: !!process.env.DATABASE_URL,
    vectorSearchEnabled: searchConfig.features.enableVectorSearch,
    semanticSearchEnabled: searchConfig.features.enableSemanticSearch,
    aiSuggestionsEnabled: searchConfig.features.enableAISuggestions,
    configValid: config.valid,
    errors: config.errors,
  }
}
