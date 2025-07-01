-- Add pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to search_documents table
ALTER TABLE search_documents 
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS search_documents_embedding_idx 
ON search_documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index for hybrid search
CREATE INDEX IF NOT EXISTS search_documents_content_gin_idx 
ON search_documents USING gin(to_tsvector('english', title || ' ' || content));

-- Add function to calculate cosine similarity
CREATE OR REPLACE FUNCTION cosine_similarity(a vector, b vector)
RETURNS float AS $$
BEGIN
    RETURN 1 - (a <=> b);
END;
$$ LANGUAGE plpgsql;

-- Update existing documents with sample embeddings (for testing)
-- In production, you would run a script to generate real embeddings
UPDATE search_documents 
SET embedding = (
    SELECT array_agg(random())::vector(1536)
    FROM generate_series(1, 1536)
)
WHERE embedding IS NULL;

-- Create function to update embeddings when content changes
CREATE OR REPLACE FUNCTION update_document_embedding()
RETURNS TRIGGER AS $$
BEGIN
    -- In a real implementation, this would call your embedding service
    -- For now, we'll just set a placeholder
    NEW.embedding = (
        SELECT array_agg(random())::vector(1536)
        FROM generate_series(1, 1536)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update embeddings
DROP TRIGGER IF EXISTS update_embedding_trigger ON search_documents;
CREATE TRIGGER update_embedding_trigger
    BEFORE INSERT OR UPDATE OF title, content ON search_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_document_embedding();
