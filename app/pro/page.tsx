"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown, Video, BarChart3, Globe, CheckCircle, X, Play, Clock, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProPage() {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

  const proFeatures = [
    {
      category: "Streaming Quality",
      icon: <Video className="h-6 w-6" />,
      features: [
        { name: "4K Ultra HD Streaming", description: "Stream in crystal clear 4K resolution up to 60fps" },
        { name: "HDR Support", description: "High Dynamic Range for enhanced visual quality" },
        { name: "Advanced Bitrate Control", description: "Optimize bitrate for perfect quality/bandwidth balance" },
        { name: "Multi-Camera Support", description: "Switch between multiple camera angles seamlessly" },
      ],
    },
    {
      category: "AI Enhancement",
      icon: <Sparkles className="h-6 w-6" />,
      features: [
        { name: "Real-time AI Enhancement", description: "Automatic video and audio quality optimization" },
        { name: "Smart Background Removal", description: "AI-powered background replacement without green screen" },
        { name: "Noise Cancellation", description: "Professional-grade audio noise reduction" },
        { name: "Auto-Framing", description: "Intelligent camera framing that follows your movement" },
      ],
    },
    {
      category: "Analytics & Insights",
      icon: <BarChart3 className="h-6 w-6" />,
      features: [
        {
          name: "Advanced Analytics Dashboard",
          description: "Comprehensive insights into your audience and performance",
        },
        { name: "Real-time Metrics", description: "Live viewer count, engagement, and revenue tracking" },
        { name: "Audience Demographics", description: "Detailed breakdown of your viewer demographics" },
        { name: "Revenue Analytics", description: "Track donations, subscriptions, and sponsorship revenue" },
      ],
    },
    {
      category: "Platform Integration",
      icon: <Globe className="h-6 w-6" />,
      features: [
        { name: "Unlimited Platform Streaming", description: "Stream to all major platforms simultaneously" },
        { name: "Custom RTMP Support", description: "Stream to any platform with RTMP support" },
        { name: "Platform-Specific Optimization", description: "Automatic settings optimization for each platform" },
        { name: "Cross-Platform Chat", description: "Unified chat from all streaming platforms" },
      ],
    },
  ]

  const pricingComparison = {
    free: {
      name: "Free",
      price: "$0",
      features: {
        "Video Quality": "720p",
        "Streaming Platforms": "2 platforms",
        Recording: "1 hour/month",
        "AI Features": "Basic",
        Analytics: "Basic metrics",
        Support: "Community",
        Storage: "1 GB",
        "Custom Overlays": false,
        "Multi-Camera": false,
        "Priority Support": false,
      },
    },
    pro: {
      name: "Pro",
      price: billingCycle === "monthly" ? "$29" : "$290",
      period: billingCycle === "monthly" ? "/month" : "/year",
      savings: billingCycle === "annual" ? "Save $58/year" : null,
      features: {
        "Video Quality": "4K HDR",
        "Streaming Platforms": "Unlimited",
        Recording: "Unlimited",
        "AI Features": "Advanced",
        Analytics: "Advanced insights",
        Support: "Priority support",
        Storage: "100 GB",
        "Custom Overlays": true,
        "Multi-Camera": true,
        "Priority Support": true,
      },
    },
  }

  const successStories = [
    {
      name: "GameMaster Pro",
      avatar: "/placeholder.svg?height=60&width=60",
      role: "Gaming Streamer",
      beforeStats: { followers: "5K", revenue: "$200/month", platforms: 1 },
      afterStats: { followers: "125K", revenue: "$8,500/month", platforms: 5 },
      timeframe: "8 months",
      quote:
        "RunAsh Pro's AI features and multi-platform streaming helped me grow 25x faster than I ever imagined possible.",
      keyFeatures: ["4K Streaming", "AI Enhancement", "Multi-Platform"],
    },
    {
      name: "TechEducator",
      avatar: "/placeholder.svg?height=60&width=60",
      role: "Educational Content",
      beforeStats: { followers: "12K", revenue: "$500/month", platforms: 2 },
      afterStats: { followers: "89K", revenue: "$15,200/month", platforms: 4 },
      timeframe: "6 months",
      quote: "The advanced analytics showed me exactly what content my audience wanted. Revenue increased 30x!",
      keyFeatures: ["Analytics", "Recording", "Custom Overlays"],
    },
    {
      name: "ArtisticVision",
      avatar: "/placeholder.svg?height=60&width=60",
      role: "Art & Creative",
      beforeStats: { followers: "8K", revenue: "$300/month", platforms: 1 },
      afterStats: { followers: "67K", revenue: "$6,800/month", platforms: 3 },
      timeframe: "10 months",
      quote: "Multi-camera support transformed my art streams. Viewers love seeing both my canvas and my process!",
      keyFeatures: ["Multi-Camera", "4K Quality", "Custom Overlays"],
    },
  ]

  const proStats = [
    { label: "Pro Users", value: "25,000+", description: "Active Pro subscribers" },
    { label: "Average Growth", value: "340%", description: "Follower growth in first 6 months" },
    { label: "Revenue Increase", value: "12x", description: "Average revenue multiplier" },
    { label: "Satisfaction Rate", value: "98%", description: "Pro user satisfaction score" },
  ]

  const FeatureComparison = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-medium">Feature</th>
            <th className="text-center p-4 font-medium">Free</th>
            <th className="text-center p-4 font-medium">
              <div className="flex items-center justify-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Pro
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(pricingComparison.free.features).map(([feature, freeValue]) => {
            const proValue = pricingComparison.pro.features[feature as keyof typeof pricingComparison.pro.features]
            return (
              <tr key={feature} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="p-4 font-medium">{feature}</td>
                <td className="p-4 text-center">
                  {typeof freeValue === "boolean" ? (
                    freeValue ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )
                  ) : (
                    <span className="text-gray-600 dark:text-gray-300">{freeValue}</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {typeof proValue === "boolean" ? (
                    proValue ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )
                  ) : (
                    <span className="font-medium text-purple-600 dark:text-purple-400">{proValue}</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 dark:from-yellow-600/5 dark:to-orange-600/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm font-medium mb-6">
              <Crown className="h-4 w-4" />
              Professional Streaming
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-500 text-transparent bg-clip-text">
              RunAsh Pro
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Unlock the full potential of your streaming career with professional-grade features, advanced AI
              capabilities, and unlimited everything.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
                onClick={() => router.push("/get-started?plan=pro")}
              >
                <Crown className="mr-2 h-4 w-4" />
                Start 14-Day Free Trial
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/demo")}>
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              No credit card required • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </section>

      {/* Pro Stats */}
      <section className="py-12 bg-white dark:bg-gray-900 border-y border-yellow-100 dark:border-yellow-900/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {proStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Choose the plan that fits your streaming ambitions. Upgrade or downgrade anytime.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm ${billingCycle === "monthly" ? "font-medium" : "text-gray-600"}`}>Monthly</span>
              <button
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingCycle === "annual" ? "bg-yellow-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === "annual" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-sm ${billingCycle === "annual" ? "font-medium" : "text-gray-600"}`}>Annual</span>
              {billingCycle === "annual" && (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Save 17%</Badge>
              )}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Free Plan */}
              <Card className="relative">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Free</CardTitle>
                  <div className="text-4xl font-bold mb-2">$0</div>
                  <p className="text-gray-600 dark:text-gray-300">Perfect for getting started</p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full mb-6 bg-transparent" variant="outline">
                    Current Plan
                  </Button>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">720p streaming quality</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Stream to 2 platforms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">1 hour recording/month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Basic AI features</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Community support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="relative border-2 border-yellow-500 shadow-xl">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    <Crown className="h-6 w-6 text-yellow-500" />
                    Pro
                  </CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{pricingComparison.pro.price}</span>
                    <span className="text-gray-600 dark:text-gray-300">{pricingComparison.pro.period}</span>
                  </div>
                  {pricingComparison.pro.savings && (
                    <div className="text-sm text-green-600 font-medium">{pricingComparison.pro.savings}</div>
                  )}
                  <p className="text-gray-600 dark:text-gray-300">For serious creators</p>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full mb-6 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                    onClick={() => router.push("/get-started?plan=pro")}
                  >
                    Start Free Trial
                  </Button>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">4K HDR streaming quality</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Unlimited platforms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Unlimited recording</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Advanced AI features</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Priority support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Advanced analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Custom overlays</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Multi-camera support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pro Features Deep Dive</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the powerful features that make RunAsh Pro the choice of professional streamers
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {proFeatures.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                      {category.icon}
                    </div>
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.features.map((feature, idx) => (
                      <div key={idx} className="border-l-4 border-yellow-500 pl-4">
                        <h4 className="font-medium mb-1">{feature.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pro Success Stories</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how RunAsh Pro has transformed the careers of creators just like you
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    <AvatarImage src={story.avatar || "/placeholder.svg"} alt={story.name} />
                    <AvatarFallback>{story.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{story.name}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">{story.role}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Before</div>
                        <div className="text-lg font-bold text-red-600">{story.beforeStats.followers}</div>
                        <div className="text-sm text-gray-600">{story.beforeStats.revenue}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">After</div>
                        <div className="text-lg font-bold text-green-600">{story.afterStats.followers}</div>
                        <div className="text-sm text-gray-600">{story.afterStats.revenue}</div>
                      </div>
                    </div>

                    <div className="text-center">
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        <Clock className="h-3 w-3 mr-1" />
                        {story.timeframe}
                      </Badge>
                    </div>

                    <blockquote className="text-sm italic text-gray-600 dark:text-gray-300 text-center">
                      "{story.quote}"
                    </blockquote>

                    <div className="flex justify-center gap-1">
                      {story.keyFeatures.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Detailed Feature Comparison</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See exactly what you get with RunAsh Pro compared to our free plan
            </p>
          </div>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-0">
              <FeatureComparison />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Go Pro?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join 25,000+ professional streamers who have transformed their careers with RunAsh Pro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-yellow-600 hover:bg-gray-100"
              onClick={() => router.push("/get-started?plan=pro")}
            >
              <Crown className="mr-2 h-4 w-4" />
              Start 14-Day Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
              onClick={() => router.push("/contact")}
            >
              Contact Sales
            </Button>
          </div>
          <p className="mt-4 text-sm opacity-75">
            No credit card required • 30-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}
