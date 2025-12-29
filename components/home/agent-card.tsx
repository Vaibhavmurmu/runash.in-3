"use client"

import React from "react"
import { Button } from "@/components/ui/button"

export default function AgentCard({ agent, onStart }: { agent: any; onStart?: () => void }) {
  return (
    <div className="border rounded-md p-3 flex flex-col items-start gap-3">
      <div className="w-full flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          <img src={agent.avatar || "/placeholder.svg?height=96&width=96"} alt={agent.name} className="object-cover h-full w-full" />
        </div>
        <div className="flex-1">
          <div className="font-medium">{agent.name}</div>
          <div className="text-xs text-gray-500">{agent.tagline}</div>
        </div>
        <div className={`h-2 w-2 rounded-full ${agent.online ? "bg-green-400" : "bg-gray-400"}`} />
      </div>

      <div className="w-full flex items-center gap-2">
        <Button size="sm" onClick={onStart} className="flex-1 bg-gradient-to-r from-orange-600 to-yellow-500 text-white">Start</Button>
        <Button size="sm" variant="outline">Profile</Button>
      </div>
    </div>
  )
}
