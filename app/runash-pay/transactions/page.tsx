"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Send,
  Download,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  const transactions = [
    {
      id: "TXN001",
      type: "sent",
      amount: "₹500.00",
      recipient: "John Doe",
      upiId: "john@paytm",
      date: "2024-01-15",
      time: "2:30 PM",
      status: "success",
      note: "Lunch payment",
    },
    {
      id: "TXN002",
      type: "received",
      amount: "₹1,200.00",
      sender: "Sarah Wilson",
      upiId: "sarah@gpay",
      date: "2024-01-15",
      time: "11:45 AM",
      status: "success",
      note: "Freelance work payment",
    },
    {
      id: "TXN003",
      type: "sent",
      amount: "₹250.00",
      recipient: "Coffee Shop",
      upiId: "coffeeshop@paytm",
      date: "2024-01-14",
      time: "4:15 PM",
      status: "success",
      note: "Coffee and snacks",
    },
    {
      id: "TXN004",
      type: "sent",
      amount: "₹750.00",
      recipient: "Mike Johnson",
      upiId: "mike@phonepe",
      date: "2024-01-14",
      time: "1:20 PM",
      status: "failed",
      note: "Dinner split",
    },
    {
      id: "TXN005",
      type: "received",
      amount: "₹2,000.00",
      sender: "Emma Davis",
      upiId: "emma@paytm",
      date: "2024-01-13",
      time: "6:30 PM",
      status: "pending",
      note: "Rent contribution",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.note.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filter === "all" ||
      (filter === "sent" && transaction.type === "sent") ||
      (filter === "received" && transaction.type === "received") ||
      (filter === "pending" && transaction.status === "pending") ||
      (filter === "failed" && transaction.status === "failed")

    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="rounded-full">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-slate-900">Transactions</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Search and Filter */}
        <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions..."
                className="pl-10"
              />
            </div>

            <div className="flex space-x-2 overflow-x-auto">
              {["all", "sent", "received", "pending", "failed"].map((filterType) => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(filterType)}
                  className={`whitespace-nowrap ${
                    filter === filterType ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">₹3,700</p>
              <p className="text-xs text-slate-500">Received</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">₹1,500</p>
              <p className="text-xs text-slate-500">Sent</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">₹2,200</p>
              <p className="text-xs text-slate-500">Net</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className={`p-4 ${index !== filteredTransactions.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "sent" ? "bg-red-100" : "bg-green-100"
                        }`}
                      >
                        {transaction.type === "sent" ? (
                          <Send className="w-4 h-4 text-red-600" />
                        ) : (
                          <Download className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-slate-900">
                            {transaction.type === "sent" ? transaction.recipient : transaction.sender}
                          </p>
                          {getStatusIcon(transaction.status)}
                        </div>
                        <p className="text-xs text-slate-500">{transaction.upiId}</p>
                        <p className="text-xs text-slate-400">{transaction.note}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.type === "sent" ? "text-red-600" : "text-green-600"}`}>
                        {transaction.type === "sent" ? "-" : "+"}
                        {transaction.amount}
                      </p>
                      <p className="text-xs text-slate-500">{transaction.date}</p>
                      <p className="text-xs text-slate-400">{transaction.time}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="secondary" className={`text-xs ${getStatusColor(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                    <p className="text-xs text-slate-400">ID: {transaction.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1 bg-transparent">
                <Calendar className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
