"use client"

import { useEffect, useRef } from "react"
import { NotificationService } from "@/lib/notification-service"
import { useAuth } from "@/contexts/auth-context"

export function NotificationChecker() {
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const initialCheckDoneRef = useRef<boolean>(false)
  const { user } = useAuth()

  useEffect(() => {
    // Only proceed if user is logged in
    if (!user) {
      return
    }

    // Request notification permission on component mount
    NotificationService.requestPermission()

    // Clean up old notification records
    NotificationService.cleanupOldNotifications()

    // Set up the interval for checking notifications
    if (!checkIntervalRef.current) {
      checkIntervalRef.current = setInterval(() => {
        NotificationService.checkDueNotifications()
      }, 60000) // Check every minute
    }

    // Initial check - only do this once per session
    if (!initialCheckDoneRef.current) {
      // Delay the initial check to avoid notification spam on login
      const initialCheckTimeout = setTimeout(() => {
        NotificationService.checkDueNotifications()
        initialCheckDoneRef.current = true
      }, 5000) // Wait 5 seconds after login before checking

      return () => {
        clearTimeout(initialCheckTimeout)
      }
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
        checkIntervalRef.current = null
      }
    }
  }, [user])

  return null // This component doesn't render anything
}
