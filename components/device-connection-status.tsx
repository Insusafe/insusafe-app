"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Wifi, WifiOff } from "lucide-react"

interface DeviceConnectionStatusProps {
  deviceId: string
  deviceName: string
}

export function DeviceConnectionStatus({ deviceId, deviceName }: DeviceConnectionStatusProps) {
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")
  const [signalStrength, setSignalStrength] = useState(0)

  useEffect(() => {
    // Simulate connection status
    const timer = setTimeout(() => {
      setStatus("connected")
      setSignalStrength(Math.floor(Math.random() * 100) + 50)
    }, 2000)

    return () => clearTimeout(timer)
  }, [deviceId])

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {status === "connected" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : status === "connecting" ? (
              <AlertCircle className="w-5 h-5 text-yellow-600 animate-spin" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            <div>
              <p className="text-sm font-medium">{deviceName}</p>
              <p className="text-xs text-muted-foreground">
                {status === "connected" ? "Connected" : status === "connecting" ? "Connecting..." : "Disconnected"}
              </p>
            </div>
          </div>

          {status === "connected" && (
            <div className="flex items-center gap-1">
              <Wifi className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-600">{signalStrength}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
