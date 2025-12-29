"use client"

import { useState } from "react"
import MobileLayout from "@/components/mobile/layout"
import RemoteCamera from "@/components/mobile/remote-camera"

export default function MobileCameraPage() {
  const [isActive, setIsActive] = useState(false)

  const toggleCamera = () => {
    setIsActive(!isActive)
  }

  return (
    <MobileLayout>
      <div className="p-4 h-full">
        <h2 className="text-lg font-bold mb-4">Remote Camera</h2>
        <RemoteCamera isActive={isActive} onToggle={toggleCamera} />
      </div>
    </MobileLayout>
  )
}
