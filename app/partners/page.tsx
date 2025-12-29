"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Handshake,
  Users,
  Award,
  Zap,
  Globe,
  Target,
  DollarSign,
  CheckCircle,
  Building,
  Rocket,
  Shield,
} from "lucide-react"

export default function PartnersPage() {
  const partnerTypes = [
    {
      icon: Building,
      title: "Technology Partners",
      description: "Integrate your solutions with our platform and reach millions of users",
      benefits: ["API access", "Co-marketing opportunities", "Technical support", "Revenue sharing"],
    },
    {
      icon: Users,
      title: "Channel Partners",
      description: "Resell our solutions and earn commissions while helping businesses grow",
      benefits: ["Competitive margins", "Sales training", "Marketing materials", "Lead sharing"],
    },
    {
      icon: Rocket,
      title: "Solution Partners",
      description: "Build custom solutions and services on top of our platform",
      benefits: ["Certification programs", "Partner portal", "Co-selling opportunities", "Technical resources"],
    },
    {
      icon: Globe,
      title: "Global Partners",
      description: "Expand our reach in your region and become our local representative",
      benefits: ["Territory protection", "Localization support", "Regional marketing", "Local support"],
    },
  ]

  const benefits = [
    {
      icon: DollarSign,
      title: "Revenue Growth",
      description: "Unlock new revenue streams and expand your business opportunities",
    },
    {
      icon: Users,
      title: "Market Access",
      description: "Reach our global network of millions of users and businesses",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Access cutting-edge technology and stay ahead of the competition",
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Get recognized as a trusted partner with exclusive badges and certifications",
    },
    {
      icon: Shield,
      title: "Support",
      description: "Dedicated partner support team to help you succeed",
    },
    {
      icon: Target,
      title: "Co-Marketing",
      description: "Joint marketing initiatives to amplify your reach and impact",
    },
  ]

  const successStories = [
    {
      name: "TechFlow Solutions",
      type: "Technology Partner",
      result: "300% increase in customer base",
      description: "Integrated their CRM with our platform, resulting in seamless customer management",
      logo: "/placeholder.svg?height=60&width=120",
    },
    {
      name: "Global Sales Corp",
      type: "Channel Partner",
      result: "$2M+ in partner revenue",
      description: "Became our exclusive partner in the APAC region with outstanding results",
      logo: "/placeholder.svg?height=60&width=120",
    },
    {
      name: "Innovation Labs",
      type: "Solution Partner",
      result: "50+ custom implementations",
      description: "Built industry-specific solutions that serve thousands of businesses",
      logo: "/placeholder.svg?height=60&width=120",
    },
  ]

  const partnerTiers = [
    {
      name: "Authorized Partner",
      requirements: ["Basic certification", "Minimum revenue commitment"],
      benefits: ["Partner portal access", "Basic marketing materials", "Standard support"],
      color: "from-gray-500 to-gray-600",
    },
    {
      name: "Silver Partner",
      requirements: ["Advanced certification", "Proven track record", "Customer references"],
      benefits: ["Co-marketing opportunities", "Priority support", "Sales training", "Lead sharing"],
      color: "from-gray-400 to-gray-500",
    },
    {
      name: "Gold Partner",
      requirements: ["Expert certification", "Significant revenue", "Strategic alignment"],
      benefits: ["Joint go-to-market", "Dedicated support", "Product roadmap input", "Executive access"],
      color: "from-yellow-400 to-yellow-500",
    },
    {
      name: "Platinum Partner",
      requirements: ["Strategic partnership", "Global presence", "Innovation leadership"],
      benefits: ["Co-innovation projects", "Executive partnership", "Global opportunities", "Custom terms"],
      color: "from-purple-400 to-purple-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900/20 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10 dark:from-green-400/5 dark:to-blue-400/5" />
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <Handshake className="h-4 w-4 mr-2" />
              Join 5,000+ Partners Worldwide
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Partner Program
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Join our global partner ecosystem and unlock new opportunities for growth, innovation, and success
              together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg px-8 py-6"
              >
                <Handshake className="h-5 w-5 mr-2" />
                Become a Partner
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                <Users className="h-5 w-5 mr-2" />
                Partner Portal
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Partnership Opportunities</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the partnership model that aligns with your business goals and expertise.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partnerTypes.map((type, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <type.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                      <p className="text-muted-foreground mb-4">{type.description}</p>
                      <ul className="space-y-2">
                        {type.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-100/50 to-blue-100/50 dark:from-green-900/10 dark:to-blue-900/10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Partner Benefits</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the advantages of partnering with us and how we can grow together.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Partner Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how our partners are achieving remarkable growth and success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <img
                      src={story.logo || "/placeholder.svg"}
                      alt={story.name}
                      className="h-12 mx-auto mb-4 object-contain"
                    />
                    <Badge variant="secondary" className="mb-2">
                      {story.type}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">{story.name}</h3>
                  <div className="text-center mb-4">
                    <p className="text-2xl font-bold text-green-600">{story.result}</p>
                  </div>
                  <p className="text-muted-foreground text-center">{story.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Tiers */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-100/50 to-blue-100/50 dark:from-green-900/10 dark:to-blue-900/10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Partner Tiers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Grow through our partner tiers and unlock exclusive benefits at each level.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerTiers.map((tier, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tier.color}`} />
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {tier.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="text-xs flex items-center gap-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Benefits:</h4>
                      <ul className="space-y-1">
                        {tier.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="text-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Apply to Become a Partner</h2>
            <p className="text-xl text-muted-foreground">
              Ready to join our partner ecosystem? Let's start the conversation.
            </p>
          </div>
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" placeholder="Enter your company name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Company Website</Label>
                    <Input id="website" placeholder="https://yourcompany.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Primary Contact</Label>
                    <Input id="contact-name" placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input id="title" placeholder="Enter your job title" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email</Label>
                    <Input id="email" type="email" placeholder="Enter your business email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter your phone number" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partner-type">Partnership Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select partnership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology Partner</SelectItem>
                      <SelectItem value="channel">Channel Partner</SelectItem>
                      <SelectItem value="solution">Solution Partner</SelectItem>
                      <SelectItem value="global">Global Partner</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-size">Company Size</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Primary Region</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north-america">North America</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                        <SelectItem value="latin-america">Latin America</SelectItem>
                        <SelectItem value="middle-east-africa">Middle East & Africa</SelectItem>
                        <SelectItem value="global">Global</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry-focus">Industry Focus</Label>
                  <Textarea
                    id="industry-focus"
                    placeholder="Describe the industries you serve and your expertise"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnership-goals">Partnership Goals</Label>
                  <Textarea
                    id="partnership-goals"
                    placeholder="What do you hope to achieve through this partnership?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current-solutions">Current Solutions/Services</Label>
                  <Textarea
                    id="current-solutions"
                    placeholder="Describe your current products, services, or solutions"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-base">Customer Base</Label>
                  <Textarea
                    id="customer-base"
                    placeholder="Tell us about your current customer base and market reach"
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Areas of Interest</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="reseller" />
                      <Label htmlFor="reseller">Reseller Program</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="integration" />
                      <Label htmlFor="integration">Technology Integration</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="co-marketing" />
                      <Label htmlFor="co-marketing">Co-marketing</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="joint-solutions" />
                      <Label htmlFor="joint-solutions">Joint Solutions</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="referral" />
                      <Label htmlFor="referral">Referral Program</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="consulting" />
                      <Label htmlFor="consulting">Consulting Services</Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <a href="#" className="text-green-600 hover:underline">
                      Partner Terms
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-green-600 hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>

                <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg py-6">
                  <Handshake className="h-5 w-5 mr-2" />
                  Submit Partnership Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Partner with Us?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join our thriving partner ecosystem and unlock new opportunities for growth and success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Handshake className="h-5 w-5 mr-2" />
                Apply Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
              >
                <Users className="h-5 w-5 mr-2" />
                Partner Portal
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
