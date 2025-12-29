"use client"
import { Sparkles, Video, MessageSquare, Radio, Layers } from "lucide-react"

interface LeftSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isChatOpen?: boolean
  onChatToggle?: (open: boolean) => void
}

export default function LeftSidebar({ activeTab, onTabChange, isChatOpen, onChatToggle }: LeftSidebarProps) {
  const tools = [
    { id: "generate", label: "Generate", icon: Sparkles, desc: "AI video generation" },
    { id: "edit", label: "Edit", icon: Video, desc: "Video editing tools" },
    { id: "chat", label: "Chat", icon: MessageSquare, desc: "Talk to AI" },
    { id: "stream", label: "Stream", icon: Radio, desc: "Live streaming" },
    { id: "layers", label: "Layers", icon: Layers, desc: "Layer management" },
  ]

  const handleTabChange = (tabId: string) => {
    if (tabId === "chat") {
      onChatToggle?.(!isChatOpen)
    } else {
      onTabChange(tabId)
      onChatToggle?.(false)
    }
  }

  return (
    <div className="w-20 bg-card border-r border-border flex flex-col items-center py-4 gap-2">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => handleTabChange(tool.id)}
          className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center transition-all ${
            (tool.id === "chat" ? isChatOpen : activeTab === tool.id)
              ? "bg-primary text-primary-foreground shadow-lg"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
          title={tool.label}
        >
          <tool.icon className="w-5 h-5" />
          <span className="text-xs mt-1">{tool.label}</span>
        </button>
      ))}
    </div>
  )
}
