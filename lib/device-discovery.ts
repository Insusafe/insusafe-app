import type { DeviceLocationUpdate } from "./hedera-hcs"

export interface DiscoveredDevice extends DeviceLocationUpdate {
  distance: number
  name?: string
}

const EARTH_RADIUS_KM = 6371

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

export function filterNearbyDevices(
  devices: DeviceLocationUpdate[],
  userLat: number,
  userLon: number,
  radiusKm = 5,
): DiscoveredDevice[] {
  return devices
    .map((device) => ({
      ...device,
      distance: calculateDistance(userLat, userLon, device.latitude, device.longitude),
    }))
    .filter((device) => device.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
}

export function getDeviceStatusColor(insulinRemaining: number): string {
  if (insulinRemaining >= 75) return "bg-green-500"
  if (insulinRemaining >= 50) return "bg-yellow-500"
  if (insulinRemaining >= 25) return "bg-orange-500"
  return "bg-red-500"
}

export function getDeviceStatusLabel(insulinRemaining: number): string {
  if (insulinRemaining >= 75) return "Good"
  if (insulinRemaining >= 50) return "Fair"
  if (insulinRemaining >= 25) return "Low"
  return "Critical"
}
