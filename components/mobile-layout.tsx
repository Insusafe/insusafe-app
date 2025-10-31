"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { LoadingScreen } from "./loading-screen"

interface MobileLayoutProps {
  children: React.ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <LoadingScreen isVisible={isLoading} />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="w-full max-w-sm bg-background rounded-3xl shadow-2xl overflow-hidden border border-border transition-all duration-300 hover:shadow-3xl">
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 h-8 flex items-center px-4">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
          <div className="min-h-screen bg-background">{children}</div>
        </div>
      </div>
    </>
  )
}
