"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"

interface AnalyticsData {
  sales: {
    daily: number[]
    weekly: number[]
    monthly: number[]
    total: number
    growth: number
  }
  streams: {
    viewCounts: Record<string, number>
    engagementRates: Record<string, number>
    peakViewers: Record<string, number>
    totalStreams: number
    totalViewers: number
    averageWatchTime: number
  }
  users: {
    newUsers: number[]
    activeUsers: number[]
    totalUsers: number
    retention: number
  }
  products: {
    topSelling: Array<{ id: string; name: string; sales: number }>
    categories: Record<string, number>
    inventory: Record<string, number>
    averageRating: number
  }
  recommendations: {
    clickThroughRate: number
    conversionRate: number
    topRecommendations: Array<{ id: string; name: string; clicks: number }>
    byType: Record<string, number>
  }
  polls: {
    totalPolls: number
    totalVotes: number
    participationRate: number
    averageOptionsPerPoll: number
    popularPolls: Array<{ id: string; question: string; votes: number }>
  }
}

interface AnalyticsContextType {
  analyticsData: AnalyticsData
  isLoading: boolean
  refreshData: () => Promise<void>
  trackEvent: (eventName: string, eventData: Record<string, any>) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

const defaultAnalyticsData: AnalyticsData = {
  sales: {
    daily: Array(30)
      .fill(0)
      .map(() => Math.floor(Math.random() * 5000) + 1000),
    weekly: Array(12)
      .fill(0)
      .map(() => Math.floor(Math.random() * 25000) + 10000),
    monthly: Array(12)
      .fill(0)
      .map(() => Math.floor(Math.random() * 100000) + 50000),
    total: 1250000,
    growth: 12.5,
  },
  streams: {
    viewCounts: {
      "tech-showcase-2025": 1250,
      "smart-home-essentials": 980,
      "gaming-peripherals": 1540,
      "mobile-innovations": 1120,
      "audio-experience": 890,
    },
    engagementRates: {
      "tech-showcase-2025": 0.68,
      "smart-home-essentials": 0.72,
      "gaming-peripherals": 0.85,
      "mobile-innovations": 0.64,
      "audio-experience": 0.71,
    },
    peakViewers: {
      "tech-showcase-2025": 1800,
      "smart-home-essentials": 1200,
      "gaming-peripherals": 2100,
      "mobile-innovations": 1500,
      "audio-experience": 1100,
    },
    totalStreams: 250,
    totalViewers: 125000,
    averageWatchTime: 24.5,
  },
  users: {
    newUsers: Array(30)
      .fill(0)
      .map(() => Math.floor(Math.random() * 100) + 20),
    activeUsers: Array(30)
      .fill(0)
      .map(() => Math.floor(Math.random() * 1000) + 500),
    totalUsers: 25000,
    retention: 0.72,
  },
  products: {
    topSelling: [
      { id: "p1", name: "AI Smart Home Hub", sales: 1250 },
      { id: "p2", name: "Ultra HD Webcam", sales: 980 },
      { id: "p3", name: "Wireless Gaming Headset", sales: 870 },
      { id: "p4", name: "Portable Power Station", sales: 760 },
      { id: "p5", name: "Mechanical Keyboard", sales: 650 },
    ],
    categories: {
      "Smart Home": 2500,
      Audio: 1800,
      Computing: 2200,
      Gaming: 1950,
      Mobile: 2100,
    },
    inventory: {
      "AI Smart Home Hub": 120,
      "Ultra HD Webcam": 85,
      "Wireless Gaming Headset": 150,
      "Portable Power Station": 95,
      "Mechanical Keyboard": 110,
    },
    averageRating: 4.2,
  },
  recommendations: {
    clickThroughRate: 0.18,
    conversionRate: 0.08,
    topRecommendations: [
      { id: "smart-home-hub", name: "AI Smart Home Hub", clicks: 320 },
      { id: "wireless-earbuds-pro", name: "Wireless Earbuds Pro", clicks: 285 },
      { id: "ultra-hd-webcam", name: "Ultra HD Webcam", clicks: 210 },
      { id: "portable-power-bank", name: "Portable Power Bank", clicks: 180 },
      { id: "smart-fitness-watch", name: "Smart Fitness Watch", clicks: 165 },
    ],
    byType: {
      viewing_history: 450,
      similar_products: 380,
      popular: 320,
      trending: 290,
      complementary: 260,
    },
  },
  polls: {
    totalPolls: 125,
    totalVotes: 18750,
    participationRate: 0.42,
    averageOptionsPerPoll: 3.8,
    popularPolls: [
      { id: "poll-1", question: "Which feature are you most excited about?", votes: 1250 },
      { id: "poll-2", question: "Would you purchase this product at $299?", votes: 980 },
      { id: "poll-3", question: "Which color option do you prefer?", votes: 870 },
      { id: "poll-4", question: "Rate the presentation so far", votes: 760 },
      { id: "poll-5", question: "What accessories would you like to see?", votes: 650 },
    ],
  },
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(defaultAnalyticsData)
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated, user } = useAuth()

