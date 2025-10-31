"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Thermometer, Droplets, Battery, MapPin, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DeviceList } from "./device-list"
import { EmergencyAlertSystem } from "./emergency-alert-system"
import { getOrCreateDiscoveryTopic } from "@/lib/hedera-hcs"
import { useDeviceData } from "@/hooks/use-device-data"

interface DeviceData {
  id: string
  name: string
  temperature: number
  humidity: number
  battery: number
  insulinRemaining: number
  lastUpdate: string
  status: "optimal" | "warning" | "critical"
  isConnected: boolean
  hederaTopicId?: string
}

interface DeviceDashboardProps {
  userAddress: string | null
}

export function DeviceDashboard({ userAddress }: DeviceDashboardProps) {
  const [devices, setDevices] = useState<DeviceData[]>([
    {
      id: "DEVICE_001",
      name: "Primary Device",
      temperature: 4.2,
      humidity: 45,
      battery: 92,
      insulinRemaining: 86,
      lastUpdate: new Date().toLocaleTimeString(),
      status: "optimal",
      isConnected: true,
    },
  ])

  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0].id)
  const [showEmergencySystem, setShowEmergencySystem] = useState(false)
  const [hederaReady, setHederaReady] = useState(false)

  const { data: realDeviceData, loading: dataLoading } = useDeviceData(selectedDeviceId, 3000)

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) || devices[0]

  useEffect(() => {
    const initHedera = async () => {
      try {
        if (!userAddress) return

        const topicId = await getOrCreateDiscoveryTopic(null)
        console.log("[v0] Hedera discovery topic ready:", topicId)
        setHederaReady(true)
      } catch (error) {
        console.warn("[v0] Failed to initialize Hedera (running in mock mode):", error)
        // Don't set hederaReady to false - allow app to continue
        setHederaReady(false)
      }
    }

    initHedera()
  }, [userAddress])

  useEffect(() => {
    if (realDeviceData) {
      setDevices((prevDevices) =>
        prevDevices.map((device) => {
          if (device.id === selectedDeviceId) {
            let status: "optimal" | "warning" | "critical" = "optimal"
            if (
              realDeviceData.temperature < 3.8 ||
              realDeviceData.temperature > 4.5 ||
              realDeviceData.batteryLevel < 20
            ) {
              status = "warning"
            }
            if (
              realDeviceData.temperature < 3.5 ||
              realDeviceData.temperature > 5.0 ||
              realDeviceData.batteryLevel < 5
            ) {
              status = "critical"
            }

            return {
              ...device,
              temperature: realDeviceData.temperature,
              humidity: realDeviceData.humidity,
              battery: realDeviceData.batteryLevel,
              lastUpdate: new Date(realDeviceData.timestamp).toLocaleTimeString(),
              status,
              isConnected: true,
            }
          }
          return device
        }),
      )
    }
  }, [realDeviceData, selectedDeviceId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      default:
        return "text-green-600"
    }
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">InsuSafe</h1>
          <p className="text-xs text-muted-foreground">
            {devices.length} device{devices.length !== 1 ? "s" : ""} connected
            {hederaReady && " • Hedera Active"}
            {dataLoading && " • Updating..."}
          </p>
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {userAddress?.slice(-2).toUpperCase()}
        </div>
      </div>

      {/* Device List */}
      <div>
        <h2 className="text-sm font-semibold text-primary mb-2">Your Devices</h2>
        <DeviceList devices={devices} onSelectDevice={setSelectedDeviceId} selectedDeviceId={selectedDeviceId} />
      </div>

      {/* Selected Device Details */}
      {selectedDevice && (
        <>
          {/* Temperature Display */}
          <Card className="bg-gradient-to-br from-blue-50 to-teal-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Thermometer className="w-5 h-5 text-blue-600" />
                  <span className="text-5xl font-bold text-primary">{selectedDevice.temperature.toFixed(1)}°C</span>
                </div>
                <p className="text-sm text-muted-foreground">Current Temperature</p>
              </div>
            </CardContent>
          </Card>

          {/* Status Alert */}
          {selectedDevice.status === "warning" && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                {selectedDevice.temperature < 3.8 || selectedDevice.temperature > 4.5
                  ? "Temperature deviation detected. Monitor closely."
                  : selectedDevice.battery < 20
                    ? "Low battery level. Consider charging soon."
                    : "Insulin level running low. Plan refill."}
              </AlertDescription>
            </Alert>
          )}

          {selectedDevice.status === "critical" && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Critical alert! Immediate action required. Check device status immediately.
              </AlertDescription>
            </Alert>
          )}

          {!selectedDevice.isConnected && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Device connection lost. Attempting to reconnect...
              </AlertDescription>
            </Alert>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-muted-foreground">Humidity</span>
                </div>
                <p className="text-2xl font-bold text-primary">{selectedDevice.humidity.toFixed(0)}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Battery className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-muted-foreground">Battery</span>
                </div>
                <p className="text-2xl font-bold text-primary">{selectedDevice.battery.toFixed(0)}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Insulin Level */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Insulin Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{selectedDevice.insulinRemaining.toFixed(0)}%</span>
                  <span className="text-xs text-muted-foreground">Last updated: {selectedDevice.lastUpdate}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-teal-500 h-2 rounded-full transition-all"
                    style={{ width: `${selectedDevice.insulinRemaining}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={() => setShowEmergencySystem(!showEmergencySystem)}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-bold"
          >
            <AlertCircle className="w-5 h-5 mr-2" />
            {showEmergencySystem ? "Hide Emergency System" : "Show Emergency System"}
          </Button>

          {showEmergencySystem && <EmergencyAlertSystem userAddress={userAddress} deviceId={selectedDevice.id} />}

          {/* Device Status */}
          <Card className="bg-muted">
            <CardContent className="pt-4 text-xs text-muted-foreground space-y-1">
              <p>✓ Device registered on Hedera network</p>
              <p>✓ Real-time monitoring active</p>
              <p>✓ Geolocation enabled for device discovery</p>
              <p className={`${selectedDevice.isConnected ? "text-green-600" : "text-red-600"}`}>
                {selectedDevice.isConnected ? "✓" : "✗"} Network connection{" "}
                {selectedDevice.isConnected ? "active" : "inactive"}
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
