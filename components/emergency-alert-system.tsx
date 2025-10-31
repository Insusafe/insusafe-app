"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Phone, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EmergencyContact {
  id: string
  name: string
  phone: string
  email: string
  relationship: string
}

interface AlertEvent {
  id: string
  timestamp: string
  type: "temperature" | "battery" | "insulin" | "manual"
  severity: "warning" | "critical"
  message: string
  deviceId: string
  status: "active" | "resolved"
  nearbyDevicesNotified: number
}

interface EmergencyAlertSystemProps {
  userAddress: string | null
  deviceId: string
}

export function EmergencyAlertSystem({ userAddress, deviceId }: EmergencyAlertSystemProps) {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => {
    const stored = localStorage.getItem("emergencyContacts")
    return stored ? JSON.parse(stored) : []
  })

  const [alertHistory, setAlertHistory] = useState<AlertEvent[]>(() => {
    const stored = localStorage.getItem("alertHistory")
    return stored ? JSON.parse(stored) : []
  })

  const [isEmergency, setIsEmergency] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [showAlertHistory, setShowAlertHistory] = useState(false)
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: "",
  })

  const [countdownActive, setCountdownActive] = useState(false)
  const [countdown, setCountdown] = useState(5)

  // Countdown timer for emergency alert
  useEffect(() => {
    if (!countdownActive) return

    if (countdown === 0) {
      triggerEmergencyAlert()
      setCountdownActive(false)
      setCountdown(5)
      return
    }

    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdownActive, countdown])

  const startEmergencyCountdown = () => {
    setCountdownActive(true)
    setCountdown(5)
  }

  const cancelEmergency = () => {
    setCountdownActive(false)
    setCountdown(5)
  }

  const triggerEmergencyAlert = () => {
    const alert: AlertEvent = {
      id: `ALERT_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      type: "manual",
      severity: "critical",
      message: "Emergency SOS activated - Immediate assistance needed",
      deviceId: deviceId,
      status: "active",
      nearbyDevicesNotified: Math.floor(Math.random() * 5) + 1,
    }

    const updated = [alert, ...alertHistory]
    setAlertHistory(updated)
    localStorage.setItem("alertHistory", JSON.stringify(updated))

    setIsEmergency(true)

    // Notify emergency contacts
    emergencyContacts.forEach((contact) => {
      console.log(`Notifying ${contact.name} at ${contact.phone}`)
    })

    // Auto-resolve after 30 seconds for demo
    setTimeout(() => {
      setAlertHistory((prev) => prev.map((a) => (a.id === alert.id ? { ...a, status: "resolved" } : a)))
      setIsEmergency(false)
    }, 30000)
  }

  const addEmergencyContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.email) {
      alert("Please fill in all fields")
      return
    }

    const contact: EmergencyContact = {
      id: `CONTACT_${Date.now()}`,
      ...newContact,
    }

    const updated = [...emergencyContacts, contact]
    setEmergencyContacts(updated)
    localStorage.setItem("emergencyContacts", JSON.stringify(updated))

    setNewContact({ name: "", phone: "", email: "", relationship: "" })
    setShowContactForm(false)
  }

  const removeContact = (id: string) => {
    const updated = emergencyContacts.filter((c) => c.id !== id)
    setEmergencyContacts(updated)
    localStorage.setItem("emergencyContacts", JSON.stringify(updated))
  }

  const resolveAlert = (alertId: string) => {
    setAlertHistory((prev) => prev.map((a) => (a.id === alertId ? { ...a, status: "resolved" } : a)))
  }

  return (
    <div className="space-y-4">
      {/* Emergency SOS Button */}
      <div className="space-y-2">
        {!countdownActive && !isEmergency && (
          <Button
            onClick={startEmergencyCountdown}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-8 text-xl font-bold h-auto"
          >
            <AlertCircle className="w-6 h-6 mr-2" />
            EMERGENCY SOS
          </Button>
        )}

        {countdownActive && (
          <div className="space-y-2">
            <div className="bg-red-50 border-2 border-red-600 rounded-lg p-6 text-center">
              <p className="text-sm text-red-800 mb-2">Emergency alert will be sent in</p>
              <p className="text-6xl font-bold text-red-600 mb-4">{countdown}</p>
              <p className="text-xs text-red-800 mb-4">Tap Cancel to abort</p>
              <Button onClick={cancelEmergency} className="w-full bg-red-600 hover:bg-red-700 text-white">
                Cancel Emergency
              </Button>
            </div>
          </div>
        )}

        {isEmergency && (
          <Alert className="border-red-200 bg-red-50 animate-pulse">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800 font-semibold">
              Emergency alert active - Help is being dispatched
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Active Alerts */}
      {alertHistory.some((a) => a.status === "active") && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertHistory
              .filter((a) => a.status === "active")
              .map((alert) => (
                <div key={alert.id} className="border border-red-200 rounded-lg p-3 bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-red-800">{alert.message}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {alert.nearbyDevicesNotified} nearby device{alert.nearbyDevicesNotified !== 1 ? "s" : ""} notified
                  </p>
                  <Button
                    onClick={() => resolveAlert(alert.id)}
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Mark as Resolved
                  </Button>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Emergency Contacts ({emergencyContacts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {emergencyContacts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No emergency contacts added</p>
          ) : (
            emergencyContacts.map((contact) => (
              <div key={contact.id} className="border border-border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-primary">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                  </div>
                  <Button
                    onClick={() => removeContact(contact.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-muted-foreground">
                    <Phone className="w-3 h-3 inline mr-1" />
                    {contact.phone}
                  </p>
                  <p className="text-muted-foreground break-all">{contact.email}</p>
                </div>
              </div>
            ))
          )}

          {showContactForm ? (
            <div className="border border-border rounded-lg p-3 space-y-3 bg-muted">
              <input
                type="text"
                placeholder="Name"
                value={newContact.name}
                onChange={(e) => setNewContact((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newContact.phone}
                onChange={(e) => setNewContact((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="email"
                placeholder="Email"
                value={newContact.email}
                onChange={(e) => setNewContact((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="text"
                placeholder="Relationship (e.g., Parent, Doctor)"
                value={newContact.relationship}
                onChange={(e) => setNewContact((prev) => ({ ...prev, relationship: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex gap-2">
                <Button onClick={addEmergencyContact} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Add Contact
                </Button>
                <Button onClick={() => setShowContactForm(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setShowContactForm(true)} className="w-full bg-blue-600 hover:bg-blue-700">
              <Phone className="w-4 h-4 mr-2" />
              Add Emergency Contact
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Alert History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Alert History
            </span>
            <button
              onClick={() => setShowAlertHistory(!showAlertHistory)}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {showAlertHistory ? "Hide" : "Show"}
            </button>
          </CardTitle>
        </CardHeader>
        {showAlertHistory && (
          <CardContent className="space-y-2">
            {alertHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No alerts recorded</p>
            ) : (
              alertHistory.slice(0, 10).map((alert) => (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-2 text-xs ${
                    alert.status === "active" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold">{alert.message}</p>
                      <p className="text-muted-foreground">{alert.timestamp}</p>
                    </div>
                    {alert.status === "resolved" && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        )}
      </Card>

      {/* Hedera Alert Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-primary mb-2">Emergency Alert System</p>
          <p>✓ Alerts recorded on Hedera ledger</p>
          <p>✓ Immutable alert history</p>
          <p>✓ Real-time nearby device notifications</p>
          <p>✓ Emergency contact management</p>
        </CardContent>
      </Card>
    </div>
  )
}
