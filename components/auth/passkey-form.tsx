"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Fingerprint, Shield, AlertCircle } from "lucide-react"
import { startAuthentication } from "@simplewebauthn/browser"

export function PasskeyLoginForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isUsernameless, setIsUsernameless] = useState(false)

  const handlePasskeyLogin = async (userEmail?: string) => {
    setIsLoading(true)
    setError("")

    try {
      // Get authentication options
      const optionsResponse = await fetch(`/api/auth/passkey/authenticate${userEmail ? `?email=${userEmail}` : ""}`)
      const options = await optionsResponse.json()

      if (!optionsResponse.ok) {
        throw new Error(options.error || "Failed to get authentication options")
      }

      // Start WebAuthn authentication
      const authResponse = await startAuthentication(options)

      // Verify authentication
      const verifyResponse = await fetch("/api/auth/passkey/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response: authResponse,
          expectedChallenge: options.challenge,
        }),
      })

      const verifyResult = await verifyResponse.json()

      if (verifyResponse.ok) {
        // Redirect to dashboard
        window.location.href = "/dashboard"
      } else {
        setError(verifyResult.error || "Authentication failed")
      }
    } catch (err: any) {
      console.error("Passkey authentication error:", err)
      if (err.name === "NotAllowedError") {
        setError("Authentication was cancelled or timed out")
      } else if (err.name === "NotSupportedError") {
        setError("Passkeys are not supported on this device")
      } else {
        setError(err.message || "Authentication failed")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handlePasskeyLogin(email)
  }

  const handleUsernamelessLogin = async () => {
    await handlePasskeyLogin()
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
          <Fingerprint className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
          Passkey Sign In
        </CardTitle>
        <CardDescription className="text-gray-600">
          Sign in securely with your fingerprint, face, or security key
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isUsernameless ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address (Optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white/50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
              <p className="text-xs text-gray-500">
                Providing your email helps us find your passkeys faster, but it's not required.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4" />
                  Sign In with Passkey
                </div>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleUsernamelessLogin}
              disabled={isLoading}
              className="w-full h-12 border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
            >
              <Shield className="w-4 h-4 mr-2" />
              Sign In Without Email
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <Button
              onClick={handleUsernamelessLogin}
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4" />
                  Authenticate with Passkey
                </div>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={() => setIsUsernameless(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Back to email option
            </Button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="text-sm font-medium text-orange-800 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Secure & Convenient
          </h4>
          <ul className="text-xs text-orange-700 space-y-1">
            <li>• Use your fingerprint, face, or security key</li>
            <li>• No passwords to remember or type</li>
            <li>• Protected by your device's security</li>
            <li>• Works across all your devices</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
