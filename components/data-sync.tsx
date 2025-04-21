"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface DataSyncProps {
  onTasksChange?: (tasks: any[]) => void
  onChatHistoryChange?: (chatHistory: any) => void
}

export function DataSync({ onTasksChange, onChatHistoryChange }: DataSyncProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!user) return

    const supabase = getSupabaseClient()

    // Initial data fetch
    const fetchInitialData = async () => {
      try {
        // Fetch tasks
        if (onTasksChange) {
          const { data: tasks, error: tasksError } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })

          if (tasksError) throw tasksError

          onTasksChange(tasks || [])
        }

        // Fetch chat history
        if (onChatHistoryChange) {
          const { data: chatHistory, error: chatError } = await supabase
            .from("chat_history")
            .select("*")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false })
            .limit(1)
            .single()

          if (chatError && chatError.code !== "PGRST116") throw chatError

          if (chatHistory) {
            onChatHistoryChange(chatHistory)
          }
        }

        setIsInitialized(true)
      } catch (error) {
        console.error("Error fetching initial data:", error)
        toast({
          title: "Data sync error",
          description: "Failed to load your data. Please refresh the page.",
          variant: "destructive",
        })
      }
    }

    fetchInitialData()

    // Set up real-time subscriptions
    const tasksSubscription = onTasksChange
      ? supabase
          .channel("tasks-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "tasks",
              filter: `user_id=eq.${user.id}`,
            },
            async () => {
              // Refetch all tasks on any change
              const { data, error } = await supabase
                .from("tasks")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })

              if (error) {
                console.error("Error in tasks subscription:", error)
                return
              }

              onTasksChange(data || [])
            },
          )
          .subscribe()
      : null

    const chatHistorySubscription = onChatHistoryChange
      ? supabase
          .channel("chat-history-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "chat_history",
              filter: `user_id=eq.${user.id}`,
            },
            async () => {
              // Refetch chat history on any change
              const { data, error } = await supabase
                .from("chat_history")
                .select("*")
                .eq("user_id", user.id)
                .order("updated_at", { ascending: false })
                .limit(1)
                .single()

              if (error && error.code !== "PGRST116") {
                console.error("Error in chat history subscription:", error)
                return
              }

              if (data) {
                onChatHistoryChange(data)
              }
            },
          )
          .subscribe()
      : null

    // Cleanup subscriptions
    return () => {
      if (tasksSubscription) {
        supabase.removeChannel(tasksSubscription)
      }
      if (chatHistorySubscription) {
        supabase.removeChannel(chatHistorySubscription)
      }
    }
  }, [user, onTasksChange, onChatHistoryChange, toast])

  return null // This is a non-visual component
}
