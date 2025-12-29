"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Smartphone, Shield, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { z } from "zod"

const emailSchema = z.string().email("Please enter a valid email address")
const phoneSchema = z.string().regex(/^\+[1-9]\d{1,14}$/, "Please enter a valid phone number with country code")

interface OTPFormProps {
  purpose?: "login" | "registration" | "password_reset" | "2fa_setup" | "2fa_login"
  onSuccess?: (data: { type: "email" | "sms"; identifier: string; userId?: number }) => void
  onError?: (error: string) => void
}

export function OTPForm({ purpose = "login", onSuccess, onError }: OTPFormProps) {
  const [activeTab, setActiveTab] = useState<"email" | "sms">("email")
  const [step, setStep] = useState<"input" | "verify">("input")
  const [identifier, setIdentifier] = useState("")
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [timeLeft, setTimeLeft] = useState(0)
  const [canResend, setCanResend] = useState(false)

  const otpInputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timeLeft])

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validate input
      if (activeTab === "email") {
        emailSchema.parse(identifier)
      } else {
        phoneSchema.parse(identifier)
      }

      const endpoint = activeTab === "email" ? "/api/auth/otp/email" : "/api/auth/otp/sms"
      const payload = activeTab === "email" ? { email: identifier, purpose } : { phoneNumber: identifier, purpose }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        setStep("verify")
        setSuccess(data.message)
        setTimeLeft(data.expiresIn || 300) // Default 5 minutes
        setCanResend(false)
        // Focus first OTP input
        setTimeout(() => otpInputs.current[0]?.focus(), 100)
      } else {
        setError(data.message)
        onError?.(data.message)
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      } else {
        setError("Failed to send OTP. Please try again.")
      }
      onError?.("Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    const code = otpCode.join("")
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const endpoint = activeTab === "email" ? "/api/auth/otp/email" : "/api/auth/otp/sms"
      const payload =
        activeTab === "email" ? { email: identifier, code, purpose } : { phoneNumber: identifier, code, purpose }

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("OTP verified successfully!")
        onSuccess?.({ type: activeTab, identifier, userId: data.userId })
      } else {
        setError(data.message)
        onError?.(data.message)
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.")
      onError?.("Failed to verify OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtpCode = [...otpCode]
    newOtpCode[index] = value

    setOtpCode(newOtpCode)

    // Auto-focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus()
    }

    // Auto-verify when all digits are entered
    if (newOtpCode.every((digit) => digit !== "") && newOtpCode.join("").length === 6) {
      setTimeout(() => handleVerifyOTP(), 100)
    }
  }

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      otpInputs.current[index - 1]?.focus()
    }
  }

  const handleResendOTP = async () => {
    setOtpCode(["", "", "", "", "", ""])
    setCanResend(false)
    await handleSendOTP(new Event("submit") as any)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getPurposeTitle = () => {
    switch (purpose) {
      case "login":
        return "Sign In Verification"
      case "registration":
        return "Account Registration"
      case "password_reset":
        return "Password Reset"
      case "2fa_setup":
        return "Two-Factor Setup"
      case "2fa_login":
        return "Two-Factor Authentication"
      default:
        return "Verification"
    }
  }

  if (step === "verify") {
    return (
      <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Enter Verification Code
          </CardTitle>
          <CardDescription className="text-gray-600">
            We sent a 6-digit code to {activeTab === "email" ? "your email" : "your phone"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {otpCode.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (otpInputs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold bg-white/50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              ))}
            </div>

            {timeLeft > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                Code expires in {formatTime(timeLeft)}
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            <Button
              onClick={handleVerifyOTP}
              disabled={isLoading || otpCode.some((digit) => !digit)}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                "Verify Code"
              )}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">Didn't receive the code?</p>
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                disabled={!canResend || isLoading}
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
              >
                {canResend ? "Resend Code" : `Resend in ${formatTime(timeLeft)}`}
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                setStep("input")
                setOtpCode(["", "", "", "", "", ""])
                setError("")
                setSuccess("")
              }}
              className="w-full text-gray-600 hover:text-gray-700"
            >
              Change {activeTab === "email" ? "Email" : "Phone Number"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
          {getPurposeTitle()}
        </CardTitle>
        <CardDescription className="text-gray-600">
          Choose how you'd like to receive your verification code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "email" | "sms")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              SMS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="h-12 bg-white/50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !identifier}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Code...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Send Email Code
                  </div>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="sms">
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="h-12 bg-white/50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
                <p className="text-xs text-gray-500">Include country code (e.g., +1 for US, +44 for UK)</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !identifier}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Code...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Send SMS Code
                  </div>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="text-sm font-medium text-orange-800 mb-2">Security Features:</h4>
          <ul className="text-xs text-orange-700 space-y-1">
            <li>• Codes expire automatically for security</li>
            <li>• Rate limiting prevents spam attempts</li>
            <li>• Each code can only be used once</li>
            <li>• Your information is never shared</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
