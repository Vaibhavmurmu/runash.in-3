-- Create content_items table for user-generated content
CREATE TABLE IF NOT EXISTS content_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('stream', 'video', 'image', 'document')),
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'moderated', 'rejected')),
  visibility VARCHAR(50) NOT NULL DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'unlisted', 'subscribers_only')),
  file_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  file_size BIGINT, -- in bytes
  tags TEXT[] DEFAULT '{}',
  category VARCHAR(100),
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  moderation_status VARCHAR(50) CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  moderation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create user_activity table for activity tracking
CREATE TABLE IF NOT EXISTS user_activity (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_likes table
CREATE TABLE IF NOT EXISTS content_likes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id INTEGER NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- Create content_comments table
CREATE TABLE IF NOT EXISTS content_comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id INTEGER NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES content_comments(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_items_user_id ON content_items(user_id);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_category ON content_items(category);
CREATE INDEX IF NOT EXISTS idx_content_items_created_at ON content_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_likes_content_id ON content_likes(content_id);
CREATE INDEX IF NOT EXISTS idx_content_comments_content_id ON content_comments(content_id);

-- Create triggers to update like_count and comment_count
CREATE OR REPLACE FUNCTION update_content_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE content_items SET like_count = like_count + 1 WHERE id = NEW.content_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE content_items SET like_count = like_count - 1 WHERE id = OLD.content_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_content_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE content_items SET comment_count = comment_count + 1 WHERE id = NEW.content_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE content_items SET comment_count = comment_count - 1 WHERE id = OLD.content_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_like_count ON content_likes;
CREATE TRIGGER trigger_update_like_count
  AFTER INSERT OR DELETE ON content_likes
  FOR EACH ROW EXECUTE FUNCTION update_content_like_count();

DROP TRIGGER IF EXISTS trigger_update_comment_count ON content_comments;
CREATE TRIGGER trigger_update_comment_count
  AFTER INSERT OR DELETE ON content_comments
  FOR EACH ROW EXECUTE FUNCTION update_content_comment_count();
