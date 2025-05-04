// Helper functions for session storage
// These values persist during a browser session but are cleared when the browser is closed

export const SessionStorage = {
  // Get a value from session storage
  get: (key: string): any => {
    if (typeof window === "undefined") return null

    const item = sessionStorage.getItem(key)
    if (!item) return null

    try {
      return JSON.parse(item)
    } catch (e) {
      return item
    }
  },

  // Set a value in session storage
  set: (key: string, value: any): void => {
    if (typeof window === "undefined") return

    const valueToStore = typeof value === "string" ? value : JSON.stringify(value)

    sessionStorage.setItem(key, valueToStore)
  },

  // Remove a value from session storage
  remove: (key: string): void => {
    if (typeof window === "undefined") return
    sessionStorage.removeItem(key)
  },

  // Clear all values from session storage
  clear: (): void => {
    if (typeof window === "undefined") return
    sessionStorage.clear()
  },
}
