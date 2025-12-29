'use client'

import { Sparkles, Play } from 'lucide-react'
import { useState } from 'react'
import ChatInput from './chat-input'

export default function HeroSection() {
  const [activeCarousel, setActiveCarousel] = useState(0)

  const carouselItems = [
    { title: 'Real-Time Generation', description: 'Generate videos on-the-fly with AI' },
    { title: 'Stream Processing', description: 'Handle continuous data streams seamlessly' },
    { title: 'Multi-Agent Collaboration', description: 'Agents work together for complex tasks' },
  ]

  return (
    <section className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Video Background */}
      <div className="absolute inset-0 bg-[url('/futuristic-ai-video-background.jpg')] bg-cover bg-center opacity-20" />
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      {/* Gradient Overlays */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent/20 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/20 rounded-full blur-3xl opacity-20" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-between px-4 sm:px-6 lg:px-8 py-20">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-accent/50 rounded-full bg-accent/10 backdrop-blur-sm">
            <Sparkles size={16} className="text-accent" />
            <span className="text-sm text-accent font-medium">AI-Powered Video Generation</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-balance">
            Real-Time
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Video Generation
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-foreground/70 mb-8 max-w-2xl text-balance">
            Harness the power of cutting-edge AI agents and streaming technology to generate, transform, and collaborate on videos in real-time. Experience the future of content creation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2 group">
              <Play size={18} className="group-hover:translate-x-1 transition" />
              Watch Demo
            </button>
            <button className="px-8 py-3 border border-primary text-primary hover:bg-primary/10 rounded-lg font-medium transition">
              Learn More
            </button>
          </div>

          {/* Carousel */}
          <div className="w-full max-w-2xl bg-card border border-border rounded-lg p-6 backdrop-blur-sm">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">
                {carouselItems[activeCarousel].title}
              </h3>
              <p className="text-center text-foreground/60">
                {carouselItems[activeCarousel].description}
              </p>
            </div>
            <div className="flex gap-2 mt-6 justify-center">
              {carouselItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCarousel(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeCarousel 
                      ? 'bg-accent w-8' 
                      : 'bg-border w-2 hover:bg-border/70'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Chat Input at Bottom */}
        <ChatInput />
      </div>
    </section>
  )
}
