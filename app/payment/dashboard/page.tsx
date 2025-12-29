import { PaymentDashboard } from "@/components/payment/payment-dashboard"
import { UsageBanner } from "@/components/billing/usage-banner"

export default function PaymentDashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <UsageBanner className="mb-6" plan="free" />
      <PaymentDashboard />
    </div>
  )
}
