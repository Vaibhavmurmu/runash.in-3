"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Check, ArrowRight, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"

import type { MediaFile } from "@/types/upload"
import type { FormatRecommendation, IntendedUse, TargetPlatform } from "@/types/format-recommendations"
import { getFormatRecommendations } from "@/services/ai-format-recommendations"

interface AIRecommendationsProps {
  selectedFile: MediaFile | null
  onSelectRecommendation: (recommendation: FormatRecommendation) => void
}

export default function AIRecommendations({ selectedFile, onSelectRecommendation }: AIRecommendationsProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState<FormatRecommendation[]>([])
  const [selectedRecommendation, setSelectedRecommendation] = useState<FormatRecommendation | null>(null)
  const [intendedUse, setIntendedUse] = useState<IntendedUse>("web-streaming")
  const [targetPlatform, setTargetPlatform] = useState<TargetPlatform | "">("")

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setRecommendations([])
    setSelectedRecommendation(null)

    try {
      const request = {
        fileId: selectedFile.id,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        duration: selectedFile.duration,
        width: selectedFile.width,
        height: selectedFile.height,
        intendedUse,
        targetPlatform: targetPlatform as TargetPlatform | undefined,
      }

      const recommendations = await getFormatRecommendations(request, selectedFile)
      setRecommendations(recommendations)

      // Auto-select the top recommendation
      if (recommendations.length > 0) {
        setSelectedRecommendation(recommendations[0])
      }
    } catch (error) {
      console.error("Error analyzing content:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleApplyRecommendation = () => {
    if (selectedRecommendation) {
      onSelectRecommendation(selectedRecommendation)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-orange-500" />
          AI Format Recommendations
        </CardTitle>
        <CardDescription>Let AI analyze your content and suggest the optimal format and settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedFile ? (
          <Alert>
            <AlertDescription>Select a file first to get AI recommendations</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Intended Use</label>
                <Select value={intendedUse} onValueChange={(value) => setIntendedUse(value as IntendedUse)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select intended use" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-streaming">Web Streaming</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="archiving">Archiving</SelectItem>
                    <SelectItem value="editing">Editing</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Target Platform (Optional)</label>
                <Select value={targetPlatform} onValueChange={(value) => setTargetPlatform(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="twitch">Twitch</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="discord">Discord</SelectItem>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="general-web">General Web</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Content...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Content
                </>
              )}
            </Button>

            {recommendations.length > 0 && (
              <div className="space-y-4 mt-4">
                <Separator />
                <h3 className="text-sm font-medium">Recommendations</h3>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-3">
                    {recommendations.map((recommendation) => (
                      <div
                        key={recommendation.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedRecommendation?.id === recommendation.id
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                            : "hover:border-orange-200 hover:bg-orange-50/50 dark:hover:bg-orange-950/10"
                        }`}
                        onClick={() => setSelectedRecommendation(recommendation)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                selectedRecommendation?.id === recommendation.id
                                  ? "bg-gradient-to-r from-orange-600 to-yellow-500"
                                  : ""
                              }
                            >
                              {recommendation.format.name}
                            </Badge>
                            <span className="text-sm font-medium">
                              {recommendation.targetPlatform
                                ? `Optimized for ${recommendation.targetPlatform}`
                                : `For ${recommendation.intendedUse.replace("-", " ")}`}
                            </span>
                          </div>
                          <Badge variant="outline" className="ml-auto">
                            {recommendation.score}% match
                          </Badge>
                          {selectedRecommendation?.id === recommendation.id && (
                            <Check className="h-4 w-4 text-orange-500 ml-2" />
                          )}
                        </div>
                        <div className="mt-2">
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {recommendation.reasons.map((reason, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-1">•</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </>
        )}
      </CardContent>
      {selectedRecommendation && (
        <CardFooter>
          <Button
            onClick={handleApplyRecommendation}
            className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
          >
            Apply Recommendation <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
