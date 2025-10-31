import { Client, PrivateKey, AccountId, Hbar } from "@hashgraph/sdk"

let hederaClient: Client | null = null

export function getHederaClient(): Client {
  if (!hederaClient) {
    // Initialize Hedera testnet client
    hederaClient = Client.forTestnet()

    hederaClient.setDefaultMaxTransactionFee(new Hbar(100))
    hederaClient.setDefaultMaxQueryPayment(new Hbar(100))
  }
  return hederaClient
}

export function setHederaOperator(accountId: string, privateKey: string) {
  const client = getHederaClient()
  try {
    client.setOperator(AccountId.fromString(accountId), PrivateKey.fromString(privateKey))
  } catch (error) {
    console.error("[v0] Failed to set Hedera operator:", error)
    throw error
  }
}

export function closeHederaClient() {
  if (hederaClient) {
    hederaClient.close()
    hederaClient = null
  }
}
