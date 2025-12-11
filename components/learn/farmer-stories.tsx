"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MapPin, TrendingUp, Users, Calendar, Quote, Play, BookOpen, Star, ArrowRight } from "lucide-react"

interface FarmerStory {
  id: string
  name: string
  location: string
  farmSize: string
  cropType: string
  yearsOrganic: number
  certification: string[]
  story: string
  challenges: string[]
  solutions: string[]
  results: string[]
  quote: string
  image: string
  videoUrl?: string
  category: "Success Story" | "Transition Journey" | "Innovation" | "Community Impact"
  likes: number
  featured: boolean
}

const farmerStories: FarmerStory[] = [
  {
    id: "rajesh-kumar",
    name: "Rajesh Kumar",
    location: "Haryana, India",
    farmSize: "15 acres",
    cropType: "Basmati Rice & Wheat",
    yearsOrganic: 8,
    certification: ["India Organic", "USDA Organic"],
    story:
      "After years of declining soil health and increasing input costs, I decided to transition to organic farming in 2016. The first three years were challenging, but with proper guidance and community support, I've built a sustainable and profitable organic farm. Today, my soil is healthier, my crops are more resilient, and I earn 40% more than conventional farming.",
    challenges: [
      "Initial yield drop during transition period",
      "Lack of knowledge about organic practices",
      "Finding reliable organic input suppliers",
      "Market access for organic produce",
    ],
    solutions: [
      "Joined local farmer producer organization (FPO)",
      "Attended organic farming training programs",
      "Implemented crop rotation and companion planting",
      "Built direct relationships with organic buyers",
    ],
    results: [
      "40% increase in profit margins",
      "Improved soil organic matter from 0.8% to 2.1%",
      "Reduced input costs by 30%",
      "Premium price of ₹35/kg for organic basmati",
    ],
    quote:
      "Organic farming is not just about avoiding chemicals; it's about working with nature to create a sustainable future.",
    image: "/placeholder.svg?height=300&width=300&text=Rajesh+Kumar",
    videoUrl: "https://example.com/rajesh-story",
    category: "Success Story",
    likes: 234,
    featured: true,
  },
  {
    id: "sunita-devi",
    name: "Sunita Devi",
    location: "Kerala, India",
    farmSize: "3 acres",
    cropType: "Spices & Coconut",
    yearsOrganic: 5,
    certification: ["India Organic", "Fair Trade"],
    story:
      "As a woman farmer, I faced many challenges in accessing resources and markets. Organic farming not only improved my farm's productivity but also gave me a platform to lead in my community. I now train other women farmers in organic practices and have formed a women's self-help group for organic spice production.",
    challenges: [
      "Limited access to credit and resources",
      "Pest management in humid climate",
      "Processing and value addition knowledge",
      "Gender-based barriers in farming",
    ],
    solutions: [
      "Formed women's self-help group",
      "Learned integrated pest management techniques",
      "Set up small-scale spice processing unit",
      "Connected with women farmer networks",
    ],
    results: [
      "Tripled income through value addition",
      "Trained 50+ women farmers in organic practices",
      "Established direct export linkages",
      "Won state award for women entrepreneurship",
    ],
    quote: "Organic farming empowered me not just as a farmer, but as a leader in my community.",
    image: "/placeholder.svg?height=300&width=300&text=Sunita+Devi",
    category: "Community Impact",
    likes: 189,
    featured: true,
  },
  {
    id: "anil-verma",
    name: "Dr. Anil Verma",
    location: "Uttarakhand, India",
    farmSize: "25 acres",
    cropType: "Mixed Vegetables & Fruits",
    yearsOrganic: 12,
    certification: ["India Organic", "USDA Organic", "EU Organic"],
    story:
      "After retiring from my job as an agricultural scientist, I started my organic farm to demonstrate that scientific principles can be applied to create highly productive organic systems. My farm now serves as a training center for farmers across North India, showing that organic farming can be both scientific and profitable.",
    challenges: [
      "Scaling organic practices to larger farm",
      "Managing diverse crop portfolio organically",
      "Training and educating other farmers",
      "Maintaining consistent quality for exports",
    ],
    solutions: [
      "Implemented precision organic farming techniques",
      "Developed integrated farming systems",
      "Created farmer training programs",
      "Established quality control systems",
    ],
    results: [
      "Achieved 95% of conventional yields organically",
      "Trained over 1000 farmers in 5 years",
      "Exported to 8 countries",
      "Developed 15 organic farming innovations",
    ],
    quote: "Science and tradition can work together to create the most productive and sustainable farming systems.",
    image: "/placeholder.svg?height=300&width=300&text=Dr+Anil+Verma",
    videoUrl: "https://example.com/anil-story",
    category: "Innovation",
    likes: 312,
    featured: true,
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    location: "Rajasthan, India",
    farmSize: "8 acres",
    cropType: "Millets & Pulses",
    yearsOrganic: 4,
    certification: ["India Organic", "Jaivik Bharat"],
    story:
      "I transitioned from conventional cotton farming to organic millet production after facing severe losses due to pest attacks and market volatility. The transition was difficult initially, but organic millets have given me stable income and improved soil health. I now supply to health food companies and have become an advocate for climate-resilient crops.",
    challenges: [
      "Transitioning from cash crop to food grains",
      "Finding markets for traditional millets",
      "Learning new cultivation techniques",
      "Managing without chemical inputs",
    ],
    solutions: [
      "Connected with health food companies",
      "Learned traditional millet cultivation from elders",
      "Implemented water conservation techniques",
      "Developed value-added millet products",
    ],
    results: [
      "Stable income despite climate variations",
      "Improved soil water retention by 60%",
      "Reduced cultivation costs by 45%",
      "Established millet processing unit",
    ],
    quote: "Millets are not just crops; they are the solution to climate change and nutrition security.",
    image: "/placeholder.svg?height=300&width=300&text=Priya+Sharma",
    category: "Transition Journey",
    likes: 156,
    featured: false,
  },
]

