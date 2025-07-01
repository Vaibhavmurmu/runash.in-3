-- Create streaming-related tables

-- Streams table
CREATE TABLE IF NOT EXISTS streams (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    tags TEXT[],
    thumbnail_url TEXT,
    privacy VARCHAR(20) DEFAULT 'public',
    chat_enabled BOOLEAN DEFAULT true,
    recording_enabled BOOLEAN DEFAULT false,
    quality VARCHAR(10) DEFAULT '1080p',
    bitrate INTEGER DEFAULT 2500,
    frame_rate INTEGER DEFAULT 30,
    audio_quality VARCHAR(20) DEFAULT 'high',
    scheduled_for TIMESTAMP,
    max_duration INTEGER,
    stream_key VARCHAR(255) UNIQUE NOT NULL,
    rtmp_url TEXT NOT NULL,
    hls_url TEXT,
    recording_url TEXT,
    status VARCHAR(20) DEFAULT 'idle',
    viewer_count INTEGER DEFAULT 0,
    duration INTEGER DEFAULT 0,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Stream chat table
CREATE TABLE IF NOT EXISTS stream_chat (
    id SERIAL PRIMARY KEY,
    stream_id INTEGER NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
    user_id INTEGER,
    username VARCHAR(100),
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'message',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Stream analytics table
CREATE TABLE IF NOT EXISTS stream_analytics (
    id SERIAL PRIMARY KEY,
    stream_id INTEGER NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
    peak_viewers INTEGER DEFAULT 0,
    average_viewers INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    chat_messages INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    donations INTEGER DEFAULT 0,
    new_followers INTEGER DEFAULT 0,
    watch_time INTEGER DEFAULT 0,
    engagement DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Stream viewers table (for tracking concurrent viewers)
CREATE TABLE IF NOT EXISTS stream_viewers (
    id SERIAL PRIMARY KEY,
    stream_id INTEGER NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
    user_id INTEGER,
    ip_address INET,
    user_agent TEXT,
    joined_at TIMESTAMP DEFAULT NOW(),
    left_at TIMESTAMP,
    watch_time INTEGER DEFAULT 0
);

-- User followers table (if not exists)
CREATE TABLE IF NOT EXISTS user_followers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    follower_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, follower_id)
);

-- Notifications table (if not exists)
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    metadata JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_streams_user_id ON streams(user_id);
CREATE INDEX IF NOT EXISTS idx_streams_status ON streams(status);
CREATE INDEX IF NOT EXISTS idx_streams_created_at ON streams(created_at);
CREATE INDEX IF NOT EXISTS idx_stream_chat_stream_id ON stream_chat(stream_id);
CREATE INDEX IF NOT EXISTS idx_stream_chat_created_at ON stream_chat(created_at);
CREATE INDEX IF NOT EXISTS idx_stream_viewers_stream_id ON stream_viewers(stream_id);
CREATE INDEX IF NOT EXISTS idx_user_followers_user_id ON user_followers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_followers_follower_id ON user_followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
