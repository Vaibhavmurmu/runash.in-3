-- Create passkey credentials table
CREATE TABLE IF NOT EXISTS passkey_credentials (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  credential_id TEXT NOT NULL UNIQUE,
  public_key BYTEA NOT NULL,
  counter BIGINT NOT NULL DEFAULT 0,
  device_type VARCHAR(50) NOT NULL, -- 'platform' or 'cross-platform'
  backup_eligible BOOLEAN NOT NULL DEFAULT false,
  backup_state BOOLEAN NOT NULL DEFAULT false,
  transports TEXT[], -- ['usb', 'nfc', 'ble', 'internal']
  name VARCHAR(255), -- User-friendly name for the passkey
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITHOUT TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create passkey challenges table for temporary challenge storage
CREATE TABLE IF NOT EXISTS passkey_challenges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  challenge TEXT NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'registration' or 'authentication'
  expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_passkey_credentials_user_id ON passkey_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_passkey_credentials_credential_id ON passkey_credentials(credential_id);
CREATE INDEX IF NOT EXISTS idx_passkey_challenges_user_id ON passkey_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_passkey_challenges_expires_at ON passkey_challenges(expires_at);

-- Clean up expired challenges (run periodically)
DELETE FROM passkey_challenges WHERE expires_at < NOW();
