"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Calendar,
  Award,
  Heart,
  MessageSquare,
  BookOpen,
  Mic,
  Video,
  Target,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  UserPlus,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function CommunityPage() {
  const router = useRouter()
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)

  const communityPrograms = [
    {
      id: "mentorship",
      title: "Creator Mentorship Program",
      description: "Get paired with experienced streamers for personalized guidance",
      icon: <Users className="h-8 w-8" />,
      color: "from-blue-500 to-cyan-500",
      participants: 1247,
      duration: "3 months",
      nextCohort: "March 2024",
      benefits: [
        "1-on-1 mentoring sessions",
        "Growth strategy planning",
        "Technical setup guidance",
        "Community networking",
        "Monthly group workshops",
      ],
      requirements: ["Active RunAsh user", "Commitment to 3-month program", "Willingness to help others"],
    },
    {
      id: "innovation",
      title: "Innovation Lab",
      description: "Beta test new features and shape the future of RunAsh",
      icon: <Zap className="h-8 w-8" />,
      color: "from-purple-500 to-pink-500",
      participants: 456,
      duration: "Ongoing",
      nextCohort: "Rolling admission",
      benefits: [
        "Early access to new features",
        "Direct feedback to dev team",
        "Exclusive community access",
        "Recognition in product releases",
        "Special beta tester badge",
      ],
      requirements: ["Pro or Enterprise plan", "Active streaming schedule", "Technical feedback skills"],
    },
    {
      id: "content",
      title: "Content Challenge Series",
      description: "Monthly themed challenges to boost creativity and engagement",
      icon: <Target className="h-8 w-8" />,
      color: "from-orange-500 to-red-500",
      participants: 2341,
      duration: "Monthly",
      nextCohort: "February Challenge",
      benefits: [
        "Monthly themed challenges",
        "Prize pools up to $5,000",
        "Featured creator spotlights",
        "Cross-promotion opportunities",
        "Skill development workshops",
      ],
      requirements: ["Original content creation", "Follow community guidelines", "Engage with other participants"],
    },
    {
      id: "success",
      title: "Success Circle",
      description: "Exclusive network for top-performing creators",
      icon: <Award className="h-8 w-8" />,
      color: "from-yellow-500 to-orange-500",
      participants: 89,
      duration: "Invitation only",
      nextCohort: "By invitation",
      benefits: [
        "Exclusive networking events",
        "Direct access to RunAsh team",
        "Revenue optimization consulting",
        "Brand partnership opportunities",
        "Annual Success Summit",
      ],
      requirements: ["Top 5% of creators by engagement", "Consistent growth metrics", "Community leadership"],
    },
  ]

  const upcomingEvents = [
    {
      id: "1",
      title: "AI Streaming Workshop",
      description: "Learn how to leverage AI features for better streams",
      date: "2024-02-15",
      time: "2:00 PM PST",
      type: "Workshop",
      attendees: 234,
      maxAttendees: 500,
      speaker: {
        name: "Dr. Sarah Chen",
        role: "AI Research Lead",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      tags: ["AI", "Workshop", "Technical"],
    },
    {
      id: "2",
      title: "Creator Showcase Night",
      description: "Monthly showcase featuring community creators",
      date: "2024-02-20",
      time: "7:00 PM PST",
      type: "Showcase",
      attendees: 567,
      maxAttendees: 1000,
      speaker: {
        name: "Community Team",
        role: "RunAsh Staff",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      tags: ["Showcase", "Community", "Networking"],
    },
    {
      id: "3",
      title: "Growth Strategy Session",
      description: "Advanced strategies for scaling your streaming business",
      date: "2024-02-25",
      time: "1:00 PM PST",
      type: "Strategy",
      attendees: 189,
      maxAttendees: 300,
      speaker: {
        name: "Marcus Johnson",
        role: "Growth Expert",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      tags: ["Growth", "Business", "Strategy"],
    },
  ]

  const featuredMembers = [
    {
      name: "StreamQueen",
      avatar: "/placeholder.svg?height=60&width=60",
      role: "Gaming Creator",
      followers: "125K",
      growth: "+45%",
      achievement: "Reached 100K followers in 6 months",
      quote: "RunAsh's AI features helped me double my engagement rate. The community support is incredible!",
      platforms: ["Twitch", "YouTube", "TikTok"],
      joinedDate: "2023-06-15",
    },
    {
      name: "TechTalker",
      avatar: "/placeholder.svg?height=60&width=60",
      role: "Tech Educator",
      followers: "89K",
      growth: "+67%",
      achievement: "Built successful tech education channel",
      quote: "The multi-platform streaming saved me hours of work. Now I can focus on creating great content.",
      platforms: ["YouTube", "LinkedIn", "Twitter"],
      joinedDate: "2023-04-20",
    },
    {
      name: "ArtisticSoul",
      avatar: "/placeholder.svg?height=60&width=60",
      role: "Art Streamer",
      followers: "67K",
      growth: "+89%",
      achievement: "Monetized art streams successfully",
      quote: "The community challenges pushed me to try new art styles. My audience loves the variety now!",
      platforms: ["Instagram", "TikTok", "YouTube"],
      joinedDate: "2023-08-10",
    },
  ]

  const communityResources = [
    {
      category: "Guides & Tutorials",
      icon: <BookOpen className="h-6 w-6" />,
      items: [
        { title: "Complete Streaming Setup Guide", type: "Guide", duration: "30 min read" },
        { title: "AI Features Masterclass", type: "Video", duration: "45 min" },
        { title: "Multi-Platform Strategy", type: "Guide", duration: "20 min read" },
        { title: "Monetization Best Practices", type: "Guide", duration: "25 min read" },
      ],
    },
    {
      category: "Community Podcasts",
      icon: <Mic className="h-6 w-6" />,
      items: [
        { title: "Creator Spotlight Series", type: "Podcast", duration: "Weekly" },
        { title: "Tech Talk Tuesdays", type: "Podcast", duration: "Bi-weekly" },
        { title: "Success Stories", type: "Podcast", duration: "Monthly" },
        { title: "Industry Insights", type: "Podcast", duration: "Monthly" },
      ],
    },
    {
      category: "Live Workshops",
      icon: <Video className="h-6 w-6" />,
      items: [
        { title: "Beginner Streaming Workshop", type: "Live", duration: "2 hours" },
        { title: "Advanced AI Features", type: "Live", duration: "1.5 hours" },
        { title: "Community Building", type: "Live", duration: "1 hour" },
        { title: "Revenue Optimization", type: "Live", duration: "2 hours" },
      ],
    },
  ]

  const communityStats = [
    { label: "Active Members", value: "45,678", change: "+12% this month" },
    { label: "Events This Month", value: "24", change: "8 upcoming" },
    { label: "Success Stories", value: "1,247", change: "+89 this week" },
    { label: "Community Projects", value: "156", change: "23 active" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 dark:from-purple-600/5 dark:to-pink-600/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
              Join 45K+ Creators
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-transparent bg-clip-text">
              RunAsh Creator Community
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect, learn, and grow with fellow creators. Access exclusive programs, events, and resources designed
              to accelerate your streaming success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                onClick={() => router.push("/get-started")}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Join Community
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/forum")}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Visit Forum
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-12 bg-white dark:bg-gray-900 border-y border-purple-100 dark:border-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {communityStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{stat.label}</div>
                <div className="text-xs text-green-600">{stat.change}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Programs */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Community Programs</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Exclusive programs designed to help you grow, learn, and connect with fellow creators
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {communityPrograms.map((program, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedProgram(program.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${program.color} text-white`}>{program.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{program.title}</CardTitle>
                      <p className="text-gray-600 dark:text-gray-300">{program.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{program.participants}</div>
                        <div className="text-xs text-gray-600">Participants</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{program.duration}</div>
                        <div className="text-xs text-gray-600">Duration</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{program.nextCohort}</div>
                        <div className="text-xs text-gray-600">Next Cohort</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Key Benefits:</div>
                      {program.benefits.slice(0, 3).map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {benefit}
                        </div>
                      ))}
                      {program.benefits.length > 3 && (
                        <div className="text-sm text-gray-600">+{program.benefits.length - 3} more benefits</div>
                      )}
                    </div>

                    <Button className="w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join our regular events to learn, network, and grow your streaming skills
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      {event.type}
                    </Badge>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {event.attendees}/{event.maxAttendees}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{event.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={event.speaker.avatar || "/placeholder.svg"} alt={event.speaker.name} />
                        <AvatarFallback>{event.speaker.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{event.speaker.name}</div>
                        <div className="text-xs text-gray-600">{event.speaker.role}</div>
                      </div>
                    </div>

                    <Progress value={(event.attendees / event.maxAttendees) * 100} className="h-2" />

                    <div className="flex flex-wrap gap-1">
                      {event.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full">Register Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Members */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Community Members</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Celebrating the success stories of our amazing creator community
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredMembers.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{member.followers}</div>
                        <div className="text-xs text-gray-600">Followers</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{member.growth}</div>
                        <div className="text-xs text-gray-600">Growth</div>
                      </div>
                    </div>

                    <div className="text-center">
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        <Award className="h-3 w-3 mr-1" />
                        {member.achievement}
                      </Badge>
                    </div>

                    <blockquote className="text-sm italic text-gray-600 dark:text-gray-300 text-center">
                      "{member.quote}"
                    </blockquote>

                    <div className="flex justify-center gap-2">
                      {member.platforms.map((platform, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-center text-xs text-gray-500">
                      Member since {new Date(member.joinedDate).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Resources */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Community Resources</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Access our comprehensive library of guides, tutorials, and educational content
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {communityResources.map((resource, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {resource.icon}
                    {resource.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {resource.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                            <span>{item.duration}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Connect with 45,000+ creators, access exclusive programs, and accelerate your streaming success
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100"
              onClick={() => router.push("/get-started")}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Join Community
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
              onClick={() => router.push("/forum")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Visit Forum
            </Button>
          </div>
          <p className="mt-4 text-sm opacity-75">Free to join • Exclusive member benefits • Active community support</p>
        </div>
      </section>
    </div>
  )
}
