"use client"

import { Database, Search, ShoppingCart, Globe, CheckCircle2, Loader2 } from "lucide-react"

interface AgentAction {
  type: "search" | "database" | "cart" | "web"
  label: string
  status: "pending" | "complete" | "error"
  result?: string
}

interface AgentActionLogProps {
  actions: AgentAction[]
}

export default function AgentActionLog({ actions }: AgentActionLogProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "search":
        return <Search className="h-3.5 w-3.5" />
      case "database":
        return <Database className="h-3.5 w-3.5" />
      case "cart":
        return <ShoppingCart className="h-3.5 w-3.5" />
      case "web":
        return <Globe className="h-3.5 w-3.5" />
      default:
        return <Search className="h-3.5 w-3.5" />
    }
  }

  return (
    <div className="mb-4 space-y-2">
      {actions.map((action, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between rounded-lg border border-border bg-card/50 px-3 py-2 text-xs"
        >
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground">{getIcon(action.type)}</div>
            <span className="font-medium">{action.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {action.status === "pending" ? (
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
            ) : action.status === "complete" ? (
              <CheckCircle2 className="h-3 w-3 text-green-500" />
            ) : (
              <span className="text-red-500">Error</span>
            )}
            {action.result && (
              <span className="text-muted-foreground border-l pl-2 max-w-[150px] truncate">{action.result}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