const categories = ["All Stories", "Success Story", "Transition Journey", "Innovation", "Community Impact"]

export default function FarmerStories() {
  const [selectedCategory, setSelectedCategory] = useState("All Stories")
  const [selectedStory, setSelectedStory] = useState<string | null>(null)

  const filteredStories = farmerStories.filter(
    (story) => selectedCategory === "All Stories" || story.category === selectedCategory,
  )

  const featuredStories = farmerStories.filter((story) => story.featured)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Success Story":
        return "bg-green-100 text-green-800"
      case "Transition Journey":
        return "bg-blue-100 text-blue-800"
      case "Innovation":
        return "bg-purple-100 text-purple-800"
      case "Community Impact":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Farmer Success Stories</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real stories from farmers who have successfully transitioned to organic farming. Learn from their experiences,
          challenges, and innovative solutions.
        </p>
      </div>

      {/* Featured Stories */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold flex items-center gap-2">
          <Star className="h-6 w-6 text-yellow-500" />
          Featured Stories
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredStories.map((story) => (
            <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={story.image || "/placeholder.svg"} alt={story.name} />
                    <AvatarFallback>
                      {story.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{story.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {story.location}
                    </div>
                  </div>
                </div>
                <Badge className={getCategoryColor(story.category)}>{story.category}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Farm Size:</span>
                    <div className="font-medium">{story.farmSize}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Crops:</span>
                    <div className="font-medium">{story.cropType}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    <span>{story.yearsOrganic} years organic</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-500" />
                    <span>{story.likes} likes</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {story.certification.slice(0, 2).map((cert) => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                  {story.certification.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{story.certification.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <Quote className="h-4 w-4 text-gray-400 mb-2" />
                  <p className="text-sm italic text-gray-700 line-clamp-3">{story.quote}</p>
                </div>

                <div className="flex gap-2">
                  {story.videoUrl && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <Play className="h-3 w-3 mr-1" />
                      Watch
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedStory(selectedStory === story.id ? null : story.id)}
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    Read Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">All Stories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredStories.map((story) => (
          <Card key={story.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={story.image || "/placeholder.svg"} alt={story.name} />
                    <AvatarFallback>
                      {story.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{story.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {story.location} • {story.farmSize}
                    </div>
                  </div>
                </div>
                <Badge className={getCategoryColor(story.category)}>{story.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 line-clamp-3">{story.story}</p>

              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div className="p-2 bg-green-50 rounded">
                  <div className="font-semibold text-green-600">{story.yearsOrganic}</div>
                  <div className="text-gray-600">Years Organic</div>
                </div>
                <div className="p-2 bg-blue-50 rounded">
                  <div className="font-semibold text-blue-600">{story.certification.length}</div>
                  <div className="text-gray-600">Certifications</div>
                </div>
                <div className="p-2 bg-purple-50 rounded">
                  <div className="font-semibold text-purple-600">{story.likes}</div>
                  <div className="text-gray-600">Likes</div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedStory(selectedStory === story.id ? null : story.id)}
              >
                {selectedStory === story.id ? "Hide Details" : "Read Full Story"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              {selectedStory === story.id && (
                <div className="mt-4 space-y-4 border-t pt-4">
                  <Tabs defaultValue="story">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="story">Story</TabsTrigger>
                      <TabsTrigger value="challenges">Challenges</TabsTrigger>
                      <TabsTrigger value="solutions">Solutions</TabsTrigger>
                      <TabsTrigger value="results">Results</TabsTrigger>
                    </TabsList>

                    <TabsContent value="story" className="space-y-3">
                      <p className="text-gray-700">{story.story}</p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <Quote className="h-4 w-4 text-blue-600 mb-2" />
                        <p className="text-blue-800 italic">"{story.quote}"</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="challenges">
                      <ul className="space-y-2">
                        {story.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="solutions">
                      <ul className="space-y-2">
                        {story.solutions.map((solution, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700">{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="results">
                      <ul className="space-y-2">
                        {story.results.map((result, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-green-800 mb-4">Share Your Story</h3>
          <p className="text-green-700 mb-6 max-w-2xl mx-auto">
            Are you an organic farmer with an inspiring story? Share your journey to help and motivate other farmers in
            their transition to organic agriculture.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-green-600 hover:bg-green-700">
              <Users className="h-4 w-4 mr-2" />
              Submit Your Story
            </Button>
            <Button variant="outline">
              <Heart className="h-4 w-4 mr-2" />
              Connect with Farmers
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
  }
