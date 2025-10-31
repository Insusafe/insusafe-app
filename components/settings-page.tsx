"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Bell, Lock, HelpCircle, LogOut } from "lucide-react"
import { UserProfile } from "./user-profile"
import { DeviceRegistration } from "./device-registration"

interface SettingsPageProps {
  userAddress: string | null
  onLogout: () => void
}

export function SettingsPage({ userAddress, onLogout }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "devices" | "preferences">("profile")
  const [notifications, setNotifications] = useState({
    temperatureAlerts: localStorage.getItem("notif_temp") !== "false",
    lowBatteryAlerts: localStorage.getItem("notif_battery") !== "false",
    insulinLevelAlerts: localStorage.getItem("notif_insulin") !== "false",
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
    localStorage.setItem(`notif_${key.split(/(?=[A-Z])/)[0].toLowerCase()}`, String(value))
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Settings
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "profile"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("devices")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "devices"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Devices
        </button>
        <button
          onClick={() => setActiveTab("preferences")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "preferences"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Preferences
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && <UserProfile userAddress={userAddress} onLogout={onLogout} />}

      {activeTab === "devices" && <DeviceRegistration onDeviceRegistered={() => {}} userAddress={userAddress} />}

      {activeTab === "preferences" && (
        <div className="space-y-4">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary">Temperature Alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified of temperature deviations</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.temperatureAlerts}
                  onChange={(e) => handleNotificationChange("temperatureAlerts", e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary">Low Battery Alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified when battery is low</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.lowBatteryAlerts}
                  onChange={(e) => handleNotificationChange("lowBatteryAlerts", e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary">Insulin Level Alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified when insulin is running low</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.insulinLevelAlerts}
                  onChange={(e) => handleNotificationChange("insulinLevelAlerts", e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Connected Wallets
              </Button>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Help & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-sm bg-transparent">
                View Documentation
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm bg-transparent">
                Contact Support
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm bg-transparent">
                Report a Bug
              </Button>
            </CardContent>
          </Card>

          {/* Logout */}
          <Button onClick={onLogout} className="w-full bg-red-600 hover:bg-red-700">
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect Wallet
          </Button>
        </div>
      )}
    </div>
  )
}
