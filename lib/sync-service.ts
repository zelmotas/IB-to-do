import { createClient } from "@/lib/supabase"
import { SessionStorage } from "@/lib/session-storage"
import type { Subject } from "@/types/todo"

interface SyncOptions {
  userId: string
  data?: Subject[]
  onSuccess?: () => void
  onError?: (error: Error) => void
}

// Define a constant for the minimum time between sync notifications (10 minutes in ms)
const MIN_NOTIFICATION_INTERVAL = 10 * 60 * 1000

export class SyncService {
  // Check if there are updates available on the server
  static async checkForUpdates({ userId }: { userId: string }): Promise<boolean> {
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
  }

  // Pull changes from the server
  static async pullChanges({ userId, onSuccess, onError }: Omit<SyncOptions, "data">): Promise<Subject[] | null> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("user_data").select("data").eq("user_id", userId).single()

      if (error) {
        if (error.code === "PGRST116") {
          // No data found, not an error
          return null
        }
        console.error("Error pulling changes:", error)
        if (onError) onError(new Error(error.message))
        return null
      }

      if (data && data.data) {
        if (onSuccess && shouldShowSyncNotification()) {
          onSuccess()
        }

        // Update last sync time
        this.updateLastSync(userId)

        return data.data
      }

      return null
    } catch (error) {
      console.error("Error in pullChanges:", error)
      if (onError) onError(error as Error)
      return null
    }
  }

  // Push changes to the server
  static async pushChanges({ userId, data, onSuccess, onError }: SyncOptions): Promise<void> {
    if (!data) {
      if (onError) onError(new Error("No data provided"))
      return
    }

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
        if (onError) onError(new Error(error.message))
        return
      }

      if (onSuccess && shouldShowSyncNotification()) {
        onSuccess()
      }

      // Update last sync time
      this.updateLastSync(userId)
    } catch (error) {
      console.error("Error in pushChanges:", error)
      if (onError) onError(error as Error)
    }
  }

  // Update the last sync time
  static updateLastSync(userId: string): void {
    const now = Date.now()
    localStorage.setItem(`lastSync_${userId}`, now.toString())

    // Also store the last notification time
    SessionStorage.set("last_sync_notification", now)
  }
}

// Helper function to determine if we should show a sync notification
function shouldShowSyncNotification(): boolean {
  // Check if notifications are disabled
  const disableNotifications = SessionStorage.get("disable_sync_notifications")
  if (disableNotifications) {
    return false
  }

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
