import type React from "react"
export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">{children}</div>
}
