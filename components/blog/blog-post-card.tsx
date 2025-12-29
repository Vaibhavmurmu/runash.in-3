"use client"

import type React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Eye, Clock, User, Bookmark } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  author: {
    name: string
    avatar: string
  }
  category: string
  publishedAt: string
  readingTime: number
  views: number
  likes: number
  comments: number
  featured: boolean
  image: string
}

interface BlogPostCardProps {
  post: BlogPost
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likes, setLikes] = useState(post.likes)

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
  }

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
        <div className="relative">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {post.featured && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-600 to-yellow-500 text-white">
              Featured
            </Badge>
          )}
          <div className="absolute top-3 right-3 flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
              onClick={handleBookmark}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current text-orange-500" : ""}`} />
            </Button>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              {post.category}
            </Badge>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{post.readingTime} min</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-orange-600 transition-colors">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">{post.excerpt}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{post.author.name}</p>
                <p className="text-xs text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
                  isLiked ? "text-red-500" : ""
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                <span>{likes}</span>
              </button>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{post.views}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
