-- Exchange rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_currency VARCHAR(3) NOT NULL,
    to_currency VARCHAR(3) NOT NULL,
    rate DECIMAL(20, 8) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(from_currency, to_currency)
);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_exchange_rates_currencies ON exchange_rates(from_currency, to_currency);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_updated ON exchange_rates(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);

-- RLS policies
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Allow read access to exchange rates for authenticated users
CREATE POLICY "Allow read access to exchange rates" ON exchange_rates
    FOR SELECT TO authenticated
    USING (true);

-- Allow admin access to system settings
CREATE POLICY "Allow admin access to system settings" ON system_settings
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

-- Function to update exchange rate
CREATE OR REPLACE FUNCTION update_exchange_rate(
    p_from_currency VARCHAR(3),
    p_to_currency VARCHAR(3),
    p_rate DECIMAL(20, 8)
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    rate_id UUID;
BEGIN
    INSERT INTO exchange_rates (from_currency, to_currency, rate, last_updated)
    VALUES (p_from_currency, p_to_currency, p_rate, NOW())
    ON CONFLICT (from_currency, to_currency)
    DO UPDATE SET 
        rate = EXCLUDED.rate,
        last_updated = NOW()
    RETURNING id INTO rate_id;
    
    RETURN rate_id;
END;
$$;

-- Function to get exchange rate
CREATE OR REPLACE FUNCTION get_exchange_rate(
    p_from_currency VARCHAR(3),
    p_to_currency VARCHAR(3)
)
RETURNS DECIMAL(20, 8)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    rate_value DECIMAL(20, 8);
BEGIN
    IF p_from_currency = p_to_currency THEN
        RETURN 1.0;
    END IF;
    
    SELECT rate INTO rate_value
    FROM exchange_rates
    WHERE from_currency = p_from_currency 
    AND to_currency = p_to_currency
    ORDER BY last_updated DESC
    LIMIT 1;
    
    IF rate_value IS NULL THEN
        -- Try reverse rate
        SELECT (1.0 / rate) INTO rate_value
        FROM exchange_rates
        WHERE from_currency = p_to_currency 
        AND to_currency = p_from_currency
        ORDER BY last_updated DESC
        LIMIT 1;
    END IF;
    
    RETURN COALESCE(rate_value, 1.0);
END;
$$;

-- Function to convert currency
CREATE OR REPLACE FUNCTION convert_currency(
    p_amount DECIMAL(20, 2),
    p_from_currency VARCHAR(3),
    p_to_currency VARCHAR(3)
)
RETURNS DECIMAL(20, 2)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    rate_value DECIMAL(20, 8);
    converted_amount DECIMAL(20, 2);
BEGIN
    rate_value := get_exchange_rate(p_from_currency, p_to_currency);
    converted_amount := p_amount * rate_value;
    
    RETURN ROUND(converted_amount, 2);
END;
$$;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON system_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
    ('exchange_rate_api_provider', 'exchangerate-api', 'Exchange rate API provider'),
    ('exchange_rate_cache_duration', '3600', 'Cache duration in seconds (1 hour)'),
    ('supported_currencies', 'USD,INR,EUR,GBP,JPY,AUD,CAD,CHF,CNY,SGD', 'Comma-separated list of supported currencies'),
    ('default_currency', 'USD', 'Default currency for the application'),
    ('currency_precision', '2', 'Number of decimal places for currency display')
ON CONFLICT (key) DO NOTHING;
