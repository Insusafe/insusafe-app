"use client"

import { useEffect, useState } from "react"

interface LoadingScreenProps {
  isVisible: boolean
}

export function LoadingScreen({ isVisible }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 30
      })
    }, 300)

    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-teal-500 flex flex-col items-center justify-center z-50">
      <div className="text-center space-y-6">
        {/* Logo */}
        <div className="space-y-2">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              IS
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">InsuSafe</h1>
          <p className="text-blue-100 text-sm">Smart Cooling for Life-Saving Insulin</p>
        </div>

        {/* Loading Bar */}
        <div className="w-48 h-1 bg-blue-400 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Status Text */}
        <p className="text-blue-100 text-sm">
          {progress < 30
            ? "Initializing..."
            : progress < 60
              ? "Connecting to Hedera..."
              : progress < 90
                ? "Loading your devices..."
                : "Ready!"}
        </p>
      </div>
    </div>
  )
}
