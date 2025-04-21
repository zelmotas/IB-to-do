"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { Message, ChatSession } from "@/types/chat"
import { v4 as uuidv4 } from "uuid"

interface ChatContextType {
  currentChat: ChatSession | null
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  setCurrentChat: (chat: ChatSession | null) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentChat) return

      try {
        setIsLoading(true)
        setError(null)

        // Create a new user message
        const newMessage: Message = {
          id: uuidv4(),
          role: "user",
          content,
          createdAt: new Date(),
        }

        // Update local state immediately for better UX
        const updatedMessages = [...currentChat.messages, newMessage]
        setCurrentChat({
          ...currentChat,
          messages: updatedMessages,
        })

        // Send the message to the API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: updatedMessages,
            chatId: currentChat.id,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to send message")
        }

        const data = await response.json()

        // Update the chat with the AI response
        setCurrentChat({
          ...currentChat,
          messages: [...updatedMessages, data.message],
        })
      } catch (err) {
        console.error("Error sending message:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    },
    [currentChat],
  )

  return (
    <ChatContext.Provider
      value={{
        currentChat,
        isLoading,
        error,
        sendMessage,
        setCurrentChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
