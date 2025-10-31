"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, MapPin } from "lucide-react"

interface UserProfileProps {
  userAddress: string | null
  onLogout: () => void
}

export function UserProfile({ userAddress, onLogout }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: localStorage.getItem("userName") || "John Doe",
    email: localStorage.getItem("userEmail") || "john@example.com",
    phone: localStorage.getItem("userPhone") || "+1 (555) 123-4567",
    location: localStorage.getItem("userLocation") || "New York, NY",
  })

  const handleSave = () => {
    localStorage.setItem("userName", profile.name)
    localStorage.setItem("userEmail", profile.email)
    localStorage.setItem("userPhone", profile.phone)
    localStorage.setItem("userLocation", profile.location)
    setIsEditing(false)
  }

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Wallet Address */}
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Hedera Wallet Address</p>
            <p className="text-sm font-mono text-primary break-all">{userAddress}</p>
          </div>

          {/* Profile Fields */}
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-semibold text-primary">{profile.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-semibold text-primary break-all">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-semibold text-primary">{profile.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-semibold text-primary">{profile.location}</p>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)} className="w-full bg-blue-600 hover:bg-blue-700">
                Edit Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
