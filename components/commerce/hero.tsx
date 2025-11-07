"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center gap-8 animate-in fade-in duration-700">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2">
            <Zap size={16} className="text-accent" />
            <span className="text-sm font-medium">Introducing Agentic Live Commerce</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
            AI-Powered Shopping
            <br />
            <span className="gradient-text">Reimagined</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
            Experience intelligent product discovery, personalized recommendations, and seamless agentic checkout
            powered by advanced AI. Shop smarter, faster, and with complete security.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <Link href="/products">
              <Button size="lg" className="rounded-lg gap-2 group">
                Explore Products
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#ai-assistant">
              <Button variant="outline" size="lg" className="rounded-lg bg-transparent">
                Try AI Assistant
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              Secure Checkout 
            </div>
            <div className="hidden sm:block w-1 h-1 bg-border rounded-full" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              AI-Powered Agents
            </div>
            <div className="hidden sm:block w-1 h-1 bg-border rounded-full" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              Real-time Updates
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
