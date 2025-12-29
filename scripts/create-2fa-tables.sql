-- Create 2FA settings table
CREATE TABLE IF NOT EXISTS user_2fa_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  totp_secret VARCHAR(32), -- Base32 encoded secret for TOTP
  totp_enabled BOOLEAN NOT NULL DEFAULT false,
  sms_enabled BOOLEAN NOT NULL DEFAULT false,
  email_enabled BOOLEAN NOT NULL DEFAULT false,
  backup_codes_generated_at TIMESTAMP WITHOUT TIME ZONE,
  backup_codes_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create backup codes table
CREATE TABLE IF NOT EXISTS user_2fa_backup_codes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code VARCHAR(10) NOT NULL,
  used_at TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create 2FA recovery attempts table for security monitoring
CREATE TABLE IF NOT EXISTS user_2fa_recovery_attempts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attempt_type VARCHAR(20) NOT NULL, -- 'backup_code', 'recovery_email', 'admin_reset'
  success BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_2fa_settings_user_id ON user_2fa_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_2fa_backup_codes_user_id ON user_2fa_backup_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_2fa_backup_codes_code ON user_2fa_backup_codes(code);
CREATE INDEX IF NOT EXISTS idx_user_2fa_recovery_attempts_user_id ON user_2fa_recovery_attempts(user_id);

-- Add 2FA columns to users table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'two_factor_enabled') THEN
    ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN NOT NULL DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'two_factor_backup_at') THEN
    ALTER TABLE users ADD COLUMN two_factor_backup_at TIMESTAMP WITHOUT TIME ZONE;
  END IF;
END $$;
