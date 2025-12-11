"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Lock,
  UserPlus,
  Target,
  Shield,
  MessageCircle,
  BookOpen,
  Video,
  FileText,
  Star,
  Activity,
  Settings,
  Share2,
} from "lucide-react"
import type { StudyGroup, StudyGroupMember, GroupDiscussion, StudySession } from "@/types/study-groups"

interface StudyGroupDetailsProps {
  group: StudyGroup
  isJoined: boolean
  onClose: () => void
  onJoin: (groupId: string) => void
  onLeave: (groupId: string) => void
}

// Sample data for group details
const sampleMembers: StudyGroupMember[] = [
  {
    id: "member-1",
    groupId: "soil-health-masters",
    userId: "dr-sarah-johnson",
    username: "Dr. Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin",
    joinedAt: new Date("2024-01-15"),
    lastActive: new Date("2024-01-25"),
    contributionScore: 95,
    badges: ["Founder", "Expert", "Helpful"],
    expertise: ["Soil Science", "pH Management", "Organic Matter"],
    studyStreak: 15,
    helpfulAnswers: 42,
    questionsAsked: 8,
  },
  {
    id: "member-2",
    groupId: "soil-health-masters",
    userId: "farmer-raj",
    username: "Rajesh Kumar",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "moderator",
    joinedAt: new Date("2024-01-16"),
    lastActive: new Date("2024-01-25"),
    contributionScore: 78,
    badges: ["Active Learner", "Helpful"],
    expertise: ["Practical Farming", "Field Experience"],
    studyStreak: 12,
    helpfulAnswers: 23,
    questionsAsked: 15,
  },
]

const sampleDiscussions: GroupDiscussion[] = [
  {
    id: "discussion-1",
    groupId: "soil-health-masters",
    title: "Best practices for soil pH testing in different seasons",
    content: "I've been getting inconsistent pH readings across seasons. What factors should I consider?",
    authorId: "farmer-raj",
    authorName: "Rajesh Kumar",
    createdAt: new Date("2024-01-24"),
    updatedAt: new Date("2024-01-25"),
    category: "question",
    tags: ["pH testing", "seasonal variation"],
    replies: [],
    likes: 8,
    views: 45,
    isPinned: false,
    isSolved: true,
  },
  {
    id: "discussion-2",
    groupId: "soil-health-masters",
    title: "Weekly Study Session: Advanced Composting Techniques",
    content: "Join us this Wednesday for our deep dive into advanced composting methods and troubleshooting.",
    authorId: "dr-sarah-johnson",
    authorName: "Dr. Sarah Johnson",
    createdAt: new Date("2024-01-23"),
    updatedAt: new Date("2024-01-23"),
    category: "announcement",
    tags: ["study session", "composting"],
    replies: [],
    likes: 15,
    views: 67,
    isPinned: true,
    isSolved: false,
  },
]

const sampleSessions: StudySession[] = [
  {
    id: "session-1",
    groupId: "soil-health-masters",
    title: "Advanced Soil Testing Workshop",
    description: "Hands-on workshop covering advanced soil testing techniques and interpretation",
    type: "practice",
    scheduledAt: new Date("2024-01-26T19:00:00"),
    duration: 90,
    hostId: "dr-sarah-johnson",
    participants: ["farmer-raj", "member-3", "member-4"],
    materials: [],
    status: "scheduled",
  },
  {
    id: "session-2",
    materials: [],
    status: "scheduled",
  },
  {
    id: "session-2",
    groupId: "soil-health-masters",
    title: "Composting Q&A Session",
    description: "Open discussion about composting challenges and solutions",
    type: "discussion",
    scheduledAt: new Date("2024-01-20T19:00:00"),
    duration: 60,
    hostId: "dr-sarah-johnson",
    participants: ["farmer-raj", "member-3"],
    materials: [],
    status: "completed",
    recordingUrl: "https://example.com/recording-2",
  },
]

