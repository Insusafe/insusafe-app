import { type Client, TopicCreateTransaction, TopicMessageSubmitTransaction, TopicId } from "@hashgraph/sdk"

interface DeviceRegistration {
  deviceId: string
  accountId: string
  temperature: number
  humidity: number
  batteryLevel: number
  insulinRemaining: number
  latitude: number
  longitude: number
  timestamp: number
}

export async function registerDeviceOnHedera(client: Client, deviceData: DeviceRegistration): Promise<string> {
  try {
    // Create a topic for device registration if it doesn't exist
    const topicCreateTx = new TopicCreateTransaction().setTopicMemo("InsuSafe Device Registry").freezeWith(client)

    const topicCreateReceipt = await topicCreateTx.execute(client).then((tx) => tx.getReceipt(client))
    const topicId = topicCreateReceipt.topicId

    if (!topicId) {
      throw new Error("Failed to create topic")
    }

    // Submit device registration message to topic
    const submitTx = new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(JSON.stringify(deviceData))
      .freezeWith(client)

    const submitReceipt = await submitTx.execute(client).then((tx) => tx.getReceipt(client))

    console.log("[v0] Device registered on Hedera:", topicId.toString())
    return topicId.toString()
  } catch (error) {
    console.error("[v0] Failed to register device on Hedera:", error)
    throw error
  }
}

export async function submitDeviceUpdate(
  client: Client,
  topicId: string,
  deviceData: DeviceRegistration,
): Promise<void> {
  try {
    const submitTx = new TopicMessageSubmitTransaction()
      .setTopicId(TopicId.fromString(topicId))
      .setMessage(JSON.stringify(deviceData))
      .freezeWith(client)

    await submitTx.execute(client).then((tx) => tx.getReceipt(client))
    console.log("[v0] Device update submitted to Hedera")
  } catch (error) {
    console.error("[v0] Failed to submit device update:", error)
    throw error
  }
}
