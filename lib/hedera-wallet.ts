import { PrivateKey } from "@hashgraph/sdk"

export interface HederaWallet {
  accountId: string
  publicKey: string
  isConnected: boolean
}

export async function connectHederaWallet(): Promise<HederaWallet> {
  try {
    // Check if running in browser
    if (typeof window === "undefined") {
      throw new Error("Wallet connection only works in browser")
    }

    // For testnet, we'll use a demo account
    // In production, integrate with HashPack or Blade wallet
    const demoAccountId = "0.0.1234567"
    const demoPrivateKey = PrivateKey.generateED25519()

    const wallet: HederaWallet = {
      accountId: demoAccountId,
      publicKey: demoPrivateKey.publicKey.toString(),
      isConnected: true,
    }

    // Store in localStorage
    localStorage.setItem("hederaWallet", JSON.stringify(wallet))
    localStorage.setItem("hederaAccountId", demoAccountId)

    console.log("[v0] Hedera wallet connected:", demoAccountId)
    return wallet
  } catch (error) {
    console.error("[v0] Failed to connect Hedera wallet:", error)
    throw error
  }
}

export function getStoredWallet(): HederaWallet | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem("hederaWallet")
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function disconnectHederaWallet(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem("hederaWallet")
  localStorage.removeItem("hederaAccountId")
  console.log("[v0] Hedera wallet disconnected")
}

export function isWalletConnected(): boolean {
  const wallet = getStoredWallet()
  return wallet?.isConnected ?? false
}
