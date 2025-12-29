"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AlertEvent } from "@/types/alerts"
import { format } from "date-fns"
import { Search, Calendar, RefreshCw } from "lucide-react"

// Mock data for alert history
const mockAlertEvents: AlertEvent[] = [
  {
    id: "1",
    type: "follow",
    username: "NewViewer123",
    platform: "twitch",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: "2",
    type: "subscription",
    username: "LoyalFan42",
    platform: "twitch",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    tier: "Tier 1",
    months: 3,
  },
  {
    id: "3",
    type: "donation",
    username: "GenerousDonor",
    platform: "streamlabs",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    amount: 15.0,
    message: "Love the content! Keep it up!",
  },
  {
    id: "4",
    type: "raid",
    username: "FriendlyStreamer",
    platform: "twitch",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    viewers: 75,
  },
  {
    id: "5",
    type: "cheer",
    username: "CheerfulViewer",
    platform: "twitch",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    amount: 500,
    message: "Bits for the win!",
  },
]

export default function AlertHistory() {
  const [alertEvents, setAlertEvents] = useState<AlertEvent[]>(mockAlertEvents)
  const [filterType, setFilterType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEvents = alertEvents.filter((event) => {
    const matchesType = filterType === "all" || event.type === filterType
    const matchesSearch =
      event.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.message && event.message.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesType && matchesSearch
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "follow":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "subscription":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      case "donation":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "cheer":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "host":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400"
      case "raid":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
      case "milestone":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return format(date, "MMM d, yyyy h:mm a")
  }

  const getEventDetails = (event: AlertEvent) => {
    switch (event.type) {
      case "follow":
        return `${event.username} followed`
      case "subscription":
        return `${event.username} subscribed (${event.tier}, ${event.months} month${event.months !== 1 ? "s" : ""})`
      case "donation":
        return `${event.username} donated $${event.amount}`
      case "cheer":
        return `${event.username} cheered ${event.amount} bits`
      case "host":
        return `${event.username} hosted with ${event.viewers} viewers`
      case "raid":
        return `${event.username} raided with ${event.viewers} viewers`
      case "milestone":
        return `${event.username} reached milestone: ${event.milestone}`
      default:
        return `${event.username} triggered a ${event.type} alert`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert History</CardTitle>
        <CardDescription>Recent alerts that have been triggered during your streams</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by username or message"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="follow">Follows</SelectItem>
              <SelectItem value="subscription">Subscriptions</SelectItem>
              <SelectItem value="donation">Donations</SelectItem>
              <SelectItem value="cheer">Cheers</SelectItem>
              <SelectItem value="host">Hosts</SelectItem>
              <SelectItem value="raid">Raids</SelectItem>
              <SelectItem value="milestone">Milestones</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="shrink-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="border rounded-md">
          {filteredEvents.length > 0 ? (
            <div className="divide-y">
              {filteredEvents.map((event) => (
                <div key={event.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getTypeColor(event.type)}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                        <span className="text-sm font-medium">{getEventDetails(event)}</span>
                      </div>
                      {event.message && <p className="text-sm text-muted-foreground mt-1">"{event.message}"</p>}
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatTimestamp(event.timestamp)}</span>
                        <span className="mx-2">•</span>
                        <span className="capitalize">{event.platform}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No alerts found matching your filters</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
