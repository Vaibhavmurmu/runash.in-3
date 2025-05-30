import LiveShoppingIntegration from "@/components/chat/live-shopping-integration"

export default function ChatPage() {
  return (
    <div className="flex h-screen">
      {/* Chat Sidebar */}
      <div className="w-80 bg-gray-100 p-4">
        <h2>Chat Sidebar</h2>
        {/* Existing chat sidebar content */}
        <p>Sidebar content goes here.</p>

        {/* Add this after the existing chat sidebar content */}
        <div className="mt-6">
          <LiveShoppingIntegration />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 p-4">
        <h2>Chat Area</h2>
        <p>Main chat content goes here.</p>
      </div>
    </div>
  )
}
