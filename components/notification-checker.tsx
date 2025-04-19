"use client"

import { useEffect, useRef } from "react"
import { NotificationService } from "@/lib/notification-service"

export function NotificationChecker() {
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Request notification permission on component mount
    NotificationService.requestPermission()

    // Check for notifications every minute
    checkIntervalRef.current = setInterval(() => {
      NotificationService.checkDueNotifications()
    }, 60000)

    // Initial check
    NotificationService.checkDueNotifications()

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
    }
  }, [])

  return null // This component doesn't render anything
}
