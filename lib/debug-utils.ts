// Debug utility to help track sync issues
export const DebugUtils = {
  logSync: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[SYNC] ${message}`, data ? data : "")
    }
  },

  logError: (message: string, error: any) => {
    console.error(`[ERROR] ${message}`, error)
  },

  // Helper to check if data exists in Supabase
  async checkUserData(userId: string) {
    try {
      const { createClient } = await import("@/lib/supabase")
      const supabase = createClient()

      const { data, error } = await supabase.from("user_data").select("*").eq("user_id", userId).single()

      if (error) {
        this.logError("Error checking user data", error)
        return null
      }

      return data
    } catch (error) {
      this.logError("Exception checking user data", error)
      return null
    }
  },
}
