// Device data types and interfaces

export interface DeviceReading {
  id?: string
  deviceId: string
  temperature: number // Celsius
  humidity: number // Percentage
  pressure: number // hPa
  batteryLevel: number // Percentage (0-100)
  peltierActive: boolean
  timestamp: string // ISO 8601 format
  createdAt?: string
}

export interface Device {
  id?: string
  deviceId: string // Unique device identifier (e.g., "DEVICE_001")
  userId: string // Owner's user ID
  name: string // Device name (e.g., "My InsuSafe Bag")
  serialNumber: string
  hederaTopicId?: string // Hedera Consensus Service topic ID
  hederaAccountId?: string // Hedera account ID
  location?: {
    latitude: number
    longitude: number
    lastUpdated: string
  }
  status: "active" | "inactive" | "error"
  lastReading?: DeviceReading
  createdAt: string
  updatedAt: string
}

export interface DeviceStats {
  deviceId: string
  averageTemperature: number
  averageHumidity: number
  minTemperature: number
  maxTemperature: number
  readingsCount: number
  period: "hour" | "day" | "week"
}
