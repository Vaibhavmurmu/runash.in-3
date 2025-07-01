-- Insert default storage providers
INSERT INTO storage_providers (name, type, config, is_active, is_default) VALUES
('AWS S3', 's3', '{"region": "us-east-1", "accessKeyId": "", "secretAccessKey": ""}', true, true),
('Cloudflare R2', 'r2', '{"accountId": "", "accessKeyId": "", "secretAccessKey": ""}', false, false),
('Google Cloud Storage', 'gcs', '{"projectId": "", "keyFilename": ""}', false, false);

-- Insert default storage buckets
INSERT INTO storage_buckets (provider_id, name, region, purpose, cdn_url, is_public) VALUES
(1, 'runash-avatars', 'us-east-1', 'avatars', 'https://cdn.runash.in/avatars', true),
(1, 'runash-videos', 'us-east-1', 'videos', 'https://cdn.runash.in/videos', false),
(1, 'runash-thumbnails', 'us-east-1', 'thumbnails', 'https://cdn.runash.in/thumbnails', true),
(1, 'runash-documents', 'us-east-1', 'documents', 'https://cdn.runash.in/docs', false),
(1, 'runash-temp', 'us-east-1', 'temporary', 'https://cdn.runash.in/temp', false);

-- Insert sample storage usage data
INSERT INTO storage_usage (user_id, date, total_files, total_size, bandwidth_used, requests_count) VALUES
('1', CURRENT_DATE - INTERVAL '7 days', 15, 52428800, 104857600, 45),
('1', CURRENT_DATE - INTERVAL '6 days', 16, 55574528, 111149056, 52),
('1', CURRENT_DATE - INTERVAL '5 days', 18, 60817408, 121634816, 61),
('1', CURRENT_DATE - INTERVAL '4 days', 19, 63963136, 127926272, 68),
('1', CURRENT_DATE - INTERVAL '3 days', 21, 69206016, 138412032, 75),
('1', CURRENT_DATE - INTERVAL '2 days', 22, 72351744, 144703488, 82),
('1', CURRENT_DATE - INTERVAL '1 day', 24, 77594624, 155189248, 89),
('1', CURRENT_DATE, 25, 80740352, 161480704, 95);
