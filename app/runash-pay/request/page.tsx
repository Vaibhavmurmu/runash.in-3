"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, User, Smartphone, CheckCircle, Clock, Share } from "lucide-react"
import Link from "next/link"

export default function RequestMoneyPage() {
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [note, setNote] = useState("")
  const [method, setMethod] = useState("upi")

  const recentContacts = [
    { name: "John Doe", upi: "john@paytm", avatar: "JD" },
    { name: "Sarah Wilson", upi: "sarah@gpay", avatar: "SW" },
    { name: "Mike Johnson", upi: "mike@phonepe", avatar: "MJ" },
    { name: "Emma Davis", upi: "emma@paytm", avatar: "ED" },
  ]

  const handleRequestMoney = () => {
    if (step === 1 && recipient && amount) {
      setStep(2)
    }
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-md mx-auto px-6 py-6">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Sent!</h2>
            <p className="text-slate-600 mb-6">
              ₹{amount} request sent to {recipient}
            </p>

            <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div className="text-left">
                    <p className="font-medium text-slate-900">Pending Response</p>
                    <p className="text-sm text-slate-500">Waiting for {recipient} to accept</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Link href="/">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">Back to Home</Button>
              </Link>
              <Button variant="outline" className="w-full bg-transparent">
                <Share className="w-4 h-4 mr-2" />
                Share Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
            <h1 className="text-xl font-semibold text-slate-900">Request Money</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Request Method Selection */}
        <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Choose Request Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                method === "upi" ? "border-blue-500 bg-blue-50" : "border-slate-200"
              }`}
              onClick={() => setMethod("upi")}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">UPI ID</p>
                  <p className="text-sm text-slate-500">Request using UPI ID</p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                method === "mobile" ? "border-blue-500 bg-blue-50" : "border-slate-200"
              }`}
              onClick={() => setMethod("mobile")}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Mobile Number</p>
                  <p className="text-sm text-slate-500">Request using mobile number</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {recentContacts.map((contact, index) => (
                <div key={index} className="text-center cursor-pointer" onClick={() => setRecipient(contact.upi)}>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-medium text-sm">{contact.avatar}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-900 truncate">{contact.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Request Form */}
        <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="recipient">{method === "upi" ? "UPI ID" : "Mobile Number"}</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={method === "upi" ? "Enter UPI ID (e.g., user@paytm)" : "Enter mobile number"}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">₹</span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note for your request..."
                className="mt-2 resize-none"
                rows={3}
              />
            </div>

            <Button
              onClick={handleRequestMoney}
              disabled={!recipient || !amount}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Request ₹{amount}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Amount Buttons */}
        <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Amounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {["100", "500", "1000", "2000", "5000", "10000"].map((quickAmount) => (
                <Button key={quickAmount} variant="outline" onClick={() => setAmount(quickAmount)} className="h-12">
                  ₹{quickAmount}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">John Doe</p>
                    <p className="text-sm text-slate-500">₹500 • 2 hours ago</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Pending
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Sarah Wilson</p>
                    <p className="text-sm text-slate-500">₹1,200 • Yesterday</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Paid
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
