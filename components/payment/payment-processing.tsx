"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { type PaymentMethod, PaymentService, type PaymentTransaction } from "@/lib/payment-service"
import { CheckCircle, XCircle, Loader2, CreditCard, Receipt } from "lucide-react"

interface PaymentProcessingProps {
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  onSuccess: (transaction: PaymentTransaction) => void
  onError: (error: string) => void
  onCancel: () => void
}

export function PaymentProcessing({
  amount,
  currency,
  paymentMethod,
  onSuccess,
  onError,
  onCancel,
}: PaymentProcessingProps) {
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const processingFee = PaymentService.calculateProcessingFee(amount, paymentMethod.id)
  const totalAmount = amount + processingFee

  const handlePayment = async () => {
    setProcessing(true)
    setStatus("processing")
    setProgress(0)

    try {
      // Step 1: Create payment intent
      setProgress(25)
      const intent = await PaymentService.createPaymentIntent(totalAmount, currency, paymentMethod.id, {
        originalAmount: amount,
        processingFee,
      })

      // Step 2: Validate payment method
      setProgress(50)
      const isValid = await PaymentService.validatePaymentMethod(paymentMethod.id, currency)
      if (!isValid) {
        throw new Error("Invalid payment method")
      }

      // Step 3: Process payment
      setProgress(75)
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate processing time

      const result = await PaymentService.processPayment(intent.id)
      setTransaction(result)

      // Step 4: Complete
      setProgress(100)

      if (result.status === "completed") {
        setStatus("success")
        onSuccess(result)
      } else {
        setStatus("error")
        setErrorMessage(result.failureReason || "Payment failed")
        onError(result.failureReason || "Payment failed")
      }
    } catch (error) {
      setStatus("error")
      const message = error instanceof Error ? error.message : "Payment processing failed"
      setErrorMessage(message)
      onError(message)
    } finally {
      setProcessing(false)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "processing":
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case "error":
        return <XCircle className="h-8 w-8 text-red-500" />
      default:
        return <CreditCard className="h-8 w-8 text-gray-400" />
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case "processing":
        return "Processing your payment..."
      case "success":
        return "Payment successful!"
      case "error":
        return "Payment failed"
      default:
        return "Ready to process payment"
    }
  }

  if (status === "success" && transaction) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-green-700">Payment Successful!</CardTitle>
          <CardDescription>Your payment has been processed successfully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Transaction ID</span>
                <span className="font-mono">{transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount</span>
                <span>{formatCurrency(transaction.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span>{transaction.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <Badge variant="default" className="bg-green-500">
                  {transaction.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Date</span>
                <span>{transaction.createdAt.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button className="flex-1" onClick={() => window.print()}>
              <Receipt className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">{getStatusIcon()}</div>
        <CardTitle>{getStatusMessage()}</CardTitle>
        <CardDescription>
          {status === "processing"
            ? "Please do not close this window or navigate away"
            : "Review your payment details below"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "processing" && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-gray-600">
              {progress < 25 && "Initializing payment..."}
              {progress >= 25 && progress < 50 && "Validating payment method..."}
              {progress >= 50 && progress < 75 && "Processing payment..."}
              {progress >= 75 && progress < 100 && "Finalizing transaction..."}
              {progress === 100 && "Payment complete!"}
            </p>
          </div>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h4 className="font-medium mb-3">Payment Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Payment Method</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{paymentMethod.icon}</span>
                <span>{paymentMethod.name}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Amount</span>
              <span>{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Fee</span>
              <span>{formatCurrency(processingFee)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        {status === "idle" && (
          <div className="flex space-x-2">
            <Button className="flex-1" onClick={handlePayment} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${formatCurrency(totalAmount)}`
              )}
            </Button>
            <Button variant="outline" onClick={onCancel} disabled={processing}>
              Cancel
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex space-x-2">
            <Button className="flex-1" onClick={handlePayment}>
              Try Again
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
