"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Brain,
  Eye,
  Mic,
  MessageSquare,
  BarChart3,
  Download,
  Search,
  Filter,
  Star,
  Zap,
  Shield,
  Play,
  BookOpen,
  Github,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function ModelsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  const modelCategories = [
    { id: "all", name: "All Models", count: 24 },
    { id: "vision", name: "Computer Vision", count: 8 },
    { id: "audio", name: "Audio Processing", count: 6 },
    { id: "nlp", name: "Natural Language", count: 5 },
    { id: "analytics", name: "Analytics", count: 3 },
    { id: "multimodal", name: "Multimodal", count: 2 },
  ]

  const featuredModels = [
    {
      id: "runash-vision-v3",
      name: "RunAsh Vision v3",
      category: "vision",
      description: "Advanced computer vision model for real-time video enhancement and analysis",
      version: "3.2.1",
      size: "2.1 GB",
      accuracy: 98.5,
      latency: "< 50ms",
      downloads: 15420,
      rating: 4.9,
      tags: ["real-time", "enhancement", "detection", "streaming"],
      capabilities: [
        "Real-time video enhancement",
        "Object detection and tracking",
        "Scene understanding",
        "Quality optimization",
        "Auto-cropping and framing",
      ],
      benchmarks: {
        "Video Quality": 98.5,
        "Object Detection": 96.8,
        "Scene Analysis": 94.2,
        "Processing Speed": 97.1,
      },
      pricing: {
        free: "1,000 API calls/month",
        pro: "$0.01 per API call",
        enterprise: "Custom pricing",
      },
      lastUpdated: "2024-01-15",
      documentation: "/docs/models/vision-v3",
      github: "https://github.com/runash-ai/vision-v3",
    },
    {
      id: "runash-audio-v2",
      name: "RunAsh Audio v2",
      category: "audio",
      description: "Intelligent audio processing for noise reduction and voice enhancement",
      version: "2.4.0",
      size: "850 MB",
      accuracy: 96.8,
      latency: "< 30ms",
      downloads: 12350,
      rating: 4.8,
      tags: ["noise-reduction", "enhancement", "real-time", "voice"],
      capabilities: [
        "Real-time noise reduction",
        "Voice enhancement",
        "Audio quality optimization",
        "Multi-channel processing",
        "Acoustic echo cancellation",
      ],
      benchmarks: {
        "Noise Reduction": 96.8,
        "Voice Clarity": 95.4,
        "Processing Speed": 98.2,
        "Audio Quality": 94.7,
      },
      pricing: {
        free: "500 minutes/month",
        pro: "$0.05 per minute",
        enterprise: "Custom pricing",
      },
      lastUpdated: "2024-01-10",
      documentation: "/docs/models/audio-v2",
      github: "https://github.com/runash-ai/audio-v2",
    },
    {
      id: "runash-nlp-v1",
      name: "RunAsh NLP v1",
      category: "nlp",
      description: "Natural language processing for chat moderation and content analysis",
      version: "1.8.2",
      size: "1.2 GB",
      accuracy: 94.2,
      latency: "< 100ms",
      downloads: 8920,
      rating: 4.7,
      tags: ["moderation", "sentiment", "multilingual", "chat"],
      capabilities: [
        "Real-time chat moderation",
        "Sentiment analysis",
        "Language detection",
        "Content classification",
        "Toxicity detection",
      ],
      benchmarks: {
        "Moderation Accuracy": 94.2,
        "Sentiment Analysis": 92.8,
        "Language Detection": 98.1,
        "Processing Speed": 95.6,
      },
      pricing: {
        free: "10,000 messages/month",
        pro: "$0.001 per message",
        enterprise: "Custom pricing",
      },
      lastUpdated: "2024-01-08",
      documentation: "/docs/models/nlp-v1",
      github: "https://github.com/runash-ai/nlp-v1",
    },
    {
      id: "runash-analytics-v1",
      name: "RunAsh Analytics v1",
      category: "analytics",
      description: "Predictive analytics for audience engagement and content optimization",
      version: "1.5.1",
      size: "650 MB",
      accuracy: 92.7,
      latency: "< 200ms",
      downloads: 5680,
      rating: 4.6,
      tags: ["prediction", "engagement", "optimization", "insights"],
      capabilities: [
        "Audience behavior prediction",
        "Engagement optimization",
        "Content recommendation",
        "Revenue forecasting",
        "Trend analysis",
      ],
      benchmarks: {
        "Prediction Accuracy": 92.7,
        "Engagement Insights": 89.4,
        "Revenue Forecasting": 87.2,
        "Processing Speed": 94.8,
      },
      pricing: {
        free: "100 predictions/month",
        pro: "$0.10 per prediction",
        enterprise: "Custom pricing",
      },
      lastUpdated: "2024-01-05",
      documentation: "/docs/models/analytics-v1",
      github: "https://github.com/runash-ai/analytics-v1",
    },
  ]

  const filteredModels = featuredModels.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || model.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const ModelCard = ({ model }: { model: (typeof featuredModels)[0] }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedModel(model.id)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {model.category === "vision" && <Eye className="h-5 w-5 text-blue-500" />}
              {model.category === "audio" && <Mic className="h-5 w-5 text-green-500" />}
              {model.category === "nlp" && <MessageSquare className="h-5 w-5 text-purple-500" />}
              {model.category === "analytics" && <BarChart3 className="h-5 w-5 text-orange-500" />}
              {model.name}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{model.description}</p>
          </div>
          <Badge variant="secondary">v{model.version}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{model.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4 text-gray-500" />
                <span>{model.downloads.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-green-500" />
                <span>{model.latency}</span>
              </div>
            </div>
            <span className="text-xs text-gray-500">Size: {model.size}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {model.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {model.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{model.tags.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button size="sm" variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Try Demo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ModelDetails = ({ model }: { model: (typeof featuredModels)[0] }) => (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {model.category === "vision" && <Eye className="h-6 w-6 text-blue-500" />}
            {model.category === "audio" && <Mic className="h-6 w-6 text-green-500" />}
            {model.category === "nlp" && <MessageSquare className="h-6 w-6 text-purple-500" />}
            {model.category === "analytics" && <BarChart3 className="h-6 w-6 text-orange-500" />}
            {model.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{model.description}</p>
        </div>
        <Button onClick={() => setSelectedModel(null)} variant="outline" size="sm">
          ← Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Model Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Version</span>
              <Badge>{model.version}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Size</span>
              <span className="text-sm font-medium">{model.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Accuracy</span>
              <span className="text-sm font-medium">{model.accuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Latency</span>
              <span className="text-sm font-medium">{model.latency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Downloads</span>
              <span className="text-sm font-medium">{model.downloads.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Updated</span>
              <span className="text-sm font-medium">{model.lastUpdated}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Benchmarks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(model.benchmarks).map(([metric, score]) => (
              <div key={metric} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{metric}</span>
                  <span className="font-medium">{score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm font-medium text-green-600">Free Tier</div>
              <div className="text-sm text-gray-600">{model.pricing.free}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-blue-600">Pro</div>
              <div className="text-sm text-gray-600">{model.pricing.pro}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-purple-600">Enterprise</div>
              <div className="text-sm text-gray-600">{model.pricing.enterprise}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {model.capabilities.map((capability, index) => (
              <div key={index} className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm">{capability}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Integration Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">
              <code>{`// Initialize ${model.name}
import { ${model.id.replace(/-/g, "")} } from '@runash/ai-sdk'

const model = new ${model.id.replace(/-/g, "")}({
  apiKey: 'your-api-key',
  version: '${model.version}'
})

// Use the model
const result = await model.process({
  input: 'your-input-data',
  options: {
    realTime: true,
    quality: 'high'
  }
})

console.log('Result:', result)`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download Model
        </Button>
        <Button variant="outline" onClick={() => window.open(model.documentation, "_blank")}>
          <BookOpen className="h-4 w-4 mr-2" />
          Documentation
        </Button>
        <Button variant="outline" onClick={() => window.open(model.github, "_blank")}>
          <Github className="h-4 w-4 mr-2" />
          GitHub
        </Button>
      </div>
    </div>
  )

  if (selectedModel) {
    const model = featuredModels.find((m) => m.id === selectedModel)
    if (model) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
          <div className="container mx-auto px-4 py-8">
            <ModelDetails model={model} />
          </div>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/5 dark:to-purple-600/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              AI Models Library
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Discover and integrate state-of-the-art AI models designed specifically for live streaming and content
              creation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {modelCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Models</span>
                  <span className="text-sm font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Downloads</span>
                  <span className="text-sm font-medium">42.3K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Rating</span>
                  <span className="text-sm font-medium">4.7 ⭐</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium">Today</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {selectedCategory === "all"
                  ? "All Models"
                  : modelCategories.find((c) => c.id === selectedCategory)?.name}
              </h2>
              <div className="text-sm text-gray-600">{filteredModels.length} models found</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>

            {filteredModels.length === 0 && (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No models found</h3>
                <p className="text-gray-600 dark:text-gray-300">Try adjusting your search query or category filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
