"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Sparkles, CheckCircle, AlertCircle } from "lucide-react"
import { z } from "zod"

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export function MagicLinkForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      // Validate email
      emailSchema.parse({ email })

      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setIsSuccess(true)
        setEmail("")
      } else {
        setError(data.error || "Failed to send magic link")
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Check Your Email</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
            </div>
            <Button
              onClick={() => {
                setIsSuccess(false)
                setMessage("")
              }}
              variant="outline"
              className="w-full"
            >
              Send Another Link
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
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
          Magic Link Sign In
        </CardTitle>
        <CardDescription className="text-gray-600">Enter your email to receive a secure sign-in link</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-white/50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !email}
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending Magic Link...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Send Magic Link
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="text-sm font-medium text-orange-800 mb-2">How it works:</h4>
          <ul className="text-xs text-orange-700 space-y-1">
            <li>• We'll send a secure link to your email</li>
            <li>• Click the link to sign in instantly</li>
            <li>• No password required - it's that simple!</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
