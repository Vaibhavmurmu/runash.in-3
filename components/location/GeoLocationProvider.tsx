"use client"

import { useEffect, useState } from "react"

type Location = {
  ip?: string
  city?: string
  region?: string
  country?: string
  country_name?: string
  latitude?: number
  longitude?: number
  language?: string
}

export function useGeoLocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    // Try browser geolocation first (user permission)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!mounted) return
          const lat = pos.coords.latitude
          const lon = pos.coords.longitude
          // Provide minimal location; use reverse lookup as fallback
          setLocation({
            latitude: lat,
            longitude: lon,
            language: navigator.language,
          })
          setLoading(false)
        },
        async () => {
          // fallback to ip-based lookup
          try {
            const res = await fetch("https://ipapi.co/json/")
            if (!res.ok) throw new Error("ipapi failed")
            const data = await res.json()
            if (!mounted) return
            setLocation({
              ip: data.ip,
              city: data.city,
              region: data.region,
              country: data.country,
              country_name: data.country_name,
              latitude: data.latitude,
              longitude: data.longitude,
              language: navigator.language || data.languages?.split(",")?.[0],
            })
          } catch (e) {
            // silent fallback
            setLocation({
              language: navigator.language,
            })
          } finally {
            if (mounted) setLoading(false)
          }
        },
        { timeout: 5000 }
      )
    } else {
      // no geolocation support: ip lookup
      ;(async () => {
        try {
          const res = await fetch("https://ipapi.co/json/")
          const data = await res.json()
          setLocation({
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country,
            country_name: data.country_name,
            latitude: data.latitude,
            longitude: data.longitude,
            language: navigator.language || data.languages?.split(",")?.[0],
          })
        } catch (e) {
          setLocation({ language: navigator.language })
        } finally {
          setLoading(false)
        }
      })()
    }

    return () => {
      mounted = false
    }
  }, [])

  return { location, loading }
}
