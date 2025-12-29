-- Create OTP codes table for email and mobile verification
CREATE TABLE IF NOT EXISTS otp_codes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255), -- For email OTP (can be different from user's primary email)
  phone_number VARCHAR(20), -- For mobile OTP
  code VARCHAR(10) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'email', 'sms', 'login', 'verification', '2fa'
  purpose VARCHAR(50) NOT NULL, -- 'login', 'registration', 'password_reset', '2fa_setup', '2fa_login'
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  used_at TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create mobile verification table for phone number management
CREATE TABLE IF NOT EXISTS mobile_verifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  country_code VARCHAR(5) NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, phone_number)
);

-- Create OTP rate limiting table
CREATE TABLE IF NOT EXISTS otp_rate_limits (
  id SERIAL PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL, -- email, phone, or IP address
  type VARCHAR(20) NOT NULL, -- 'email', 'sms', 'ip'
  attempts INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  blocked_until TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier, type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_otp_codes_user_id ON otp_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_codes_phone ON otp_codes(phone_number);
CREATE INDEX IF NOT EXISTS idx_otp_codes_code ON otp_codes(code);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON otp_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_mobile_verifications_user_id ON mobile_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_mobile_verifications_phone ON mobile_verifications(phone_number);
CREATE INDEX IF NOT EXISTS idx_otp_rate_limits_identifier ON otp_rate_limits(identifier, type);

-- Clean up expired OTP codes and rate limits (run periodically)
DELETE FROM otp_codes WHERE expires_at < NOW();
DELETE FROM otp_rate_limits WHERE blocked_until IS NOT NULL AND blocked_until < NOW();
