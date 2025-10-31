"use client"

import { useState, useEffect } from "react"
import { fetchDeviceData, type DeviceDataResponse } from "@/lib/api-client"

export function useDeviceData(deviceId: string, pollInterval = 3000) {
  const [data, setData] = useState<DeviceDataResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await fetchDeviceData(deviceId)

        if (result) {
          setData(result)
          setError(null)
        } else {
          setError("Failed to fetch device data")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    // Fetch immediately
    fetchData()

    // Set up polling interval
    const interval = setInterval(fetchData, pollInterval)

    return () => clearInterval(interval)
  }, [deviceId, pollInterval])

  return { data, loading, error }
}
