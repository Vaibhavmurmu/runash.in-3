"use client"

import { useState, useEffect, useCallback } from "react"
import type { StreamConfig, StreamStatus, StreamDevice } from "@/lib/streaming-types"

export function useStreaming() {
  const [currentStream, setCurrentStream] = useState<StreamStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createStream = useCallback(async (config: StreamConfig): Promise<StreamStatus | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/streaming/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create stream")
      }

      const stream = await response.json()
      setCurrentStream(stream)
      return stream
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create stream"
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const startStream = useCallback(async (streamId: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/streaming/${streamId}/start`, {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to start stream")
      }

      const status = await response.json()
      setCurrentStream(status)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to start stream"
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const endStream = useCallback(async (streamId: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/streaming/${streamId}/end`, {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to end stream")
      }

      const status = await response.json()
      setCurrentStream(status)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to end stream"
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getStreamStatus = useCallback(async (streamId: string): Promise<StreamStatus | null> => {
    try {
      const response = await fetch(`/api/streaming/${streamId}/status`)

      if (!response.ok) {
        return null
      }

      const status = await response.json()
      setCurrentStream(status)
      return status
    } catch (err) {
      console.error("Error getting stream status:", err)
      return null
    }
  }, [])

  return {
    currentStream,
    isLoading,
    error,
    createStream,
    startStream,
    endStream,
    getStreamStatus,
    setError,
  }
}

export function useMediaDevices() {
  const [devices, setDevices] = useState<StreamDevice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getDevices = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Request permissions first
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

      const deviceList = await navigator.mediaDevices.enumerateDevices()
      const streamDevices: StreamDevice[] = deviceList.map((device) => ({
        deviceId: device.deviceId,
        label: device.label || `${device.kind} ${device.deviceId.slice(0, 8)}`,
        kind: device.kind as "videoinput" | "audioinput" | "audiooutput",
        groupId: device.groupId,
      }))

      setDevices(streamDevices)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get media devices"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    getDevices()
  }, [getDevices])

  return {
    devices,
    isLoading,
    error,
    refreshDevices: getDevices,
  }
}
