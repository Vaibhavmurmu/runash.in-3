"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, ArrowRight, BarChart, TestTube2, Sparkles } from "lucide-react"
import {
  generateAlertSuggestions,
  getAlertPerformanceMetrics,
  implementSuggestion,
  createABTest,
} from "@/services/ai-alert-suggestions"
import type { AlertTemplate } from "@/types/alerts"
import type { AlertSuggestion, AlertPerformanceMetrics } from "@/types/alert-suggestions"
import SuggestionCard from "./suggestion-card"
import AlertPerformance from "./alert-performance"
import ABTestingPanel from "./ab-testing-panel"

interface AlertSuggestionsProps {
  templates: AlertTemplate[]
  onUpdateTemplate: (template: AlertTemplate) => void
}

export default function AlertSuggestions({ templates, onUpdateTemplate }: AlertSuggestionsProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<AlertSuggestion[]>([])
  const [metrics, setMetrics] = useState<AlertPerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("suggestions")
  const [implementingId, setImplementingId] = useState<string | null>(null)
  const [testingId, setTestingId] = useState<string | null>(null)

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || null

  useEffect(() => {
    if (selectedTemplateId) {
      loadMetricsAndSuggestions()
    } else {
      setSuggestions([])
      setMetrics(null)
    }
  }, [selectedTemplateId])

  const loadMetricsAndSuggestions = async () => {
    if (!selectedTemplateId) return

    setLoading(true)
    try {
      const metrics = await getAlertPerformanceMetrics(selectedTemplateId)
      setMetrics(metrics)

      if (selectedTemplate) {
        const suggestions = await generateAlertSuggestions(selectedTemplate, metrics, [])
        setSuggestions(suggestions)
      }
    } catch (error) {
      console.error("Error loading metrics and suggestions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImplementSuggestion = async (suggestion: AlertSuggestion) => {
    if (!selectedTemplate) return

    setImplementingId(suggestion.id)
    try {
      const updatedTemplate = await implementSuggestion(suggestion, selectedTemplate)
      onUpdateTemplate(updatedTemplate)

      // Update suggestion status
      setSuggestions(
        suggestions.map((s) =>
          s.id === suggestion.id ? { ...s, status: "implemented", implementedAt: new Date().toISOString() } : s,
        ),
      )
    } catch (error) {
      console.error("Error implementing suggestion:", error)
    } finally {
      setImplementingId(null)
    }
  }

  const handleDismissSuggestion = (suggestionId: string) => {
    setSuggestions(suggestions.map((s) => (s.id === suggestionId ? { ...s, status: "dismissed" } : s)))
  }

  const handleCreateABTest = async (suggestion: AlertSuggestion) => {
    if (!selectedTemplate) return

    setTestingId(suggestion.id)
    try {
      // Create a variant template with the suggested change
      const variantTemplate = await implementSuggestion(suggestion, selectedTemplate)

      // Create the A/B test
      await createABTest(selectedTemplate, variantTemplate)

      // Update suggestion status
      setSuggestions(suggestions.map((s) => (s.id === suggestion.id ? { ...s, status: "testing" } : s)))
    } catch (error) {
      console.error("Error creating A/B test:", error)
    } finally {
      setTestingId(null)
    }
  }

  const pendingSuggestions = suggestions.filter((s) => s.status === "pending")
  const implementedSuggestions = suggestions.filter((s) => s.status === "implemented")
  const testingSuggestions = suggestions.filter((s) => s.status === "testing")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-orange-500" />
            AI Alert Suggestions
          </h2>
          <p className="text-muted-foreground">
            Get AI-powered suggestions to improve your alerts based on viewer engagement
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Alert</CardTitle>
            <CardDescription>Choose an alert to analyze</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {templates.map((template) => (
              <Button
                key={template.id}
                variant={selectedTemplateId === template.id ? "default" : "outline"}
                className={`w-full justify-start ${
                  selectedTemplateId === template.id ? "bg-gradient-to-r from-orange-600 to-yellow-500 text-white" : ""
                }`}
                onClick={() => setSelectedTemplateId(template.id)}
              >
                {template.name}
              </Button>
            ))}
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          {selectedTemplate ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
                <TabsTrigger value="suggestions">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Suggestions
                </TabsTrigger>
                <TabsTrigger value="performance">
                  <BarChart className="h-4 w-4 mr-2" />
                  Performance
                </TabsTrigger>
                <TabsTrigger value="testing">
                  <TestTube2 className="h-4 w-4 mr-2" />
                  A/B Testing
                </TabsTrigger>
              </TabsList>

              <TabsContent value="suggestions" className="space-y-6">
                {loading ? (
                  <Card>
                    <CardContent className="py-10">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
                        <p>Analyzing viewer engagement and generating suggestions...</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : pendingSuggestions.length > 0 ? (
                  <div className="space-y-4">
                    {pendingSuggestions.map((suggestion) => (
                      <SuggestionCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        onImplement={() => handleImplementSuggestion(suggestion)}
                        onDismiss={() => handleDismissSuggestion(suggestion.id)}
                        onTest={() => handleCreateABTest(suggestion)}
                        implementing={implementingId === suggestion.id}
                        testing={testingId === suggestion.id}
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-10">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Lightbulb className="h-12 w-12 text-orange-500 mb-4" />
                        <h3 className="text-xl font-medium mb-2">No suggestions available</h3>
                        <p className="text-muted-foreground max-w-md">
                          We don't have any suggestions for this alert right now. This could mean your alert is already
                          performing well!
                        </p>
                        <Button onClick={loadMetricsAndSuggestions} variant="outline" className="mt-4">
                          Refresh Analysis
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {implementedSuggestions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Recently Implemented</h3>
                    <div className="space-y-4">
                      {implementedSuggestions.map((suggestion) => (
                        <Card key={suggestion.id} className="bg-muted/50">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">{suggestion.title}</CardTitle>
                                <CardDescription>{suggestion.description}</CardDescription>
                              </div>
                              <Badge className="bg-green-500">Implemented</Badge>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="performance">
                {metrics ? (
                  <AlertPerformance metrics={metrics} alertTemplate={selectedTemplate} />
                ) : (
                  <Card>
                    <CardContent className="py-10">
                      <div className="flex flex-col items-center justify-center">
                        <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
                        <p>No performance data available for this alert yet.</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="testing">
                <ABTestingPanel
                  alertTemplate={selectedTemplate}
                  testingSuggestions={testingSuggestions}
                  onCreateTest={handleCreateABTest}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="py-10">
                <div className="flex flex-col items-center justify-center text-center">
                  <ArrowRight className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Select an alert</h3>
                  <p className="text-muted-foreground max-w-md">
                    Choose an alert from the list to see AI-powered suggestions for improvement based on viewer
                    engagement.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
