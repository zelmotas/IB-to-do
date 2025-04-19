export interface NotificationOptions {
  taskId: string
  title: string
  body: string
  dueDate: string
  reminderTime: string | null
}

export class NotificationService {
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

  static sendNotification(title: string, body: string): void {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications")
      return
    }

    if (Notification.permission === "granted") {
      new Notification(title, { body })
    }
  }

  static checkDueNotifications(): void {
    const notifications = this.getScheduledNotifications()
    const now = new Date()

    notifications.forEach((notification) => {
      if (!notification.scheduled) return

      const dueDate = new Date(notification.dueDate)
      let shouldNotify = false

      if (notification.reminderTime === "at-time") {
        // Notify exactly at the due time
        shouldNotify = Math.abs(dueDate.getTime() - now.getTime()) < 60000 // Within a minute
      } else if (notification.reminderTime === "15-min") {
        // Notify 15 minutes before
        const fifteenMinBefore = new Date(dueDate.getTime() - 15 * 60000)
        shouldNotify = Math.abs(fifteenMinBefore.getTime() - now.getTime()) < 60000
      } else if (notification.reminderTime === "1-hour") {
        // Notify 1 hour before
        const oneHourBefore = new Date(dueDate.getTime() - 60 * 60000)
        shouldNotify = Math.abs(oneHourBefore.getTime() - now.getTime()) < 60000
      } else if (notification.reminderTime === "1-day") {
        // Notify 1 day before
        const oneDayBefore = new Date(dueDate.getTime() - 24 * 60 * 60000)
        shouldNotify = Math.abs(oneDayBefore.getTime() - now.getTime()) < 60000
      }

      if (shouldNotify) {
        this.sendNotification(notification.title, notification.body)
        // Mark as notified
        notification.scheduled = false
      }
    })

    // Save updated notifications
    localStorage.setItem("scheduledNotifications", JSON.stringify(notifications))
  }
}
