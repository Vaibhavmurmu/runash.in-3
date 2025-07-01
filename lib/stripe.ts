// Stripe configuration and utilities
// In production, you'd use the actual Stripe SDK

export interface StripeConfig {
  publishableKey: string
  secretKey: string
  webhookSecret: string
}

export interface PaymentMethod {
  id: string
  type: string
  card?: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
}

export interface Subscription {
  id: string
  status: string
  current_period_start: number
  current_period_end: number
  cancel_at_period_end: boolean
}

export interface Invoice {
  id: string
  amount_due: number
  amount_paid: number
  currency: string
  status: string
  invoice_pdf: string
  created: number
}

class StripeService {
  private config: StripeConfig

  constructor() {
    this.config = {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_...",
      secretKey: process.env.STRIPE_SECRET_KEY || "sk_test_...",
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "whsec_...",
    }
  }

  // Simulate Stripe API calls for demo purposes
  async createPaymentMethod(cardDetails: any): Promise<PaymentMethod> {
    // In production, this would call Stripe's API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      id: `pm_${Math.random().toString(36).substr(2, 9)}`,
      type: "card",
      card: {
        brand: cardDetails.brand || "visa",
        last4: cardDetails.number?.slice(-4) || "4242",
        exp_month: cardDetails.exp_month || 12,
        exp_year: cardDetails.exp_year || 2025,
      },
    }
  }

  async createSubscription(customerId: string, priceId: string): Promise<Subscription> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const now = Math.floor(Date.now() / 1000)
    return {
      id: `sub_${Math.random().toString(36).substr(2, 9)}`,
      status: "active",
      current_period_start: now,
      current_period_end: now + 30 * 24 * 60 * 60, // 30 days
      cancel_at_period_end: false,
    }
  }

  async updateSubscription(subscriptionId: string, updates: any): Promise<Subscription> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const now = Math.floor(Date.now() / 1000)
    return {
      id: subscriptionId,
      status: updates.cancel_at_period_end ? "active" : "active",
      current_period_start: now,
      current_period_end: now + 30 * 24 * 60 * 60,
      cancel_at_period_end: updates.cancel_at_period_end || false,
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<Subscription> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const now = Math.floor(Date.now() / 1000)
    return {
      id: subscriptionId,
      status: "canceled",
      current_period_start: now,
      current_period_end: now + 30 * 24 * 60 * 60,
      cancel_at_period_end: true,
    }
  }

  async createPaymentIntent(amount: number, currency = "usd"): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      id: `pi_${Math.random().toString(36).substr(2, 9)}`,
      client_secret: `pi_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency,
      status: "requires_payment_method",
    }
  }

  async retrieveInvoice(invoiceId: string): Promise<Invoice> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      id: invoiceId,
      amount_due: 2900, // $29.00 in cents
      amount_paid: 2900,
      currency: "usd",
      status: "paid",
      invoice_pdf: `https://pay.stripe.com/invoice/${invoiceId}/pdf`,
      created: Math.floor(Date.now() / 1000),
    }
  }

  formatAmount(amount: number, currency = "usd"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }
}

export const stripeService = new StripeService()
