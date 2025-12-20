-- Bill Payment Tables
CREATE TABLE IF NOT EXISTS bill_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bill_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES bill_categories(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  customer_care VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  supports_fetch BOOLEAN DEFAULT false,
  fetch_params JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_bills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES bill_providers(id) ON DELETE CASCADE,
  nickname VARCHAR(100),
  consumer_number VARCHAR(100) NOT NULL,
  consumer_name VARCHAR(200),
  billing_address TEXT,
  is_autopay_enabled BOOLEAN DEFAULT false,
  autopay_amount_limit DECIMAL(10,2),
  reminder_days INTEGER DEFAULT 3,
  is_favorite BOOLEAN DEFAULT false,
  last_bill_amount DECIMAL(10,2),
  last_bill_date TIMESTAMP WITH TIME ZONE,
  next_due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider_id, consumer_number)
);

CREATE TABLE IF NOT EXISTS bill_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_bill_id UUID REFERENCES user_bills(id) ON DELETE CASCADE,
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  bill_number VARCHAR(100),
  bill_date TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  bill_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) NOT NULL,
  convenience_fee DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'UPI',
  status VARCHAR(20) DEFAULT 'PENDING',
  gateway_transaction_id VARCHAR(200),
  gateway_response JSONB,
  failure_reason TEXT,
  is_autopay BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bill_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_bill_id UUID REFERENCES user_bills(id) ON DELETE CASCADE,
  reminder_date TIMESTAMP WITH TIME ZONE NOT NULL,
  reminder_type VARCHAR(20) DEFAULT 'DUE_DATE',
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_bills_user_id ON user_bills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bills_provider_id ON user_bills(provider_id);
CREATE INDEX IF NOT EXISTS idx_bill_payments_user_id ON bill_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_bill_payments_status ON bill_payments(status);
CREATE INDEX IF NOT EXISTS idx_bill_reminders_user_id ON bill_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_bill_reminders_reminder_date ON bill_reminders(reminder_date);

-- Insert bill categories
INSERT INTO bill_categories (name, icon, description) VALUES
('Electricity', 'zap', 'Electricity bill payments'),
('Water', 'droplets', 'Water utility bill payments'),
('Gas', 'flame', 'Gas connection bill payments'),
('Mobile', 'smartphone', 'Mobile recharge and postpaid bills'),
('Internet', 'wifi', 'Broadband and internet bill payments'),
('DTH/Cable', 'tv', 'DTH and cable TV bill payments'),
('Insurance', 'shield', 'Insurance premium payments'),
('Loan EMI', 'credit-card', 'Loan EMI payments'),
('Municipal Tax', 'building', 'Property and municipal tax payments'),
('Education', 'graduation-cap', 'School and college fee payments')
ON CONFLICT DO NOTHING;

-- Insert sample bill providers
INSERT INTO bill_providers (category_id, name, code, supports_fetch) VALUES
((SELECT id FROM bill_categories WHERE name = 'Electricity'), 'BSES Rajdhani', 'BSES_RAJ', true),
((SELECT id FROM bill_categories WHERE name = 'Electricity'), 'BSES Yamuna', 'BSES_YAM', true),
((SELECT id FROM bill_categories WHERE name = 'Electricity'), 'Tata Power Delhi', 'TATA_POWER_DDL', true),
((SELECT id FROM bill_categories WHERE name = 'Mobile'), 'Airtel', 'AIRTEL', true),
((SELECT id FROM bill_categories WHERE name = 'Mobile'), 'Jio', 'JIO', true),
((SELECT id FROM bill_categories WHERE name = 'Mobile'), 'Vi (Vodafone Idea)', 'VI', true),
((SELECT id FROM bill_categories WHERE name = 'Internet'), 'Airtel Broadband', 'AIRTEL_BB', true),
((SELECT id FROM bill_categories WHERE name = 'Internet'), 'Jio Fiber', 'JIO_FIBER', true),
((SELECT id FROM bill_categories WHERE name = 'DTH/Cable'), 'Tata Sky', 'TATA_SKY', true),
((SELECT id FROM bill_categories WHERE name = 'DTH/Cable'), 'Dish TV', 'DISH_TV', true)
ON CONFLICT DO NOTHING;
