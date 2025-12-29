"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, MoreHorizontal, Flag, Share2, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
    isAuthor?: boolean
  }
  content: string
  timestamp: string
  likes: number
  replies: Comment[]
  isLiked?: boolean
}

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: {
        name: "Alex Thompson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "This is an excellent article! The insights about AI-powered live streaming are really valuable. I've been considering starting my own organic product business and this gives me a lot to think about.",
      timestamp: "2 hours ago",
      likes: 12,
      replies: [
        {
          id: "1-1",
          author: {
            name: "Sarah Chen",
            avatar: "/placeholder.svg?height=40&width=40",
            isAuthor: true,
          },
          content:
            "Thank you so much, Alex! I'm glad you found it helpful. If you do start your organic product business, I'd love to hear about your experience with live streaming.",
          timestamp: "1 hour ago",
          likes: 5,
          replies: [],
        },
      ],
    },
    {
      id: "2",
      author: {
        name: "Maria Garcia",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "I've been using live streaming for my organic farm products for about 6 months now. The engagement is incredible compared to traditional e-commerce. Customers love seeing the actual farming process!",
      timestamp: "4 hours ago",
      likes: 18,
      replies: [],
    },
    {
      id: "3",
      author: {
        name: "David Kim",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Great article! One question though - what are the technical requirements for getting started with AI-enhanced streaming? Do you need expensive equipment?",
      timestamp: "6 hours ago",
      likes: 8,
      replies: [],
    },
  ])

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: newComment,
      timestamp: "Just now",
      likes: 0,
      replies: [],
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim()) return

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: replyContent,
      timestamp: "Just now",
      likes: 0,
      replies: [],
    }

    setComments(
      comments.map((comment) =>
        comment.id === parentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
      ),
    )
    setReplyContent("")
    setReplyTo(null)
  }

  const handleLikeComment = (commentId: string, isReply = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(
        comments.map((comment) =>
          comment.id === parentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === commentId
                    ? { ...reply, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1, isLiked: !reply.isLiked }
                    : reply,
                ),
              }
            : comment,
        ),
      )
    } else {
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1, isLiked: !comment.isLiked }
            : comment,
        ),
      )
    }
  }

  const CommentItem = ({
    comment,
    isReply = false,
    parentId,
  }: { comment: Comment; isReply?: boolean; parentId?: string }) => (
    <div className={`${isReply ? "ml-8 mt-4" : ""}`}>
      <Card className="border-l-4 border-l-orange-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-sm">{comment.author.name}</h4>
                  {comment.author.isAuthor && (
                    <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">Author</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{comment.timestamp}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm mb-3">{comment.content}</p>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLikeComment(comment.id, isReply, parentId)}
              className={`h-8 ${comment.isLiked ? "text-red-500" : ""}`}
            >
              <Heart className={`h-4 w-4 mr-1 ${comment.isLiked ? "fill-current" : ""}`} />
              {comment.likes}
            </Button>
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="h-8"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Reply
              </Button>
            )}
          </div>

          {replyTo === comment.id && (
            <div className="mt-4 space-y-3">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleSubmitReply(comment.id)}>
                  Reply
                </Button>
                <Button variant="outline" size="sm" onClick={() => setReplyTo(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} isReply={true} parentId={comment.id} />
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>

      {/* New Comment Form */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                Post Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}
