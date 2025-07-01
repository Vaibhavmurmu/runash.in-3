"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CreditCard,
  Download,
  Calendar,
  Zap,
  Check,
  ArrowUpRight,
  AlertCircle,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react"
import { useBilling } from "@/hooks/use-billing"
import { useToast } from "@/hooks/use-toast"

export default function BillingPage() {
  const {
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
  } = useBilling()

  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAddCard, setShowAddCard] = useState(false)
  const [showPlanChange, setShowPlanChange] = useState(false)
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvc: "",
    isDefault: false,
  })

  const handleCancelSubscription = async () => {
    try {
      setIsProcessing(true)
      await updateSubscription("cancel")
      toast({
        title: "Subscription canceled",
        description: "Your subscription will remain active until the end of the current billing period.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReactivateSubscription = async () => {
    try {
      setIsProcessing(true)
      await updateSubscription("reactivate")
      toast({
        title: "Subscription reactivated",
        description: "Your subscription has been reactivated and will continue billing.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reactivate subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAddPaymentMethod = async () => {
    try {
      setIsProcessing(true)
      await addPaymentMethod(cardForm)
      setShowAddCard(false)
      setCardForm({ cardNumber: "", expMonth: "", expYear: "", cvc: "", isDefault: false })
      toast({
        title: "Payment method added",
        description: "Your new payment method has been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add payment method. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemovePaymentMethod = async (paymentMethodId: number) => {
    try {
      await removePaymentMethod(paymentMethodId)
      toast({
        title: "Payment method removed",
        description: "The payment method has been removed from your account.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove payment method. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getUsagePercentage = (metricName: string, currentValue: number) => {
    if (!subscription?.plan?.limits) return 0
    const limit = subscription.plan.limits[metricName as keyof typeof subscription.plan.limits]
    if (typeof limit !== "number" || limit <= 0) return 0
    return Math.min((currentValue / limit) * 100, 100)
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Error loading billing information</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  const currentPlan = subscription?.plan || plans.find((p) => p.name === "Creator")
  const currentUsage = {
    streams: usage.find((u) => u.metric_name === "concurrent_streams")?.metric_value || 7,
    storage: usage.find((u) => u.metric_name === "storage_gb")?.metric_value || 45,
    bandwidth: usage.find((u) => u.metric_name === "bandwidth_gb")?.metric_value || 210,
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription, billing, and usage</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Current Plan
                <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white">
                  {currentPlan?.name || "Creator Plan"}
                </Badge>
              </CardTitle>
              <CardDescription>
                {subscription ? `You're currently on the ${currentPlan?.name} plan` : "No active subscription"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{formatCurrency(currentPlan?.price_monthly || 29)}</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Next billing date</div>
                  <div className="font-medium">
                    {subscription?.current_period_end
                      ? new Date(subscription.current_period_end).toLocaleDateString()
                      : "February 1, 2024"}
                  </div>
                </div>
              </div>

              {subscription?.cancel_at_period_end && (
                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-center gap-2 text-sm text-yellow-700">
                    <AlertCircle className="h-4 w-4" />
                    Your subscription will be canceled at the end of the current billing period.
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 bg-transparent"
                    onClick={handleReactivateSubscription}
                    disabled={isProcessing}
                  >
                    Reactivate Subscription
                  </Button>
                </div>
              )}

              <Separator />

              {/* Usage This Month */}
              <div className="space-y-3">
                <h4 className="font-medium">Usage This Month</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Concurrent Streams</span>
                      <span>
                        {currentUsage.streams}/{currentPlan?.limits?.concurrent_streams || 10}
                      </span>
                    </div>
                    <Progress value={getUsagePercentage("concurrent_streams", currentUsage.streams)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Storage (GB)</span>
                      <span>
                        {currentUsage.storage}/{currentPlan?.limits?.storage_gb || 100}
                      </span>
                    </div>
                    <Progress value={getUsagePercentage("storage_gb", currentUsage.storage)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Bandwidth (GB)</span>
                      <span>
                        {currentUsage.bandwidth}/{currentPlan?.limits?.bandwidth_gb || 500}
                      </span>
                    </div>
                    <Progress value={getUsagePercentage("bandwidth_gb", currentUsage.bandwidth)} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>Choose the plan that best fits your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative rounded-lg border p-4 ${
                      subscription?.plan_id === plan.id
                        ? "border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100"
                        : "border-border"
                    }`}
                  >
                    {subscription?.plan_id === plan.id && (
                      <Badge className="absolute -top-2 left-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white">
                        Current Plan
                      </Badge>
                    )}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                      <div>
                        <span className="text-2xl font-bold">{formatCurrency(plan.price_monthly)}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <ul className="space-y-1 text-sm">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full"
                        variant={subscription?.plan_id === plan.id ? "default" : "outline"}
                        disabled={subscription?.plan_id === plan.id}
                      >
                        {subscription?.plan_id === plan.id ? "Current Plan" : "Upgrade"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Download your invoices and view payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200">
                        <CreditCard className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium">{invoice.invoice_number}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(invoice.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(invoice.amount_due)}</div>
                        <Badge variant="secondary" className="text-xs">
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="p-2 rounded bg-gradient-to-br from-blue-100 to-blue-200">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">•••• •••• •••• {method.card_last4}</div>
                    <div className="text-sm text-muted-foreground">
                      {method.card_brand?.toUpperCase()} • Expires {method.card_exp_month}/{method.card_exp_year}
                    </div>
                  </div>
                  {method.is_default && (
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleRemovePaymentMethod(method.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>Add a new credit or debit card to your account</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardForm.cardNumber}
                        onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="expMonth">Month</Label>
                        <Select
                          value={cardForm.expMonth}
                          onValueChange={(value) => setCardForm({ ...cardForm, expMonth: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                                {String(i + 1).padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expYear">Year</Label>
                        <Select
                          value={cardForm.expYear}
                          onValueChange={(value) => setCardForm({ ...cardForm, expYear: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="YYYY" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => (
                              <SelectItem key={i} value={String(new Date().getFullYear() + i)}>
                                {new Date().getFullYear() + i}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          placeholder="123"
                          value={cardForm.cvc}
                          onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleAddPaymentMethod}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
                    >
                      {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Payment Method"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Calendar className="mr-2 h-4 w-4" />
                Billing History
              </Button>
              {subscription && !subscription.cancel_at_period_end && (
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent text-red-600 hover:text-red-700"
                  onClick={handleCancelSubscription}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Cancel Subscription"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Usage Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                Usage Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You're using {Math.round(getUsagePercentage("concurrent_streams", currentUsage.streams))}% of your
                concurrent stream limit. Consider upgrading to avoid interruptions.
              </p>
              <Button
                size="sm"
                className="mt-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
              >
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
