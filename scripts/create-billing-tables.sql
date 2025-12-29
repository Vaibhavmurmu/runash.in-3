-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- in cents
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  interval VARCHAR(20) NOT NULL CHECK (interval IN ('month', 'year')),
  interval_count INTEGER NOT NULL DEFAULT 1,
  features TEXT[] DEFAULT '{}',
  limits JSONB NOT NULL DEFAULT '{}',
  stripe_price_id VARCHAR(255),
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  trial_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES subscription_plans(id),
  stripe_subscription_id VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing', 'incomplete')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id INTEGER REFERENCES user_subscriptions(id),
  stripe_invoice_id VARCHAR(255),
  amount_due INTEGER NOT NULL, -- in cents
  amount_paid INTEGER NOT NULL DEFAULT 0, -- in cents
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
  description TEXT,
  invoice_pdf TEXT,
  hosted_invoice_url TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice line items table
CREATE TABLE IF NOT EXISTS invoice_line_items (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_amount INTEGER NOT NULL, -- in cents
  amount INTEGER NOT NULL, -- in cents
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  proration BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usage records table
CREATE TABLE IF NOT EXISTS usage_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id INTEGER REFERENCES user_subscriptions(id),
  metric VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add stripe_customer_id to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_id ON user_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription_id ON invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_usage_records_user_id ON usage_records(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_metric ON usage_records(metric);
CREATE INDEX IF NOT EXISTS idx_usage_records_timestamp ON usage_records(timestamp);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price, currency, interval, features, limits, is_popular, trial_days) VALUES
('Starter', 'Perfect for getting started with streaming', 999, 'USD', 'month', 
 ARRAY['Up to 10 streams per month', 'Basic analytics', '5GB storage', 'Email support'],
 '{"streams_per_month": 10, "storage_gb": 5, "analytics_retention_days": 30, "multi_platform_streams": 1, "custom_branding": false, "priority_support": false, "api_access": false}',
 false, 7),

('Pro', 'For serious content creators', 2999, 'USD', 'month',
 ARRAY['Unlimited streams', 'Advanced analytics', '100GB storage', 'Multi-platform streaming', 'Custom branding', 'Priority support'],
 '{"streams_per_month": -1, "storage_gb": 100, "analytics_retention_days": 90, "multi_platform_streams": 5, "custom_branding": true, "priority_support": true, "api_access": true}',
 true, 14),

('Enterprise', 'For teams and organizations', 9999, 'USD', 'month',
 ARRAY['Everything in Pro', 'Unlimited storage', 'White-label solution', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
 '{"streams_per_month": -1, "storage_gb": -1, "analytics_retention_days": 365, "multi_platform_streams": -1, "custom_branding": true, "priority_support": true, "api_access": true}',
 false, 30),

('Pro Annual', 'Pro plan billed annually (2 months free)', 29990, 'USD', 'year',
 ARRAY['Unlimited streams', 'Advanced analytics', '100GB storage', 'Multi-platform streaming', 'Custom branding', 'Priority support'],
 '{"streams_per_month": -1, "storage_gb": 100, "analytics_retention_days": 90, "multi_platform_streams": 5, "custom_branding": true, "priority_support": true, "api_access": true}',
 false, 14)

ON CONFLICT DO NOTHING;
