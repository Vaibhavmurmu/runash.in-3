import LiveStoreDashboard from "@/components/grocery/live-shopping/live-store-dashboard"

export const dynamic = "force-dynamic"

export default function Page() {
  return (
    <main className="min-h-dvh">
      <LiveStoreDashboard />
    </main>
  )
}
