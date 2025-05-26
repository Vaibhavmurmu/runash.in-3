"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Award, MapPin, Star } from "lucide-react"
import type { CartSustainabilityMetrics } from "@/types/cart"

interface SustainabilityMetricsProps {
  metrics: CartSustainabilityMetrics
}

export default function SustainabilityMetrics({ metrics }: SustainabilityMetricsProps) {
  const getSustainabilityColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-100"
    if (score >= 6) return "text-yellow-600 bg-yellow-100"
    return "text-orange-600 bg-orange-100"
  }

  const getCarbonFootprintColor = (footprint: number) => {
    if (footprint <= 5) return "text-green-600"
    if (footprint <= 10) return "text-yellow-600"
    return "text-orange-600"
  }

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Leaf className="h-4 w-4 text-green-600" />
          <h3 className="font-medium text-sm text-green-800 dark:text-green-200">Sustainability Impact</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Sustainability Score */}
          <div className="text-center">
            <div
              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full ${getSustainabilityColor(metrics.sustainabilityScore)}`}
            >
              <Star className="h-3 w-3" />
              <span className="text-xs font-medium">{metrics.sustainabilityScore}/10</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Sustainability Score</p>
          </div>

          {/* Carbon Footprint */}
          <div className="text-center">
            <div className={`text-sm font-medium ${getCarbonFootprintColor(metrics.totalCarbonFootprint)}`}>
              {metrics.totalCarbonFootprint}kg CO₂
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Carbon Footprint</p>
          </div>

          {/* Organic Percentage */}
          <div className="text-center">
            <div className="text-sm font-medium text-green-600">{metrics.organicPercentage}%</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Organic Products</p>
          </div>

          {/* Local Products */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <MapPin className="h-3 w-3 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">{metrics.localProductsCount}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Local Products</p>
          </div>
        </div>

        {/* Certifications */}
        {Object.keys(metrics.certificationCounts).length > 0 && (
          <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
            <div className="flex flex-wrap gap-1">
              {Object.entries(metrics.certificationCounts).map(([cert, count]) => (
                <Badge key={cert} variant="outline" className="text-xs bg-white/50">
                  <Award className="h-2 w-2 mr-1" />
                  {cert} ({count})
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
