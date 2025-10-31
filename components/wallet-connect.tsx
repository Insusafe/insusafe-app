"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Shield, Zap } from "lucide-react"
import { connectHederaWallet } from "@/lib/hedera-wallet"

interface WalletConnectProps {
  onConnect: (address: string) => void
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const wallet = await connectHederaWallet()
      console.log("[v0] Wallet connected successfully:", wallet.accountId)
      onConnect(wallet.accountId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect wallet"
      console.error("[v0] Connection failed:", errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-sm space-y-6 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-primary">InsuSafe</h1>
          <p className="text-muted-foreground text-lg">Smart Cooling for Life-Saving Insulin</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center space-y-2">
            <Shield className="w-6 h-6 text-blue-600 mx-auto" />
            <p className="text-xs font-semibold text-primary">Secure</p>
            <p className="text-xs text-muted-foreground">Hedera Network</p>
          </div>
          <div className="text-center space-y-2">
            <Zap className="w-6 h-6 text-teal-500 mx-auto" />
            <p className="text-xs font-semibold text-primary">Real-time</p>
            <p className="text-xs text-muted-foreground">Live Tracking</p>
          </div>
          <div className="text-center space-y-2">
            <Wallet className="w-6 h-6 text-blue-600 mx-auto" />
            <p className="text-xs font-semibold text-primary">Decentralized</p>
            <p className="text-xs text-muted-foreground">Web3 Ready</p>
          </div>
        </div>

        {/* Connection Card */}
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Connect Your Wallet</CardTitle>
            <CardDescription>Link your Hedera account to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-4 rounded-lg text-center border border-blue-200">
              <Wallet className="w-12 h-12 mx-auto text-blue-600 mb-2" />
              <p className="text-sm text-muted-foreground">
                Connect your Hedera wallet to register your device and discover nearby insulin storage units
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
            )}

            <Button
              onClick={handleConnect}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white py-6 text-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Hedera Wallet
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">Supports HashPack, Blade Wallet, and Kabila</p>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center text-xs text-muted-foreground space-y-1 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="font-semibold text-primary mb-2">Your data is secured</p>
          <p>✓ Encrypted on Hedera network</p>
          <p>✓ No personal information stored</p>
          <p>✓ Immutable transaction history</p>
        </div>
      </div>
    </div>
  )
}
