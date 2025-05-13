"use client"

import { useState } from "react"
import { BarChart3, Users, Video, MessageSquare } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentStreams } from "@/components/dashboard/recent-streams"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { QuickActions } from "@/components/dashboard/quick-actions"

// Sample data for charts
const viewerData = [
  { date: "Mon", viewers: 245 },
  { date: "Tue", viewers: 388 },
  { date: "Wed", viewers: 356 },
  { date: "Thu", viewers: 498 },
  { date: "Fri", viewers: 602 },
  { date: "Sat", viewers: 783 },
  { date: "Sun", viewers: 689 },
]

const engagementData = [
  { date: "Mon", engagement: 45 },
  { date: "Tue", engagement: 52 },
  { date: "Wed", engagement: 49 },
  { date: "Thu", engagement: 62 },
  { date: "Fri", engagement: 58 },
  { date: "Sat", engagement: 78 },
  { date: "Sun", engagement: 73 },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Views",
      value: "24.5K",
      icon: <BarChart3 />,
      description: "from last month",
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Followers",
      value: "2,345",
      icon: <Users />,
      description: "from last month",
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Streams",
      value: "45",
      icon: <Video />,
      description: "this month",
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Chat Messages",
      value: "12.4K",
      icon: <MessageSquare />,
      description: "this month",
      trend: { value: 3, isPositive: false },
    },
  ]

  const recentStreams = [
    {
      id: "1",
      title: "Getting Started with RunAsh AI",
      date: "Today",
      duration: "2h 15m",
      viewers: 1245,
      status: "live" as const,
    },
    {
      id: "2",
      title: "AI-Powered Content Creation",
      date: "Yesterday",
      duration: "1h 30m",
      viewers: 876,
      status: "ended" as const,
    },
    {
      id: "3",
      title: "Advanced Streaming Techniques",
      date: "Apr 20, 2023",
      duration: "2h 45m",
      viewers: 1532,
      status: "ended" as const,
    },
    {
      id: "4",
      title: "Q&A Session: RunAsh Features",
      date: "Apr 25, 2023",
      duration: "1h 00m",
      viewers: 0,
      status: "scheduled" as const,
    },
  ]

  const activities = [
    {
      id: "1",
      user: { name: "Alex Johnson" },
      action: "commented on your stream",
      target: "Getting Started with RunAsh AI",
      time: "5 minutes ago",
      type: "comment" as const,
    },
    {
      id: "2",
      user: { name: "Sarah Miller" },
      action: "followed you",
      target: "",
      time: "15 minutes ago",
      type: "follow" as const,
    },
    {
      id: "3",
      user: { name: "David Chen" },
      action: "subscribed to your channel",
      target: "",
      time: "1 hour ago",
      type: "subscription" as const,
    },
    {
      id: "4",
      user: { name: "Emma Wilson" },
      action: "donated $25 to your stream",
      target: "AI-Powered Content Creation",
      time: "3 hours ago",
      type: "donation" as const,
    },
    {
      id: "5",
      user: { name: "Michael Brown" },
      action: "commented on your stream",
      target: "Advanced Streaming Techniques",
      time: "5 hours ago",
      type: "comment" as const,
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your streaming activity.</p>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <StatsCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  description={stat.description}
                  trend={stat.trend}
                />
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <RecentStreams streams={recentStreams} />
              <ActivityFeed activities={activities} />
            </div>

            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}
