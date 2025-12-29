"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, TestTube2 } from "lucide-react"
import type { AlertSuggestion } from "@/types/alert-suggestions"

interface SuggestionCardProps {
  suggestion: AlertSuggestion
  onImplement: () => void
  onDismiss: () => void
  onTest: () => void
  implementing: boolean
  testing: boolean
}

export default function SuggestionCard({
  suggestion,
  onImplement,
  onDismiss,
  onTest,
  implementing,
  testing,
}: SuggestionCardProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-blue-500"
      default:
        return ""
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-500"
    if (confidence >= 60) return "text-yellow-500"
    return "text-orange-500"
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{suggestion.title}</CardTitle>
            <CardDescription>{suggestion.description}</CardDescription>
          </div>
          <Badge
            className={`${
              suggestion.potentialImpact === "high"
                ? "bg-green-500"
                : suggestion.potentialImpact === "medium"
                  ? "bg-yellow-500"
                  : "bg-blue-500"
            }`}
          >
            {suggestion.potentialImpact} impact
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Current</p>
              <div className="bg-muted p-2 rounded text-sm">{suggestion.currentValue || "Not set"}</div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Suggested</p>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded text-sm">{suggestion.suggestedValue}</div>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">AI Reasoning</p>
            <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <span className="font-medium mr-1">Confidence:</span>
              <span className={getConfidenceColor(suggestion.confidence)}>{suggestion.confidence}%</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium mr-1">Difficulty:</span>
              <span>{suggestion.implementationDifficulty}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onDismiss} disabled={implementing || testing}>
          <X className="h-4 w-4 mr-1" />
          Dismiss
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onTest}
            disabled={implementing || testing}
            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
          >
            {testing ? (
              <>
                <div className="animate-spin h-4 w-4 mr-1 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
                Testing...
              </>
            ) : (
              <>
                <TestTube2 className="h-4 w-4 mr-1" />
                A/B Test
              </>
            )}
          </Button>
          <Button
            size="sm"
            onClick={onImplement}
            disabled={implementing || testing}
            className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 text-white"
          >
            {implementing ? (
              <>
                <div className="animate-spin h-4 w-4 mr-1 border-2 border-white border-t-transparent rounded-full"></div>
                Implementing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" />
                Implement
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
