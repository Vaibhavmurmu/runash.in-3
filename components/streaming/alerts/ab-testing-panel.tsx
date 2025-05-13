"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TestTube2, ArrowRight, Trophy } from "lucide-react"
import type { AlertTemplate } from "@/types/alerts"
import type { AlertSuggestion, ABTestResult } from "@/types/alert-suggestions"

interface ABTestingPanelProps {
  alertTemplate: AlertTemplate
  testingSuggestions: AlertSuggestion[]
  onCreateTest: (suggestion: AlertSuggestion) => void
}

export default function ABTestingPanel({ alertTemplate, testingSuggestions, onCreateTest }: ABTestingPanelProps) {
  // Mock A/B test results
  const [activeTests] = useState<ABTestResult[]>([
    {
      id: "test-1",
      originalAlertId: alertTemplate.id,
      variantAlertId: "variant-1",
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      impressionsOriginal: 342,
      impressionsVariant: 358,
      engagementOriginal: 103,
      engagementVariant: 143,
      winner: "variant",
      improvementPercentage: 32.4,
      confidenceLevel: 87,
    },
  ])

  const [completedTests] = useState<ABTestResult[]>([
    {
      id: "test-2",
      originalAlertId: alertTemplate.id,
      variantAlertId: "variant-2",
      startDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      impressionsOriginal: 512,
      impressionsVariant: 488,
      engagementOriginal: 179,
      engagementVariant: 151,
      winner: "original",
      improvementPercentage: 12.8,
      confidenceLevel: 76,
    },
  ])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active A/B Tests</CardTitle>
          <CardDescription>Currently running tests for this alert</CardDescription>
        </CardHeader>
        <CardContent>
          {activeTests.length > 0 ? (
            <div className="space-y-4">
              {activeTests.map((test) => (
                <div key={test.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">Testing Alert Variant</h4>
                      <p className="text-sm text-muted-foreground">
                        Started {new Date(test.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className="bg-blue-500">In Progress</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Original</span>
                        <span>
                          {((test.engagementOriginal / test.impressionsOriginal) * 100).toFixed(1)}% engagement
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-400"
                          style={{ width: `${(test.engagementOriginal / test.impressionsOriginal) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Variant</span>
                        <span>{((test.engagementVariant / test.impressionsVariant) * 100).toFixed(1)}% engagement</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500"
                          style={{ width: `${(test.engagementVariant / test.impressionsVariant) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium">Current leader:</span>{" "}
                      <span className="text-orange-500 font-medium">Variant (+{test.improvementPercentage}%)</span>
                    </div>
                    <div>
                      <span className="font-medium">Confidence:</span> {test.confidenceLevel}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <TestTube2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No active tests</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any active A/B tests for this alert. Create one to optimize your alerts.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {testingSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Tests</CardTitle>
            <CardDescription>Tests that have been created but not yet started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testingSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <Badge className="bg-yellow-500">Pending</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{suggestion.description}</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Created {new Date().toLocaleDateString()}</span>
                    <span>Starting soon</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Completed Tests</CardTitle>
          <CardDescription>Results from previous A/B tests</CardDescription>
        </CardHeader>
        <CardContent>
          {completedTests.length > 0 ? (
            <div className="space-y-4">
              {completedTests.map((test) => (
                <div key={test.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">Alert Variant Test</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(test.startDate).toLocaleDateString()} - {new Date(test.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={test.winner === "variant" ? "bg-green-500" : "bg-gray-500"}>Completed</Badge>
                  </div>

                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center">
                      <div className="text-center px-4">
                        <div className="text-lg font-bold">
                          {((test.engagementOriginal / test.impressionsOriginal) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Original</div>
                      </div>
                      <ArrowRight className="h-5 w-5 mx-2" />
                      <div className="text-center px-4">
                        <div className="text-lg font-bold">
                          {((test.engagementVariant / test.impressionsVariant) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Variant</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                      <span className="font-medium">
                        Winner: {test.winner === "original" ? "Original" : "Variant"} ({test.improvementPercentage}%
                        improvement)
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">No completed tests yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
