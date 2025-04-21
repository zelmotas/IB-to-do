// Add the ChatLink component to the dashboard
import { ChatLink } from "./chat-link"

export const metadata = {
  title: "Dashboard",
  description: "Your personal dashboard",
}

export default async function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          {/* Main content */}
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome to IB Class Tracker</h2>
            <p className="text-muted-foreground mb-4">
              Track your tasks, manage your schedule, and get help with your IB studies.
            </p>

            <div className="flex flex-col space-y-2 mt-6">
              <h3 className="text-lg font-medium">Quick Links</h3>
              <ChatLink />
              {/* Add more links as needed */}
            </div>
          </div>
        </div>

        <div>
          {/* Sidebar */}
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Tasks</h2>
            <p className="text-sm text-muted-foreground">You don't have any upcoming tasks. Add some to get started.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
