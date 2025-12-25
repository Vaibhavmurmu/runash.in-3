-- Run this once to create the users table in your Neon database

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  name TEXT,
  username TEXT UNIQUE,
  platforms JSONB,
  content_types JSONB,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index username for quick lookup
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
