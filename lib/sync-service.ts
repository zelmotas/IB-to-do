// First, let's update the SyncService to handle notification suppression

import { createClient } from "@/lib/supabase"
import { SessionStorage } from "@/lib/session-storage"

// Define a constant for the minimum time between sync notifications (10 minutes in ms)
const MIN_NOTIFICATION_INTERVAL = 10 * 60 * 1000

export const SyncService = {
  // Check if there are updates available on the server
  checkForUpdates: async ({ userId }: { userId: string }): Promise<boolean> => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("user_data").select("updated_at").eq("user_id", userId).single()

      if (error) {
        console.error("Error checking for updates:", error)
        return false
      }

      if (!data) return false

      const lastSyncTime = localStorage.getItem(`lastSync_${userId}`)
      if (!lastSyncTime) return true

      const serverUpdateTime = new Date(data.updated_at).getTime()
      const lastSyncTimeMs = Number.parseInt(lastSyncTime, 10)

      return serverUpdateTime > lastSyncTimeMs
    } catch (error) {
      console.error("Error in checkForUpdates:", error)
      return false
    }
  },

  // Pull changes from the server
  pullChanges: async ({
    userId,
    onSuccess,
  }: {
    userId: string
    onSuccess?: () => void
  }): Promise<any> => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("user_data").select("data").eq("user_id", userId).single()

      if (error) {
        console.error("Error pulling changes:", error)
        return null
      }

      if (data && data.data) {
        if (onSuccess && shouldShowSyncNotification()) {
          onSuccess()
        }
        return data.data
      }

      return null
    } catch (error) {
      console.error("Error in pullChanges:", error)
      return null
    }
  },

  // Push changes to the server
  pushChanges: async ({
    userId,
    data,
    onSuccess,
  }: {
    userId: string
    data: any
    onSuccess?: () => void
  }): Promise<void> => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("user_data").upsert(
        {
          user_id: userId,
          data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )

      if (error) {
        console.error("Error pushing changes:", error)
        return
      }

      if (onSuccess && shouldShowSyncNotification()) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error in pushChanges:", error)
    }
  },

  // Update the last sync time
  updateLastSync: (userId: string): void => {
    const now = Date.now()
    localStorage.setItem(`lastSync_${userId}`, now.toString())

    // Also store the last notification time
    SessionStorage.set("last_sync_notification", now)
  },
}

// Helper function to determine if we should show a sync notification
function shouldShowSyncNotification(): boolean {
  // Get the login timestamp
  const loginTimestamp = SessionStorage.get("login_timestamp")

  // If we logged in less than 30 seconds ago, don't show notification
  if (loginTimestamp && Date.now() - loginTimestamp < 30000) {
    return false
  }

  // Get the last time we showed a notification
  const lastNotification = SessionStorage.get("last_sync_notification")

  // If we showed a notification recently, don't show another one
  if (lastNotification && Date.now() - lastNotification < MIN_NOTIFICATION_INTERVAL) {
    return false
  }

  // Otherwise, it's okay to show a notification
  return true
}
