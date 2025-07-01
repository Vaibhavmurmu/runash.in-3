"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, Heart, MessageCircle, Bookmark, Eye } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { ShareButton } from "@/components/blog/share-button"
import { CommentSection } from "@/components/blog/comment-section"

// Mock data for the blog post
const blogPost = {
  id: "1",
  title: "The Future of AI-Powered Live Streaming",
  slug: "future-of-ai-powered-live-streaming",
  excerpt:
    "Explore how artificial intelligence is revolutionizing the live streaming industry and what it means for content creators worldwide.",
  content: `
    <p>Artificial Intelligence is transforming every aspect of digital media, and live streaming is no exception. As we move into 2025, AI-powered streaming platforms are becoming increasingly sophisticated, offering creators unprecedented tools to engage with their audiences.</p>
    
    <h2>The Current State of AI in Streaming</h2>
    <p>Today's streaming platforms already incorporate AI in various ways:</p>
    <ul>
      <li>Automated content moderation</li>
      <li>Real-time video enhancement</li>
      <li>Intelligent chat filtering</li>
      <li>Automated highlight generation</li>
    </ul>
    
    <h2>What's Coming Next</h2>
    <p>The future holds even more exciting possibilities. We're seeing developments in:</p>
    
    <h3>Advanced Video Processing</h3>
    <p>AI algorithms can now enhance video quality in real-time, adjusting lighting, reducing noise, and even generating virtual backgrounds that respond to the streamer's movements naturally.</p>
    
    <h3>Intelligent Content Creation</h3>
    <p>AI assistants are beginning to help streamers create content ideas, generate thumbnails, and even suggest optimal streaming times based on audience behavior patterns.</p>
    
    <h2>The Impact on Content Creators</h2>
    <p>These advancements are democratizing content creation, allowing creators with limited technical knowledge to produce professional-quality streams. However, they also raise questions about authenticity and the human element in content creation.</p>
    
    <h2>Conclusion</h2>
    <p>As AI continues to evolve, the streaming landscape will become more accessible, engaging, and personalized. The key for creators will be finding the right balance between leveraging AI tools and maintaining their unique voice and personality.</p>
  `,
  author: {
    name: "Ram Murmu",
    avatar: "/rammurmu.jpg",
    bio: "AI Researcher and Founder of RunAsh",
  },
  publishedAt: "2025-01-06",
  readTime: "8 min read",
  category: "AI Research",
  tags: ["AI", "Live Streaming", "Technology", "Future"],
  image: "/ai live streaming innovation.webp",
  views: 1247,
  likes: 89,
  comments: 23,
}

const relatedPosts = [
  {
    id: "2",
    title: "Getting Started with AI Video Enhancement",
    slug: "getting-started-ai-video-enhancement",
    excerpt: "Learn how to use RunAsh's AI video enhancement features to improve your stream quality automatically.",
    author: "Ram Murmu",
    publishedAt: "2025-01-05",
    readTime: "5 min read",
    category: "Tutorial",
    image: "/ai-video-enhamcement.webp",
  },
  {
    id: "3",
    title: "Multi-Platform Streaming Best Practices",
    slug: "multi-platform-streaming-best-practices",
    excerpt:
      "Discover the best strategies for streaming to multiple platforms simultaneously while maintaining quality.",
    author: "Ram Murmu",
    publishedAt: "2025-01-04",
    readTime: "7 min read",
    category: "Tips",
    image: "/multi platform streaming.webp",
  },
  {
    id: "4",
    title: "Building Your Streaming Brand with AI",
    slug: "building-streaming-brand-with-ai",
    excerpt: "How to leverage AI tools to create consistent branding and grow your streaming audience.",
    author: "Community Team",
    publishedAt: "2025-01-03",
    readTime: "6 min read",
    category: "Community",
    image: "/building your streaming.webp",
  },
]

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-orange-200/50 dark:border-orange-900/30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                {blogPost.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`gap-2 ${isBookmarked ? "text-orange-500" : ""}`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
              <ShareButton url={`https://runash.in/blog/${blogPost.slug}`} title={blogPost.title} />
            </div>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge
              variant="secondary"
              className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
            >
              {blogPost.category}
            </Badge>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{blogPost.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{blogPost.comments} comments</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text">
            {blogPost.title}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{blogPost.excerpt}</p>

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-12 w-12">
              <AvatarImage src={blogPost.author.avatar || "/placeholder.svg"} alt={blogPost.author.name} />
              <AvatarFallback>
                {blogPost.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{blogPost.author.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{blogPost.author.bio}</div>
            </div>
            <div className="ml-auto text-right text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(blogPost.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{blogPost.readTime}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-video overflow-hidden rounded-xl mb-8">
            <img
              src={blogPost.image || "/placeholder.svg"}
              alt={blogPost.title}
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        {/* Article Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: blogPost.content }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {blogPost.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-orange-200 dark:border-orange-800/30">
              #{tag}
            </Badge>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Author Bio */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={blogPost.author.avatar || "/placeholder.svg"} alt={blogPost.author.name} />
                <AvatarFallback>
                  {blogPost.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">About {blogPost.author.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {blogPost.author.bio}. Passionate about leveraging AI to democratize content creation and empower
                  creators worldwide.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Follow
                  </Button>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <CommentSection postId={blogPost.id} />
      </article>

      {/* Related Posts */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
