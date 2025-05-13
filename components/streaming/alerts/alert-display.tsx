"use client"

import { useState, useEffect, useRef } from "react"
import type { AlertTemplate, AlertEvent } from "@/types/alerts"

interface AlertDisplayProps {
  isStreaming: boolean
  alertsEnabled: boolean
  queueAlerts: boolean
  alertDelay: number
  testMode: boolean
}

export default function AlertDisplay({
  isStreaming,
  alertsEnabled,
  queueAlerts,
  alertDelay,
  testMode,
}: AlertDisplayProps) {
  const [activeAlerts, setActiveAlerts] = useState<(AlertEvent & { template: AlertTemplate })[]>([])
  const [alertQueue, setAlertQueue] = useState<(AlertEvent & { template: AlertTemplate })[]>([])
  const alertAudioRef = useRef<HTMLAudioElement | null>(null)

  // Mock function to simulate receiving an alert
  const receiveAlert = (alert: AlertEvent, template: AlertTemplate) => {
    const alertWithTemplate = { ...alert, template }

    if (!isStreaming && !testMode) return
    if (!alertsEnabled) return

    if (queueAlerts) {
      setAlertQueue((prev) => [...prev, alertWithTemplate])
    } else {
      setActiveAlerts((prev) => [...prev, alertWithTemplate])

      if (template.soundUrl) {
        if (alertAudioRef.current) {
          alertAudioRef.current.src = template.soundUrl
          alertAudioRef.current.play().catch((err) => console.error("Error playing alert sound:", err))
        }
      }
    }
  }

  // Process the queue
  useEffect(() => {
    if (queueAlerts && alertQueue.length > 0 && activeAlerts.length === 0) {
      const nextAlert = alertQueue[0]
      setActiveAlerts([nextAlert])
      setAlertQueue((prev) => prev.slice(1))

      if (nextAlert.template.soundUrl) {
        if (alertAudioRef.current) {
          alertAudioRef.current.src = nextAlert.template.soundUrl
          alertAudioRef.current.play().catch((err) => console.error("Error playing alert sound:", err))
        }
      }
    }
  }, [queueAlerts, alertQueue, activeAlerts])

  // Remove expired alerts
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    activeAlerts.forEach((alert, index) => {
      const timer = setTimeout(() => {
        setActiveAlerts((prev) => prev.filter((_, i) => i !== index))
      }, alert.template.duration * 1000)

      timers.push(timer)
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [activeAlerts])

  const getAnimationClass = (animation: string) => {
    switch (animation) {
      case "fade":
        return "animate-fade-in"
      case "slide-in":
        return "animate-slide-in"
      case "bounce":
        return "animate-bounce"
      case "pulse":
        return "animate-pulse"
      case "shake":
        return "animate-shake"
      case "flip":
        return "animate-flip"
      case "zoom":
        return "animate-zoom"
      default:
        return "animate-fade-in"
    }
  }

  const getPositionClass = (position: string) => {
    switch (position) {
      case "top-left":
        return "top-4 left-4"
      case "top-center":
        return "top-4 left-1/2 -translate-x-1/2"
      case "top-right":
        return "top-4 right-4"
      case "middle-left":
        return "top-1/2 -translate-y-1/2 left-4"
      case "middle-center":
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      case "middle-right":
        return "top-1/2 -translate-y-1/2 right-4"
      case "bottom-left":
        return "bottom-4 left-4"
      case "bottom-center":
        return "bottom-4 left-1/2 -translate-x-1/2"
      case "bottom-right":
        return "bottom-4 right-4"
      default:
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    }
  }

  const formatMessage = (message: string, alert: AlertEvent) => {
    return message
      .replace(/{{username}}/g, alert.username)
      .replace(/{{amount}}/g, alert.amount?.toString() || "")
      .replace(/{{message}}/g, alert.message || "")
      .replace(/{{months}}/g, alert.months?.toString() || "")
      .replace(/{{viewers}}/g, alert.viewers?.toString() || "")
      .replace(/{{tier}}/g, alert.tier || "")
  }

  return (
    <>
      <audio ref={alertAudioRef} className="hidden" />

      <div className="fixed inset-0 pointer-events-none z-50">
        {activeAlerts.map((alert, index) => (
          <div
            key={`${alert.id}-${index}`}
            className={`absolute ${getPositionClass(alert.template.position)} max-w-[80%] ${getAnimationClass(alert.template.animation)}`}
          >
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
              {alert.template.imageUrl && (
                <div
                  className="w-full h-32 bg-cover bg-center"
                  style={{ backgroundImage: `url(${alert.template.imageUrl})` }}
                />
              )}
              <div className="p-4">
                <p className="font-medium text-center">{formatMessage(alert.template.message, alert)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
