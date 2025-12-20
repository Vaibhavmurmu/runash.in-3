-- Function to transfer funds between accounts
CREATE OR REPLACE FUNCTION transfer_funds(
    sender_id UUID,
    receiver_id UUID,
    amount DECIMAL(15,2)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    sender_balance DECIMAL(15,2);
    receiver_balance DECIMAL(15,2);
BEGIN
    -- Get sender's primary account balance
    SELECT balance INTO sender_balance
    FROM public.bank_accounts
    WHERE user_id = sender_id AND is_primary = true AND is_active = true;

    -- Check if sender has sufficient balance
    IF sender_balance IS NULL OR sender_balance < amount THEN
        RETURN FALSE;
    END IF;

    -- Get receiver's primary account balance
    SELECT balance INTO receiver_balance
    FROM public.bank_accounts
    WHERE user_id = receiver_id AND is_primary = true AND is_active = true;

    -- If receiver doesn't have an account, return false
    IF receiver_balance IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Perform the transfer
    UPDATE public.bank_accounts
    SET balance = balance - amount
    WHERE user_id = sender_id AND is_primary = true;

    UPDATE public.bank_accounts
    SET balance = balance + amount
    WHERE user_id = receiver_id AND is_primary = true;

    RETURN TRUE;
END;
$$;

-- Function to get exchange rate
CREATE OR REPLACE FUNCTION get_exchange_rate(
    from_currency TEXT,
    to_currency TEXT
)
RETURNS DECIMAL(10,6)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    rate DECIMAL(10,6);
BEGIN
    -- If same currency, return 1
    IF from_currency = to_currency THEN
        RETURN 1.0;
    END IF;

    -- Get the exchange rate
    SELECT er.rate INTO rate
    FROM public.exchange_rates er
    WHERE er.from_currency = $1 AND er.to_currency = $2
    ORDER BY er.updated_at DESC
    LIMIT 1;

    -- If no direct rate found, try inverse
    IF rate IS NULL THEN
        SELECT (1.0 / er.rate) INTO rate
        FROM public.exchange_rates er
        WHERE er.from_currency = $2 AND er.to_currency = $1
        ORDER BY er.updated_at DESC
        LIMIT 1;
    END IF;

    -- Return rate or 1.0 if not found
    RETURN COALESCE(rate, 1.0);
END;
$$;

-- Function to create payment link
CREATE OR REPLACE FUNCTION create_payment_link(
    user_id UUID,
    title TEXT,
    amount DECIMAL(15,2),
    currency TEXT DEFAULT 'INR'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    link_id TEXT;
BEGIN
    -- Generate unique link ID
    link_id := 'pl_' || encode(gen_random_bytes(16), 'hex');

    -- Insert payment link
    INSERT INTO public.payment_links (user_id, link_id, title, amount, currency)
    VALUES (user_id, link_id, title, amount, currency);

    RETURN link_id;
END;
$$;

-- Function to handle user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, phone, country_code, preferred_language, preferred_currency)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'phone',
        COALESCE(NEW.raw_user_meta_data->>'country_code', 'IN'),
        COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en'),
        COALESCE(NEW.raw_user_meta_data->>'preferred_currency', 'INR')
    );
    RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update payment link usage
CREATE OR REPLACE FUNCTION update_payment_link_usage()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Increment usage count
    UPDATE public.payment_links
    SET usage_count = usage_count + 1
    WHERE id = NEW.payment_link_id;

    -- Check if max usage reached and deactivate if needed
    UPDATE public.payment_links
    SET is_active = false
    WHERE id = NEW.payment_link_id
    AND max_usage IS NOT NULL
    AND usage_count >= max_usage;

    RETURN NEW;
END;
$$;

-- Trigger for payment link usage tracking
CREATE TRIGGER on_payment_link_transaction_created
    AFTER INSERT ON public.payment_link_transactions
    FOR EACH ROW EXECUTE FUNCTION update_payment_link_usage();
