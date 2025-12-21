"use client"

import { useEffect, useState } from "react"
import { PaymentMethodSelector } from "@/components/payment/payment-method-selector"
import { PaymentProcessing } from "@/components/payment/payment-processing"
import type { PaymentMethod, PaymentTransaction } from "@/lib/payment-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ShoppingCart } from "lucide-react"

type CartSummary = {
  total: number
  currency: string
  itemsCount?: number
  breakdown?: { label: string; amount: number }[]
}

export default function PaymentPage() {
  const [step, setStep] = useState<"amount" | "method" | "processing" | "success">("amount")

  // amount & currency come from real cart summary API
  const [amount, setAmount] = useState<number | null>(null)
  const [currency, setCurrency] = useState<string>("INR")

  // Payment methods loaded from API
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [methodsLoading, setMethodsLoading] = useState<boolean>(false)
  const [methodsError, setMethodsError] = useState<string | null>(null)

  // Cart summary state
  const [cartLoading, setCartLoading] = useState<boolean>(false)
  const [cartError, setCartError] = useState<string | null>(null)

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null)

  // Coupon state
  const [coupon, setCoupon] = useState<string>("")
  const [couponApplying, setCouponApplying] = useState<boolean>(false)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null)

  // Load cart summary (amount/currency) from the server
  useEffect(() => {
    const loadCart = async () => {
      setCartLoading(true)
      setCartError(null)
      try {
        // Expecting an API returning { total: number, currency: string, ... }
        const res = await fetch("/api/cart/summary")
        if (!res.ok) {
          throw new Error(`Failed to load cart summary (${res.status})`)
        }
        const data: CartSummary = await res.json()
        setAmount(data.total)
        setCurrency(data.currency || "INR")
      } catch (err: any) {
        console.error("Error loading cart summary:", err)
        setCartError(err?.message ?? "Unable to load cart summary")
      } finally {
        setCartLoading(false)
      }
    }

    loadCart()
  }, [])

  // Load available payment methods from the server
  useEffect(() => {
    const loadMethods = async () => {
      setMethodsLoading(true)
      setMethodsError(null)
      try {
        const res = await fetch("/api/payment/methods")
        if (!res.ok) {
          throw new Error(`Failed to load payment methods (${res.status})`)
        }
        const data: PaymentMethod[] = await res.json()
        setPaymentMethods(data)
      } catch (err: any) {
        console.error("Error loading payment methods:", err)
        setMethodsError(err?.message ?? "Unable to load payment methods")
      } finally {
        setMethodsLoading(false)
      }
    }

    loadMethods()
  }, [])

  const handleAmountSubmit = () => {
    if (!amount || amount <= 0) {
      setCartError("Please enter a valid amount to continue.")
      return
    }
    setCartError(null)
    setStep("method")
  }

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setMethodsError(null)
  }

  // Create transaction on server then move to processing step
  const handleProceedToPayment = async () => {
    if (!selectedMethod) {
      setMethodsError("Select a payment method to continue.")
      return
    }
    if (!amount || amount <= 0) {
      setCartError("Invalid amount.")
      setStep("amount")
      return
    }

    try {
      // Create a transaction/session on the backend before moving to processing
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency,
          methodId: selectedMethod.id,
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || `Failed to create transaction (${res.status})`)
      }

      const txn: PaymentTransaction = await res.json()
      setTransaction(txn)
      setStep("processing")
    } catch (err: any) {
      console.error("Payment create error:", err)
      setMethodsError(err?.message ?? "Unable to start payment")
    }
  }

  const handlePaymentSuccess = (txn: PaymentTransaction) => {
    setTransaction(txn)
    setStep("success")
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
    // Keep user on processing step to allow retry or go back
    setMethodsError(error)
    setStep("method")
  }

  const handleCancel = () => {
    if (step === "processing") {
      setStep("method")
    } else if (step === "method") {
      setStep("amount")
    } else {
      // Reset everything
      setStep("amount")
      setSelectedMethod(null)
      setTransaction(null)
    }
  }

  // Coupon application
  const applyCoupon = async () => {
    if (!coupon.trim()) {
      setCouponError("Enter a coupon code to apply.")
      return
    }
    setCouponApplying(true)
    setCouponError(null)
    setCouponSuccess(null)
    try {
      const res = await fetch("/api/cart/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon.trim() }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => null)
        throw new Error(json?.message || `Coupon failed (${res.status})`)
      }
      const updated: CartSummary = await res.json()
      setAmount(updated.total)
      setCurrency(updated.currency || currency)
      setCouponSuccess("Coupon applied successfully.")
    } catch (err: any) {
      console.error("Coupon error:", err)
      setCouponError(err?.message ?? "Unable to apply coupon")
    } finally {
      setCouponApplying(false)
    }
  }

  const formatCurrency = (amt?: number | null) => {
    if (!amt && amt !== 0) return ""
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
      }).format(amt as number)
    } catch {
      return `${currency} ${amt}`
    }
  }

  // Simple fee display (if payment method provides feeRate or fixedFee)
  const calculateFee = (amt: number | null, method?: PaymentMethod) => {
    if (!amt || !method) return 0
    let fee = 0
    if (method.feeRate) {
      fee += (amt * method.feeRate) / 100
    }
    if (method.fixedFee) {
      fee += method.fixedFee
    }
    return Math.round(fee * 100) / 100
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            {step !== "amount" && (
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold">Payment Checkout</h1>
              <p className="text-gray-600">Secure payment processing</p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "amount" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
              }`}
            >
              1
            </div>
            <div
              className={`flex-1 h-1 ${
                ["method", "processing", "success"].includes(step) ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "method"
                  ? "bg-blue-500 text-white"
                  : ["processing", "success"].includes(step)
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
            <div
              className={`flex-1 h-1 ${["processing", "success"].includes(step) ? "bg-green-500" : "bg-gray-300"}`}
            />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "processing"
                  ? "bg-blue-500 text-white"
                  : step === "success"
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              3
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === "amount" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Enter Payment Amount</span>
              </CardTitle>
              <CardDescription>We grabbed your current cart total for checkout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartLoading ? (
                <div className="text-sm text-gray-500">Loading cart summary…</div>
              ) : cartError ? (
                <div className="text-sm text-red-600">{cartError}</div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ({currency})</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount ?? ""}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="Enter amount"
                      min="1"
                      step="0.01"
                    />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Payment Summary</h4>
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(amount)}</div>
                    <p className="text-sm text-gray-600 mt-1">
                      Processing fees will be calculated based on your selected payment method
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Items in cart: { /* optional display */ "—" }</p>
                  </div>

                  {/* Coupon */}
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Coupon code (optional)"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <Button onClick={applyCoupon} disabled={couponApplying}>
                      {couponApplying ? "Applying…" : "Apply"}
                    </Button>
                  </div>
                  {couponError && <div className="text-sm text-red-600">{couponError}</div>}
                  {couponSuccess && <div className="text-sm text-green-600">{couponSuccess}</div>}

                  <Button className="w-full" onClick={handleAmountSubmit} disabled={!amount || amount <= 0}>
                    Continue to Payment Methods
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {step === "method" && (
          <div className="space-y-4">
            {methodsLoading ? (
              <Card>
                <CardContent>Loading payment methods…</CardContent>
              </Card>
            ) : methodsError ? (
              <Card>
                <CardContent className="text-red-600">{methodsError}</CardContent>
              </Card>
            ) : (
              <>
                <PaymentMethodSelector
                  amount={amount ?? 0}
                  currency={currency}
                  onMethodSelect={handleMethodSelect}
                  selectedMethod={selectedMethod || undefined}
                  methods={paymentMethods} // if selector supports a methods prop
                />

                {/* Show fee and final amount for the selected method */}
                {selectedMethod && (
                  <Card>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatCurrency(amount)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Processing fee ({selectedMethod.name})</span>
                        <span>{formatCurrency(calculateFee(amount, selectedMethod))}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>
                          {formatCurrency((amount ?? 0) + calculateFee(amount, selectedMethod))}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div>
                  <Button
                    className="w-full"
                    onClick={handleProceedToPayment}
                    disabled={!selectedMethod || !amount || amount <= 0}
                  >
                    Pay {selectedMethod ? `with ${selectedMethod.name}` : "Now"}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {step === "processing" && selectedMethod && (
          <PaymentProcessing
            amount={amount ?? 0}
            currency={currency}
            paymentMethod={selectedMethod}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onCancel={handleCancel}
            // If backend created a transaction, pass it to PaymentProcessing via props if supported
            // transaction={transaction}
          />
        )}

        {step === "success" && transaction && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Successful</CardTitle>
              <CardDescription>Thank you — your payment was completed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">Transaction ID: {transaction.id}</div>
              <div className="text-lg font-semibold">{formatCurrency(transaction.amount)}</div>
              <div className="flex space-x-2">
                <Button onClick={() => (window.location.href = "/")}>Return to Home</Button>
                <Button variant="ghost" onClick={() => (window.location.href = `/orders/${transaction.orderId}`)}>
                  View Order
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
