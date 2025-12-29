"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function Banner() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    try {
      const v = localStorage.getItem("bannerHidden")
      setHidden(v === "1")
    } catch (e) {}
  }, [])

  function dismiss() {
    try {
      localStorage.setItem("bannerHidden", "1")
    } catch (e) {}
    setHidden(true)
  }

  if (hidden) return null

  return (
    <div className="w-full bg-orange-50 dark:bg-orange-900/20 border-t border-orange-100 dark:border-orange-800/30 py-2 text-center">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="text-sm text-orange-700 dark:text-orange-300">
          🎉 We're pre-releasing our real-time AI video model — <Link href="/blog/new-model" className="underline font-semibold">learn more</Link>
        </div>
        <div>
          <button onClick={dismiss} className="text-sm text-gray-600 dark:text-gray-300">Dismiss</button>
        </div>
      </div>
    </div>
  )
}
