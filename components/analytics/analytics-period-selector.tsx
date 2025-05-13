"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import type { AnalyticsPeriod } from "@/types/analytics"

interface AnalyticsPeriodSelectorProps {
  currentPeriod: AnalyticsPeriod
  onChange: (period: AnalyticsPeriod) => void
}

export function AnalyticsPeriodSelector({ currentPeriod, onChange }: AnalyticsPeriodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCustom, setIsCustom] = useState(false)
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([
    currentPeriod.start ? new Date(currentPeriod.start) : undefined,
    currentPeriod.end ? new Date(currentPeriod.end) : undefined,
  ])

  const predefinedPeriods = [
    {
      label: "Last 7 days",
      period: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
        label: "Last 7 days",
      },
    },
    {
      label: "Last 30 days",
      period: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
        label: "Last 30 days",
      },
    },
    {
      label: "This month",
      period: {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
        end: new Date().toISOString(),
        label: "This month",
      },
    },
    {
      label: "Last month",
      period: {
        start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString(),
        end: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString(),
        label: "Last month",
      },
    },
    {
      label: "Last 3 months",
      period: {
        start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
        label: "Last 3 months",
      },
    },
    {
      label: "Year to date",
      period: {
        start: new Date(new Date().getFullYear(), 0, 1).toISOString(),
        end: new Date().toISOString(),
        label: "Year to date",
      },
    },
    {
      label: "Custom range",
      period: {
        start: "",
        end: "",
        label: "Custom range",
      },
    },
  ]

  const handlePeriodSelect = (period: AnalyticsPeriod) => {
    if (period.label === "Custom range") {
      setIsCustom(true)
    } else {
      onChange(period)
      setIsOpen(false)
      setIsCustom(false)
    }
  }

  const handleCustomRangeSelect = () => {
    if (dateRange[0] && dateRange[1]) {
      const customPeriod: AnalyticsPeriod = {
        start: dateRange[0].toISOString(),
        end: dateRange[1].toISOString(),
        label: `${format(dateRange[0], "MMM d, yyyy")} - ${format(dateRange[1], "MMM d, yyyy")}`,
      }
      onChange(customPeriod)
      setIsOpen(false)
      setIsCustom(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto justify-between">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{currentPeriod.label}</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {!isCustom ? (
          <div className="flex flex-col">
            {predefinedPeriods.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="justify-start font-normal"
                onClick={() => handlePeriodSelect(item.period)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        ) : (
          <div className="p-3">
            <Calendar
              mode="range"
              selected={{
                from: dateRange[0],
                to: dateRange[1],
              }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setDateRange([range.from, range.to])
                }
              }}
              numberOfMonths={2}
              disabled={{ after: new Date() }}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCustom(false)}>
                Cancel
              </Button>
              <Button onClick={handleCustomRangeSelect}>Apply Range</Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
