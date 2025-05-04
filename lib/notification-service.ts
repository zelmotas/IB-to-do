export interface NotificationOptions {
  taskId: string
  title: string
  body: string
  dueDate: string
  reminderTime: string | null
}

export class NotificationService {
  // Track the last time notifications were checked to prevent spam
  private static lastCheckTime = 0
  // Minimum time between notification checks (in milliseconds)
  private static readonly CHECK_THROTTLE = 30000 // 30 seconds
  // Track notifications that have already been shown
  private static readonly SHOWN_NOTIFICATIONS_KEY = "shownNotifications"

  static async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications")
      return false
    }

    if (Notification.permission === "granted") {
      return true
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    }

    return false
  }

  static async scheduleNotification(options: NotificationOptions): Promise<void> {
    const hasPermission = await this.requestPermission()
    if (!hasPermission) return

    const { taskId, title, body, dueDate, reminderTime } = options

    // Store the notification in localStorage
    const notifications = this.getScheduledNotifications()
    notifications.push({
      id: taskId,
      title,
      body,
      dueDate,
      reminderTime,
      scheduled: true,
    })

    localStorage.setItem("scheduledNotifications", JSON.stringify(notifications))
  }

  static getScheduledNotifications(): any[] {
    const stored = localStorage.getItem("scheduledNotifications")
    return stored ? JSON.parse(stored) : []
  }

  static removeNotification(taskId: string): void {
    const notifications = this.getScheduledNotifications()
    const updated = notifications.filter((n) => n.id !== taskId)
    localStorage.setItem("scheduledNotifications", JSON.stringify(updated))
  }

  static sendNotification(title: string, body: string, id: string): void {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications")
      return
    }

    if (Notification.permission === "granted") {
      // Check if this notification has already been shown
      if (this.hasNotificationBeenShown(id)) {
        console.log(`Notification ${id} already shown, skipping`)
        return
      }

      // Mark this notification as shown
      this.markNotificationAsShown(id)

      // Show the notification
      new Notification(title, { body })
    }
  }

  static checkDueNotifications(): void {
    // Throttle checks to prevent spam
    const now = Date.now()
    if (now - this.lastCheckTime < this.CHECK_THROTTLE) {
      console.log("Notification check throttled")
      return
    }
    this.lastCheckTime = now

    const notifications = this.getScheduledNotifications()
    const currentTime = new Date()

    notifications.forEach((notification) => {
      if (!notification.scheduled) return

      const dueDate = new Date(notification.dueDate)
      let shouldNotify = false
      const notificationId = `${notification.id}-${notification.reminderTime}`

      if (notification.reminderTime === "at-time") {
        // Notify exactly at the due time
        shouldNotify = Math.abs(dueDate.getTime() - currentTime.getTime()) < 60000 // Within a minute
      } else if (notification.reminderTime === "15-min") {
        // Notify 15 minutes before
        const fifteenMinBefore = new Date(dueDate.getTime() - 15 * 60000)
        shouldNotify = Math.abs(fifteenMinBefore.getTime() - currentTime.getTime()) < 60000
      } else if (notification.reminderTime === "1-hour") {
        // Notify 1 hour before
        const oneHourBefore = new Date(dueDate.getTime() - 60 * 60000)
        shouldNotify = Math.abs(oneHourBefore.getTime() - currentTime.getTime()) < 60000
      } else if (notification.reminderTime === "1-day") {
        // Notify 1 day before
        const oneDayBefore = new Date(dueDate.getTime() - 24 * 60 * 60000)
        shouldNotify = Math.abs(oneDayBefore.getTime() - currentTime.getTime()) < 60000
      }

      if (shouldNotify) {
        this.sendNotification(notification.title, notification.body, notificationId)
        // Mark as notified
        notification.scheduled = false
      }
    })

    // Save updated notifications
    localStorage.setItem("scheduledNotifications", JSON.stringify(notifications))
  }

  // Helper methods to track shown notifications
  private static getShownNotifications(): Record<string, number> {
    const stored = localStorage.getItem(this.SHOWN_NOTIFICATIONS_KEY)
    return stored ? JSON.parse(stored) : {}
  }

  private static hasNotificationBeenShown(id: string): boolean {
    const shown = this.getShownNotifications()
    const timestamp = shown[id]

    if (!timestamp) return false

    // Consider notifications shown in the last 24 hours as "already shown"
    const now = Date.now()
    return now - timestamp < 24 * 60 * 60 * 1000
  }

  private static markNotificationAsShown(id: string): void {
    const shown = this.getShownNotifications()
    shown[id] = Date.now()
    localStorage.setItem(this.SHOWN_NOTIFICATIONS_KEY, JSON.stringify(shown))
  }

  // Clean up old shown notifications (call this periodically)
  static cleanupOldNotifications(): void {
    const shown = this.getShownNotifications()
    const now = Date.now()
    const oneDay = 24 * 60 * 60 * 1000

    let changed = false
    Object.keys(shown).forEach((id) => {
      if (now - shown[id] > oneDay) {
        delete shown[id]
        changed = true
      }
    })

    if (changed) {
      localStorage.setItem(this.SHOWN_NOTIFICATIONS_KEY, JSON.stringify(shown))
    }
  }
}
