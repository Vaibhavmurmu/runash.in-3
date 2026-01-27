"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Brain, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AgentThoughtProps {
  thought: string
  steps?: string[]
}

export default function AgentThought({ thought, steps }: AgentThoughtProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-primary/20 bg-agent-thought/50 backdrop-blur-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-primary/5"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Brain className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-medium text-primary">Agentic Reasoning</span>
        </div>
        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-primary/10 px-4 py-3"
          >
            <p className="text-sm italic text-muted-foreground leading-relaxed">{thought}</p>
            {steps && steps.length > 0 && (
              <ul className="mt-3 space-y-2">
                {steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Sparkles className="mt-0.5 h-3 w-3 text-primary/50" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
