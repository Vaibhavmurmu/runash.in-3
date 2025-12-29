"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Search, Check, AlertCircle } from "lucide-react"

import type { MediaFile } from "@/types/upload"
import type { ConversionSettings } from "@/types/conversion"
import type { CompatibilityCheckRequest, CompatibilityResult, PlatformCategory } from "@/types/platform-requirements"
import { checkCompatibilityWithAllPlatforms } from "@/services/compatibility-checker-service"
import { getAllPlatformCategories } from "@/services/platform-requirements-service"

interface CompatibilityCheckerProps {
  selectedFile?: MediaFile | null
  targetFormat: string
  settings: ConversionSettings
  onOptimizeForPlatform: (platformId: string) => void
}

export default function CompatibilityChecker({
  selectedFile,
  targetFormat,
  settings,
  onOptimizeForPlatform,
}: CompatibilityCheckerProps) {
  const [results, setResults] = useState<CompatibilityResult[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<PlatformCategory | "all">("all")
  const [isChecking, setIsChecking] = useState(false)

  const categories = ["all" as const, ...getAllPlatformCategories()]

  // Filter results by category
  const filteredResults =
    activeCategory === "all" ? results : results.filter((result) => result.platform.category === activeCategory)

  // Sort results by compatibility score
  const sortedResults = [...filteredResults].sort((a, b) => b.score - a.score)

  // Get the selected platform result
  const selectedResult = selectedPlatform ? results.find((result) => result.platform.id === selectedPlatform) : null

  // Check compatibility when settings change
  const checkCompatibility = () => {
    if (!targetFormat) return

    setIsChecking(true)

    // Create compatibility check request
    const request: CompatibilityCheckRequest = {
      format: targetFormat,
      resolution: settings.resolution,
      videoBitrate: settings.videoBitrate,
      audioBitrate: settings.audioBitrate,
      framerate: settings.framerate,
      fileSize: selectedFile?.size ? selectedFile.size / 1024 / 1024 : undefined, // Convert to MB
      duration: selectedFile?.duration,
      mediaType: selectedFile?.type === "audio" ? "audio" : "video",
    }

    // Check compatibility with all platforms
    const results = checkCompatibilityWithAllPlatforms(request)
    setResults(results)
    setIsChecking(false)

    // Select first platform if none selected
    if (!selectedPlatform && results.length > 0) {
      setSelectedPlatform(results[0].platform.id)
    }
  }

  // Handle optimize for platform
  const handleOptimizeForPlatform = (platformId: string) => {
    onOptimizeForPlatform(platformId)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5 text-orange-500" />
          Platform Compatibility Checker
        </CardTitle>
        <CardDescription>
          Check if your current format and settings are compatible with popular platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div>
              <h3 className="text-sm font-medium mb-2">Current Settings</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{targetFormat.toUpperCase()}</Badge>
                {settings.resolution && (
                  <Badge variant="outline">
                    {settings.resolution.width}x{settings.resolution.height}
                  </Badge>
                )}
                {settings.videoBitrate && <Badge variant="outline">{settings.videoBitrate} kbps video</Badge>}
                {settings.audioBitrate && <Badge variant="outline">{settings.audioBitrate} kbps audio</Badge>}
                {settings.framerate && <Badge variant="outline">{settings.framerate} fps</Badge>}
              </div>
            </div>
            <Button
              onClick={checkCompatibility}
              disabled={isChecking || !targetFormat}
              className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
            >
              {isChecking ? "Checking..." : "Check Compatibility"}
            </Button>
          </div>
        </div>

        {results.length > 0 ? (
          <Tabs defaultValue="platforms" className="w-full">
            <TabsList className="grid grid-cols-2 w-full rounded-none border-b">
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="details">Compatibility Details</TabsTrigger>
            </TabsList>

            <TabsContent value="platforms" className="p-0">
              <div className="p-4 border-b">
                <h3 className="text-sm font-medium mb-2">Filter by Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={activeCategory === category ? "default" : "outline"}
                      className={
                        activeCategory === category
                          ? "bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90 cursor-pointer"
                          : "cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/20"
                      }
                      onClick={() => setActiveCategory(category)}
                    >
                      {category === "all" ? "All Platforms" : category.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {sortedResults.map((result) => (
                    <Card
                      key={result.platform.id}
                      className={`cursor-pointer transition-all ${
                        selectedPlatform === result.platform.id
                          ? "border-orange-500 shadow-md"
                          : "hover:border-orange-200"
                      }`}
                      onClick={() => setSelectedPlatform(result.platform.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
                              {/* Platform logo would go here */}
                              <span className="text-xs font-bold">{result.platform.name.charAt(0)}</span>
                            </div>
                            <h3 className="font-medium">{result.platform.name}</h3>
                          </div>
                          {result.compatible ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>

                        <div className="mb-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Compatibility</span>
                            <span>{result.score}%</span>
                          </div>
                          <Progress value={result.score} className="h-2" />
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {result.errors.length > 0 && (
                            <div className="flex items-center gap-1 text-red-500">
                              <AlertCircle className="h-3 w-3" />
                              <span>
                                {result.errors.length} error{result.errors.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                          {result.warnings.length > 0 && (
                            <div className="flex items-center gap-1 text-amber-500">
                              <AlertTriangle className="h-3 w-3" />
                              <span>
                                {result.warnings.length} warning{result.warnings.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                          {result.errors.length === 0 && result.warnings.length === 0 && (
                            <div className="flex items-center gap-1 text-green-500">
                              <Check className="h-3 w-3" />
                              <span>Fully compatible</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="details" className="p-4">
              {selectedResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
                        {/* Platform logo would go here */}
                        <span className="text-sm font-bold">{selectedResult.platform.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{selectedResult.platform.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {selectedResult.platform.category.replace("-", " ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => window.open(selectedResult.platform.url, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Platform Guidelines
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
                        onClick={() => handleOptimizeForPlatform(selectedResult.platform.id)}
                      >
                        Optimize for {selectedResult.platform.name}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge
                      variant={selectedResult.compatible ? "default" : "destructive"}
                      className={selectedResult.compatible ? "bg-green-500" : ""}
                    >
                      {selectedResult.compatible ? "Compatible" : "Not Compatible"}
                    </Badge>
                    <Badge variant="outline">{selectedResult.score}% Score</Badge>
                  </div>

                  <Separator />

                  {selectedResult.errors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        Compatibility Errors
                      </h4>
                      {selectedResult.errors.map((error, index) => (
                        <Alert key={index} variant="destructive">
                          <AlertTitle className="text-sm">
                            {error.type.charAt(0).toUpperCase() + error.type.slice(1)} Issue
                          </AlertTitle>
                          <AlertDescription className="text-xs">
                            <p>{error.message}</p>
                            {error.recommendation && (
                              <p className="mt-1 font-medium">Recommendation: {error.recommendation}</p>
                            )}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}

                  {selectedResult.warnings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-amber-500 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        Compatibility Warnings
                      </h4>
                      {selectedResult.warnings.map((warning, index) => (
                        <Alert
                          key={index}
                          variant="warning"
                          className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                        >
                          <AlertTitle className="text-sm">
                            {warning.type.charAt(0).toUpperCase() + warning.type.slice(1)} Warning
                          </AlertTitle>
                          <AlertDescription className="text-xs">
                            <p>{warning.message}</p>
                            {warning.recommendation && (
                              <p className="mt-1 font-medium">Recommendation: {warning.recommendation}</p>
                            )}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}

                  {selectedResult.errors.length === 0 && selectedResult.warnings.length === 0 && (
                    <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertTitle className="text-green-600 dark:text-green-400">Fully Compatible</AlertTitle>
                      <AlertDescription className="text-green-600 dark:text-green-400">
                        Your current settings are fully compatible with {selectedResult.platform.name}.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Platform Requirements</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium">Supported Formats</h5>
                        <div className="flex flex-wrap gap-1">
                          {selectedResult.platform.formats.map((format) => (
                            <Badge
                              key={format.format}
                              variant="outline"
                              className={format.recommended ? "border-green-500 text-green-600" : ""}
                            >
                              {format.format.toUpperCase()}
                              {format.recommended && <Check className="ml-1 h-3 w-3" />}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-xs font-medium">Recommended Resolutions</h5>
                        <div className="flex flex-wrap gap-1">
                          {selectedResult.platform.resolutions
                            .filter((res) => res.recommended)
                            .map((res) => (
                              <Badge
                                key={`${res.width}x${res.height}`}
                                variant="outline"
                                className="border-green-500 text-green-600"
                              >
                                {res.width}x{res.height}
                                {res.notes && ` (${res.notes})`}
                              </Badge>
                            ))}
                        </div>
                      </div>

                      {selectedResult.platform.videoBitrate && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium">Video Bitrate</h5>
                          <p className="text-xs">
                            Recommended: {selectedResult.platform.videoBitrate.recommended} kbps
                            <br />
                            Maximum: {selectedResult.platform.videoBitrate.max} kbps
                            {selectedResult.platform.videoBitrate.notes && (
                              <>
                                <br />
                                Note: {selectedResult.platform.videoBitrate.notes}
                              </>
                            )}
                          </p>
                        </div>
                      )}

                      {selectedResult.platform.audioBitrate && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium">Audio Bitrate</h5>
                          <p className="text-xs">
                            Recommended: {selectedResult.platform.audioBitrate.recommended} kbps
                            <br />
                            Maximum: {selectedResult.platform.audioBitrate.max} kbps
                            {selectedResult.platform.audioBitrate.notes && (
                              <>
                                <br />
                                Note: {selectedResult.platform.audioBitrate.notes}
                              </>
                            )}
                          </p>
                        </div>
                      )}

                      {selectedResult.platform.framerate && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium">Framerate</h5>
                          <p className="text-xs">
                            Recommended: {selectedResult.platform.framerate.recommended} fps
                            <br />
                            Maximum: {selectedResult.platform.framerate.max} fps
                            {selectedResult.platform.framerate.notes && (
                              <>
                                <br />
                                Note: {selectedResult.platform.framerate.notes}
                              </>
                            )}
                          </p>
                        </div>
                      )}

                      {selectedResult.platform.fileSize && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium">File Size Limit</h5>
                          <p className="text-xs">
                            Maximum: {selectedResult.platform.fileSize.max} MB
                            {selectedResult.platform.fileSize.notes && (
                              <>
                                <br />
                                Note: {selectedResult.platform.fileSize.notes}
                              </>
                            )}
                          </p>
                        </div>
                      )}

                      {selectedResult.platform.duration && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium">Duration Limit</h5>
                          <p className="text-xs">
                            Maximum: {Math.floor(selectedResult.platform.duration.max / 60)} minutes
                            {selectedResult.platform.duration.notes && (
                              <>
                                <br />
                                Note: {selectedResult.platform.duration.notes}
                              </>
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedResult.platform.additionalRequirements &&
                      selectedResult.platform.additionalRequirements.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-medium">Additional Requirements</h5>
                          <ul className="text-xs list-disc pl-5 space-y-1">
                            {selectedResult.platform.additionalRequirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">Select a platform to view detailed compatibility information</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              Click "Check Compatibility" to analyze your current settings against popular platforms
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
