-- Insert subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, features, limits) VALUES 
(
    'Starter',
    'Perfect for getting started with live streaming',
    0.00,
    0.00,
    '["Up to 3 concurrent streams", "720p streaming quality", "Basic chat features", "Community support"]',
    '{"concurrent_streams": 3, "max_quality": "720p", "storage_gb": 10, "bandwidth_gb": 50}'
),
(
    'Creator',
    'For serious content creators',
    29.00,
    290.00,
    '["Up to 10 concurrent streams", "1080p streaming quality", "Basic AI tools", "Priority support", "Advanced analytics"]',
    '{"concurrent_streams": 10, "max_quality": "1080p", "storage_gb": 100, "bandwidth_gb": 500}'
),
(
    'Pro',
    'For professional streamers and businesses',
    99.00,
    990.00,
    '["Unlimited concurrent streams", "4K streaming quality", "Advanced AI tools", "24/7 phone support", "Custom branding", "API access"]',
    '{"concurrent_streams": -1, "max_quality": "4K", "storage_gb": 1000, "bandwidth_gb": 5000}'
) ON CONFLICT DO NOTHING;

-- Insert sample subscription for user
INSERT INTO user_subscriptions (user_id, plan_id, status, billing_cycle, current_period_start, current_period_end) VALUES 
(
    1,
    2, -- Creator plan
    'active',
    'monthly',
    NOW() - INTERVAL '15 days',
    NOW() + INTERVAL '15 days'
) ON CONFLICT DO NOTHING;

-- Insert sample payment method
INSERT INTO payment_methods (user_id, stripe_payment_method_id, type, card_brand, card_last4, card_exp_month, card_exp_year, is_default) VALUES 
(
    1,
    'pm_sample_card',
    'card',
    'visa',
    '4242',
    12,
    2025,
    true
) ON CONFLICT DO NOTHING;

-- Insert sample invoices
INSERT INTO invoices (user_id, subscription_id, invoice_number, amount_due, amount_paid, status, due_date, paid_at, description) VALUES 
(
    1,
    1,
    'INV-2024-001',
    29.00,
    29.00,
    'paid',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days',
    'Creator Plan - Monthly Subscription'
),
(
    1,
    1,
    'INV-2024-002',
    29.00,
    29.00,
    'paid',
    NOW() - INTERVAL '35 days',
    NOW() - INTERVAL '35 days',
    'Creator Plan - Monthly Subscription'
),
(
    1,
    1,
    'INV-2024-003',
    29.00,
    29.00,
    'paid',
    NOW() - INTERVAL '65 days',
    NOW() - INTERVAL '65 days',
    'Creator Plan - Monthly Subscription'
) ON CONFLICT DO NOTHING;

-- Insert sample usage data
INSERT INTO usage_tracking (user_id, metric_name, metric_value, period_start, period_end) VALUES 
(
    1,
    'concurrent_streams',
    7,
    DATE_TRUNC('month', NOW()),
    DATE_TRUNC('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 day'
),
(
    1,
    'storage_gb',
    45,
    DATE_TRUNC('month', NOW()),
    DATE_TRUNC('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 day'
),
(
    1,
    'bandwidth_gb',
    210,
    DATE_TRUNC('month', NOW()),
    DATE_TRUNC('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 day'
) ON CONFLICT DO NOTHING;
