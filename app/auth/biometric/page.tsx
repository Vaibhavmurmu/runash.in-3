"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import Link from "next/link"
import { Fingerprint, Shield, CheckCircle, AlertCircle, Smartphone, Eye, ArrowLeft, Settings } from "lucide-react"
import { BiometricService } from "@/lib/services/biometric-service"

interface BiometricCapability {
  available: boolean
  type: string
  description: string
  icon: React.ReactNode
}

export default function BiometricAuthPage() {
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [capabilities, setCapabilities] = useState<BiometricCapability[]>([])
  const [isSupported, setIsSupported] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [lastAuth, setLastAuth] = useState<Date | null>(null)

  useEffect(() => {
    checkBiometricSupport()
    loadBiometricSettings()
  }, [])

  const checkBiometricSupport = async () => {
    try {
      const supported = await BiometricService.isSupported()
      setIsSupported(supported)

      if (supported) {
        const availableTypes = await BiometricService.getAvailableTypes()
        const caps: BiometricCapability[] = [
          {
            available: availableTypes.includes("fingerprint"),
            type: "fingerprint",
            description: "Use your fingerprint to authenticate",
            icon: <Fingerprint className="w-5 h-5" />,
          },
          {
            available: availableTypes.includes("face"),
            type: "face",
            description: "Use face recognition to authenticate",
            icon: <Eye className="w-5 h-5" />,
          },
          {
            available: availableTypes.includes("voice"),
            type: "voice",
            description: "Use voice recognition to authenticate",
            icon: <Smartphone className="w-5 h-5" />,
          },
        ]
        setCapabilities(caps)
      }
    } catch (error) {
      console.error("Error checking biometric support:", error)
      setError("Failed to check biometric capabilities")
    }
  }

  const loadBiometricSettings = () => {
    const enabled = localStorage.getItem("biometric_enabled") === "true"
    setBiometricEnabled(enabled)

    const lastAuthStr = localStorage.getItem("last_biometric_auth")
    if (lastAuthStr) {
      setLastAuth(new Date(lastAuthStr))
    }
  }

  const handleEnableBiometric = async () => {
    if (!isSupported) {
      setError("Biometric authentication is not supported on this device")
      return
    }

    setLoading(true)
    setError("")

    try {
      const success = await BiometricService.register()
      if (success) {
        setBiometricEnabled(true)
        localStorage.setItem("biometric_enabled", "true")
        toast.success("Biometric authentication enabled successfully!")
      } else {
        setError("Failed to enable biometric authentication")
      }
    } catch (error: any) {
      setError(error.message || "Failed to enable biometric authentication")
    } finally {
      setLoading(false)
    }
  }

  const handleDisableBiometric = () => {
    setBiometricEnabled(false)
    localStorage.setItem("biometric_enabled", "false")
    localStorage.removeItem("last_biometric_auth")
    setLastAuth(null)
    toast.success("Biometric authentication disabled")
  }

  const handleTestBiometric = async () => {
    if (!biometricEnabled) {
      setError("Biometric authentication is not enabled")
      return
    }

    setLoading(true)
    setError("")

    try {
      const success = await BiometricService.authenticate("Test authentication")
      if (success) {
        const now = new Date()
        setLastAuth(now)
        localStorage.setItem("last_biometric_auth", now.toISOString())
        toast.success("Biometric authentication successful!")
      } else {
        setError("Biometric authentication failed")
      }
    } catch (error: any) {
      setError(error.message || "Biometric authentication failed")
    } finally {
      setLoading(false)
    }
  }

  const availableCapabilities = capabilities.filter((cap) => cap.available)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <div className="glass-white border-b border-orange-200/50 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="rounded-full">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold gradient-text">Biometric Authentication</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Status Card */}
        <Card className="glass-white border-orange-200/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    biometricEnabled ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {biometricEnabled ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Shield className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div>
                  <CardTitle className="gradient-text">{biometricEnabled ? "Enabled" : "Disabled"}</CardTitle>
                  <p className="text-sm text-orange-700">
                    {biometricEnabled ? "Biometric auth is active" : "Biometric auth is inactive"}
                  </p>
                </div>
              </div>
              <Switch
                checked={biometricEnabled}
                onCheckedChange={biometricEnabled ? handleDisableBiometric : handleEnableBiometric}
                disabled={loading || !isSupported}
              />
            </div>
          </CardHeader>
        </Card>

        {/* Support Status */}
        <Card className="glass-white border-orange-200/50">
          <CardHeader>
            <CardTitle className="gradient-text flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Device Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isSupported ? (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  Biometric authentication is not supported on this device or browser.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {capabilities.map((capability) => (
                  <div
                    key={capability.type}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      capability.available ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          capability.available ? "bg-green-100" : "bg-gray-100"
                        }`}
                      >
                        {capability.icon}
                      </div>
                      <div>
                        <p className={`font-medium ${capability.available ? "text-green-900" : "text-gray-600"}`}>
                          {capability.type.charAt(0).toUpperCase() + capability.type.slice(1)}
                        </p>
                        <p className={`text-xs ${capability.available ? "text-green-700" : "text-gray-500"}`}>
                          {capability.description}
                        </p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${capability.available ? "bg-green-500" : "bg-gray-300"}`} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        {isSupported && (
          <Card className="glass-white border-orange-200/50">
            <CardHeader>
              <CardTitle className="gradient-text flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!biometricEnabled ? (
                <Button
                  onClick={handleEnableBiometric}
                  disabled={loading || availableCapabilities.length === 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  <Fingerprint className="w-4 h-4 mr-2" />
                  {loading ? "Setting up..." : "Enable Biometric Auth"}
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={handleTestBiometric}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Fingerprint className="w-4 h-4 mr-2" />
                    {loading ? "Authenticating..." : "Test Authentication"}
                  </Button>

                  <Button
                    onClick={handleDisableBiometric}
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    Disable Biometric Auth
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Last Authentication */}
        {lastAuth && (
          <Card className="glass-white border-orange-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-orange-900">Last Authentication</p>
                  <p className="text-sm text-orange-700">
                    {lastAuth.toLocaleDateString()} at {lastAuth.toLocaleTimeString()}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Info */}
        <Card className="glass-white border-orange-200/50">
          <CardHeader>
            <CardTitle className="gradient-text flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-orange-700">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Your biometric data is stored securely on your device and never transmitted to our servers.</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Biometric authentication provides an additional layer of security for your account.</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p>You can disable biometric authentication at any time from this page.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
