-- Insert sample exchange rates
INSERT INTO public.exchange_rates (from_currency, to_currency, rate) VALUES
('USD', 'INR', 83.25),
('INR', 'USD', 0.012),
-- ('EUR', 'INR', 90.15),
-- ('INR', 'EUR', 0.011),
-- ('GBP', 'INR', 105.50),
-- ('INR', 'GBP', 0.0095),
-- ('USD', 'EUR', 0.92),
-- ('EUR', 'USD', 1.09),
-- ('USD', 'GBP', 0.79),
-- ('GBP', 'USD', 1.27);

-- Insert sample notification templates (for system use)
-- These would be used by the notification service
