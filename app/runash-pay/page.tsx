"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Send,
  QrCode,
  Receipt,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
  Bell,
  Settings,
  User,
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  History,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { InstallPrompt } from "@/components/pwa/install-prompt" 
{/* import { useI18n } from "@/lib/i18n/context" */}
import { useCurrencyConverter } from "@/lib/hooks/use-exchange-rates"
{/* import { useAuth } from "@/lib/auth/auth-context" */}
import { useRouter } from "next/navigation"

interface Transaction {
  id: string
  type: "sent" | "received" | "bill" | "request"
  amount: number
  currency: string
  recipient?: string
  sender?: string
  description: string
  status: "success" | "pending" | "failed"
  timestamp: Date
  category?: string
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

export default function RunashPayPage() {
  const [mounted, setMounted] = useState(false)
  const [balance, setBalance] = useState(25420.5)
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [loading, setLoading] = useState(false)

  // const { t, currentLanguage } = useI18n()
  const { formatCurrency } = useCurrencyConverter()
 // const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)

    // Redirect to login if not authenticated
      if (mounted && !user) {
      router.push("/auth/login")
    }
  }, [mounted, user, router]) 

  const recentTransactions: Transaction[] = [
    {
      id: "1",
      type: "received",
      amount: 2500,
      currency: "INR",
      sender: "Rajesh Kumar",
      description: "Payment for freelance work",
      status: "success",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      category: "income",
    },
    {
      id: "2",
      type: "sent",
      amount: 850,
      currency: "INR",
      recipient: "Priya Sharma",
      description: "Dinner split",
      status: "success",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      category: "food",
    },
    {
      id: "3",
      type: "bill",
      amount: 1200,
      currency: "INR",
      recipient: "Electricity Board",
      description: "Monthly electricity bill",
      status: "success",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      category: "utilities",
    },
    {
      id: "4",
      type: "sent",
      amount: 500,
      currency: "INR",
      recipient: "Amit Patel",
      description: "Coffee meetup",
      status: "pending",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      category: "food",
    },
  ]

  const quickActions: QuickAction[] = [
    {
      id: "send",
      title: "Send Money",
      description: "Send money to contacts",
      icon: <Send className="w-6 h-6" />,
      href: "/send",
      color: "bg-blue-500",
    },
    {
      id: "request",
      title: "Request Money",
      description: "Request money from contacts",
      icon: <ArrowDownLeft className="w-6 h-6" />,
      href: "/request",
      color: "bg-green-500",
    },
    {
      id: "scan",
      title: "Scan QR",
      description: "Scan QR code to pay",
      icon: <QrCode className="w-6 h-6" />,
      href: "/scan",
      color: "bg-purple-500",
    },
    {
      id: "bills",
      title: "Pay Bills",
      description: "Pay utility bills",
      icon: <Receipt className="w-6 h-6" />,
      href: "/bills",
      color: "bg-orange-500",
    },
  ]

  const getTransactionIcon = (transaction: Transaction) => {
    switch (transaction.type) {
      case "sent":
        return <ArrowUpRight className="w-4 h-4 text-red-600" />
      case "received":
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />
      case "bill":
        return <Receipt className="w-4 h-4 text-orange-600" />
      case "request":
        return <Clock className="w-4 h-4 text-blue-600" />
      default:
        return <CreditCard className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />
    }
  }

  const formatAmount = (amount: number, type: Transaction["type"]) => {
    const formatted = formatCurrency(amount, "INR")
    return type === "sent" || type === "bill" ? `-${formatted}` : `+${formatted}`
  }

  const refreshBalance = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const newBalance = balance + (Math.random() - 0.5) * 1000
      setBalance(Math.max(0, newBalance))
      toast.success("Balance updated!")
    } catch (error) {
      toast.error("Failed to refresh balance")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-orange-200 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <div className="glass-white border-b border-orange-200/50 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-orange-100 text-orange-600">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-semibold gradient-text">Good Morning!</h1>
                <p className="text-sm text-orange-600">Welcome back to RunAsh Pay</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="rounded-full">
                <Bell className="w-5 h-5 text-orange-600" />
              </Button>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Settings className="w-5 h-5 text-orange-600" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Balance Card */}
        <Card className="glass-white border-orange-200/50 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-orange-600 mb-1">Total Balance</p>
                <div className="flex items-center space-x-2">
                  {balanceVisible ? (
                    <h2 className="text-3xl font-bold gradient-text">{formatCurrency(balance, "INR")}</h2>
                  ) : (
                    <h2 className="text-3xl font-bold gradient-text">••••••</h2>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshBalance}
                disabled={loading}
                className="bg-transparent border-orange-200 hover:bg-orange-50"
              >
                <Wallet className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-green-50">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Income</span>
                </div>
                <p className="text-lg font-semibold text-green-800">{formatCurrency(12500, "INR")}</p>
                <p className="text-xs text-green-600">This month</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-900">Expenses</span>
                </div>
                <p className="text-lg font-semibold text-red-800">{formatCurrency(8750, "INR")}</p>
                <p className="text-xs text-red-600">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-white border-orange-200/50">
          <CardHeader>
            <CardTitle className="gradient-text">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link key={action.id} href={action.href}>
                  <div className="p-4 rounded-lg glass-subtle hover:glass-orange transition-all cursor-pointer group">
                    <div
                      className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-3 text-white group-hover:scale-110 transition-transform`}
                    >
                      {action.icon}
                    </div>
                    <h3 className="font-medium text-orange-900 mb-1">{action.title}</h3>
                    <p className="text-xs text-orange-600">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="glass-white border-orange-200/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="gradient-text">Recent Transactions</CardTitle>
              <Link href="/transactions">
                <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <p className="text-orange-700">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction)}
                      </div>
                      <div>
                        <p className="font-medium text-orange-900 text-sm">
                          {transaction.recipient || transaction.sender || "Unknown"}
                        </p>
                        <p className="text-xs text-orange-600">{transaction.description}</p>
                        <p className="text-xs text-orange-500">
                          {transaction.timestamp.toLocaleDateString(currentLanguage === "hi" ? "hi-IN" : "en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <p
                          className={`font-semibold text-sm ${
                            transaction.type === "received" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {formatAmount(transaction.amount, transaction.type)}
                        </p>
                        {getStatusIcon(transaction.status)}
                      </div>
                      <Badge
                        variant={
                          transaction.status === "success"
                            ? "default"
                            : transaction.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bottom Navigation Spacer */}
        <div className="h-20" />
      </div>

      {/* PWA Install Prompt */}
      {/* <InstallPrompt /> */}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-md mx-auto">
          <div className="glass-white border-t border-orange-200/50 px-6 py-3">
            <div className="flex items-center justify-around">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-orange-600">
                  <Wallet className="w-5 h-5" />
                  <span className="text-xs">Home</span>
                </Button>
              </Link>
              <Link href="/send">
                <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-orange-500">
                  <Send className="w-5 h-5" />
                  <span className="text-xs">Send</span>
                </Button>
              </Link>
              <Link href="/scan">
                <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-orange-500">
                  <QrCode className="w-5 h-5" />
                  <span className="text-xs">Scan</span>
                </Button>
              </Link>
              <Link href="/transactions">
                <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-orange-500">
                  <History className="w-5 h-5" />
                  <span className="text-xs">History</span>
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 text-orange-500">
                  <User className="w-5 h-5" />
                  <span className="text-xs">Profile</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  }
