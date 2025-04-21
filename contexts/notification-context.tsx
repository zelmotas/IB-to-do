"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface NotificationContextType {
  showTaskNotification: (action: "added" | "updated" | "deleted", taskName: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()

  // Use a state to track shown notifications to prevent duplicates
  const [shownNotifications, setShownNotifications] = useState<Set<string>>(new Set())

  const showTaskNotification = useCallback(
    (action: "added" | "updated" | "deleted", taskName: string) => {
      // Create a unique ID for this notification
      const notificationId = `${action}-${taskName}-${Date.now()}`

      // Check if we've already shown this notification
      if (shownNotifications.has(notificationId)) {
        return
      }

      // Add to shown notifications
      setShownNotifications((prev) => {
        const newSet = new Set(prev)
        newSet.add(notificationId)
        return newSet
      })

      // Show the toast
      let title = ""
      let description = ""

      switch (action) {
        case "added":
          title = "Task Added"
          description = `"${taskName}" has been added to your tasks.`
          break
        case "updated":
          title = "Task Updated"
          description = `"${taskName}" has been updated.`
          break
        case "deleted":
          title = "Task Deleted"
          description = `"${taskName}" has been deleted.`
          break
      }

      toast({
        title,
        description,
      })

      // Remove from shown notifications after a delay
      setTimeout(() => {
        setShownNotifications((prev) => {
          const newSet = new Set(prev)
          newSet.delete(notificationId)
          return newSet
        })
      }, 5000) // 5 seconds
    },
    [toast, shownNotifications],
  )

  return <NotificationContext.Provider value={{ showTaskNotification }}>{children}</NotificationContext.Provider>
}

export function useNotification() {
  const context = useContext(NotificationContext)

  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }

  return context
}
