export interface AlertPerformanceMetrics {
  alertId: string
  impressions: number
  engagementRate: number // percentage of viewers who engaged after seeing the alert
  averageViewerRetention: number // in seconds
  chatActivity: number // messages per minute after alert
  clickThroughRate?: number // for alerts with clickable elements
  conversionRate?: number // for alerts with call-to-action
  averageSentiment: number // -1 to 1 scale
}

export interface AlertSuggestion {
  id: string
  alertId: string
  suggestionType: "message" | "duration" | "animation" | "timing" | "sound" | "visual" | "position" | "comprehensive"
  title: string
  description: string
  currentValue?: string
  suggestedValue: string
  confidence: number // 0-100
  potentialImpact: "low" | "medium" | "high"
  reasoning: string
  implementationDifficulty: "easy" | "medium" | "complex"
  status: "pending" | "implemented" | "dismissed" | "testing"
  createdAt: string
  implementedAt?: string
}

export interface ABTestResult {
  id: string
  originalAlertId: string
  variantAlertId: string
  startDate: string
  endDate: string
  impressionsOriginal: number
  impressionsVariant: number
  engagementOriginal: number
  engagementVariant: number
  winner: "original" | "variant" | "inconclusive"
  improvementPercentage?: number
  confidenceLevel: number // 0-100
}

export interface EngagementTrend {
  period: string
  engagementRate: number
  alertId: string
}
