"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, QrCode, Smartphone, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { registerDeviceOnHedera } from "@/lib/hedera-device-registry"
import { getHederaClient } from "@/lib/hedera-client"

interface RegisteredDevice {
  id: string
  name: string
  serialNumber: string
  registeredDate: string
  status: "active" | "inactive"
  hederaTopicId?: string
}

interface DeviceRegistrationProps {
  onDeviceRegistered: (device: RegisteredDevice) => void
  userAddress: string | null
}

export function DeviceRegistration({ onDeviceRegistered, userAddress }: DeviceRegistrationProps) {
  const [registeredDevices, setRegisteredDevices] = useState<RegisteredDevice[]>(() => {
    const stored = localStorage.getItem("registeredDevices")
    return stored ? JSON.parse(stored) : []
  })

  const [isRegistering, setIsRegistering] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    serialNumber: "",
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleRegisterDevice = async () => {
    if (!formData.name || !formData.serialNumber) {
      setErrorMessage("Please fill in all fields")
      return
    }

    if (!userAddress) {
      setErrorMessage("Please connect your wallet first")
      return
    }

    setIsRegistering(true)
    setErrorMessage("")

    try {
      const client = getHederaClient()

      const deviceData = {
        deviceId: `DEVICE_${Date.now()}`,
        accountId: userAddress,
        temperature: 4.2,
        humidity: 45,
        batteryLevel: 92,
        insulinRemaining: 86,
        latitude: 0,
        longitude: 0,
        timestamp: Date.now(),
      }

      console.log("[v0] Registering device on Hedera:", deviceData)
      const topicId = await registerDeviceOnHedera(client, deviceData)

      const newDevice: RegisteredDevice = {
        id: deviceData.deviceId,
        name: formData.name,
        serialNumber: formData.serialNumber,
        registeredDate: new Date().toLocaleDateString(),
        status: "active",
        hederaTopicId: topicId,
      }

      const updated = [...registeredDevices, newDevice]
      setRegisteredDevices(updated)
      localStorage.setItem("registeredDevices", JSON.stringify(updated))
      localStorage.setItem("hederaTopicId", topicId)

      onDeviceRegistered(newDevice)

      setSuccessMessage(`Device "${formData.name}" registered on Hedera successfully!`)
      setFormData({ name: "", serialNumber: "" })
      setShowForm(false)

      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to register device"
      console.error("[v0] Device registration error:", errorMsg)
      setErrorMessage(errorMsg)
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Success Message */}
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Registered Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Registered Devices ({registeredDevices.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {registeredDevices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No devices registered yet</p>
          ) : (
            registeredDevices.map((device) => (
              <div key={device.id} className="border border-border rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-primary">{device.name}</p>
                    <p className="text-xs text-muted-foreground">Serial: {device.serialNumber}</p>
                    <p className="text-xs text-muted-foreground">Registered: {device.registeredDate}</p>
                    {device.hederaTopicId && (
                      <p className="text-xs text-blue-600 font-mono mt-1">
                        Topic: {device.hederaTopicId.substring(0, 20)}...
                      </p>
                    )}
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      device.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {device.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Registration Form */}
      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Register New Device</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Device Name</label>
              <input
                type="text"
                placeholder="e.g., Primary Device"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1">Serial Number</label>
              <input
                type="text"
                placeholder="e.g., SN-2024-001"
                value={formData.serialNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, serialNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <QrCode className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-xs">
                You can also scan the QR code on your device to auto-fill these details
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                onClick={handleRegisterDevice}
                disabled={isRegistering}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isRegistering ? "Registering on Hedera..." : "Register Device"}
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} className="w-full bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Register New Device
        </Button>
      )}

      {/* Hedera Registration Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-primary mb-2">Device Registration on Hedera</p>
          <p>✓ Devices registered on Hedera Consensus Service</p>
          <p>✓ Unique topic ID per device</p>
          <p>✓ Immutable registration history</p>
          <p>✓ Real-time device updates via HCS</p>
        </CardContent>
      </Card>
    </div>
  )
}
