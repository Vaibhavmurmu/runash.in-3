-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upi_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_link_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_tokens ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Bank accounts policies
CREATE POLICY "Users can view own bank accounts" ON public.bank_accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bank accounts" ON public.bank_accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bank accounts" ON public.bank_accounts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bank accounts" ON public.bank_accounts
    FOR DELETE USING (auth.uid() = user_id);

-- UPI IDs policies
CREATE POLICY "Users can view own UPI IDs" ON public.upi_ids
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own UPI IDs" ON public.upi_ids
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own UPI IDs" ON public.upi_ids
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own UPI IDs" ON public.upi_ids
    FOR DELETE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert transactions as sender" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "System can update transactions" ON public.transactions
    FOR UPDATE USING (true);

-- Payment links policies
CREATE POLICY "Users can view own payment links" ON public.payment_links
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active payment links" ON public.payment_links
    FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

CREATE POLICY "Users can insert own payment links" ON public.payment_links
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment links" ON public.payment_links
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment links" ON public.payment_links
    FOR DELETE USING (auth.uid() = user_id);

-- Payment link transactions policies
CREATE POLICY "Users can view payment link transactions" ON public.payment_link_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.payment_links pl 
            WHERE pl.id = payment_link_id AND pl.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can insert payment link transactions" ON public.payment_link_transactions
    FOR INSERT WITH CHECK (true);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- User sessions policies
CREATE POLICY "Users can view own sessions" ON public.user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.user_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.user_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON public.user_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Biometric tokens policies
CREATE POLICY "Users can view own biometric tokens" ON public.biometric_tokens
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own biometric tokens" ON public.biometric_tokens
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own biometric tokens" ON public.biometric_tokens
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own biometric tokens" ON public.biometric_tokens
    FOR DELETE USING (auth.uid() = user_id);

-- Exchange rates policies (public read access)
CREATE POLICY "Anyone can view exchange rates" ON public.exchange_rates
    FOR SELECT USING (true);

CREATE POLICY "System can manage exchange rates" ON public.exchange_rates
    FOR ALL USING (true);
