"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { useI18n } from "@/lib/i18n/context"
import { toast } from "sonner"
import { CheckCircle, CreditCard, Smartphone, Globe, Calendar, Users, Loader2 } from "lucide-react"
import { useParams } from "next/navigation"

interface PaymentLink {
  id: string
  link_id: string
  title: string
  description: string | null
  amount: number
  currency: string
  is_fixed_amount: boolean
  min_amount: number | null
  max_amount: number | null
  expires_at: string | null
  usage_count: number
  max_usage: number | null
  user: {
    full_name: string
    email: string
  }
}

export default function PaymentPage() {
  const params = useParams()
  const linkId = params.linkId as string
  const { formatCurrency, formatDate } = useI18n()

  const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  // Form state
  const [amount, setAmount] = useState("")
  const [payerName, setPayerName] = useState("")
  const [payerEmail, setPayerEmail] = useState("")
  const [payerPhone, setPayerPhone] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("upi")

  useEffect(() => {
    if (linkId) {
      loadPaymentLink()
    }
  }, [linkId])

  const loadPaymentLink = async () => {
    try {
      const response = await fetch(`/api/payment-links/${linkId}`)
      const result = await response.json()

      if (response.ok) {
        setPaymentLink(result.data)
        if (result.data.is_fixed_amount) {
          setAmount(result.data.amount.toString())
        }
      } else {
        toast.error(result.error || "Payment link not found")
      }
    } catch (error) {
      toast.error("Failed to load payment link")
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!paymentLink) return

    if (!amount || !payerName || !payerEmail) {
      toast.error("Please fill in all required fields")
      return
    }

    const paymentAmount = Number.parseFloat(amount)

    if (paymentLink.is_fixed_amount && paymentAmount !== paymentLink.amount) {
      toast.error("Invalid payment amount")
      return
    }

    if (!paymentLink.is_fixed_amount) {
      if (paymentLink.min_amount && paymentAmount < paymentLink.min_amount) {
        toast.error(`Minimum amount is ${formatCurrency(paymentLink.min_amount, paymentLink.currency)}`)
        return
      }
      if (paymentLink.max_amount && paymentAmount > paymentLink.max_amount) {
        toast.error(`Maximum amount is ${formatCurrency(paymentLink.max_amount, paymentLink.currency)}`)
        return
      }
    }

    setProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // 90% success rate for demo
      const success = Math.random() > 0.1

      if (success) {
        setSuccess(true)
        toast.success("Payment successful!")
      } else {
        toast.error("Payment failed. Please try again.")
      }
    } catch (error) {
      toast.error("Payment processing error")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (!paymentLink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Payment Link Not Found</h2>
            <p className="text-slate-600">This payment link may have expired or been deactivated.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Payment Successful!</h2>
            <p className="text-slate-600 mb-4">
              {formatCurrency(Number.parseFloat(amount), paymentLink.currency)} has been paid to{" "}
              {paymentLink.user.full_name}
            </p>
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">{formatCurrency(Number.parseFloat(amount), paymentLink.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>To:</span>
                  <span className="font-medium">{paymentLink.user.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>For:</span>
                  <span className="font-medium">{paymentLink.title}</span>
                </div>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">Done</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Payment Link Details */}
        <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm mb-6">
          <CardHeader>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">{paymentLink.user.full_name.charAt(0)}</span>
              </div>
              <CardTitle className="text-xl mb-2">{paymentLink.title}</CardTitle>
              <p className="text-slate-600 text-sm">Payment request from {paymentLink.user.full_name}</p>
            </div>
          </CardHeader>
          <CardContent>
            {paymentLink.description && <p className="text-slate-700 mb-4 text-center">{paymentLink.description}</p>}

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {paymentLink.is_fixed_amount
                    ? formatCurrency(paymentLink.amount, paymentLink.currency)
                    : "Variable Amount"}
                </div>
                {!paymentLink.is_fixed_amount && (
                  <div className="text-sm text-slate-600">
                    {paymentLink.min_amount && `Min: ${formatCurrency(paymentLink.min_amount, paymentLink.currency)}`}
                    {paymentLink.min_amount && paymentLink.max_amount && " • "}
                    {paymentLink.max_amount && `Max: ${formatCurrency(paymentLink.max_amount, paymentLink.currency)}`}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
              {paymentLink.expires_at && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Expires {formatDate(paymentLink.expires_at)}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>
                  {paymentLink.usage_count}
                  {paymentLink.max_usage ? `/${paymentLink.max_usage}` : ""} payments
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!paymentLink.is_fixed_amount && (
              <div>
                <Label htmlFor="amount">Amount *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                    {paymentLink.currency === "INR" ? "₹" : "$"}
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-8"
                    step="0.01"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="payerName">Your Name *</Label>
              <Input
                id="payerName"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="payerEmail">Email Address *</Label>
              <Input
                id="payerEmail"
                type="email"
                value={payerEmail}
                onChange={(e) => setPayerEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="payerPhone">Phone Number</Label>
              <Input
                id="payerPhone"
                type="tel"
                value={payerPhone}
                onChange={(e) => setPayerPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label>Payment Method</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === "upi" ? "border-blue-500 bg-blue-50" : "border-slate-200"
                  }`}
                  onClick={() => setPaymentMethod("upi")}
                >
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">UPI</span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === "card" ? "border-blue-500 bg-blue-50" : "border-slate-200"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Card</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 h-12"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay ${amount ? formatCurrency(Number.parseFloat(amount), paymentLink.currency) : formatCurrency(paymentLink.amount, paymentLink.currency)}`
              )}
            </Button>

            <div className="text-center text-xs text-slate-500">
              <p>Secured by RunAsh Pay • Your payment information is encrypted</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