export default function StudyGroupDetails({ group, isJoined, onClose, onJoin, onLeave }: StudyGroupDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview")

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

  const formatMeetingTime = () => {
    if (!group.meetingSchedule) return "No scheduled meetings"

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const day = days[group.meetingSchedule.dayOfWeek]
    const time = group.meetingSchedule.time
    const frequency = group.meetingSchedule.frequency

    return `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} ${day}s at ${time} ${group.meetingSchedule.timezone}`
  }

  const membershipPercentage = (group.currentMembers / group.maxMembers) * 100

  return (
    <div className="max-w-6xl mx-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {group.name}
        </DialogTitle>
      </DialogHeader>

      <div className="mt-6 space-y-6">
        {/* Header Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={getDifficultyColor(group.difficulty)}>{group.difficulty}</Badge>
                  <div className="flex items-center gap-1 text-gray-500">
                    {getPrivacyIcon(group.privacy)}
                    <span className="text-sm capitalize">{group.privacy}</span>
                  </div>
                  <Badge variant="secondary">{group.category}</Badge>
                  {group.region && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{group.region}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-700 mb-4">{group.description}</p>
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-6">
                {isJoined ? (
                  <>
                    <Button variant="outline" onClick={() => onLeave(group.id)}>
                      Leave Group
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => onJoin(group.id)}
                    disabled={group.currentMembers >= group.maxMembers}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {group.currentMembers >= group.maxMembers ? "Group Full" : "Join Group"}
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{group.currentMembers}</div>
                <div className="text-sm text-gray-600">Members</div>
                <Progress value={membershipPercentage} className="h-1 mt-1" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.floor((Date.now() - group.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600">Days Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{sampleSessions.length}</div>
                <div className="text-sm text-gray-600">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{sampleDiscussions.length}</div>
                <div className="text-sm text-gray-600">Discussions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members ({group.currentMembers})</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Learning Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {group.goals.map((goal, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Rules */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Group Rules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {group.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Meeting Schedule */}
            {group.meetingSchedule && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Meeting Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{formatMeetingTime()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{group.meetingSchedule.duration} minutes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <span>Dr. Sarah Johnson posted a new discussion about pH testing</span>
                    <span className="text-gray-500 ml-auto">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>RK</AvatarFallback>
                    </Avatar>
                    <span>Rajesh Kumar completed the soil health quiz</span>
                    <span className="text-gray-500 ml-auto">5 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span>Weekly study session scheduled for tomorrow</span>
                    <span className="text-gray-500 ml-auto">1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <div className="grid gap-4">
              {sampleMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {member.username
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{member.username}</h3>
                            <Badge variant={member.role === "admin" ? "default" : "secondary"}>{member.role}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Joined {member.joinedAt.toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{member.contributionScore} contribution score</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {member.badges.map((badge, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="grid grid-cols-3 gap-4 text-center text-sm">
                          <div>
                            <div className="font-semibold text-green-600">{member.studyStreak}</div>
                            <div className="text-gray-500">Streak</div>
                          </div>
                          <div>
                            <div className="font-semibold text-blue-600">{member.helpfulAnswers}</div>
                            <div className="text-gray-500">Helpful</div>
                          </div>
                          <div>
                            <div className="font-semibold text-purple-600">{member.questionsAsked}</div>
                            <div className="text-gray-500">Questions</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discussions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Group Discussions</h3>
              <Button className="bg-green-600 hover:bg-green-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Discussion
              </Button>
            </div>
            <div className="space-y-4">
              {sampleDiscussions.map((discussion) => (
                <Card key={discussion.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {discussion.isPinned && <Star className="h-4 w-4 text-yellow-500" />}
                          <h4 className="font-semibold">{discussion.title}</h4>
                          <Badge variant={discussion.category === "question" ? "default" : "secondary"}>
                            {discussion.category}
                          </Badge>
                          {discussion.isSolved && <Badge className="bg-green-100 text-green-800">Solved</Badge>}
                        </div>
                        <p className="text-gray-700 text-sm mb-3">{discussion.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>By {discussion.authorName}</span>
                          <span>•</span>
                          <span>{discussion.createdAt.toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{discussion.likes} likes</span>
                          <span>•</span>
                          <span>{discussion.views} views</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Reply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Study Sessions</h3>
                <Button className="bg-green-600 hover:bg-green-700">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
            </div>
            <div className="space-y-4">
              {sampleSessions.map((session) => (
                <Card key={session.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          {session.type === "video-watch" ? (
                            <Video className="h-6 w-6 text-blue-600" />
                          ) : session.type === "quiz-session" ? (
                            <BookOpen className="h-6 w-6 text-blue-600" />
                          ) : (
                            <MessageCircle className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{session.title}</h4>
                          <p className="text-gray-600 mb-2">{session.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{session.scheduledAt.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{session.duration} minutes</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{session.participants.length} attending</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge
                          variant={
                            session.status === "completed"
                              ? "default"
                              : session.status === "live"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {session.status}
                        </Badge>
                        {session.status === "scheduled" && <Button size="sm">Join Session</Button>}
                        {session.status === "completed" && session.recordingUrl && (
                          <Button variant="outline" size="sm">
                            <Video className="h-4 w-4 mr-2" />
                            Recording
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Shared Resources</h3>
              <Button className="bg-green-600 hover:bg-green-700">
                <FileText className="h-4 w-4 mr-2" />
                Share Resource
              </Button>
            </div>
            <div className="grid gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 rounded">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Soil Testing Guide PDF</h4>
                        <p className="text-sm text-gray-600">Comprehensive guide to soil testing methods</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>Shared by Dr. Sarah Johnson</span>
                          <span>•</span>
                          <span>Downloaded 45 times</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>4.8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded">
                        <Video className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Composting Workshop Recording</h4>
                        <p className="text-sm text-gray-600">Last week's hands-on composting session</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>Shared by Maria Rodriguez</span>
                          <span>•</span>
                          <span>Viewed 23 times</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>4.9</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Watch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
