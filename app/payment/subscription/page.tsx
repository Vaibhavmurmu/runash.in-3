import { SubscriptionManager } from "@/components/billing/subscription-manager"
import { UsageBanner } from "@/components/billing/usage-banner"

export default function SubscriptionPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <UsageBanner className="mb-2" plan="free" />
      <SubscriptionManager />
    </div>
  )
}
