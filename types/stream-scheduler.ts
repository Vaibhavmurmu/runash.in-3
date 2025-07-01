export interface ScheduledStream {
  id: string
  title: string
  description: string
  scheduledDate: string // ISO date string
  duration: number // in minutes
  platforms: string[] // platform IDs
  isRecurring: boolean
  recurrencePattern?: {
    frequency: "daily" | "weekly" | "monthly"
    interval: number // every X days/weeks/months
    daysOfWeek?: number[] // 0-6, Sunday to Saturday
    endDate?: string // ISO date string
  }
  thumbnail?: string
  tags: string[]
  category: string
  isPublic: boolean
  notificationTime: number // minutes before stream to send notification
  templateId?: string
  createdAt: string
  updatedAt: string
}

export interface StreamTemplate {
  id: string
  name: string
  title: string
  description: string
  duration: number
  platforms: string[]
  thumbnail?: string
  tags: string[]
  category: string
  isPublic: boolean
}

export type StreamFrequency = "once" | "daily" | "weekly" | "monthly"

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay?: boolean
  color?: string
  platforms: string[]
}
