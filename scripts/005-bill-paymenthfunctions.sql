-- Function to update bill payment status
CREATE OR REPLACE FUNCTION update_bill_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user_bills with last payment info
  IF NEW.status = 'SUCCESS' THEN
    UPDATE user_bills 
    SET 
      last_bill_amount = NEW.bill_amount,
      last_bill_date = NEW.bill_date,
      updated_at = NOW()
    WHERE id = NEW.user_bill_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for bill payment status updates
DROP TRIGGER IF EXISTS trigger_update_bill_payment_status ON bill_payments;
CREATE TRIGGER trigger_update_bill_payment_status
  AFTER UPDATE ON bill_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_bill_payment_status();

-- Function to create bill reminders
CREATE OR REPLACE FUNCTION create_bill_reminder(
  p_user_id UUID,
  p_user_bill_id UUID,
  p_due_date TIMESTAMP WITH TIME ZONE,
  p_reminder_days INTEGER DEFAULT 3
)
RETURNS UUID AS $$
DECLARE
  reminder_id UUID;
  reminder_date TIMESTAMP WITH TIME ZONE;
BEGIN
  reminder_date := p_due_date - INTERVAL '1 day' * p_reminder_days;
  
  INSERT INTO bill_reminders (user_id, user_bill_id, reminder_date, reminder_type)
  VALUES (p_user_id, p_user_bill_id, reminder_date, 'DUE_DATE')
  RETURNING id INTO reminder_id;
  
  RETURN reminder_id;
END;
$$ LANGUAGE plpgsql;
