"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, ExternalLink, Copy } from "lucide-react"

interface ConfigStatus {
  openaiConfigured: boolean
  databaseConfigured: boolean
  vectorSearchEnabled: boolean
  semanticSearchEnabled: boolean
  aiSuggestionsEnabled: boolean
  configValid: boolean
  errors: string[]
}

export function OpenAISetupGuide() {
  const [status, setStatus] = useState<ConfigStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConfigStatus()
  }, [])

  const fetchConfigStatus = async () => {
    try {
      const response = await fetch("/api/admin/config-status")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Error fetching config status:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Configuration Status...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            OpenAI API Configuration
            {status?.openaiConfigured ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                Configured
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="w-3 h-3 mr-1" />
                Not Configured
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Configure OpenAI API for AI-powered search features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!status?.openaiConfigured && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                OpenAI API key is not configured. AI-powered features will be disabled.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <h4 className="font-semibold">Setup Steps:</h4>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-mono bg-muted px-1 rounded">1.</span>
                <div>
                  <p>Get your OpenAI API key from the OpenAI dashboard</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 bg-transparent"
                    onClick={() => window.open("https://platform.openai.com/api-keys", "_blank")}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    OpenAI API Keys
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="font-mono bg-muted px-1 rounded">2.</span>
                <div className="flex-1">
                  <p>Add your API key to environment variables:</p>
                  <div className="mt-1 p-2 bg-muted rounded font-mono text-xs flex items-center justify-between">
                    <span>OPENAI_API_KEY=sk-your-api-key-here</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard("OPENAI_API_KEY=sk-your-api-key-here")}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="font-mono bg-muted px-1 rounded">3.</span>
                <div>
                  <p>Restart your application to apply changes</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Status</CardTitle>
          <CardDescription>Current status of AI search features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded">
              <span>Semantic Search</span>
              {status?.semanticSearchEnabled ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Enabled
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <XCircle className="w-3 h-3 mr-1" />
                  Disabled
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <span>AI Suggestions</span>
              {status?.aiSuggestionsEnabled ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Enabled
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <XCircle className="w-3 h-3 mr-1" />
                  Disabled
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <span>Vector Search</span>
              {status?.vectorSearchEnabled ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Enabled
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <XCircle className="w-3 h-3 mr-1" />
                  Disabled
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <span>Database</span>
              {status?.databaseConfigured ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="w-3 h-3 mr-1" />
                  Not Connected
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {status?.errors && status.errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Configuration Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {status.errors.map((error, index) => (
                <Alert key={index} variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>Required database extensions and tables</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <p>Run these SQL scripts to set up vector search:</p>

            <div className="space-y-2">
              <div className="p-2 bg-muted rounded font-mono text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">1. Enable pgvector extension</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("CREATE EXTENSION IF NOT EXISTS vector;")}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <code>CREATE EXTENSION IF NOT EXISTS vector;</code>
              </div>

              <div className="p-2 bg-muted rounded font-mono text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">2. Run vector support script</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("-- Run scripts/add-vector-support.sql")}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <code>-- Run scripts/add-vector-support.sql</code>
              </div>
            </div>
          </div>

          <Button onClick={fetchConfigStatus} variant="outline">
            Refresh Status
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
