'use client'

import { useState } from 'react'
import PlatformLayout from '@/components/platform-layout'
import ChatAgentStudio from '@/components/chat-agent-studio'
import MediaControls from '@/components/media-controls'
import AICapabilities from '@/components/ai-capabilities'
import AdvancedSearch from '@/components/advanced-search'
import UserManagement from '@/components/user-management'
import SettingsPanel from '@/components/settings-panel'

export default function Home() {
  const [activeTab, setActiveTab] = useState('studio')
  const [isDark, setIsDark] = useState(true)

  return (
    <PlatformLayout isDark={isDark} onThemeToggle={() => setIsDark(!isDark)}>
      {activeTab === 'studio' && <ChatAgentStudio />}
      {activeTab === 'media' && <MediaControls />}
      {activeTab === 'capabilities' && <AICapabilities />}
      {activeTab === 'search' && <AdvancedSearch />}
      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'settings' && <SettingsPanel />}
    </PlatformLayout>
  )
}
