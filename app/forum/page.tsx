"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  MessageSquare,
  Users,
  TrendingUp,
  Pin,
  Lock,
  Eye,
  ThumbsUp,
  Reply,
  Clock,
  Star,
  Award,
  Flame,
  HelpCircle,
  Lightbulb,
  Code,
  Megaphone,
  Plus,
  Filter,
  ArrowRight,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function ForumPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  const forumCategories = [
    {
      id: "all",
      name: "All Categories",
      count: 1247,
      icon: <MessageSquare className="h-5 w-5" />,
      description: "All forum discussions",
    },
    {
      id: "general",
      name: "General Discussion",
      count: 342,
      icon: <MessageSquare className="h-5 w-5" />,
      description: "General RunAsh discussions and community chat",
    },
    {
      id: "streaming",
      name: "Streaming Help",
      count: 289,
      icon: <HelpCircle className="h-5 w-5" />,
      description: "Get help with streaming setup and troubleshooting",
    },
    {
      id: "features",
      name: "Feature Requests",
      count: 156,
      icon: <Lightbulb className="h-5 w-5" />,
      description: "Suggest new features and improvements",
    },
    {
      id: "technical",
      name: "Technical Support",
      count: 198,
      icon: <Code className="h-5 w-5" />,
      description: "Technical issues and API discussions",
    },
    {
      id: "announcements",
      name: "Announcements",
      count: 45,
      icon: <Megaphone className="h-5 w-5" />,
      description: "Official RunAsh announcements and updates",
    },
    {
      id: "showcase",
      name: "Creator Showcase",
      count: 217,
      icon: <Star className="h-5 w-5" />,
      description: "Show off your streams and get feedback",
    },
  ]

  const trendingTopics = [
    {
      id: "1",
      title: "New AI Enhancement Features - Beta Testing",
      category: "announcements",
      author: {
        name: "RunAsh Team",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Staff",
        badge: "official",
      },
      stats: {
        replies: 127,
        views: 2847,
        likes: 89,
      },
      lastActivity: "2 hours ago",
      isPinned: true,
      isLocked: false,
      tags: ["beta", "ai", "features"],
      excerpt:
        "We're excited to announce the beta release of our new AI-powered stream enhancement features. Join the beta program and help us test these cutting-edge capabilities...",
    },
    {
      id: "2",
      title: "How to optimize stream quality for mobile viewers?",
      category: "streaming",
      author: {
        name: "StreamerPro",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Creator",
        badge: "verified",
      },
      stats: {
        replies: 34,
        views: 892,
        likes: 23,
      },
      lastActivity: "4 hours ago",
      isPinned: false,
      isLocked: false,
      tags: ["mobile", "quality", "optimization"],
      excerpt:
        "I've been noticing that my mobile viewers are experiencing quality issues. What are the best practices for optimizing streams for mobile devices?",
    },
    {
      id: "3",
      title: "Multi-platform streaming setup guide",
      category: "general",
      author: {
        name: "TechGuru",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Moderator",
        badge: "moderator",
      },
      stats: {
        replies: 67,
        views: 1543,
        likes: 45,
      },
      lastActivity: "6 hours ago",
      isPinned: false,
      isLocked: false,
      tags: ["multiplatform", "guide", "setup"],
      excerpt:
        "Complete guide on setting up multi-platform streaming with RunAsh. Covers all major platforms including Twitch, YouTube, Facebook, and more...",
    },
    {
      id: "4",
      title: "Feature Request: Custom Alert Animations",
      category: "features",
      author: {
        name: "CreativeStreamer",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Member",
        badge: "contributor",
      },
      stats: {
        replies: 89,
        views: 1234,
        likes: 67,
      },
      lastActivity: "8 hours ago",
      isPinned: false,
      isLocked: false,
      tags: ["alerts", "animations", "customization"],
      excerpt:
        "Would love to see support for custom alert animations. Being able to upload our own GIFs or videos for follower/donation alerts would be amazing...",
    },
    {
      id: "5",
      title: "API Rate Limiting Issues",
      category: "technical",
      author: {
        name: "DevCoder",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer",
        badge: "developer",
      },
      stats: {
        replies: 23,
        views: 567,
        likes: 12,
      },
      lastActivity: "12 hours ago",
      isPinned: false,
      isLocked: false,
      tags: ["api", "rate-limiting", "development"],
      excerpt:
        "Experiencing rate limiting issues with the streaming API. Getting 429 errors even when staying within documented limits. Anyone else seeing this?",
    },
  ]

  const topContributors = [
    {
      name: "StreamMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      posts: 1247,
      reputation: 8950,
      badge: "legend",
      role: "Community Leader",
    },
    {
      name: "TechWizard",
      avatar: "/placeholder.svg?height=40&width=40",
      posts: 892,
      reputation: 6780,
      badge: "expert",
      role: "Technical Expert",
    },
    {
      name: "CreatorHelper",
      avatar: "/placeholder.svg?height=40&width=40",
      posts: 634,
      reputation: 4560,
      badge: "helper",
      role: "Community Helper",
    },
    {
      name: "AIEnthusiast",
      avatar: "/placeholder.svg?height=40&width=40",
      posts: 456,
      reputation: 3240,
      badge: "contributor",
      role: "AI Specialist",
    },
  ]

  const forumStats = [
    { label: "Total Topics", value: "12,847", change: "+234 this week" },
    { label: "Total Posts", value: "89,234", change: "+1,567 this week" },
    { label: "Active Members", value: "45,678", change: "+892 this month" },
    { label: "Online Now", value: "2,341", change: "Peak: 3,456" },
  ]

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "official":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "moderator":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "verified":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "developer":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      case "legend":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "expert":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "helper":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const filteredTopics = trendingTopics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || topic.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const TopicCard = ({ topic }: { topic: (typeof trendingTopics)[0] }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedTopic(topic.id)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={topic.author.avatar || "/placeholder.svg"} alt={topic.author.name} />
            <AvatarFallback>{topic.author.name.slice(0, 2)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {topic.isPinned && <Pin className="h-4 w-4 text-orange-500" />}
              {topic.isLocked && <Lock className="h-4 w-4 text-gray-500" />}
              <Badge variant="outline" className="text-xs">
                {forumCategories.find((c) => c.id === topic.category)?.name}
              </Badge>
            </div>

            <h3 className="text-lg font-semibold mb-2 line-clamp-2">{topic.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{topic.excerpt}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {topic.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <Reply className="h-4 w-4" />
                  {topic.stats.replies}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {topic.stats.views}
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {topic.stats.likes}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={getBadgeColor(topic.author.badge)}>{topic.author.role}</Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {topic.lastActivity}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/5 dark:to-purple-600/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Community Forum
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Connect with fellow creators, get help, share knowledge, and discuss all things RunAsh
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Topic
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Forum Stats */}
      <section className="py-8 bg-white dark:bg-gray-900 border-y border-blue-100 dark:border-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {forumStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.change}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {forumCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {category.icon}
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{category.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={contributor.avatar || "/placeholder.svg"} alt={contributor.name} />
                        <AvatarFallback>{contributor.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{contributor.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">{contributor.role}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{contributor.posts} posts</span>
                        <span>•</span>
                        <span>{contributor.reputation} rep</span>
                      </div>
                    </div>
                    <Badge className={getBadgeColor(contributor.badge)} variant="secondary">
                      {contributor.badge}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start bg-transparent" variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Topic
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline" size="sm">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Get Help
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline" size="sm">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Suggest Feature
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline" size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Showcase Stream
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="trending" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="trending" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="recent" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent
                  </TabsTrigger>
                  <TabsTrigger value="popular" className="flex items-center gap-2">
                    <Flame className="h-4 w-4" />
                    Popular
                  </TabsTrigger>
                  <TabsTrigger value="unanswered" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Unanswered
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <div className="text-sm text-gray-600">{filteredTopics.length} topics</div>
                </div>
              </div>

              <TabsContent value="trending" className="space-y-4">
                {filteredTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </TabsContent>

              <TabsContent value="recent" className="space-y-4">
                {filteredTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </TabsContent>

              <TabsContent value="popular" className="space-y-4">
                {filteredTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </TabsContent>

              <TabsContent value="unanswered" className="space-y-4">
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No unanswered topics</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Great! Our community is actively helping each other
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {filteredTopics.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No topics found</h3>
                <p className="text-gray-600 dark:text-gray-300">Try adjusting your search query or category filter</p>
              </div>
            )}

            {/* Load More */}
            {filteredTopics.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline">
                  Load More Topics
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Connect with thousands of creators, get expert help, and share your streaming journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => router.push("/get-started")}
            >
              <Users className="mr-2 h-4 w-4" />
              Join Community
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
              onClick={() => router.push("/contact")}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
