import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for device data (replace with database in production)
const deviceDataStore: Record<string, any> = {}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const { deviceId, temperature, humidity, pressure, batteryLevel, peltierActive, timestamp } = data

    if (!deviceId) {
      return NextResponse.json({ error: "deviceId is required" }, { status: 400 })
    }

    // Store device data
    if (!deviceDataStore[deviceId]) {
      deviceDataStore[deviceId] = {
        deviceId,
        readings: [],
        lastUpdate: null,
      }
    }

    const deviceEntry = deviceDataStore[deviceId]

    // Add new reading
    deviceEntry.readings.push({
      temperature,
      humidity,
      pressure,
      batteryLevel,
      peltierActive,
      timestamp: new Date(timestamp).toISOString(),
    })

    // Keep only last 100 readings
    if (deviceEntry.readings.length > 100) {
      deviceEntry.readings = deviceEntry.readings.slice(-100)
    }

    deviceEntry.lastUpdate = new Date().toISOString()

    console.log(`[v0] Device data received from ${deviceId}:`, {
      temperature,
      humidity,
      batteryLevel,
    })

    return NextResponse.json({
      success: true,
      message: "Device data received",
      deviceId,
    })
  } catch (error) {
    console.error("[v0] Error processing device data:", error)
    return NextResponse.json({ error: "Failed to process device data" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const deviceId = searchParams.get("deviceId")

    if (!deviceId) {
      return NextResponse.json({ error: "deviceId is required" }, { status: 400 })
    }

    const deviceEntry = deviceDataStore[deviceId]

    if (!deviceEntry) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    // Return latest reading
    const latestReading = deviceEntry.readings[deviceEntry.readings.length - 1]

    return NextResponse.json({
      deviceId,
      ...latestReading,
      lastUpdate: deviceEntry.lastUpdate,
      readingsCount: deviceEntry.readings.length,
    })
  } catch (error) {
    console.error("[v0] Error retrieving device data:", error)
    return NextResponse.json({ error: "Failed to retrieve device data" }, { status: 500 })
  }
}
