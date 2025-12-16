"use client"

import { useEffect, useRef } from "react"

export default function AutoCarousel({ children }: { children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf: number | null = null
    let px = 0
    const speed = 0.4 // pixels per frame

    function step() {
      if (!el) return
      // smooth auto-scroll
      el.scrollLeft += speed
      // loop back
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
        el.scrollLeft = 0
      }
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="w-full overflow-x-auto whitespace-nowrap hide-scrollbar py-2"
      style={{ scrollBehavior: "smooth" }}
      aria-hidden
    >
      {children ?? (
        <>
          {["Real-time AI", "4K Quality", "Low Latency", "Multi-platform", "Upload & Stream", "Analytics", "Custom Overlays"].map((t) => (
            <div key={t} className="inline-block mr-4 px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 text-sm">
              {t}
            </div>
          ))}
          {/* duplicate items to create a longer loop so the scroll looks continuous */}
          {["Real-time AI", "4K Quality", "Low Latency", "Multi-platform", "Upload & Stream", "Analytics", "Custom Overlays"].map((t, i) => (
            <div key={"dup-" + i} className="inline-block mr-4 px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 text-sm">
              {t}
            </div>
          ))}
        </>
      )}
    </div>
  )
}
