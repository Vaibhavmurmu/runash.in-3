export interface CartItem {
  id: string
  product: Product
  quantity: number
  addedAt: Date
  selectedVariant?: ProductVariant
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  inStock: boolean
  attributes: Record<string, string> // e.g., { size: "1kg", type: "whole" }
}

export interface Cart {
  id: string
  items: CartItem[]
  createdAt: Date
  updatedAt: Date
  appliedCoupons: Coupon[]
  shippingMethod?: ShippingMethod
  sustainabilityMetrics: CartSustainabilityMetrics
}

export interface CartSustainabilityMetrics {
  totalCarbonFootprint: number
  organicPercentage: number
  localProductsCount: number
  sustainabilityScore: number
  certificationCounts: Record<string, number>
}

export interface Coupon {
  id: string
  code: string
  type: "percentage" | "fixed" | "free_shipping"
  value: number
  description: string
  minOrderAmount?: number
  expiresAt?: Date
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: number
  carbonNeutral: boolean
}

export interface CartTotals {
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  savings: number
}

export interface ProductCategory {
  id: string
  name: string
}

export interface NutritionalInfo {
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  fiber: number
  sugar: number
}

// Extend the existing Product type
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  isOrganic: boolean
  sustainabilityScore: number
  image: string
  inStock: boolean
  certifications: string[]
  nutritionalInfo?: NutritionalInfo
  supplier?: string
  carbonFootprint?: number
  variants?: ProductVariant[]
  isLocal?: boolean
  seasonality?: string[]
  shelfLife?: number
}
