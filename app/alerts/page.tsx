import type { Metadata } from "next"
import AlertManager from "@/components/streaming/alerts/alert-manager"

export const metadata: Metadata = {
  title: "Stream Alerts | RunAsh",
  description: "Create and manage alerts for your live streams",
}

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <AlertManager />
      </div>
    </div>
  )
}
