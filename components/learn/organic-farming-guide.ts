"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Leaf,
  Droplets,
  Bug,
  Recycle,
  Sprout,
  Sun,
  Shield,
  Heart,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Target,
} from "lucide-react"

interface GuideSection {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  content: string[]
  tips: string[]
  benefits: string[]
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  timeToImplement: string
}

const guideSections: GuideSection[] = [
  {
    id: "soil-health",
    title: "Soil Health & Fertility",
    icon: <Sprout className="h-5 w-5" />,
    description: "Building and maintaining healthy, fertile soil is the foundation of organic farming.",
    content: [
      "Organic farming starts with healthy soil. Soil is a living ecosystem that supports plant growth through complex interactions between minerals, organic matter, water, air, and countless microorganisms.",
      "Healthy soil contains 25% air, 25% water, 45% mineral particles, and 5% organic matter. This balance creates the perfect environment for plant roots and beneficial microorganisms.",
      "Soil testing is crucial to understand pH levels, nutrient content, and organic matter percentage. Most crops thrive in slightly acidic to neutral soil (pH 6.0-7.0).",
    ],
    tips: [
      "Test soil pH and nutrient levels annually",
      "Add compost regularly to increase organic matter",
      "Use cover crops to prevent soil erosion",
      "Rotate crops to maintain soil fertility",
      "Avoid walking on wet soil to prevent compaction",
    ],
    benefits: [
      "Improved water retention and drainage",
      "Enhanced nutrient availability",
      "Increased beneficial microbial activity",
      "Better plant root development",
      "Reduced need for external inputs",
    ],
    difficulty: "Beginner",
    timeToImplement: "1-2 seasons",
  },
  {
    id: "composting",
    title: "Composting & Organic Matter",
    icon: <Recycle className="h-5 w-5" />,
    description: "Creating nutrient-rich compost from organic waste to feed your soil naturally.",
    content: [
      "Composting is nature's way of recycling organic materials into nutrient-rich soil amendment. It's a controlled decomposition process that transforms kitchen scraps, yard waste, and farm residues into 'black gold'.",
      "A good compost pile needs the right balance of 'greens' (nitrogen-rich materials like fresh grass clippings, kitchen scraps) and 'browns' (carbon-rich materials like dry leaves, straw, paper).",
      "The ideal carbon-to-nitrogen ratio is about 30:1. Proper aeration, moisture (like a wrung-out sponge), and temperature (130-160°F) ensure efficient decomposition.",
    ],
    tips: [
      "Maintain 3:1 ratio of brown to green materials",
      "Turn compost pile every 2-3 weeks for aeration",
      "Keep moisture level at 40-60%",
      "Chop materials into smaller pieces for faster decomposition",
      "Monitor temperature to ensure proper decomposition",
    ],
    benefits: [
      "Reduces waste going to landfills",
      "Provides slow-release nutrients",
      "Improves soil structure and water retention",
      "Introduces beneficial microorganisms",
      "Saves money on fertilizers",
    ],
    difficulty: "Beginner",
    timeToImplement: "3-6 months",
  },
  {
    id: "pest-management",
    title: "Natural Pest Management",
    icon: <Bug className="h-5 w-5" />,
    description: "Controlling pests using natural methods that protect beneficial insects and soil health.",
    content: [
      "Integrated Pest Management (IPM) in organic farming focuses on prevention, monitoring, and using natural controls rather than synthetic pesticides.",
      "The goal is not to eliminate all insects, but to maintain a balanced ecosystem where beneficial insects keep pest populations in check.",
      "Companion planting, beneficial insects, natural predators, and organic-approved treatments work together to manage pest pressure sustainably.",
    ],
    tips: [
      "Encourage beneficial insects with diverse flowering plants",
      "Use row covers during vulnerable growth stages",
      "Apply neem oil or insecticidal soap for soft-bodied pests",
      "Practice crop rotation to break pest cycles",
      "Monitor regularly for early pest detection",
    ],
    benefits: [
      "Protects beneficial insects and pollinators",
      "Reduces chemical residues on food",
      "Maintains ecological balance",
      "Builds natural resistance over time",
      "Safer for farmers and consumers",
    ],
    difficulty: "Intermediate",
    timeToImplement: "1-2 seasons",
  },
  {
    id: "water-management",
    title: "Water Conservation & Management",
    icon: <Droplets className="h-5 w-5" />,
    description: "Efficient water use through conservation techniques and sustainable irrigation practices.",
    content: [
      "Water is a precious resource that must be used efficiently in organic farming. Proper water management reduces waste, prevents soil erosion, and ensures plants receive adequate moisture.",
      "Drip irrigation, mulching, and rainwater harvesting are key strategies for water conservation. These methods deliver water directly to plant roots while minimizing evaporation.",
      "Understanding your soil's water-holding capacity and your crops' water needs helps optimize irrigation timing and frequency.",
    ],
    tips: [
      "Install drip irrigation systems for efficient water delivery",
      "Use organic mulch to retain soil moisture",
      "Collect rainwater in tanks or ponds",
      "Water early morning or evening to reduce evaporation",
      "Group plants with similar water needs together",
    ],
    benefits: [
      "Reduces water consumption by 30-50%",
      "Prevents soil erosion and nutrient runoff",
      "Reduces weed growth through targeted watering",
      "Lowers water bills and environmental impact",
      "Improves plant health and yields",
    ],
    difficulty: "Intermediate",
    timeToImplement: "1 season",
  },
  {
    id: "crop-rotation",
    title: "Crop Rotation & Diversity",
    icon: <Sun className="h-5 w-5" />,
    description: "Planning crop sequences to maintain soil health and break pest and disease cycles.",
    content: [
      "Crop rotation involves growing different types of crops in the same area across different seasons or years. This practice is fundamental to organic farming success.",
      "Different plant families have varying nutrient needs and root structures. Rotating crops prevents soil depletion and reduces the buildup of pests and diseases.",
      "A typical rotation might include legumes (nitrogen-fixing), heavy feeders (corn, tomatoes), light feeders (herbs), and soil builders (cover crops).",
    ],
    tips: [
      "Plan 3-4 year rotation cycles",
      "Include nitrogen-fixing legumes in rotation",
      "Avoid planting same family crops consecutively",
      "Use cover crops during fallow periods",
      "Keep detailed records of what was planted where",
    ],
    benefits: [
      "Maintains soil fertility naturally",
      "Breaks pest and disease cycles",
      "Improves soil structure and biodiversity",
      "Reduces need for external inputs",
      "Increases overall farm productivity",
    ],
    difficulty: "Intermediate",
    timeToImplement: "2-3 years",
  },
  {
    id: "biodiversity",
    title: "Biodiversity & Ecosystem Health",
    icon: <Heart className="h-5 w-5" />,
    description: "Creating diverse ecosystems that support beneficial wildlife and natural processes.",
    content: [
      "Biodiversity is the variety of life in and around your farm. A diverse ecosystem is more resilient, productive, and sustainable than a monoculture.",
      "Encouraging biodiversity involves creating habitats for beneficial insects, birds, and other wildlife that contribute to natural pest control and pollination.",
      "Hedgerows, wildflower strips, ponds, and diverse crop plantings all contribute to a thriving farm ecosystem.",
    ],
    tips: [
      "Plant native flowers and shrubs around field edges",
      "Create wildlife corridors and habitat patches",
      "Maintain diverse crop varieties and heirloom seeds",
      "Provide nesting sites for beneficial insects",
      "Avoid broad-spectrum treatments that harm beneficial species",
    ],
    benefits: [
      "Natural pest control through beneficial insects",
      "Improved pollination services",
      "Enhanced soil health through diverse root systems",
      "Climate resilience and adaptation",
      "Beautiful and productive landscapes",
    ],
    difficulty: "Advanced",
    timeToImplement: "2-5 years",
  },
]

