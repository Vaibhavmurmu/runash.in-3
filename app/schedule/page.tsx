"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, CalendarIcon, ListFilter } from "lucide-react"
import StreamCalendar from "@/components/streaming/schedule/stream-calendar"
import UpcomingStreams from "@/components/streaming/schedule/upcoming-streams"
import StreamTemplates from "@/components/streaming/schedule/stream-templates"
import ScheduleStreamForm from "@/components/streaming/schedule/schedule-stream-form"
import StreamNotification from "@/components/streaming/schedule/stream-notification"
import type { ScheduledStream, StreamTemplate, CalendarEvent } from "@/types/stream-scheduler"

// Mock data for platforms (in a real app, this would come from the API)
const mockPlatforms = [
  { id: "twitch-1", name: "My Twitch Channel", platform: "twitch" },
  { id: "youtube-1", name: "YouTube Gaming", platform: "youtube" },
  { id: "facebook-1", name: "Facebook Gaming", platform: "facebook" },
]

// Mock data for templates
const mockTemplates = [
  {
    id: "template-1",
    name: "Gaming Stream",
    title: "Let's Play Session",
    description: "Regular gaming session with followers",
    duration: 120,
    platforms: ["twitch-1", "youtube-1"],
    tags: ["gaming", "interactive"],
    category: "Gaming",
    isPublic: true,
  },
  {
    id: "template-2",
    name: "Quick Update",
    title: "Community Update",
    description: "Quick updates and announcements for the community",
    duration: 30,
    platforms: ["twitch-1"],
    tags: ["update", "community"],
    category: "Just Chatting",
    isPublic: true,
  },
]

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState("calendar")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingStream, setEditingStream] = useState<ScheduledStream | null>(null)
  const [initialDate, setInitialDate] = useState<Date | null>(null)
  const [streams, setStreams] = useState<ScheduledStream[]>([])
  const [templates, setTemplates] = useState<StreamTemplate[]>(mockTemplates)
  const [showNotification, setShowNotification] = useState(false)
  const [upcomingStream, setUpcomingStream] = useState<ScheduledStream | null>(null)

  // Load mock data
  useEffect(() => {
    // In a real app, we would fetch this data from an API
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const nextWeek = new Date(now)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const mockStreams: ScheduledStream[] = [
      {
        id: "stream-1",
        title: "Weekly Gaming Stream",
        description: "Join me for some fun gameplay and chat!",
        scheduledDate: tomorrow.toISOString(),
        duration: 120,
        platforms: ["twitch-1", "youtube-1"],
        isRecurring: true,
        recurrencePattern: {
          frequency: "weekly",
          interval: 1,
          daysOfWeek: [tomorrow.getDay()],
        },
        tags: ["gaming", "interactive"],
        category: "Gaming",
        isPublic: true,
        notificationTime: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "stream-2",
        title: "Community Q&A",
        description: "Answering your questions about streaming and content creation",
        scheduledDate: nextWeek.toISOString(),
        duration: 60,
        platforms: ["twitch-1"],
        isRecurring: false,
        tags: ["qa", "community"],
        category: "Just Chatting",
        isPublic: true,
        notificationTime: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    setStreams(mockStreams)

    // Simulate an upcoming stream notification
    setTimeout(() => {
      setUpcomingStream(mockStreams[0])
      setShowNotification(true)
    }, 5000)
  }, [])

  // Convert streams to calendar events
  const calendarEvents: CalendarEvent[] = streams.map((stream) => {
    const start = new Date(stream.scheduledDate)
    const end = new Date(start.getTime() + stream.duration * 60000)

    return {
      id: stream.id,
      title: stream.title,
      start,
      end,
      platforms: stream.platforms,
      color: stream.isRecurring ? "#8b5cf6" : "#f97316", // Purple for recurring, orange for one-time
    }
  })

  const handleCreateStream = () => {
    setEditingStream(null)
    setInitialDate(null)
    setIsFormOpen(true)
  }

  const handleEditStream = (stream: ScheduledStream) => {
    setEditingStream(stream)
    setInitialDate(null)
    setIsFormOpen(true)
  }

  const handleDeleteStream = (streamId: string) => {
    setStreams((prev) => prev.filter((s) => s.id !== streamId))
  }

  const handleDuplicateStream = (stream: ScheduledStream) => {
    const newStream = {
      ...stream,
      id: `stream-${Date.now()}`,
      title: `${stream.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setEditingStream(newStream)
    setIsFormOpen(true)
  }

  const handleSaveStream = (data: Partial<ScheduledStream>) => {
    if (editingStream?.id) {
      // Update existing stream
      setStreams((prev) =>
        prev.map((s) =>
          s.id === editingStream.id
            ? ({
                ...s,
                ...data,
                updatedAt: new Date().toISOString(),
              } as ScheduledStream)
            : s,
        ),
      )
    } else {
      // Create new stream
      const newStream: ScheduledStream = {
        id: `stream-${Date.now()}`,
        title: data.title || "Untitled Stream",
        description: data.description || "",
        scheduledDate: data.scheduledDate || new Date().toISOString(),
        duration: data.duration || 60,
        platforms: data.platforms || [],
        isRecurring: data.isRecurring || false,
        recurrencePattern: data.recurrencePattern,
        tags: data.tags || [],
        category: data.category || "Gaming",
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        notificationTime: data.notificationTime || 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setStreams((prev) => [...prev, newStream])
    }
    setIsFormOpen(false)
    setEditingStream(null)
  }

  const handleSelectCalendarSlot = (slotInfo: { start: Date; end: Date }) => {
    setEditingStream(null)
    setInitialDate(slotInfo.start)
    setIsFormOpen(true)
  }

  const handleSelectCalendarEvent = (event: CalendarEvent) => {
    const stream = streams.find((s) => s.id === event.id)
    if (stream) {
      handleEditStream(stream)
    }
  }

  const handleCreateTemplate = () => {
    // In a real app, this would open a template form
    console.log("Create template")
  }

  const handleEditTemplate = (template: StreamTemplate) => {
    // In a real app, this would open a template form with the template data
    console.log("Edit template", template)
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId))
  }

  const handleUseTemplate = (template: StreamTemplate) => {
    // Create a new stream from the template
    const now = new Date()
    now.setHours(now.getHours() + 1)
    now.setMinutes(0)
    now.setSeconds(0)
    now.setMilliseconds(0)

    const newStream: Partial<ScheduledStream> = {
      title: template.title,
      description: template.description,
      scheduledDate: now.toISOString(),
      duration: template.duration,
      platforms: template.platforms,
      isRecurring: false,
      tags: template.tags,
      category: template.category,
      isPublic: template.isPublic,
      notificationTime: 15,
      templateId: template.id,
    }

    setEditingStream(null)
    setInitialDate(now)
    setIsFormOpen(true)

    // Pre-fill the form with template data
    setTimeout(() => {
      handleSaveStream(newStream)
    }, 100)
  }

  const handleDismissNotification = () => {
    setShowNotification(false)
  }

  const handleGoToStudio = () => {
    // In a real app, this would navigate to the studio page
    console.log("Go to studio")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Stream Scheduler</h1>
          <Button
            onClick={handleCreateStream}
            className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Stream
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="calendar" className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center">
                <ListFilter className="h-4 w-4 mr-2" />
                List View
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calendar" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-[700px]">
                <StreamCalendar
                  events={calendarEvents}
                  onSelectEvent={handleSelectCalendarEvent}
                  onSelectSlot={handleSelectCalendarSlot}
                />
              </div>
              <div className="h-[700px]">
                <StreamTemplates
                  templates={templates}
                  onCreateTemplate={handleCreateTemplate}
                  onEditTemplate={handleEditTemplate}
                  onDeleteTemplate={handleDeleteTemplate}
                  onUseTemplate={handleUseTemplate}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <div className="h-[700px]">
              <UpcomingStreams
                streams={streams}
                onEdit={handleEditStream}
                onDelete={handleDeleteStream}
                onDuplicate={handleDuplicateStream}
              />
            </div>
          </TabsContent>
        </Tabs>

        <ScheduleStreamForm
          isOpen={isFormOpen}
          initialData={editingStream || undefined}
          initialDate={initialDate || undefined}
          platforms={mockPlatforms}
          templates={templates}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveStream}
        />

        {showNotification && upcomingStream && (
          <div className="fixed bottom-4 right-4 w-80 z-50">
            <StreamNotification
              stream={upcomingStream}
              onDismiss={handleDismissNotification}
              onGoToStudio={handleGoToStudio}
            />
          </div>
        )}
      </div>
    </div>
  )
}