  // Simulate loading analytics data
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      const loadData = async () => {
        setIsLoading(true)
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // In a real app, this would be an API call to fetch analytics data
        setAnalyticsData(defaultAnalyticsData)
        setIsLoading(false)
      }

      loadData()
    }
  }, [isAuthenticated, user])

  // Refresh analytics data
  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate slightly different data to simulate refresh
    const updatedData = {
      ...defaultAnalyticsData,
      sales: {
        ...defaultAnalyticsData.sales,
        daily: defaultAnalyticsData.sales.daily.map((val) => Math.max(0, val + Math.floor(Math.random() * 500) - 250)),
        total: defaultAnalyticsData.sales.total + Math.floor(Math.random() * 10000),
      },
      users: {
        ...defaultAnalyticsData.users,
        totalUsers: defaultAnalyticsData.users.totalUsers + Math.floor(Math.random() * 100),
      },
      recommendations: {
        ...defaultAnalyticsData.recommendations,
        clickThroughRate: defaultAnalyticsData.recommendations.clickThroughRate + (Math.random() * 0.02 - 0.01),
        conversionRate: defaultAnalyticsData.recommendations.conversionRate + (Math.random() * 0.01 - 0.005),
      },
      polls: {
        ...defaultAnalyticsData.polls,
        totalPolls: defaultAnalyticsData.polls.totalPolls + Math.floor(Math.random() * 5),
        totalVotes: defaultAnalyticsData.polls.totalVotes + Math.floor(Math.random() * 500),
        participationRate: Math.min(
          0.95,
          defaultAnalyticsData.polls.participationRate + (Math.random() * 0.05 - 0.025),
        ),
      },
    }

    setAnalyticsData(updatedData)
    setIsLoading(false)
  }

  // Track user events for analytics
  const trackEvent = (eventName: string, eventData: Record<string, any>) => {
    // In a real app, this would send the event to an analytics service
    console.log(`Analytics event: ${eventName}`, eventData)

    // For demo purposes, we'll just update some stats based on the event type
    if (eventName === "ai_recommendation_click") {
      // Update recommendation analytics
      setAnalyticsData((prev) => {
        // Update click-through rate slightly
        const newClickThroughRate = Math.min(0.95, prev.recommendations.clickThroughRate + 0.001)

        // Update top recommendations
        const updatedTopRecommendations = [...prev.recommendations.topRecommendations]
        const clickedProductIndex = updatedTopRecommendations.findIndex((p) => p.id === eventData.productId)

        if (clickedProductIndex >= 0) {
          // Increment existing product clicks
          updatedTopRecommendations[clickedProductIndex] = {
            ...updatedTopRecommendations[clickedProductIndex],
            clicks: updatedTopRecommendations[clickedProductIndex].clicks + 1,
          }
        }

        // Update recommendation type stats
        const updatedByType = { ...prev.recommendations.byType }
        if (eventData.recommendationType && updatedByType[eventData.recommendationType]) {
          updatedByType[eventData.recommendationType] += 1
        }

        return {
          ...prev,
          recommendations: {
            ...prev.recommendations,
            clickThroughRate: newClickThroughRate,
            topRecommendations: updatedTopRecommendations,
            byType: updatedByType,
          },
        }
      })
    } else if (eventName === "poll_vote" || eventName === "poll_created") {
      // Update poll analytics
      setAnalyticsData((prev) => {
        // Update total votes if it's a vote event
        const newTotalVotes = eventName === "poll_vote" ? prev.polls.totalVotes + 1 : prev.polls.totalVotes

        // Update total polls if it's a creation event
        const newTotalPolls = eventName === "poll_created" ? prev.polls.totalPolls + 1 : prev.polls.totalPolls

        // Update participation rate
        const newParticipationRate = Math.min(0.95, prev.polls.participationRate + Math.random() * 0.01)

        return {
          ...prev,
          polls: {
            ...prev.polls,
            totalPolls: newTotalPolls,
            totalVotes: newTotalVotes,
            participationRate: newParticipationRate,
          },
        }
      })
    }
  }

  return (
    <AnalyticsContext.Provider
      value={{
        analyticsData,
        isLoading,
        refreshData,
        trackEvent,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider")
  }
  return context
}
