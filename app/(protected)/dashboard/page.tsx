import { createServerSupabaseClient } from "@/lib/supabase"
import { DataSync } from "@/components/data-sync"
import { TaskList } from "@/components/task-list"
import { ChatHistory } from "@/components/chat-history"

export const metadata = {
  title: "Dashboard",
  description: "Your personal dashboard",
}

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  // Get user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get initial tasks
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", session?.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
          <TaskList initialTasks={tasks || []} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
          <ChatHistory />
        </div>
      </div>

      {/* This component handles real-time data sync */}
      <DataSync />
    </div>
  )
}
