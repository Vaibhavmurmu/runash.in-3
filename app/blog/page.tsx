"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Calendar, Clock, Search, User } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { CategoryFilter } from "@/components/blog/category-filter"

const blogPosts = [
  {
    id: "1",
    title: "Getting Started with AI Video Enhancement",
    slug: "getting-started-ai-video-enhancement",
    excerpt: "Learn how to use RunAsh's AI video enhancement features to improve your stream quality automatically.",
    author: "Ram Murmu",
    publishedAt: "2025-01-06",
    readTime: "5 min read",
    category: "Tutorial",
    image: "/ai-video-enhamcement.webp",
  },
  {
    id: "2",
    title: "Multi-Platform Streaming Best Practices",
    slug: "multi-platform-streaming-best-practices",
    excerpt:
      "Discover the best strategies for streaming to multiple platforms simultaneously while maintaining quality.",
    author: "Ram Murmu",
    publishedAt: "2025-01-06",
    readTime: "7 min read",
    category: "Tips",
    image: "/multi platform streaming.webp",
  },
  {
    id: "3",
    title: "RunAsh 2.1 Release Notes",
    slug: "runash-2-1-release-notes",
    excerpt:
      "Explore the latest features and improvements in RunAsh AI 2.1, including enhanced chat moderation and new analytics.",
    author: "Product Team",
    publishedAt: "2025-01-04",
    readTime: "4 min read",
    category: "Product Updates",
    image: "/release notes.webp",
  },
  {
    id: "4",
    title: "Building Your Streaming Brand with AI",
    slug: "building-streaming-brand-with-ai",
    excerpt: "How to leverage AI tools to create consistent branding and grow your streaming audience.",
    author: "Community Team",
    publishedAt: "2025-01-06",
    readTime: "6 min read",
    category: "Community",
    image: "/building your streaming.webp",
  },
  {
    id: "5",
    title: "The Science Behind Real-Time Video Processing",
    slug: "science-behind-real-time-video-processing",
    excerpt: "A deep dive into the technical challenges and solutions for processing video streams in real-time.",
    author: "Ram Murmu",
    publishedAt: "2025-02-01",
    readTime: "10 min read",
    category: "AI Research",
    image: "/real time video processing.webp",
  },
  {
    id: "6",
    title: "Community Spotlight: Top Streamers Using RunAsh",
    slug: "community-spotlight-top-streamers",
    excerpt: "Meet some of the amazing content creators who are using RunAsh AI to elevate their streaming experience.",
    author: "Community Team",
    publishedAt: "2025-01-06",
    readTime: "8 min read",
    category: "Community",
    image: "/community.webp",
  },
]

const featuredPost = {
  id: "featured",
  title: "The Future of AI-Powered Live Streaming",
  slug: "future-of-ai-powered-live-streaming",
  excerpt:
    "Explore how artificial intelligence is revolutionizing the live streaming industry and what it means for content creators worldwide.",
  author: "Ram Murmu",
  publishedAt: "2025-01-06",
  readTime: "8 min read",
  category: "AI Research",
  image: "/ai live streaming innovation.webp",
  featured: true,
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = ["Tutorial", "Product Updates", "AI Research", "Community", "Tips"]
  const postCounts = {
    all: blogPosts.length + 1,
    Tutorial: blogPosts.filter((p) => p.category === "Tutorial").length,
    "Product Updates": blogPosts.filter((p) => p.category === "Product Updates").length,
    "AI Research": blogPosts.filter((p) => p.category === "AI Research").length + 1,
    Community: blogPosts.filter((p) => p.category === "Community").length,
    Tips: blogPosts.filter((p) => p.category === "Tips").length,
  }

  const filteredPosts = selectedCategory ? blogPosts.filter((post) => post.category === selectedCategory) : blogPosts

  const filteredFeaturedPost = selectedCategory
    ? featuredPost.category === selectedCategory
      ? featuredPost
      : null
    : featuredPost

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/30 to-white dark:from-gray-950 dark:via-orange-950/30 dark:to-gray-950"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5 dark:opacity-10"></div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 px-6 py-2 border border-orange-500/30 rounded-full bg-orange-500/10 backdrop-blur-sm">
              <span className="text-orange-600 dark:text-orange-400">RunAsh Blog</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text">
              Insights & Updates
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              Stay up to date with the latest news, tutorials, and insights from the RunAsh AI team.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-gray-900/50 border-orange-200 dark:border-orange-800/30 focus:border-orange-500/70"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Category Filter */}
            <div className="mb-8">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                postCounts={postCounts}
              />
            </div>

            {/* Featured Post */}
            {filteredFeaturedPost && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Featured Article</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="aspect-video overflow-hidden rounded-xl">
                    <img
                      src={filteredFeaturedPost.image || "/placeholder.svg"}
                      alt="Featured article"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium rounded-full">
                        {filteredFeaturedPost.category}
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-sm font-medium rounded-full">
                        Featured
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold mb-4">{filteredFeaturedPost.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{filteredFeaturedPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{filteredFeaturedPost.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(filteredFeaturedPost.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{filteredFeaturedPost.readTime}</span>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 dark:from-orange-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:to-yellow-600 text-white">
                      <a href={`/blog/${filteredFeaturedPost.slug}`}>
                        Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Posts */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {selectedCategory ? `${selectedCategory} Posts` : "Recent Posts"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No posts found in this category.</p>
                </div>
              )}
            </div>

            {/* Newsletter Signup */}
            <div className="mt-16 p-8 rounded-xl bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 border border-orange-200 dark:border-orange-800/30">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-orange-800 dark:text-orange-300">Stay Updated</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Subscribe to our newsletter for the latest updates, tutorials, and insights.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  placeholder="Enter your email"
                  className="bg-white dark:bg-gray-900 border-orange-200 dark:border-orange-800/30"
                />
                <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 dark:from-orange-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:to-yellow-600 text-white">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-gray-950 border-t border-orange-200/50 dark:border-orange-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500">
            <p>© {new Date().getFullYear()} RunAsh AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
