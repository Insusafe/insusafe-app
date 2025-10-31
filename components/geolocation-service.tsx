"use client"

import { useState, useEffect } from "react"

export interface UserLocation {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

export interface NearbyDevice {
  id: string
  name: string
  latitude: number
  longitude: number
  insulinRemaining: number
  distance: number
  temperature: number
  status: "optimal" | "warning" | "critical"
  isConnected: boolean
}

interface GeolocationServiceProps {
  onLocationUpdate: (location: UserLocation) => void
  onDevicesUpdate: (devices: NearbyDevice[]) => void
}

export function useGeolocation() {
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setLocation({
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 50,
        timestamp: Date.now(),
      })
      return
    }

    setIsTracking(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        })
        setError(null)
      },
      (err) => {
        console.log("[v0] Geolocation getCurrentPosition error:", err.code, err.message)
        setLocation({
          latitude: 40.7128,
          longitude: -74.006,
          accuracy: 50,
          timestamp: Date.now(),
        })
        setError("Using demo location - enable location permissions for real-time tracking")
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 30000,
      },
    )

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        })
        setError(null)
      },
      (err) => {
        console.log("[v0] Geolocation watchPosition error:", err.code, err.message)
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 30000,
      },
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
      setIsTracking(false)
    }
  }, [])

  return { location, error, isTracking }
}

export function generateNearbyDevices(userLocation: UserLocation): NearbyDevice[] {
  const baseDevices = [
    {
      id: "device_1",
      name: "Patient A",
      latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
      longitude: -74.006 + (Math.random() - 0.5) * 0.01,
      insulinRemaining: 86,
      temperature: 4.1,
      status: "optimal" as const,
      isConnected: true,
    },
    {
      id: "device_2",
      name: "Patient B",
      latitude: 40.7128 + (Math.random() - 0.5) * 0.02,
      longitude: -74.006 + (Math.random() - 0.5) * 0.02,
      insulinRemaining: 65,
      temperature: 4.3,
      status: "warning" as const,
      isConnected: true,
    },
    {
      id: "device_3",
      name: "Patient C",
      latitude: 40.7128 + (Math.random() - 0.5) * 0.015,
      longitude: -74.006 + (Math.random() - 0.5) * 0.015,
      insulinRemaining: 92,
      temperature: 4.0,
      status: "optimal" as const,
      isConnected: true,
    },
    {
      id: "device_4",
      name: "Clinic Storage",
      latitude: 40.7128 + (Math.random() - 0.5) * 0.025,
      longitude: -74.006 + (Math.random() - 0.5) * 0.025,
      insulinRemaining: 45,
      temperature: 4.2,
      status: "warning" as const,
      isConnected: false,
    },
  ]

  return baseDevices.map((device) => {
    const latDiff = device.latitude - userLocation.latitude
    const lonDiff = device.longitude - userLocation.longitude
    const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111 // Rough conversion to km

    return {
      ...device,
      distance: Math.max(0.1, distance),
    }
  })
}
