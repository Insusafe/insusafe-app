import { type Client, TopicCreateTransaction, TopicMessageSubmitTransaction, TopicId } from "@hashgraph/sdk"

export interface DeviceLocationUpdate {
  deviceId: string
  accountId: string
  latitude: number
  longitude: number
  temperature: number
  humidity: number
  batteryLevel: number
  insulinRemaining: number
  timestamp: number
}

let discoveryTopicId: string | null = null

export async function getOrCreateDiscoveryTopic(client: Client | null): Promise<string> {
  if (discoveryTopicId) {
    return discoveryTopicId
  }

  try {
    // Check if topic exists in localStorage
    const stored = localStorage.getItem("hcsDiscoveryTopic")
    if (stored) {
      discoveryTopicId = stored
      console.log("[v0] Using existing HCS discovery topic:", discoveryTopicId)
      return discoveryTopicId
    }

    if (!client) {
      console.warn("[v0] Hedera client not available, using mock topic ID")
      discoveryTopicId = "0.0.mock-topic-" + Date.now()
      localStorage.setItem("hcsDiscoveryTopic", discoveryTopicId)
      return discoveryTopicId
    }

    // Create new discovery topic
    const topicCreateTx = new TopicCreateTransaction()
      .setTopicMemo("InsuSafe Device Discovery - Geolocation-based device finder")
      .freezeWith(client)

    const topicCreateReceipt = await topicCreateTx.execute(client).then((tx) => tx.getReceipt(client))
    const topicId = topicCreateReceipt.topicId

    if (!topicId) {
      throw new Error("Failed to create discovery topic")
    }

    discoveryTopicId = topicId.toString()
    localStorage.setItem("hcsDiscoveryTopic", discoveryTopicId)

    console.log("[v0] Created HCS discovery topic:", discoveryTopicId)
    return discoveryTopicId
  } catch (error) {
    console.warn("[v0] Failed to get/create discovery topic, using mock:", error)
    discoveryTopicId = "0.0.mock-topic-" + Date.now()
    localStorage.setItem("hcsDiscoveryTopic", discoveryTopicId)
    return discoveryTopicId
  }
}

export async function publishDeviceLocation(
  client: Client | null,
  topicId: string,
  locationData: DeviceLocationUpdate,
): Promise<void> {
  try {
    if (!client) {
      console.log("[v0] Hedera client not available, skipping HCS publish (mock mode)")
      return
    }

    const submitTx = new TopicMessageSubmitTransaction()
      .setTopicId(TopicId.fromString(topicId))
      .setMessage(JSON.stringify(locationData))
      .freezeWith(client)

    await submitTx.execute(client).then((tx) => tx.getReceipt(client))

    console.log("[v0] Device location published to HCS:", locationData.deviceId)
  } catch (error) {
    console.warn("[v0] Failed to publish device location:", error)
    // Don't throw - allow app to continue in mock mode
  }
}

export function getDiscoveryTopicId(): string | null {
  if (discoveryTopicId) {
    return discoveryTopicId
  }

  const stored = localStorage.getItem("hcsDiscoveryTopic")
  if (stored) {
    discoveryTopicId = stored
  }

  return discoveryTopicId
}

export function setDiscoveryTopicId(topicId: string): void {
  discoveryTopicId = topicId
  localStorage.setItem("hcsDiscoveryTopic", topicId)
}
