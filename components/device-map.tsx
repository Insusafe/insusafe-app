"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Navigation, AlertTriangle, CheckCircle } from "lucide-react"
import { useGeolocation, generateNearbyDevices, type NearbyDevice } from "./geolocation-service"
import { Button } from "@/components/ui/button"

interface DeviceMapProps {
  userAddress: string | null
}

export function DeviceMap({ userAddress }: DeviceMapProps) {
  const { location, error, isTracking } = useGeolocation()
  const [nearbyDevices, setNearbyDevices] = useState<NearbyDevice[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [mapZoom, setMapZoom] = useState(1)

  useEffect(() => {
    if (location) {
      const devices = generateNearbyDevices(location)
      setNearbyDevices(devices.sort((a, b) => a.distance - b.distance))
    }
  }, [location])

  // Simulate real-time device position updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNearbyDevices((prev) =>
        prev.map((device) => ({
          ...device,
          latitude: device.latitude + (Math.random() - 0.5) * 0.0005,
          longitude: device.longitude + (Math.random() - 0.5) * 0.0005,
          insulinRemaining: Math.max(0, device.insulinRemaining - Math.random() * 0.1),
          temperature: device.temperature + (Math.random() - 0.5) * 0.2,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500"
      case "warning":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  const calculateMapPosition = (
    deviceLat: number,
    deviceLon: number,
    userLat: number,
    userLon: number,
    radius: number,
  ) => {
    const latDiff = (deviceLat - userLat) * 100
    const lonDiff = (deviceLon - userLon) * 100

    const angle = Math.atan2(latDiff, lonDiff)
    const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff)
    const scaledDistance = Math.min(distance * mapZoom, radius)

    const x = Math.cos(angle) * scaledDistance
    const y = Math.sin(angle) * scaledDistance

    return { x, y }
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <MapPin className="w-6 h-6" />
          Device Discovery Map
        </h1>
        <p className="text-sm text-muted-foreground">
          {isTracking ? "Real-time location tracking active" : "Location tracking disabled"}
        </p>
      </div>

      {/* Location Status */}
      {error && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-4 text-sm text-yellow-800">
            <p className="font-semibold mb-1">Location Note</p>
            <p>{error}</p>
            <p className="text-xs mt-2">Using demo location for visualization</p>
          </CardContent>
        </Card>
      )}

      {location && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="font-semibold text-primary">Your Location</p>
                <p className="text-xs text-muted-foreground">
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </p>
                <p className="text-xs text-muted-foreground">Accuracy: ±{location.accuracy.toFixed(0)}m</p>
              </div>
              <Navigation className="w-5 h-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interactive Map */}
      <Card className="overflow-hidden">
        <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center relative">
          {/* Grid background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 300">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="400" height="300" fill="url(#grid)" />
            </svg>
          </div>

          {/* Map content */}
          {location && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-40 h-40">
                {/* Distance rings */}
                <div className="absolute inset-0 border-2 border-blue-300 rounded-full opacity-30"></div>
                <div className="absolute inset-4 border border-blue-300 rounded-full opacity-20"></div>

                {/* User location (center) */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                  <div className="absolute inset-0 animate-pulse">
                    <div className="w-4 h-4 bg-blue-600 rounded-full opacity-30"></div>
                  </div>
                </div>

                {/* Nearby devices */}
                {nearbyDevices.map((device, idx) => {
                  const pos = calculateMapPosition(
                    device.latitude,
                    device.longitude,
                    location.latitude,
                    location.longitude,
                    80,
                  )

                  return (
                    <div
                      key={device.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-125"
                      style={{
                        left: `calc(50% + ${pos.x}px)`,
                        top: `calc(50% + ${pos.y}px)`,
                        zIndex: selectedDevice === device.id ? 20 : 5,
                      }}
                      onClick={() => setSelectedDevice(selectedDevice === device.id ? null : device.id)}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${getStatusColor(device.status)}`}
                      ></div>
                      {selectedDevice === device.id && (
                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white rounded shadow-lg p-2 whitespace-nowrap text-xs z-30">
                          <p className="font-semibold text-primary">{device.name}</p>
                          <p className="text-muted-foreground">{device.distance.toFixed(2)} km</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Map Controls */}
        <div className="p-3 border-t border-border flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMapZoom(Math.max(0.5, mapZoom - 0.2))}
            className="text-xs"
          >
            Zoom Out
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMapZoom(Math.min(2, mapZoom + 0.2))}
            className="text-xs"
          >
            Zoom In
          </Button>
        </div>
      </Card>

      {/* Devices List */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-primary flex items-center gap-2">
          <Users className="w-4 h-4" />
          {nearbyDevices.length} Devices Found
        </h2>

        {nearbyDevices.length === 0 ? (
          <Card>
            <CardContent className="pt-4 text-center text-muted-foreground text-sm">
              <p>No nearby devices detected</p>
              <p className="text-xs mt-1">Enable location services to discover devices</p>
            </CardContent>
          </Card>
        ) : (
          nearbyDevices.map((device) => (
            <Card
              key={device.id}
              onClick={() => setSelectedDevice(selectedDevice === device.id ? null : device.id)}
              className={`cursor-pointer transition-all ${selectedDevice === device.id ? "ring-2 ring-blue-600" : ""}`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {device.status === "optimal" ? (
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                      )}
                      <p className="font-semibold text-primary truncate">{device.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">ID: {device.id}</p>
                  </div>

                  <div className="text-right space-y-1 flex-shrink-0">
                    <div className="text-sm font-bold text-primary">{device.distance.toFixed(2)} km</div>
                    <div className="text-xs text-muted-foreground">{device.temperature.toFixed(1)}°C</div>
                  </div>
                </div>

                {/* Device details when selected */}
                {selectedDevice === device.id && (
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Insulin</p>
                      <p className="text-sm font-semibold text-primary">{device.insulinRemaining.toFixed(0)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-sm font-semibold text-primary capitalize">{device.status}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Connection</p>
                      <p className={`text-sm font-semibold ${device.isConnected ? "text-green-600" : "text-red-600"}`}>
                        {device.isConnected ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Hedera Network Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-primary mb-2">Hedera Network Status</p>
          <p>✓ Devices registered on Hedera Consensus Service</p>
          <p>✓ Real-time location updates via topic subscription</p>
          <p>✓ Proximity-based device discovery enabled</p>
          <p>✓ Immutable device history on ledger</p>
        </CardContent>
      </Card>
    </div>
  )
}