export default function OrganicFarmingGuide() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [completedSections, setCompletedSections] = useState<string[]>([])

  const toggleCompletion = (sectionId: string) => {
    setCompletedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const progressPercentage = (completedSections.length / guideSections.length) * 100

  return (
    <div className="space-y-8">
      {/* Progress Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Completed Sections</span>
              <span>
                {completedSections.length} of {guideSections.length}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex flex-wrap gap-2">
              {guideSections.map((section) => (
                <Badge
                  key={section.id}
                  variant={completedSections.includes(section.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleCompletion(section.id)}
                >
                  {completedSections.includes(section.id) && <CheckCircle className="h-3 w-3 mr-1" />}
                  {section.title}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guide Sections */}
      <div className="grid gap-6">
        {guideSections.map((section) => (
          <Card key={section.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">{section.icon}</div>
                  <div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <p className="text-gray-600 mt-1">{section.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant={
                      section.difficulty === "Beginner"
                        ? "secondary"
                        : section.difficulty === "Intermediate"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {section.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    {section.timeToImplement}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="content">
                  <AccordionTrigger>Learn More</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      {/* Main Content */}
                      <div className="space-y-4">
                        {section.content.map((paragraph, index) => (
                          <p key={index} className="text-gray-700 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {/* Tips */}
                      <div>
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <Leaf className="h-4 w-4" />
                          Practical Tips
                        </h4>
                        <ul className="space-y-2">
                          {section.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Benefits */}
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Key Benefits
                        </h4>
                        <ul className="space-y-2">
                          {section.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Heart className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Button */}
                      <div className="pt-4 border-t space-y-3">
                        <Button
                          onClick={() => toggleCompletion(section.id)}
                          variant={completedSections.includes(section.id) ? "secondary" : "default"}
                          className="w-full"
                        >
                          {completedSections.includes(section.id) ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Completed
                            </>
                          ) : (
                            <>
                              <Users className="h-4 w-4 mr-2" />
                              Mark as Complete
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => window.open("/education/quiz", "_blank")}
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Take Knowledge Quiz
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
