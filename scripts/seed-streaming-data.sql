-- Seed streaming data

-- Insert sample stream categories
INSERT INTO stream_categories (name, description, icon) VALUES
('Programming', 'Coding, development, and tech tutorials', '💻'),
('Gaming', 'Video games, esports, and gaming content', '🎮'),
('Music', 'Music production, performances, and tutorials', '🎵'),
('Art', 'Digital art, drawing, and creative content', '🎨'),
('Education', 'Learning, tutorials, and educational content', '📚'),
('Fitness', 'Workouts, health, and wellness content', '💪'),
('Cooking', 'Recipes, cooking tutorials, and food content', '👨‍🍳'),
('Talk Shows', 'Discussions, interviews, and conversations', '🎙️')
ON CONFLICT (name) DO NOTHING;

-- Insert sample streams for testing
INSERT INTO streams (
    user_id, title, description, category, tags, privacy, 
    chat_enabled, recording_enabled, quality, stream_key, rtmp_url, hls_url, status
) VALUES
(1, 'Building a React Dashboard', 'Live coding session building a modern dashboard with React and TypeScript', 'Programming', 
 ARRAY['react', 'typescript', 'dashboard', 'coding'], 'public', true, true, '1080p',
 'sk_live_abc123def456', 'rtmp://live.runash.in/live/sk_live_abc123def456', 
 'https://live.runash.in/hls/sk_live_abc123def456/index.m3u8', 'idle'),

(1, 'Music Production Masterclass', 'Creating beats and learning music production techniques', 'Music',
 ARRAY['music', 'production', 'beats', 'tutorial'], 'public', true, false, '720p',
 'sk_live_xyz789ghi012', 'rtmp://live.runash.in/live/sk_live_xyz789ghi012',
 'https://live.runash.in/hls/sk_live_xyz789ghi012/index.m3u8', 'idle'),

(1, 'Digital Art Workshop', 'Character design and digital illustration techniques', 'Art',
 ARRAY['art', 'digital', 'character', 'design'], 'public', true, true, '1080p',
 'sk_live_mno345pqr678', 'rtmp://live.runash.in/live/sk_live_mno345pqr678',
 'https://live.runash.in/hls/sk_live_mno345pqr678/index.m3u8', 'idle')
ON CONFLICT (stream_key) DO NOTHING;

-- Insert sample chat messages
INSERT INTO stream_chat (stream_id, user_id, username, message, type) VALUES
(1, 1, 'alexdev', 'Welcome everyone to the stream!', 'message'),
(1, 2, 'viewer123', 'Excited to learn React!', 'message'),
(1, 3, 'coder_jane', 'Great explanation of hooks!', 'message'),
(1, 4, 'dev_mike', 'Can you show the TypeScript types?', 'message'),
(1, 1, 'alexdev', 'Let me show the interface definitions', 'message');

-- Insert sample followers
INSERT INTO user_followers (user_id, follower_id) VALUES
(1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10);

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, metadata) VALUES
(2, 'stream_live', 'Stream Started', 'alexdev just went live with "Building a React Dashboard"', 
 '{"streamId": 1, "userId": 1}'),
(3, 'new_follower', 'New Follower', 'You have a new follower!', '{"followerId": 11}'),
(1, 'stream_milestone', 'Milestone Reached', 'Congratulations! You reached 1000 followers!', 
 '{"milestone": "followers", "count": 1000}');
