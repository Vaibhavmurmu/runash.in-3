import type { Metadata } from "next"
import UploadDashboard from "@/components/upload/upload-dashboard"

export const metadata: Metadata = {
  title: "Upload & Stream | RunAsh",
  description: "Upload media and manage your streaming content",
}

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto py-8 px-4">
        <UploadDashboard />
      </div>
    </div>
  )
}
