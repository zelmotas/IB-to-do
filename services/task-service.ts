import { createClient } from "@/utils/supabase/server"
import { v4 as uuidv4 } from "uuid"

export interface Task {
  id: string
  text: string
  completed: boolean
  due_date: string | null
  created_at: string
  reminder_time: string | null
  subject_id: string | null
  unit_id: string | null
  subtopic_id: string | null
  subject_name: string | null
  unit_name: string | null
  subtopic_name: string | null
  subject_color: string | null
}

export interface CreateTaskData {
  text: string
  due_date?: string | null
  reminder_time?: string | null
  subject_id?: string | null
  unit_id?: string | null
  subtopic_id?: string | null
  subject_name?: string | null
  unit_name?: string | null
  subtopic_name?: string | null
  subject_color?: string | null
}

export interface UpdateTaskData {
  text?: string
  completed?: boolean
  due_date?: string | null
  reminder_time?: string | null
  subject_id?: string | null
  unit_id?: string | null
  subtopic_id?: string | null
  subject_name?: string | null
  unit_name?: string | null
  subtopic_name?: string | null
  subject_color?: string | null
}

export async function getTasks() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData?.user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching tasks:", error)
    throw error
  }

  return data as Task[]
}

export async function createTask(taskData: CreateTaskData) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData?.user) {
    throw new Error("User not authenticated")
  }

  const newTask = {
    id: uuidv4(),
    user_id: userData.user.id,
    text: taskData.text,
    completed: false,
    due_date: taskData.due_date || null,
    reminder_time: taskData.reminder_time || null,
    subject_id: taskData.subject_id || null,
    unit_id: taskData.unit_id || null,
    subtopic_id: taskData.subtopic_id || null,
    subject_name: taskData.subject_name || null,
    unit_name: taskData.unit_name || null,
    subtopic_name: taskData.subtopic_name || null,
    subject_color: taskData.subject_color || null,
  }

  const { data, error } = await supabase.from("tasks").insert([newTask]).select().single()

  if (error) {
    console.error("Error creating task:", error)
    throw error
  }

  return data as Task
}

export async function updateTask(id: string, taskData: UpdateTaskData) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("tasks").update(taskData).eq("id", id).select().single()

  if (error) {
    console.error("Error updating task:", error)
    throw error
  }

  return data as Task
}

export async function deleteTask(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("tasks").delete().eq("id", id)

  if (error) {
    console.error("Error deleting task:", error)
    throw error
  }

  return true
}
