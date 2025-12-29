-- Create SSO organizations table
CREATE TABLE IF NOT EXISTS sso_organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  sso_enabled BOOLEAN NOT NULL DEFAULT false,
  auto_provision BOOLEAN NOT NULL DEFAULT true,
  default_role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  created_by INTEGER REFERENCES users(id),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create SSO providers table
CREATE TABLE IF NOT EXISTS sso_providers (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES sso_organizations(id) ON DELETE CASCADE,
  provider_type VARCHAR(20) NOT NULL, -- 'saml', 'oidc', 'oauth'
  provider_name VARCHAR(100) NOT NULL,
  client_id VARCHAR(255),
  client_secret TEXT,
  issuer_url TEXT,
  authorization_url TEXT,
  token_url TEXT,
  userinfo_url TEXT,
  jwks_uri TEXT,
  saml_sso_url TEXT,
  saml_entity_id TEXT,
  saml_certificate TEXT,
  saml_signature_algorithm VARCHAR(50) DEFAULT 'RSA-SHA256',
  attribute_mapping JSONB, -- Maps SSO attributes to user fields
  scopes TEXT[], -- For OIDC/OAuth
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, provider_type)
);

-- Create SSO user mappings table
CREATE TABLE IF NOT EXISTS sso_user_mappings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id INTEGER NOT NULL REFERENCES sso_organizations(id) ON DELETE CASCADE,
  provider_id INTEGER NOT NULL REFERENCES sso_providers(id) ON DELETE CASCADE,
  external_id VARCHAR(255) NOT NULL, -- User ID from SSO provider
  external_email VARCHAR(255) NOT NULL,
  external_attributes JSONB, -- Additional attributes from SSO
  last_login_at TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  UNIQUE(provider_id, external_id),
  UNIQUE(user_id, organization_id)
);

-- Create SSO login attempts table for monitoring
CREATE TABLE IF NOT EXISTS sso_login_attempts (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES sso_organizations(id),
  provider_id INTEGER REFERENCES sso_providers(id),
  user_id INTEGER REFERENCES users(id),
  external_id VARCHAR(255),
  email VARCHAR(255),
  success BOOLEAN NOT NULL,
  error_message TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Create domain verification table
CREATE TABLE IF NOT EXISTS domain_verifications (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES sso_organizations(id) ON DELETE CASCADE,
  domain VARCHAR(255) NOT NULL,
  verification_token VARCHAR(255) NOT NULL,
  verification_method VARCHAR(20) NOT NULL, -- 'dns', 'file', 'email'
  verified_at TIMESTAMP WITHOUT TIME ZONE,
  expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(organization_id, domain)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sso_organizations_domain ON sso_organizations(domain);
CREATE INDEX IF NOT EXISTS idx_sso_organizations_slug ON sso_organizations(slug);
CREATE INDEX IF NOT EXISTS idx_sso_providers_org_id ON sso_providers(organization_id);
CREATE INDEX IF NOT EXISTS idx_sso_user_mappings_user_id ON sso_user_mappings(user_id);
CREATE INDEX IF NOT EXISTS idx_sso_user_mappings_org_id ON sso_user_mappings(organization_id);
CREATE INDEX IF NOT EXISTS idx_sso_user_mappings_external_id ON sso_user_mappings(external_id);
CREATE INDEX IF NOT EXISTS idx_sso_login_attempts_org_id ON sso_login_attempts(organization_id);
CREATE INDEX IF NOT EXISTS idx_domain_verifications_domain ON domain_verifications(domain);

-- Add SSO columns to users table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'sso_organization_id') THEN
    ALTER TABLE users ADD COLUMN sso_organization_id INTEGER REFERENCES sso_organizations(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_sso_user') THEN
    ALTER TABLE users ADD COLUMN is_sso_user BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;
