-- Insert default payment gateway configurations
INSERT INTO payment_gateways (name, provider, api_key, api_secret, webhook_secret, is_sandbox) VALUES
-- ('Razorpay Sandbox', 'razorpay', 'rzp_test_key', 'rzp_test_secret', 'webhook_secret', true),
('Pay Sandbox', 'pay', 'pay_test_key', 'pay_test_secret', 'pay_webhook_secret', true);

-- Create sample users (for development only)
INSERT INTO users (id, email, phone, full_name, is_verified) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'john@example.com', '+919876543210', 'John Doe', true),
('550e8400-e29b-41d4-a716-446655440001', 'jane@example.com', '+919876543211', 'Jane Smith', true);

-- Create sample bank accounts
INSERT INTO bank_accounts (user_id, bank_name, account_number, ifsc_code, account_holder_name, is_primary, balance) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'State Bank of India', '1234567890', 'SBIN0001234', 'John Doe', true, 10000.00),
('550e8400-e29b-41d4-a716-446655440001', 'HDFC Bank', '0987654321', 'HDFC0001234', 'Jane Smith', true, 15000.00);

-- Create sample UPI IDs
INSERT INTO upi_ids (user_id, bank_account_id, upi_id, provider, is_primary) VALUES
('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM bank_accounts WHERE user_id = '550e8400-e29b-41d4-a716-446655440000' LIMIT 1), 'john@paytm', 'paytm', true),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM bank_accounts WHERE user_id = '550e8400-e29b-41d4-a716-446655440001' LIMIT 1), 'jane@gpay', 'gpay', true);
