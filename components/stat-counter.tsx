"use client"

import { useEffect, useState, useRef } from "react"
import { useInView } from "react-intersection-observer"

interface StatCounterProps {
  value: number
  label: string
  prefix?: string
  suffix?: string
  duration?: number
}

export default function StatCounter({ value, label, prefix = "", suffix = "", duration = 2000 }: StatCounterProps) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  const countRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (inView) {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp
        const progress = timestamp - startTimeRef.current

        const percentage = Math.min(progress / duration, 1)
        const easeOutQuart = 1 - Math.pow(1 - percentage, 4)

        const currentCount = Math.floor(easeOutQuart * value)

        if (currentCount !== countRef.current) {
          countRef.current = currentCount
          setCount(currentCount)
        }

        if (percentage < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [inView, value, duration])

  const formattedCount = new Intl.NumberFormat().format(count)

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text">
        {prefix}
        {formattedCount}
        {suffix}
      </div>
      <p className="text-gray-700 dark:text-gray-300">{label}</p>
    </div>
  )
}
