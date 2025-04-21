import { createClient } from "@/utils/supabase/server"
import type { Message, ChatSession } from "@/types/chat"
import { v4 as uuidv4 } from "uuid"

export async function getChatSessions() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("chat_history").select("*").order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching chat sessions:", error)
    return []
  }

  return data.map((session) => ({
    ...session,
    messages: session.messages || [],
    createdAt: new Date(session.created_at),
    updatedAt: new Date(session.updated_at),
  })) as ChatSession[]
}

export async function getChatSession(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("chat_history").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching chat session:", error)
    return null
  }

  return {
    ...data,
    messages: data.messages || [],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  } as ChatSession
}

export async function createChatSession(title: string, initialMessage?: string) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData?.user) {
    throw new Error("User not authenticated")
  }

  const messages: Message[] = initialMessage
    ? [
        {
          id: uuidv4(),
          role: "user",
          content: initialMessage,
          createdAt: new Date(),
        },
      ]
    : []

  const { data, error } = await supabase
    .from("chat_history")
    .insert({
      user_id: userData.user.id,
      title: title || "New Chat",
      messages: messages,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating chat session:", error)
    throw error
  }

  return {
    ...data,
    messages: data.messages || [],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  } as ChatSession
}

export async function updateChatSession(id: string, messages: Message[]) {
  const supabase = await createClient()

  // Generate a title from the first user message if available
  let title = "New Chat"
  const firstUserMessage = messages.find((m) => m.role === "user")
  if (firstUserMessage) {
    title = firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "")
  }

  const { data, error } = await supabase
    .from("chat_history")
    .update({
      messages,
      title,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating chat session:", error)
    throw error
  }

  return {
    ...data,
    messages: data.messages || [],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  } as ChatSession
}

export async function deleteChatSession(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("chat_history").delete().eq("id", id)

  if (error) {
    console.error("Error deleting chat session:", error)
    throw error
  }

  return true
}
