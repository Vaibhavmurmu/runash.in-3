-- Minimal fix to add just the essential missing columns
-- This should work even if the table structure is different

-- Check if users table exists and add missing columns one by one
DO $$ 
DECLARE
    table_exists boolean;
BEGIN
    -- Check if users table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
    ) INTO table_exists;
    
    IF table_exists THEN
        -- Add username column if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'username'
        ) THEN
            ALTER TABLE users ADD COLUMN username VARCHAR(100);
            RAISE NOTICE 'Added username column';
        END IF;
        
        -- Add email_verified column if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'email_verified'
        ) THEN
            ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;
            RAISE NOTICE 'Added email_verified column';
        END IF;
        
        -- Add other essential columns
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'avatar_url'
        ) THEN
            ALTER TABLE users ADD COLUMN avatar_url TEXT;
            RAISE NOTICE 'Added avatar_url column';
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'bio'
        ) THEN
            ALTER TABLE users ADD COLUMN bio TEXT;
            RAISE NOTICE 'Added bio column';
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'website'
        ) THEN
            ALTER TABLE users ADD COLUMN website VARCHAR(255);
            RAISE NOTICE 'Added website column';
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'location'
        ) THEN
            ALTER TABLE users ADD COLUMN location VARCHAR(255);
            RAISE NOTICE 'Added location column';
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'email_verified_at'
        ) THEN
            ALTER TABLE users ADD COLUMN email_verified_at TIMESTAMP WITH TIME ZONE;
            RAISE NOTICE 'Added email_verified_at column';
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'pending_email'
        ) THEN
            ALTER TABLE users ADD COLUMN pending_email VARCHAR(255);
            RAISE NOTICE 'Added pending_email column';
        END IF;
        
        -- Update sample user if it exists
        UPDATE users 
        SET 
            username = 'alexj_streams',
            email_verified = true,
            email_verified_at = NOW(),
            bio = 'Tech enthusiast and live streamer passionate about AI and gaming.',
            website = 'https://alexjohnson.dev',
            location = 'San Francisco, CA'
        WHERE email = 'alex@runash.ai' 
        AND username IS NULL;
        
        RAISE NOTICE 'Schema update completed successfully';
    ELSE
        RAISE NOTICE 'Users table does not exist';
    END IF;
END $$;
