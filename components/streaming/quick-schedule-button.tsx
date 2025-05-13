"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface QuickScheduleButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function QuickScheduleButton({ variant = "default", size = "default" }: QuickScheduleButtonProps) {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(undefined)

  const handleSchedule = () => {
    if (date) {
      // In a real app, we would pass the date as a query parameter
      router.push(`/schedule?date=${date.toISOString()}`)
    } else {
      router.push("/schedule")
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(variant === "default" && "bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90")}
        >
          <Calendar className={cn("h-4 w-4", size !== "icon" && "mr-2")} />
          {size !== "icon" && "Schedule"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="p-3 border-b">
          <h4 className="font-medium">Quick Schedule</h4>
          <p className="text-xs text-gray-500">Select a date to schedule a stream</p>
        </div>
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          disabled={(date) => date < new Date()}
        />
        <div className="p-3 border-t flex justify-end">
          <Button
            onClick={handleSchedule}
            className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:opacity-90"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            {date ? `Schedule for ${format(date, "MMM d")}` : "Go to Scheduler"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
