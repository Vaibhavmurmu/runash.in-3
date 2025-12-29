"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { type PaymentMethod, PaymentService } from "@/lib/payment-service"
import { CreditCard, Smartphone, Building2, Wallet, Clock } from "lucide-react"

interface PaymentMethodSelectorProps {
  amount: number
  currency: string
  onMethodSelect: (method: PaymentMethod) => void
  selectedMethod?: PaymentMethod
}

export function PaymentMethodSelector({
  amount,
  currency,
  onMethodSelect,
  selectedMethod,
}: PaymentMethodSelectorProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const methods = await PaymentService.getPaymentMethods(currency)
        setPaymentMethods(methods)
      } catch (error) {
        console.error("Failed to load payment methods:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPaymentMethods()
  }, [currency])

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-5 w-5" />
      case "upi":
        return <Smartphone className="h-5 w-5" />
      case "netbanking":
        return <Building2 className="h-5 w-5" />
      case "wallet":
        return <Wallet className="h-5 w-5" />
      case "bnpl":
        return <Clock className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const calculateTotal = (method: PaymentMethod) => {
    const fee = PaymentService.calculateProcessingFee(amount, method.id)
    return amount + fee
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Payment Methods...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Payment Method</CardTitle>
        <CardDescription>Choose your preferred payment method to complete the transaction</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => {
          const processingFee = PaymentService.calculateProcessingFee(amount, method.id)
          const total = calculateTotal(method)
          const isSelected = selectedMethod?.id === method.id

          return (
            <div
              key={method.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => onMethodSelect(method)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{method.icon}</div>
                  <div className="flex items-center space-x-2">
                    {getMethodIcon(method.type)}
                    <div>
                      <h3 className="font-medium">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(total)}</div>
                  {processingFee > 0 && (
                    <div className="text-xs text-gray-500">+{formatCurrency(processingFee)} fee</div>
                  )}
                </div>
              </div>

              {method.processingFee > 0 && (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Processing fee ({method.processingFee}%)</span>
                  <Badge variant="secondary">{formatCurrency(processingFee)}</Badge>
                </div>
              )}
            </div>
          )
        })}

        {selectedMethod && (
          <>
            <Separator />
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h4 className="font-medium mb-2">Payment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing fee</span>
                  <span>{formatCurrency(PaymentService.calculateProcessingFee(amount, selectedMethod.id))}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(calculateTotal(selectedMethod))}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
