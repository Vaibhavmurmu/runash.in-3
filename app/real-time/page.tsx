'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/video/header'
import HeroSection from '@/components/video/hero-section'
import FeaturesSection from '@/components/video/features-section'
import AICapabilitiesSection from '@/components/video/ai-capabilities-section'
import ChatBotWidget from '@/components/video/chatbot-widget'
import Footer from '@/components/video/footer'
import ThemeToggle from '@/components/video/theme-toggle'

export default function RealTime() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check system preference
    const isDarkMode = document.documentElement.classList.contains('dark') || 
      window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      <Header />
      <HeroSection />
      <FeaturesSection />
      <AICapabilitiesSection />
      <ChatBotWidget />
      <Footer />
    </main>
  )
}
