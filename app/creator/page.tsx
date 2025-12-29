"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Video, Users, DollarSign, TrendingUp, Play, Zap, Globe, Rocket, CheckCircle, ArrowRight } from "lucide-react"

export default function CreatorPage() {
  const features = [
    {
      icon: Video,
      title: "Professional Live Streaming",
      description: "Stream in HD quality with AI-powered enhancement and real-time optimization",
    },
    {
      icon: Users,
      title: "Global Audience Reach",
      description: "Connect with millions of viewers worldwide and build your community",
    },
    {
      icon: DollarSign,
      title: "Multiple Revenue Streams",
      description: "Monetize through subscriptions, donations, merchandise, and sponsored content",
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Track your growth with detailed insights and performance metrics",
    },
    {
      icon: Zap,
      title: "AI-Powered Tools",
      description: "Leverage AI for content optimization, audience engagement, and growth",
    },
    {
      icon: Globe,
      title: "Multi-Platform Distribution",
      description: "Stream simultaneously to multiple platforms and maximize your reach",
    },
  ]

  const successStories = [
    {
      name: "Alex Chen",
      category: "Gaming",
      followers: "2.5M",
      revenue: "$50K/month",
      growth: "+300%",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Maria Rodriguez",
      category: "Cooking",
      followers: "1.8M",
      revenue: "$35K/month",
      growth: "+250%",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "David Kim",
      category: "Tech Reviews",
      followers: "3.2M",
      revenue: "$75K/month",
      growth: "+400%",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  const plans = [
    {
      name: "Creator",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "Up to 5 hours streaming/month",
        "Basic analytics",
        "Community features",
        "Mobile streaming",
        "Standard support",
      ],
      popular: false,
    },
    {
      name: "Creator Pro",
      price: "$29/month",
      description: "For serious content creators",
      features: [
        "Unlimited streaming",
        "Advanced analytics",
        "AI-powered tools",
        "Multi-platform streaming",
        "Priority support",
        "Custom branding",
        "Monetization tools",
      ],
      popular: true,
    },
    {
      name: "Creator Studio",
      price: "$99/month",
      description: "For professional creators and teams",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Advanced AI features",
        "White-label solutions",
        "Dedicated account manager",
        "Custom integrations",
        "Enterprise support",
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 dark:from-purple-400/5 dark:to-pink-400/5" />
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Rocket className="h-4 w-4 mr-2" />
              Join 100K+ Creators
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Become a Creator
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Turn your passion into profit. Create, stream, and monetize your content with the world's most advanced
              creator platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Creating Now
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                <Video className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools and features you need to create amazing content and build a thriving
              community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-900/10 dark:to-pink-900/10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Creator Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how creators like you are building successful businesses and communities on our platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur text-center">
                <CardContent className="p-6">
                  <img
                    src={story.image || "/placeholder.svg"}
                    alt={story.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-1">{story.name}</h3>
                  <p className="text-muted-foreground mb-4">{story.category} Creator</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{story.followers}</p>
                      <p className="text-sm text-muted-foreground">Followers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{story.revenue}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">{story.growth}</p>
                      <p className="text-sm text-muted-foreground">Growth</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Creator Plan</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade as you grow. All plans include our core features with no hidden fees.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`border-0 shadow-lg bg-white/80 backdrop-blur relative ${
                  plan.popular ? "ring-2 ring-purple-500 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-purple-600 mb-2">{plan.price}</div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                    }`}
                  >
                    {plan.price === "Free" ? "Get Started" : "Upgrade Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-900/10 dark:to-pink-900/10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Apply to Become a Creator</h2>
            <p className="text-xl text-muted-foreground">
              Join our creator program and start monetizing your content today.
            </p>
          </div>
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Enter your last name" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter your phone number" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content-category">Content Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your content category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="cooking">Cooking & Food</SelectItem>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="fitness">Fitness & Health</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="art">Art & Design</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                      <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                      <SelectItem value="expert">Expert (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social-media">Social Media Handles</Label>
                  <Textarea
                    id="social-media"
                    placeholder="List your social media profiles (YouTube, Instagram, TikTok, etc.)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content-description">Content Description</Label>
                  <Textarea
                    id="content-description"
                    placeholder="Describe the type of content you create and your unique style"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals">Goals & Expectations</Label>
                  <Textarea
                    id="goals"
                    placeholder="What are your goals as a creator? What do you hope to achieve?"
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Equipment & Setup</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="camera" />
                      <Label htmlFor="camera">Professional Camera</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="microphone" />
                      <Label htmlFor="microphone">Quality Microphone</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="lighting" />
                      <Label htmlFor="lighting">Lighting Setup</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="editing-software" />
                      <Label htmlFor="editing-software">Editing Software</Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <a href="#" className="text-purple-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-purple-600 hover:underline">
                      Creator Guidelines
                    </a>
                  </Label>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6">
                  <Rocket className="h-5 w-5 mr-2" />
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Creator Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of creators who are already building successful businesses on our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Creating Today
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                <ArrowRight className="h-5 w-5 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
