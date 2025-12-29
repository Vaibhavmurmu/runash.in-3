-- Email Templates Management System
-- Create tables for comprehensive email template management

-- Email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  subject VARCHAR(500) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  category VARCHAR(100) DEFAULT 'general',
  description TEXT,
  variables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_system BOOLEAN DEFAULT false,
  created_by INTEGER REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  version INTEGER DEFAULT 1
);

-- Email template versions for history tracking
CREATE TABLE IF NOT EXISTS email_template_versions (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES email_templates(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  subject VARCHAR(500) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB DEFAULT '[]'::jsonb,
  created_by INTEGER REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  change_notes TEXT
);

-- Email campaigns for bulk sending
CREATE TABLE IF NOT EXISTS email_campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  template_id INTEGER REFERENCES email_templates(id),
  subject VARCHAR(500) NOT NULL,
  sender_name VARCHAR(255),
  sender_email VARCHAR(255),
  recipient_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, sending, sent, paused, cancelled
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_by INTEGER REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb
);

-- Email delivery tracking
CREATE TABLE IF NOT EXISTS email_deliveries (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES email_campaigns(id),
  template_id INTEGER REFERENCES email_templates(id),
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  user_id INTEGER REFERENCES users(id),
  message_id VARCHAR(255) UNIQUE,
  subject VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending', -- pending, sent, delivered, bounced, failed, opened, clicked
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  bounced_at TIMESTAMP WITH TIME ZONE,
  bounce_reason TEXT,
  error_message TEXT,
  tracking_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email bounces and suppressions
CREATE TABLE IF NOT EXISTS email_suppressions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL, -- bounce, complaint, unsubscribe, manual
  reason TEXT,
  bounce_type VARCHAR(50), -- hard, soft, complaint
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_permanent BOOLEAN DEFAULT false
);

-- Email engagement tracking
CREATE TABLE IF NOT EXISTS email_engagement (
  id SERIAL PRIMARY KEY,
  delivery_id INTEGER REFERENCES email_deliveries(id),
  event_type VARCHAR(50) NOT NULL, -- open, click, unsubscribe, complaint
  event_data JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_email_deliveries_status ON email_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_email_deliveries_recipient ON email_deliveries(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_deliveries_campaign ON email_deliveries(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_suppressions_email ON email_suppressions(email);
CREATE INDEX IF NOT EXISTS idx_email_engagement_delivery ON email_engagement(delivery_id);
CREATE INDEX IF NOT EXISTS idx_email_engagement_type ON email_engagement(event_type);

-- Insert default system templates
INSERT INTO email_templates (name, subject, html_content, text_content, category, description, variables, is_system, created_by) VALUES
('welcome', 'Welcome to {{app_name}}!', 
'<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
  <h1 style="color: #ff6b35; text-align: center;">Welcome to {{app_name}}!</h1>
  <p>Hi {{user_name}},</p>
  <p>Welcome to our platform! We''re excited to have you on board.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{dashboard_url}}" style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
      Get Started
    </a>
  </div>
  <p>Best regards,<br>The {{app_name}} Team</p>
</div>',
'Welcome to {{app_name}}!

Hi {{user_name}},

Welcome to our platform! We''re excited to have you on board.

Get started: {{dashboard_url}}

Best regards,
The {{app_name}} Team',
'user', 'Welcome email for new users', 
'[{"name": "user_name", "description": "User''s display name"}, {"name": "app_name", "description": "Application name"}, {"name": "dashboard_url", "description": "Link to user dashboard"}]'::jsonb, 
true, 1),

('password_reset', 'Reset Your Password', 
'<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
  <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
  <p>Hi {{user_name}},</p>
  <p>You requested to reset your password. Click the button below to create a new password:</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{reset_url}}" style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
      Reset Password
    </a>
  </div>
  <p>This link will expire in {{expires_in}} minutes.</p>
  <p>If you didn''t request this, you can safely ignore this email.</p>
</div>',
'Reset Your Password

Hi {{user_name}},

You requested to reset your password. Use this link: {{reset_url}}

This link will expire in {{expires_in}} minutes.

If you didn''t request this, you can safely ignore this email.',
'auth', 'Password reset email template',
'[{"name": "user_name", "description": "User''s display name"}, {"name": "reset_url", "description": "Password reset URL"}, {"name": "expires_in", "description": "Expiration time in minutes"}]'::jsonb,
true, 1);
