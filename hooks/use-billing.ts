"use client"

import { useState, useEffect } from "react"
import type { UserSubscription, PaymentMethod, Invoice, UsageMetric, SubscriptionPlan } from "@/lib/payment-types"

export function useBilling() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [usage, setUsage] = useState<UsageMetric[]>([])
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBillingData()
  }, [])

  const fetchBillingData = async () => {
    try {
      setLoading(true)
      await Promise.all([fetchSubscription(), fetchPaymentMethods(), fetchInvoices(), fetchUsage(), fetchPlans()])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const fetchSubscription = async () => {
    const response = await fetch("/api/billing/subscription")
    if (!response.ok) throw new Error("Failed to fetch subscription")
    const data = await response.json()
    setSubscription(data.subscription)
  }

  const fetchPaymentMethods = async () => {
    const response = await fetch("/api/billing/payment-methods")
    if (!response.ok) throw new Error("Failed to fetch payment methods")
    const data = await response.json()
    setPaymentMethods(data.paymentMethods)
  }

  const fetchInvoices = async () => {
    const response = await fetch("/api/billing/invoices")
    if (!response.ok) throw new Error("Failed to fetch invoices")
    const data = await response.json()
    setInvoices(data.invoices)
  }

  const fetchUsage = async () => {
    const response = await fetch("/api/billing/usage")
    if (!response.ok) throw new Error("Failed to fetch usage")
    const data = await response.json()
    setUsage(data.usage)
  }

  const fetchPlans = async () => {
    const response = await fetch("/api/billing/plans")
    if (!response.ok) throw new Error("Failed to fetch plans")
    const data = await response.json()
    setPlans(data.plans)
  }

  const createSubscription = async (planId: number, billingCycle: "monthly" | "yearly") => {
    const response = await fetch("/api/billing/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, billingCycle }),
    })
    if (!response.ok) throw new Error("Failed to create subscription")
    const data = await response.json()
    setSubscription(data.subscription)
    return data.subscription
  }

  const updateSubscription = async (action: string, planId?: number, billingCycle?: string) => {
    const response = await fetch("/api/billing/subscription", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, planId, billingCycle }),
    })
    if (!response.ok) throw new Error("Failed to update subscription")
    const data = await response.json()
    setSubscription(data.subscription)
    return data.subscription
  }

  const addPaymentMethod = async (cardDetails: any) => {
    const response = await fetch("/api/billing/payment-methods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cardDetails),
    })
    if (!response.ok) throw new Error("Failed to add payment method")
    const data = await response.json()
    setPaymentMethods([...paymentMethods, data.paymentMethod])
    return data.paymentMethod
  }

  const removePaymentMethod = async (paymentMethodId: number) => {
    const response = await fetch(`/api/billing/payment-methods?id=${paymentMethodId}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to remove payment method")
    setPaymentMethods(paymentMethods.filter((pm) => pm.id !== paymentMethodId))
  }

  return {
    subscription,
    paymentMethods,
    invoices,
    usage,
    plans,
    loading,
    error,
    createSubscription,
    updateSubscription,
    addPaymentMethod,
    removePaymentMethod,
    refetch: fetchBillingData,
  }
}
