import type { Subject } from "@/types/todo"

interface SyncOptions {
  userId: string
  data: Subject[]
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export class SyncService {
  // Simulate a server-side storage with localStorage
  // In a real implementation, this would be a database or cloud storage
  private static getServerKey(userId: string): string {
    return `server_data_${userId}`
  }

  // Push local changes to the server
  static async pushChanges({ userId, data, onSuccess, onError }: SyncOptions): Promise<void> {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Store data in "server" (localStorage with a different key)
      const serverKey = this.getServerKey(userId)
      localStorage.setItem(
        serverKey,
        JSON.stringify({
          data,
          lastUpdated: new Date().toISOString(),
        }),
      )

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error pushing changes:", error)
      if (onError) onError(error as Error)
    }
  }

  // Pull latest data from the server
  static async pullChanges({ userId, onSuccess, onError }: Omit<SyncOptions, "data">): Promise<Subject[] | null> {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Get data from "server"
      const serverKey = this.getServerKey(userId)
      const serverData = localStorage.getItem(serverKey)

      if (!serverData) return null

      const parsedData = JSON.parse(serverData)

      if (onSuccess) onSuccess()

      return parsedData.data
    } catch (error) {
      console.error("Error pulling changes:", error)
      if (onError) onError(error as Error)
      return null
    }
  }

  // Check if there are newer changes on the server
  static async checkForUpdates({ userId }: { userId: string }): Promise<boolean> {
    try {
      // Get local last sync time
      const localLastSync = localStorage.getItem(`last_sync_${userId}`)

      // Get server data
      const serverKey = this.getServerKey(userId)
      const serverData = localStorage.getItem(serverKey)

      if (!serverData || !localLastSync) return false

      const parsedServerData = JSON.parse(serverData)
      const serverLastUpdated = new Date(parsedServerData.lastUpdated)
      const localLastSyncDate = new Date(localLastSync)

      // Return true if server has newer data
      return serverLastUpdated > localLastSyncDate
    } catch (error) {
      console.error("Error checking for updates:", error)
      return false
    }
  }

  // Update the last sync timestamp
  static updateLastSync(userId: string): void {
    localStorage.setItem(`last_sync_${userId}`, new Date().toISOString())
  }
}
