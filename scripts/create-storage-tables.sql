-- Create storage-related tables
CREATE TABLE IF NOT EXISTS storage_providers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL, -- 's3', 'gcs', 'azure', 'cloudflare'
  config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS storage_buckets (
  id SERIAL PRIMARY KEY,
  provider_id INTEGER REFERENCES storage_providers(id),
  name VARCHAR(100) NOT NULL,
  region VARCHAR(50),
  purpose VARCHAR(50) NOT NULL, -- 'avatars', 'videos', 'thumbnails', 'documents'
  cdn_url VARCHAR(255),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stored_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(50) NOT NULL,
  bucket_id INTEGER REFERENCES storage_buckets(id),
  original_name VARCHAR(255) NOT NULL,
  stored_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_hash VARCHAR(64),
  metadata JSONB DEFAULT '{}',
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  is_processed BOOLEAN DEFAULT false,
  processing_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  cdn_url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS file_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID REFERENCES stored_files(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  stored_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  file_hash VARCHAR(64),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS storage_usage (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  total_files INTEGER DEFAULT 0,
  total_size BIGINT DEFAULT 0,
  bandwidth_used BIGINT DEFAULT 0,
  requests_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS file_access_logs (
  id SERIAL PRIMARY KEY,
  file_id UUID REFERENCES stored_files(id) ON DELETE CASCADE,
  user_id VARCHAR(50),
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  action VARCHAR(20) NOT NULL, -- 'upload', 'download', 'view', 'delete'
  status_code INTEGER,
  bytes_transferred BIGINT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stored_files_user_id ON stored_files(user_id);
CREATE INDEX IF NOT EXISTS idx_stored_files_bucket_id ON stored_files(bucket_id);
CREATE INDEX IF NOT EXISTS idx_stored_files_created_at ON stored_files(created_at);
CREATE INDEX IF NOT EXISTS idx_stored_files_mime_type ON stored_files(mime_type);
CREATE INDEX IF NOT EXISTS idx_stored_files_tags ON stored_files USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_storage_usage_user_date ON storage_usage(user_id, date);
CREATE INDEX IF NOT EXISTS idx_file_access_logs_file_id ON file_access_logs(file_id);
CREATE INDEX IF NOT EXISTS idx_file_access_logs_created_at ON file_access_logs(created_at);
