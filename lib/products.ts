export interface StripeProduct {
  id: string
  name: string
  description: string
  priceInCents: number
  category: "subscription" | "one-time"
}

export const PRODUCTS: StripeProduct[] = [
  {
    id: "basic-plan",
    name: "Basic Plan",
    description: "Perfect for small businesses starting out.",
    priceInCents: 2900,
    category: "subscription",
  },
  {
    id: "pro-plan",
    name: "Pro Plan",
    description: "Advanced features for growing teams.",
    priceInCents: 7900,
    category: "subscription",
  },
  {
    id: "enterprise-plan",
    name: "Enterprise Plan",
    description: "Custom solutions for large scale organizations.",
    priceInCents: 19900,
    category: "subscription",
  },
]
