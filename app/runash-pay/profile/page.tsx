"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Edit,
  QrCode,
  Shield,
  Bell,
  CreditCard,
  Globe,
  HelpCircle,
  LogOut,
  Copy,
  Check,
  Camera,
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("RunAsh Kumar")
  const [mobile, setMobile] = useState("+91 98765 43210")
  const [email, setEmail] = useState("runash@example.com")
  const [copied, setCopied] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [biometric, setBiometric] = useState(true)

  const upiIds = [
    { id: "runash@paytm", bank: "Paytm Payments Bank", primary: true },
    { id: "runash@gpay", bank: "Google Pay", primary: false },
    { id: "9876543210@ybl", bank: "PhonePe", primary: false },
  ]

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="rounded-full">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} className="rounded-full">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Profile Info */}
        <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">RK</span>
                </div>
                {isEditing && (
                  <Button size="sm" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-blue-600">
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
                  </div>
                  <Button
                    onClick={() => setIsEditing(false)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{name}</h2>
                  <p className="text-slate-600 mb-1">{mobile}</p>
                  <p className="text-slate-600">{email}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* UPI IDs */}
        <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">UPI IDs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upiIds.map((upi, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-slate-900">{upi.id}</p>
                    {upi.primary && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                        Primary
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{upi.bank}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(upi.id)} className="rounded-full">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">My QR Code</p>
                  <p className="text-sm text-slate-500">Share to receive payments</p>
                </div>
              </div>
              <Link href="/qr">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-medium text-slate-900">Notifications</p>
                  <p className="text-sm text-slate-500">Payment alerts and updates</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-medium text-slate-900">Biometric Auth</p>
                  <p className="text-sm text-slate-500">Use fingerprint/face unlock</p>
                </div>
              </div>
              <Switch checked={biometric} onCheckedChange={setBiometric} />
            </div>
          </CardContent>
        </Card>

        {/* Menu Options */}
        <div className="space-y-3">
          <Link href="/banks">
            <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-slate-600" />
                    <p className="font-medium text-slate-900">Bank Accounts</p>
                  </div>
                  <Badge variant="secondary">3</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/language">
            <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-slate-600" />
                  <p className="font-medium text-slate-900">Language</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/help">
            <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-slate-600" />
                  <p className="font-medium text-slate-900">Help & Support</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="border-slate-200/50 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-red-600" />
                <p className="font-medium text-red-600">Sign Out</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-sm text-slate-500">RunAsh AI Pay v2.1.0</p>
          <p className="text-xs text-slate-400 mt-1">Built with ❤️ in India</p>
        </div>
      </div>
    </div>
  )
}
