"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle, MoreHorizontal, Reply } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  publishedAt: string
  likes: number
  replies?: Comment[]
}

const mockComments: Comment[] = [
  {
    id: "1",
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder-user.jpg",
    },
    content:
      "This is a fantastic article! The insights about AI in streaming are really eye-opening. I'm particularly interested in the real-time video enhancement capabilities.",
    publishedAt: "2025-01-06T10:30:00Z",
    likes: 12,
    replies: [
      {
        id: "1-1",
        author: {
          name: "Ram Murmu",
          avatar: "/rammurmu.jpg",
        },
        content:
          "Thank you Sarah! The real-time enhancement is indeed one of the most exciting developments. We're seeing 40% improvement in video quality with minimal latency.",
        publishedAt: "2025-01-06T11:15:00Z",
        likes: 8,
      },
    ],
  },
  {
    id: "2",
    author: {
      name: "Mike Chen",
      avatar: "/placeholder-user.jpg",
    },
    content:
      "Great read! I've been using RunAsh for my streams and the AI features have been game-changing. The automated highlight generation saves me hours of editing time.",
    publishedAt: "2025-01-06T09:45:00Z",
    likes: 7,
  },
  {
    id: "3",
    author: {
      name: "Emily Rodriguez",
      avatar: "/placeholder-user.jpg",
    },
    content:
      "The section about intelligent content creation is fascinating. Do you think AI will eventually replace human creativity in streaming, or will it always be a tool to enhance it?",
    publishedAt: "2025-01-06T08:20:00Z",
    likes: 15,
  },
]

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: "You",
        avatar: "/placeholder-user.jpg",
      },
      content: newComment,
      publishedAt: new Date().toISOString(),
      likes: 0,
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
        avatar: "/placeholder-user.jpg",
      },
      content: replyContent,
      publishedAt: new Date().toISOString(),
      likes: 0,
    }

    setComments(
      comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
          }
        }
        return comment
      }),
    )

    setReplyContent("")
    setReplyingTo(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? "ml-12" : ""}`}>
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
          <AvatarFallback>
            {comment.author.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{comment.author.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.publishedAt)}</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
              <Heart className="h-3 w-3" />
              <span>{comment.likes}</span>
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="flex items-center gap-1 hover:text-orange-500 transition-colors"
              >
                <Reply className="h-3 w-3" />
                <span>Reply</span>
              </button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:text-gray-700 dark:hover:text-gray-300">
                  <MoreHorizontal className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {replyingTo === comment.id && (
        <div className="ml-11 mt-3">
          <div className="flex gap-2">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[80px] text-sm"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={() => handleSubmitReply(comment.id)} disabled={!replyContent.trim()}>
              Reply
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setReplyingTo(null)
                setReplyContent("")
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* Comment Form */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700"
              >
                Post Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment, index) => (
          <div key={comment.id}>
            <CommentItem comment={comment} />
            {index < comments.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}
      </div>
    </div>
  )
}
