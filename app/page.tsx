"use client"

import { useState } from "react"
import { MobileLayout } from "@/components/mobile-layout"
import { DeviceDashboard } from "@/components/device-dashboard"
import { DeviceMap } from "@/components/device-map"
import { SettingsPage } from "@/components/settings-page"
import { WalletConnect } from "@/components/wallet-connect"
import { Navigation } from "@/components/navigation"

export default function Home() {
  const [currentTab, setCurrentTab] = useState("home")
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState<string | null>(null)

  const handleLogout = () => {
    setIsConnected(false)
    setUserAddress(null)
    localStorage.removeItem("hederaAddress")
    localStorage.removeItem("deviceId")
  }

  return (
    <MobileLayout>
      {!isConnected ? (
        <WalletConnect
          onConnect={(address) => {
            setUserAddress(address)
            setIsConnected(true)
          }}
        />
      ) : (
        <>
          {currentTab === "home" && <DeviceDashboard userAddress={userAddress} />}
          {currentTab === "map" && <DeviceMap userAddress={userAddress} />}
          {currentTab === "community" && (
            <div className="p-4 text-center text-muted-foreground">Community features coming soon</div>
          )}
          {currentTab === "settings" && <SettingsPage userAddress={userAddress} onLogout={handleLogout} />}
          <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
        </>
      )}
    </MobileLayout>
  )
}
