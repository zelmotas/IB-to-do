export type MessageRole = "user" | "assistant" | "system"

export interface Message {
  id: string
  role: MessageRole
  content: string
  createdAt: Date
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}
