import { createClient } from "@/lib/supabase"
import { SessionStorage } from "@/lib/session-storage"
import type { Subject, Task } from "@/types/todo"
import { DebugUtils } from "@/lib/debug-utils"

// Define a constant for the minimum time between sync notifications (10 minutes in ms)
const MIN_NOTIFICATION_INTERVAL = 10 * 60 * 1000

export class SyncService {
  // Check if there are updates available on the server
  static async checkForUpdates({ userId }: { userId: string }): Promise<boolean> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("user_data").select("updated_at").eq("user_id", userId).single()

      if (error) {
        DebugUtils.logError("Error checking for updates", error)
        return false
      }

      if (!data) return false

      const lastSyncTime = localStorage.getItem(`lastSync_${userId}`)
      if (!lastSyncTime) return true

      const serverUpdateTime = new Date(data.updated_at).getTime()
      const lastSyncTimeMs = Number.parseInt(lastSyncTime, 10)

      return serverUpdateTime > lastSyncTimeMs
    } catch (error) {
      DebugUtils.logError("Error in checkForUpdates", error)
      return false
    }
  }

  // Pull changes from the server
  static async pullChanges({
    userId,
    onSuccess,
    onError,
    localData,
  }: {
    userId: string
    onSuccess?: () => void
    onError?: (error: Error) => void
    localData?: Subject[]
  }): Promise<Subject[] | null> {
    try {
      DebugUtils.logSync("Pulling changes for user", userId)
      const supabase = createClient()
      const { data, error } = await supabase.from("user_data").select("data, updated_at").eq("user_id", userId).single()

      if (error) {
        if (error.code === "PGRST116") {
          // No data found, not an error
          DebugUtils.logSync("No data found for user", userId)
          return null
        }
        DebugUtils.logError("Error pulling changes", error)
        if (onError) onError(new Error(error.message))
        return null
      }

      if (data && data.data) {
        DebugUtils.logSync("Successfully pulled data", { count: data.data.length })

        // If we have local data, merge it with server data
        if (localData) {
          const mergedData = this.mergeData(localData, data.data, data.updated_at)

          // If we had to merge, push the merged data back to the server
          if (JSON.stringify(mergedData) !== JSON.stringify(data.data)) {
            DebugUtils.logSync("Merged data differs from server data, pushing merged data back", {
              localCount: localData.length,
              serverCount: data.data.length,
              mergedCount: mergedData.length,
            })

            // Push the merged data back to the server
            await this.pushChanges({
              userId,
              data: mergedData,
              skipNotification: true,
            })
          }

          if (onSuccess && shouldShowSyncNotification()) {
            onSuccess()
          }

          // Update last sync time
          this.updateLastSync(userId)

          return mergedData
        }

        if (onSuccess && shouldShowSyncNotification()) {
          onSuccess()
        }

        // Update last sync time
        this.updateLastSync(userId)

        return data.data
      }

      return null
    } catch (error) {
      DebugUtils.logError("Error in pullChanges", error)
      if (onError) onError(error instanceof Error ? error : new Error(String(error)))
      return null
    }
  }

  // Push changes to the server
  static async pushChanges({
    userId,
    data,
    onSuccess,
    onError,
    skipNotification = false,
  }: {
    userId: string
    data: Subject[]
    onSuccess?: () => void
    onError?: (error: Error) => void
    skipNotification?: boolean
  }): Promise<void> {
    if (!data) {
      if (onError) onError(new Error("No data provided"))
      return
    }

    try {
      DebugUtils.logSync("Pushing changes for user", userId)
      const supabase = createClient()

      // First, check if the record exists
      const { data: existingData, error: checkError } = await supabase
        .from("user_data")
        .select("id, data, updated_at")
        .eq("user_id", userId)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        DebugUtils.logError("Error checking existing data", checkError)
        if (onError) onError(new Error(checkError.message))
        return
      }

      // If record exists, check if we need to merge
      if (existingData && existingData.data) {
        // Check if server data is newer than our last sync
        const lastSyncTime = localStorage.getItem(`lastSync_${userId}`)
        const serverUpdateTime = new Date(existingData.updated_at).getTime()
        const lastSyncTimeMs = lastSyncTime ? Number.parseInt(lastSyncTime, 10) : 0

        if (serverUpdateTime > lastSyncTimeMs) {
          // Server has newer data, merge it with our data
          DebugUtils.logSync("Server has newer data, merging", {
            serverTime: serverUpdateTime,
            lastSyncTime: lastSyncTimeMs,
          })

          const mergedData = this.mergeData(data, existingData.data, existingData.updated_at)
          data = mergedData
        }

        DebugUtils.logSync("Updating existing record for user", userId)
        const { error } = await supabase
          .from("user_data")
          .update({
            data,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)

        if (error) {
          DebugUtils.logError("Error updating data", error)
          if (onError) onError(new Error(error.message))
          return
        }
      } else {
        // If record doesn't exist, insert it
        DebugUtils.logSync("Creating new record for user", userId)
        const { error } = await supabase.from("user_data").insert({
          user_id: userId,
          data,
          updated_at: new Date().toISOString(),
        })

        if (error) {
          DebugUtils.logError("Error inserting data", error)
          if (onError) onError(new Error(error.message))
          return
        }
      }

      DebugUtils.logSync("Successfully pushed data for user", userId)
      if (onSuccess && !skipNotification && shouldShowSyncNotification()) {
        onSuccess()
      }

      // Update last sync time
      this.updateLastSync(userId)
    } catch (error) {
      DebugUtils.logError("Error in pushChanges", error)
      if (onError) onError(error instanceof Error ? error : new Error(String(error)))
    }
  }

  // Immediately sync data to the server (for critical operations like adding/deleting tasks)
  static async immediateSync({
    userId,
    data,
    onSuccess,
    onError,
  }: {
    userId: string
    data: Subject[]
    onSuccess?: () => void
    onError?: (error: Error) => void
  }): Promise<void> {
    if (!data || !userId) {
      DebugUtils.logError("Missing data or userId for immediate sync", { userId, hasData: !!data })
      if (onError) onError(new Error("Missing data or userId"))
      return
    }

    try {
      DebugUtils.logSync("Immediate sync for user", userId)
      await this.pushChanges({ userId, data, onSuccess, onError })
    } catch (error) {
      DebugUtils.logError("Error in immediateSync", error)
      if (onError) onError(error instanceof Error ? error : new Error(String(error)))
    }
  }

  // Update the last sync time
  static updateLastSync(userId: string): void {
    const now = Date.now()
    localStorage.setItem(`lastSync_${userId}`, now.toString())

    // Also store the last notification time
    SessionStorage.set("last_sync_notification", now)
  }

  // Merge local and server data
  static mergeData(localData: Subject[], serverData: Subject[], serverUpdatedAt: string): Subject[] {
    DebugUtils.logSync("Merging data", {
      localSubjects: localData.length,
      serverSubjects: serverData.length,
    })

    // Create a deep copy of server data to start with
    const mergedData = JSON.parse(JSON.stringify(serverData)) as Subject[]

    // Create maps for faster lookups
    const serverSubjectMap = new Map(mergedData.map((subject) => [subject.id, subject]))

    // Process each local subject
    localData.forEach((localSubject) => {
      const serverSubject = serverSubjectMap.get(localSubject.id)

      if (!serverSubject) {
        // Subject exists only locally, add it to merged data
        DebugUtils.logSync(`Adding new local subject to merged data: ${localSubject.name}`)
        mergedData.push(JSON.parse(JSON.stringify(localSubject)))
        return
      }

      // Subject exists in both, merge units
      localSubject.units.forEach((localUnit) => {
        const serverUnit = serverSubject.units.find((u) => u.id === localUnit.id)

        if (!serverUnit) {
          // Unit exists only locally, add it to server subject
          DebugUtils.logSync(`Adding new local unit to subject ${localSubject.name}: ${localUnit.name}`)
          serverSubject.units.push(JSON.parse(JSON.stringify(localUnit)))
          return
        }

        // Unit exists in both, merge subtopics
        localUnit.subtopics.forEach((localSubtopic) => {
          const serverSubtopic = serverUnit.subtopics.find((s) => s.id === localSubtopic.id)

          if (!serverSubtopic) {
            // Subtopic exists only locally, add it to server unit
            DebugUtils.logSync(`Adding new local subtopic to unit ${localUnit.name}: ${localSubtopic.name}`)
            serverUnit.subtopics.push(JSON.parse(JSON.stringify(localSubtopic)))
            return
          }

          // Subtopic exists in both, merge tasks
          this.mergeTasks(localSubtopic.tasks, serverSubtopic.tasks)
        })
      })
    })

    return mergedData
  }

  // Merge tasks between local and server
  static mergeTasks(localTasks: Task[], serverTasks: Task[]): void {
    // Create a map of server tasks by ID for faster lookup
    const serverTaskMap = new Map(serverTasks.map((task) => [task.id, task]))

    // Process each local task
    localTasks.forEach((localTask) => {
      const serverTask = serverTaskMap.get(localTask.id)

      if (!serverTask) {
        // Task exists only locally, add it to server tasks
        DebugUtils.logSync(`Adding new local task: ${localTask.text}`)
        serverTasks.push(JSON.parse(JSON.stringify(localTask)))
        return
      }

      // Task exists in both, use the most recently updated one
      const localCreatedAt = new Date(localTask.createdAt).getTime()
      const serverCreatedAt = new Date(serverTask.createdAt).getTime()

      // If local task is newer or was modified more recently, update server task
      if (localCreatedAt > serverCreatedAt) {
        DebugUtils.logSync(`Updating server task with newer local task: ${localTask.text}`)
        Object.assign(serverTask, JSON.parse(JSON.stringify(localTask)))
      }
    })
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
