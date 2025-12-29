"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Building2,
  Users,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Target,
  Headphones,
  CheckCircle,
  ArrowRight,
  Briefcase,
  DollarSign,
  Clock,
  Star,
} from "lucide-react"

export default function BusinessPage() {
  const features = [
    {
      icon: Building2,
      title: "Enterprise-Grade Infrastructure",
      description: "Scalable, secure, and reliable platform built for business needs",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Multi-user accounts with role-based permissions and team management",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive business intelligence and performance tracking",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 compliant with advanced security features and data protection",
    },
    {
      icon: Zap,
      title: "API Integration",
      description: "Seamless integration with your existing business tools and workflows",
    },
    {
      icon: Headphones,
      title: "Dedicated Support",
      description: "24/7 priority support with dedicated account management",
    },
  ]

  const useCases = [
    {
      title: "Product Launches",
      description: "Launch products with live demonstrations and real-time customer engagement",
      icon: Target,
      benefits: ["Increased conversion rates", "Direct customer feedback", "Global reach"],
    },
    {
      title: "Training & Education",
      description: "Conduct employee training, webinars, and educational content delivery",
      icon: Users,
      benefits: ["Cost-effective training", "Interactive learning", "Scalable delivery"],
    },
    {
      title: "Customer Support",
      description: "Provide live customer support and technical assistance",
      icon: Headphones,
      benefits: ["Improved satisfaction", "Reduced support costs", "Visual problem solving"],
    },
    {
      title: "Sales Presentations",
      description: "Deliver compelling sales presentations and product demos",
      icon: TrendingUp,
      benefits: ["Higher close rates", "Personal connection", "Interactive demos"],
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "VP of Marketing",
      company: "TechCorp Inc.",
      content:
        "RunAsh has transformed how we launch products. Our last launch saw 300% higher engagement compared to traditional methods.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Training Director",
      company: "Global Solutions",
      content:
        "The platform's reliability and features have made our global training programs incredibly effective and cost-efficient.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Sales Manager",
      company: "Innovation Labs",
      content:
        "Our sales team loves the interactive features. We've seen a 40% increase in qualified leads since implementing RunAsh.",
      rating: 5,
    },
  ]

  const plans = [
    {
      name: "Business Starter",
      price: "$99/month",
      description: "Perfect for small to medium businesses",
      features: [
        "Up to 10 team members",
        "100 hours streaming/month",
        "Basic analytics",
        "Email support",
        "Standard integrations",
        "HD streaming quality",
      ],
      popular: false,
    },
    {
      name: "Business Pro",
      price: "$299/month",
      description: "For growing businesses and teams",
      features: [
        "Up to 50 team members",
        "Unlimited streaming",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "4K streaming quality",
        "White-label options",
        "API access",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited team members",
        "Unlimited everything",
        "Custom analytics",
        "Dedicated support",
        "Custom development",
        "On-premise deployment",
        "SLA guarantees",
        "Advanced security",
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5" />
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Building2 className="h-4 w-4 mr-2" />
              Trusted by 10,000+ Businesses
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Business Solutions
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Transform your business communication with enterprise-grade live streaming, interactive presentations, and
              team collaboration tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
              >
                <Briefcase className="h-5 w-5 mr-2" />
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                <Clock className="h-5 w-5 mr-2" />
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Enterprise-Ready Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for businesses that need reliability, security, and scalability at every level.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
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

      {/* Use Cases */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-100/50 to-purple-100/50 dark:from-blue-900/10 dark:to-purple-900/10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Business Use Cases</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover how businesses across industries are leveraging our platform to drive growth and engagement.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <useCase.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                      <p className="text-muted-foreground mb-4">{useCase.description}</p>
                      <ul className="space-y-2">
                        {useCase.benefits.map((benefit, benefitIndex) => (
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

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how businesses are achieving remarkable results with our platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-blue-600">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-100/50 to-purple-100/50 dark:from-blue-900/10 dark:to-purple-900/10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Business Pricing Plans</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your business needs. All plans include our core business features.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`border-0 shadow-lg bg-white/80 backdrop-blur relative ${
                  plan.popular ? "ring-2 ring-blue-500 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-blue-600 mb-2">{plan.price}</div>
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
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                    }`}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get Started Today</h2>
            <p className="text-xl text-muted-foreground">
              Ready to transform your business communication? Let's discuss your needs.
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
                    <Label htmlFor="industry">Industry</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Contact Name</Label>
                    <Input id="contact-name" placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input id="job-title" placeholder="Enter your job title" />
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
                  <Label htmlFor="use-case">Primary Use Case</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary use case" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product-launches">Product Launches</SelectItem>
                      <SelectItem value="training">Training & Education</SelectItem>
                      <SelectItem value="customer-support">Customer Support</SelectItem>
                      <SelectItem value="sales">Sales Presentations</SelectItem>
                      <SelectItem value="marketing">Marketing & Events</SelectItem>
                      <SelectItem value="internal-comms">Internal Communications</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements & Goals</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Tell us about your specific requirements and what you hope to achieve"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Implementation Timeline</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate (within 1 month)</SelectItem>
                      <SelectItem value="short-term">Short-term (1-3 months)</SelectItem>
                      <SelectItem value="medium-term">Medium-term (3-6 months)</SelectItem>
                      <SelectItem value="long-term">Long-term (6+ months)</SelectItem>
                      <SelectItem value="exploring">Just exploring options</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Interested Features</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="live-streaming" />
                      <Label htmlFor="live-streaming">Live Streaming</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="team-collaboration" />
                      <Label htmlFor="team-collaboration">Team Collaboration</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="analytics" />
                      <Label htmlFor="analytics">Advanced Analytics</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="integrations" />
                      <Label htmlFor="integrations">API Integrations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="white-label" />
                      <Label htmlFor="white-label">White-label Solution</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="custom-development" />
                      <Label htmlFor="custom-development">Custom Development</Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" />
                  <Label htmlFor="newsletter" className="text-sm">
                    Subscribe to our business newsletter for industry insights and product updates
                  </Label>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Request Demo & Pricing
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of businesses that trust RunAsh for their communication and engagement needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Clock className="h-5 w-5 mr-2" />
                Schedule Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <DollarSign className="h-5 w-5 mr-2" />
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
