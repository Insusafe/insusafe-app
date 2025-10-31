"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, AlertCircle, Wifi, WifiOff } from "lucide-react"

interface Device {
  id: string
  name: string
  temperature: number
  humidity: number
  battery: number
  insulinRemaining: number
  status: "optimal" | "warning" | "critical"
  isConnected: boolean
  lastUpdate: string
}

interface DeviceListProps {
  devices: Device[]
  onSelectDevice: (deviceId: string) => void
  selectedDeviceId?: string
}

export function DeviceList({ devices, onSelectDevice, selectedDeviceId }: DeviceListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default:
        return <CheckCircle className="w-4 h-4 text-green-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-green-200 bg-green-50"
    }
  }

  return (
    <div className="space-y-2">
      {devices.map((device) => (
        <Card
          key={device.id}
          onClick={() => onSelectDevice(device.id)}
          className={`cursor-pointer transition-all ${
            selectedDeviceId === device.id ? "ring-2 ring-blue-600" : ""
          } ${getStatusColor(device.status)}`}
        >
          <CardContent className="pt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(device.status)}
                  <p className="font-semibold text-primary truncate">{device.name}</p>
                  {device.isConnected ? (
                    <Wifi className="w-3 h-3 text-green-600 flex-shrink-0" />
                  ) : (
                    <WifiOff className="w-3 h-3 text-red-600 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">ID: {device.id}</p>
              </div>

              <div className="text-right space-y-1 flex-shrink-0">
                <div className="text-sm font-bold text-primary">{device.temperature.toFixed(1)}°C</div>
                <div className="text-xs text-muted-foreground">{device.insulinRemaining.toFixed(0)}% insulin</div>
              </div>
            </div>

            {/* Quick metrics */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-current border-opacity-10">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="text-sm font-semibold text-primary">{device.humidity.toFixed(0)}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Battery</p>
                <p className="text-sm font-semibold text-primary">{device.battery.toFixed(0)}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Updated</p>
                <p className="text-xs font-semibold text-primary">{device.lastUpdate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
