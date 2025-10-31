"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, Wifi, CheckCircle, AlertCircle } from "lucide-react"

interface DevicePairingProps {
  onDevicePaired: (deviceId: string, deviceName: string) => void
}

export function DevicePairing({ onDevicePaired }: DevicePairingProps) {
  const [step, setStep] = useState<"method" | "manual" | "wifi" | "success">("method")
  const [deviceId, setDeviceId] = useState("")
  const [deviceName, setDeviceName] = useState("")
  const [wifiSSID, setWifiSSID] = useState("")
  const [wifiPassword, setWifiPassword] = useState("")
  const [pairingStatus, setPairingStatus] = useState<"idle" | "connecting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleManualPairing = async () => {
    if (!deviceId || !deviceName) {
      setErrorMessage("Please enter device ID and name")
      return
    }

    setPairingStatus("connecting")
    setErrorMessage("")

    try {
      // Simulate device pairing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store device in localStorage
      const devices = JSON.parse(localStorage.getItem("pairedDevices") || "[]")
      devices.push({
        id: deviceId,
        name: deviceName,
        pairedAt: new Date().toISOString(),
      })
      localStorage.setItem("pairedDevices", JSON.stringify(devices))

      setPairingStatus("success")
      setTimeout(() => {
        onDevicePaired(deviceId, deviceName)
        setStep("success")
      }, 1000)
    } catch (error) {
      setPairingStatus("error")
      setErrorMessage("Failed to pair device. Please try again.")
    }
  }

  const handleWifiSetup = async () => {
    if (!wifiSSID || !wifiPassword || !deviceId) {
      setErrorMessage("Please fill in all fields")
      return
    }

    setPairingStatus("connecting")
    setErrorMessage("")

    try {
      // In production, this would send WiFi credentials to the device
      // For now, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setPairingStatus("success")
      setTimeout(() => {
        onDevicePaired(deviceId, deviceName || "InsuSafe Device")
        setStep("success")
      }, 1000)
    } catch (error) {
      setPairingStatus("error")
      setErrorMessage("Failed to configure WiFi. Please try again.")
    }
  }

  return (
    <div className="space-y-4">
      {/* Step 1: Choose Pairing Method */}
      {step === "method" && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Pair Your InsuSafe Device</h2>

          <Button
            onClick={() => setStep("manual")}
            variant="outline"
            className="w-full h-20 flex flex-col items-center justify-center gap-2"
          >
            <QrCode className="w-6 h-6" />
            <span>Scan QR Code</span>
          </Button>

          <Button
            onClick={() => setStep("manual")}
            variant="outline"
            className="w-full h-20 flex flex-col items-center justify-center gap-2"
          >
            <span>Manual Entry</span>
            <span className="text-xs text-muted-foreground">Enter Device ID</span>
          </Button>

          <Button
            onClick={() => setStep("wifi")}
            variant="outline"
            className="w-full h-20 flex flex-col items-center justify-center gap-2"
          >
            <Wifi className="w-6 h-6" />
            <span>WiFi Setup</span>
          </Button>
        </div>
      )}

      {/* Step 2: Manual Entry */}
      {step === "manual" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enter Device Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Device ID</label>
              <Input
                placeholder="e.g., DEVICE_001"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Found on the device label or in the setup guide</p>
            </div>

            <div>
              <label className="text-sm font-medium">Device Name</label>
              <Input
                placeholder="e.g., My InsuSafe Bag"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="mt-1"
              />
            </div>

            {errorMessage && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={() => setStep("method")} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={handleManualPairing} disabled={pairingStatus === "connecting"} className="flex-1">
                {pairingStatus === "connecting" ? "Pairing..." : "Pair Device"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: WiFi Setup */}
      {step === "wifi" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configure WiFi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Make sure your ESP32 device is powered on and in pairing mode
              </AlertDescription>
            </Alert>

            <div>
              <label className="text-sm font-medium">Device ID</label>
              <Input
                placeholder="e.g., DEVICE_001"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">WiFi Network (SSID)</label>
              <Input
                placeholder="Your WiFi network name"
                value={wifiSSID}
                onChange={(e) => setWifiSSID(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">WiFi Password</label>
              <Input
                type="password"
                placeholder="Your WiFi password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                className="mt-1"
              />
            </div>

            {errorMessage && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={() => setStep("method")} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={handleWifiSetup} disabled={pairingStatus === "connecting"} className="flex-1">
                {pairingStatus === "connecting" ? "Configuring..." : "Configure"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Success */}
      {step === "success" && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <div>
              <h3 className="font-semibold text-green-900">Device Paired Successfully!</h3>
              <p className="text-sm text-green-800 mt-1">{deviceName} is now connected and ready to use</p>
            </div>
            <Button
              onClick={() => {
                setStep("method")
                setDeviceId("")
                setDeviceName("")
                setWifiSSID("")
                setWifiPassword("")
                setPairingStatus("idle")
              }}
              className="w-full"
            >
              Pair Another Device
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
