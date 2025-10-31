import { type NextRequest, NextResponse } from "next/server"

// Import the device data store from the parent route
// In production, this would be a database query
const deviceDataStore: Record<string, any> = {}

export async function GET(request: NextRequest, { params }: { params: { deviceId: string } }) {
  try {
    const deviceId = params.deviceId

    if (!deviceId) {
      return NextResponse.json({ error: "deviceId is required" }, { status: 400 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const deviceEntry = deviceDataStore[deviceId]

    if (!deviceEntry) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    // Return last N readings
    const readings = deviceEntry.readings.slice(-limit)

    return NextResponse.json({
      deviceId,
      readings,
      total: deviceEntry.readings.length,
      lastUpdate: deviceEntry.lastUpdate,
    })
  } catch (error) {
    console.error("[v0] Error retrieving device history:", error)
    return NextResponse.json({ error: "Failed to retrieve device history" }, { status: 500 })
  }
}
