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

  // Helper to compare local and server data
  compareData(localData: any, serverData: any) {
    if (!localData || !serverData) {
      return { isDifferent: true, details: "One of the datasets is missing" }
    }

    try {
      const localJson = JSON.stringify(localData)
      const serverJson = JSON.stringify(serverData)

      if (localJson === serverJson) {
        return { isDifferent: false, details: "Data is identical" }
      }

      // If data is different, try to identify what's different
      const localSubjects = Array.isArray(localData) ? localData.length : "not an array"
      const serverSubjects = Array.isArray(serverData) ? serverData.length : "not an array"

      return {
        isDifferent: true,
        details: {
          localSubjectsCount: localSubjects,
          serverSubjectsCount: serverSubjects,
          localDataSize: localJson.length,
          serverDataSize: serverJson.length,
        },
      }
    } catch (error) {
      this.logError("Error comparing data", error)
      return { isDifferent: true, details: "Error comparing data" }
    }
  },
}
