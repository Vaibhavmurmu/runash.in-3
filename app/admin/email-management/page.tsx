import { EmailManagementDashboard } from "@/components/email/email-management-dashboard"
import { RealTimeEmailDashboard } from "@/components/email/real-time-email-dashboard"

export default function EmailManagementPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <RealTimeEmailDashboard />
      <EmailManagementDashboard />
    </div>
  )
}
