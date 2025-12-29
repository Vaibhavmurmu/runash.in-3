"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Calendar, Globe, Lock, UserPlus, Settings, MessageCircle, MapPin, Target } from "lucide-react"
import type { StudyGroup } from "@/types/study-groups"

interface StudyGroupCardProps {
  group: StudyGroup
  isJoined: boolean
  onSelect: () => void
  onJoin: (groupId: string) => void
  onLeave: (groupId: string) => void
  showManageButton?: boolean
}

export default function StudyGroupCard({
  group,
  isJoined,
  onSelect,
  onJoin,
  onLeave,
  showManageButton = false,
}: StudyGroupCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      case "mixed":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case "public":
        return <Globe className="h-4 w-4" />
      case "private":
        return <Lock className="h-4 w-4" />
      case "invite-only":
        return <UserPlus className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const membershipPercentage = (group.currentMembers / group.maxMembers) * 100

  const formatMeetingTime = () => {
    if (!group.meetingSchedule) return "No scheduled meetings"

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const day = days[group.meetingSchedule.dayOfWeek]
    const time = group.meetingSchedule.time
    const frequency = group.meetingSchedule.frequency

    return `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} ${day}s at ${time}`
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onSelect}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(group.difficulty)}>{group.difficulty}</Badge>
            <div className="flex items-center gap-1 text-gray-500">
              {getPrivacyIcon(group.privacy)}
              <span className="text-xs capitalize">{group.privacy}</span>
            </div>
          </div>
          {isJoined && <Badge variant="outline">Joined</Badge>}
        </div>
        <h3 className="font-semibold text-lg leading-tight">{group.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Category and Region */}
        <div className="flex items-center justify-between text-sm">
          <Badge variant="secondary">{group.category}</Badge>
          {group.region && (
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="h-3 w-3" />
              <span>{group.region}</span>
            </div>
          )}
        </div>

        {/* Membership Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-gray-500" />
              <span>
                {group.currentMembers}/{group.maxMembers} members
              </span>
            </div>
            <span className="text-gray-500">{Math.round(membershipPercentage)}% full</span>
          </div>
          <Progress value={membershipPercentage} className="h-2" />
        </div>

        {/* Meeting Schedule */}
        {group.meetingSchedule && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="line-clamp-1">{formatMeetingTime()}</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {group.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {group.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{group.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Goals Preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Target className="h-4 w-4 text-green-600" />
            <span>Group Goals:</span>
          </div>
          <ul className="text-xs text-gray-600 space-y-1">
            {group.goals.slice(0, 2).map((goal, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-green-600 mt-0.5">•</span>
                <span className="line-clamp-1">{goal}</span>
              </li>
            ))}
            {group.goals.length > 2 && <li className="text-gray-500">+{group.goals.length - 2} more goals</li>}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {isJoined ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation()
                  onLeave(group.id)
                }}
              >
                Leave Group
              </Button>
              {showManageButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle manage group
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle view discussions
                }}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              className="flex-1"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onJoin(group.id)
              }}
              disabled={group.currentMembers >= group.maxMembers}
            >
              {group.currentMembers >= group.maxMembers ? "Full" : "Join Group"}
            </Button>
          )}
        </div>

        {/* Activity Indicator */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${group.isActive ? "bg-green-500" : "bg-gray-400"}`} />
            <span>{group.isActive ? "Active" : "Inactive"}</span>
          </div>
          <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
