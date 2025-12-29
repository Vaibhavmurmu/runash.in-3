"use client"

import { useState } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { CalendarEvent } from "@/types/stream-scheduler"

// Initialize localizer
const localizer = momentLocalizer(moment)

interface StreamCalendarProps {
  events: CalendarEvent[]
  onSelectEvent: (event: CalendarEvent) => void
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void
}

export default function StreamCalendar({ events, onSelectEvent, onSelectSlot }: StreamCalendarProps) {
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [date, setDate] = useState(new Date())

  // Custom toolbar component
  const CustomToolbar = ({ label, onNavigate, onView }: any) => (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => onNavigate("TODAY")}>
          Today
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onNavigate("PREV")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onNavigate("NEXT")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-medium">{label}</h3>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant={view === "month" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setView("month")
            onView("month")
          }}
        >
          Month
        </Button>
        <Button
          variant={view === "week" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setView("week")
            onView("week")
          }}
        >
          Week
        </Button>
        <Button
          variant={view === "day" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setView("day")
            onView("day")
          }}
        >
          Day
        </Button>
      </div>
    </div>
  )

  // Custom event component
  const EventComponent = ({ event }: { event: CalendarEvent }) => (
    <div
      className="px-2 py-1 rounded overflow-hidden text-white text-sm"
      style={{ backgroundColor: event.color || "#f97316" }}
    >
      <div className="font-medium truncate">{event.title}</div>
      {event.platforms && event.platforms.length > 0 && (
        <div className="text-xs opacity-80 truncate">
          {event.platforms.length} platform{event.platforms.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  )

  return (
    <Card className="h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          views={["month", "week", "day"]}
          view={view}
          date={date}
          onNavigate={setDate}
          onView={(newView: any) => setView(newView)}
          selectable
          onSelectEvent={onSelectEvent}
          onSelectSlot={onSelectSlot}
          components={{
            toolbar: CustomToolbar,
            event: EventComponent,
          }}
          className="flex-1"
        />
      </div>
    </Card>
  )
}
