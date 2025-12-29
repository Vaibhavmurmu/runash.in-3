"use client"

import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

/**
 * A lightweight guided tour for the dashboard.
 * - Shows steps with explanation and a "Next" button.
 * - Stores a flag in localStorage so it doesn't show repeatedly.
 *
 * This is intentionally simple so you can extend it (or replace with react-joyride later).
 */

const TOUR_KEY = "dashboard_tour_shown_v1"

const steps = [
  {
    title: "Welcome to your Dashboard",
    body: "This page shows your recent streams, stats, and activity. Use Quick Actions to start streaming or update settings.",
  },
  {
    title: "Quick Actions",
    body: "Open Quick Actions to quickly start, schedule, or invite collaborators.",
  },
  {
    title: "Stats & Goals",
    body: "Your stats and monthly goals give you insight into performance. Click into items to see more details.",
  },
  {
    title: "Tutorial",
    body: "Open the settings to configure defaults for your streams.",
  },
]

export function DashboardTour({ forceOpen = false }: { forceOpen?: boolean }) {
  const [open, setOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const shown = localStorage.getItem(TOUR_KEY)
    if (forceOpen) {
      setOpen(true)
    } else if (!shown) {
      setOpen(true)
    }
  }, [forceOpen])

  const close = (dismissForever = false) => {
    setOpen(false)
    if (dismissForever) localStorage.setItem(TOUR_KEY, "1")
  }

  const next = () => {
    if (stepIndex < steps.length - 1) setStepIndex((s) => s + 1)
    else {
      close(true)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close(false)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{steps[stepIndex].title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">{steps[stepIndex].body}</p>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <Badge className="bg-muted">Step {stepIndex + 1}/{steps.length}</Badge>
          <Button variant="outline" onClick={() => close(true)}>Don't show again</Button>
          <Button onClick={next}>{stepIndex === steps.length - 1 ? "Finish" : "Next"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DashboardTour
