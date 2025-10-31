"use client"

import { Home, Map, Users, Settings } from "lucide-react"

interface NavigationProps {
  currentTab: string
  onTabChange: (tab: string) => void
}

export function Navigation({ currentTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "map", label: "Map", icon: Map },
    { id: "community", label: "Community", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex justify-around items-center h-16 max-w-sm mx-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = currentTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
              isActive ? "text-blue-600" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
