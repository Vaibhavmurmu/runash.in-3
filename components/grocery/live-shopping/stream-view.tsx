"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Heart, Share2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function StreamView() {
  const params = useParams()
  const [isFollowing, setIsFollowing] = useState(false)
  const [viewerCount, setViewerCount] = useState(1234)

  // This would come from your API in a real application
  const streamData = {
    title: "Exclusive Grocery Collection Launch",
    streamer: {
      name: "Grocery Studio Live",
      avatar: "/placeholder.svg",
      followers: "0K",
    },
    category: "Grocery",
    tags: ["New Collection", "Limited Edition", "Sustainable living"],
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
        <video className="w-full h-full object-cover" poster="/placeholder.svg" controls>
          <source src="/stream.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <Badge variant="destructive" className="flex items-center space-x-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span>LIVE</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{viewerCount.toLocaleString()}</span>
          </Badge>
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={streamData.streamer.avatar} />
            <AvatarFallback>{streamData.streamer.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{streamData.title}</h1>
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium">{streamData.streamer.name}</span>
              <span className="text-muted-foreground">{streamData.streamer.followers} followers</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share stream</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setIsFollowing(!isFollowing)}>
                  <Heart className={`h-4 w-4 ${isFollowing ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFollowing ? "Unfollow" : "Follow"} channel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant={isFollowing ? "secondary" : "default"} onClick={() => setIsFollowing(!isFollowing)}>
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{streamData.category}</Badge>
        {streamData.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
