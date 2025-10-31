"use client"

const API_BASE_URL = "/api"

export interface DeviceDataResponse {
  deviceId: string
  temperature: number
  humidity: number
  pressure: number
  batteryLevel: number
  peltierActive: boolean
  timestamp: string
  lastUpdate?: string
  readingsCount?: number
}

// Mock data for development/fallback
function getMockDeviceData(deviceId: string): DeviceDataResponse {
  return {
    deviceId,
    temperature: 4.2 + Math.random() * 0.5,
    humidity: 45 + Math.random() * 5,
    pressure: 1013,
    batteryLevel: 92 + Math.random() * 5,
    peltierActive: true,
    timestamp: new Date().toISOString(),
    lastUpdate: new Date().toISOString(),
    readingsCount: 1,
  }
}

export async function fetchDeviceData(deviceId: string): Promise<DeviceDataResponse | null> {
  try {
    console.log("[v0] Fetching device data for:", deviceId)
    const url = `${API_BASE_URL}/device-data?deviceId=${deviceId}`
    console.log("[v0] Fetch URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] Fetch response status:", response.status)

    if (!response.ok) {
      console.warn("[v0] API returned status:", response.status, "- using mock data")
      return getMockDeviceData(deviceId)
    }

    const data = await response.json()
    console.log("[v0] Device data fetched successfully:", data)
    return data
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorType = error instanceof Error ? error.name : typeof error
    console.warn("[v0] Failed to fetch device data - Error Type:", errorType, "Message:", errorMessage)
    console.warn("[v0] Using mock data as fallback")
    // Return mock data as fallback
    return getMockDeviceData(deviceId)
  }
}

export async function fetchDeviceHistory(deviceId: string, limit = 10): Promise<DeviceDataResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/device-data/${deviceId}?limit=${limit}`)

    if (!response.ok) {
      console.warn("[v0] Failed to fetch device history:", response.statusText)
      return []
    }

    const data = await response.json()
    return data.readings || []
  } catch (error) {
    console.warn("[v0] Error fetching device history:", error)
    return []
  }
}

export async function sendDeviceData(deviceData: any): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/device-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deviceData),
    })

    if (!response.ok) {
      console.warn("[v0] Failed to send device data:", response.statusText)
      return false
    }

    console.log("[v0] Device data sent successfully")
    return true
  } catch (error) {
    console.warn("[v0] Error sending device data:", error)
    return false
  }
}
