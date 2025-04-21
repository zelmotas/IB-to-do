import { getSupabaseClient } from "@/lib/supabase"
import type { Insertable, Updatable } from "@/types/supabase"

export class DataService {
  // Tasks
  static async getUserTasks(userId: string) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching tasks:", error)
      throw error
    }

    return data
  }

  static async createTask(task: Insertable<"tasks">) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("tasks").insert(task).select().single()

    if (error) {
      console.error("Error creating task:", error)
      throw error
    }

    return data
  }

  static async updateTask(id: string, task: Updatable<"tasks">) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("tasks").update(task).eq("id", id).select().single()

    if (error) {
      console.error("Error updating task:", error)
      throw error
    }

    return data
  }

  static async deleteTask(id: string) {
    const supabase = getSupabaseClient()

    const { error } = await supabase.from("tasks").delete().eq("id", id)

    if (error) {
      console.error("Error deleting task:", error)
      throw error
    }

    return true
  }

  // Chat History
  static async getChatHistory(userId: string) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("chat_history")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned" error
      console.error("Error fetching chat history:", error)
      throw error
    }

    return data
  }

  static async saveChatHistory(userId: string, messages: any) {
    const supabase = getSupabaseClient()

    // Check if chat history exists
    const { data: existingData } = await supabase
      .from("chat_history")
      .select("id")
      .eq("user_id", userId)
      .limit(1)
      .single()

    if (existingData) {
      // Update existing chat history
      const { data, error } = await supabase
        .from("chat_history")
        .update({
          messages,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingData.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating chat history:", error)
        throw error
      }

      return data
    } else {
      // Create new chat history
      const { data, error } = await supabase
        .from("chat_history")
        .insert({
          user_id: userId,
          messages,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating chat history:", error)
        throw error
      }

      return data
    }
  }
}
