"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, QrCode, Share, Download, Copy, Mail, MessageCircle, Check } from "lucide-react"
import Link from "next/link"

export default function MyQRPage() {
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [copied, setCopied] = useState(false)

  const upiId = "runash@paytm"
  const qrData = `upi://pay?pa=${upiId}&pn=RunAsh&am=${amount}&cu=INR&tn=${note}`

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: string) => {
    const text = `Pay me using UPI: ${upiId}`
    const url = encodeURIComponent(text)

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${url}`, "_blank")
        break
      case "email":
        window.open(`mailto:?subject=Payment Request&body=${text}`, "_blank")
        break
      case "sms":
        window.open(`sms:?body=${text}`, "_blank")
        break
    }
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
            <h1 className="text-xl font-semibold text-slate-900">My QR Code</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* QR Code Display */}
        <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="text-center">
              {/* QR Code Placeholder */}
              <div className="w-64 h-64 bg-white border-2 border-slate-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-56 h-56 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-slate-400" />
                </div>
              </div>

              {/* UPI ID */}
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {upiId}
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="rounded-full">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              <p className="text-slate-600 text-sm">Scan this QR code to pay me instantly</p>
            </div>
          </CardContent>
        </Card>

        {/* Customize Payment */}
        <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Customize Payment Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (Optional)</Label>
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
              <Input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note for the payment"
                className="mt-2"
              />
            </div>

            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">Generate Custom QR</Button>
          </CardContent>
        </Card>

        {/* Share Options */}
        <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Share QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="flex-col space-y-2 h-auto py-4 bg-transparent"
                onClick={() => handleShare("whatsapp")}
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs">WhatsApp</span>
              </Button>

              <Button
                variant="outline"
                className="flex-col space-y-2 h-auto py-4 bg-transparent"
                onClick={() => handleShare("email")}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs">Email</span>
              </Button>

              <Button
                variant="outline"
                className="flex-col space-y-2 h-auto py-4 bg-transparent"
                onClick={() => handleShare("sms")}
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs">SMS</span>
              </Button>
            </div>

            <div className="flex space-x-3 mt-4">
              <Button variant="outline" className="flex-1 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Share className="w-4 h-4 mr-2" />
                More
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <p className="font-medium text-slate-900 text-sm">Print QR</p>
              <p className="text-xs text-slate-500 mt-1">For your shop</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Share className="w-6 h-6 text-green-600" />
              </div>
              <p className="font-medium text-slate-900 text-sm">Share Link</p>
              <p className="text-xs text-slate-500 mt-1">Payment link</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
