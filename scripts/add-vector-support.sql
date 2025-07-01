-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add embedding column to search_documents table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'search_documents' 
        AND column_name = 'embedding'
    ) THEN
        ALTER TABLE search_documents ADD COLUMN embedding vector(1536);
    END IF;
END $$;

-- Add search_vector column for full-text search
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'search_documents' 
        AND column_name = 'search_vector'
    ) THEN
        ALTER TABLE search_documents ADD COLUMN search_vector tsvector;
    END IF;
END $$;

-- Create indexes for vector similarity search
CREATE INDEX IF NOT EXISTS search_documents_embedding_idx 
ON search_documents USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Create indexes for full-text search
CREATE INDEX IF NOT EXISTS search_documents_search_vector_idx 
ON search_documents USING gin(search_vector);

-- Create trigram indexes for fuzzy matching
CREATE INDEX IF NOT EXISTS search_documents_title_trgm_idx 
ON search_documents USING gin(title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS search_documents_content_trgm_idx 
ON search_documents USING gin(content gin_trgm_ops);

-- Function to update search_vector automatically
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        COALESCE(NEW.title, '') || ' ' || 
        COALESCE(NEW.content, '') || ' ' ||
        COALESCE(array_to_string(NEW.tags, ' '), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update search_vector
DROP TRIGGER IF EXISTS search_documents_search_vector_trigger ON search_documents;
CREATE TRIGGER search_documents_search_vector_trigger
    BEFORE INSERT OR UPDATE ON search_documents
    FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- Update existing rows to populate search_vector
UPDATE search_documents 
SET search_vector = to_tsvector('english', 
    COALESCE(title, '') || ' ' || 
    COALESCE(content, '') || ' ' ||
    COALESCE(array_to_string(tags, ' '), '')
)
WHERE search_vector IS NULL;

-- Create function for cosine similarity search
CREATE OR REPLACE FUNCTION cosine_similarity(a vector, b vector)
RETURNS float AS $$
BEGIN
    RETURN 1 - (a <=> b);
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;

-- Create function for hybrid search scoring
CREATE OR REPLACE FUNCTION hybrid_search_score(
    embedding_similarity float,
    text_rank float,
    semantic_weight float DEFAULT 0.7
)
RETURNS float AS $$
BEGIN
    RETURN (embedding_similarity * semantic_weight) + 
           (text_rank * (1 - semantic_weight));
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON search_documents TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON search_queries TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON search_results TO PUBLIC;

-- Create view for search analytics
CREATE OR REPLACE VIEW search_analytics AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_queries,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(response_time) as avg_response_time,
    search_type,
    COUNT(CASE WHEN results_count > 0 THEN 1 END) as successful_queries,
    COUNT(CASE WHEN results_count = 0 THEN 1 END) as empty_queries
FROM search_queries
GROUP BY DATE(created_at), search_type
ORDER BY date DESC, search_type;

-- Create view for trending searches
CREATE OR REPLACE VIEW trending_searches AS
SELECT 
    query,
    COUNT(*) as search_count,
    AVG(results_count) as avg_results,
    MAX(created_at) as last_searched,
    COUNT(DISTINCT user_id) as unique_users
FROM search_queries
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY query
HAVING COUNT(*) > 1
ORDER BY search_count DESC, last_searched DESC
LIMIT 20;

-- Insert sample configuration data
INSERT INTO search_config (key, value, description) VALUES
('embedding_model', 'text-embedding-3-small', 'OpenAI embedding model to use')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

INSERT INTO search_config (key, value, description) VALUES
('max_results', '100', 'Maximum number of search results to return')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

INSERT INTO search_config (key, value, description) VALUES
('similarity_threshold', '0.7', 'Minimum similarity score for semantic search')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- Create search configuration table if it doesn't exist
CREATE TABLE IF NOT EXISTS search_config (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMIT;
