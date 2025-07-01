// Payment and subscription type definitions

export interface SubscriptionPlan {
  id: number
  name: string
  description: string
  price_monthly: number
  price_yearly: number
  features: string[]
  limits: {
    concurrent_streams: number
    max_quality: string
    storage_gb: number
    bandwidth_gb: number
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserSubscription {
  id: number
  user_id: number
  plan_id: number
  status: "active" | "canceled" | "past_due" | "unpaid"
  billing_cycle: "monthly" | "yearly"
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  canceled_at?: string
  stripe_subscription_id?: string
  created_at: string
  updated_at: string
  plan?: SubscriptionPlan
}

export interface PaymentMethod {
  id: number
  user_id: number
  stripe_payment_method_id: string
  type: string
  card_brand?: string
  card_last4?: string
  card_exp_month?: number
  card_exp_year?: number
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: number
  user_id: number
  subscription_id?: number
  stripe_invoice_id?: string
  invoice_number: string
  amount_due: number
  amount_paid: number
  currency: string
  status: "draft" | "open" | "paid" | "void" | "uncollectible"
  due_date?: string
  paid_at?: string
  invoice_pdf_url?: string
  description?: string
  created_at: string
  updated_at: string
}

export interface PaymentTransaction {
  id: number
  user_id: number
  invoice_id?: number
  stripe_payment_intent_id?: string
  amount: number
  currency: string
  status: "succeeded" | "failed" | "pending" | "canceled"
  payment_method_id?: number
  failure_reason?: string
  created_at: string
  updated_at: string
}

export interface UsageMetric {
  id: number
  user_id: number
  metric_name: string
  metric_value: number
  period_start: string
  period_end: string
  created_at: string
}

export interface BillingInfo {
  subscription: UserSubscription | null
  paymentMethods: PaymentMethod[]
  invoices: Invoice[]
  usage: UsageMetric[]
  upcomingInvoice?: {
    amount: number
    date: string
  }
}
