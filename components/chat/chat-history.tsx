"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ChatSession } from "@/types/chat"
import { Plus, Trash2 } from "lucide-react"
import { useChat } from "@/contexts/chat-context"
import { createChatSession, deleteChatSession, getChatSessions } from "@/services/chat-service"

export function ChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { currentChat, setCurrentChat } = useChat()

  const loadSessions = async () => {
    try {
      setIsLoading(true)
      const data = await getChatSessions()
      setSessions(data)
    } catch (error) {
      console.error("Error loading chat sessions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSessions()
  }, [])

  const handleNewChat = async () => {
    try {
      const newChat = await createChatSession("New Chat")
      setSessions([newChat, ...sessions])
      setCurrentChat(newChat)
    } catch (error) {
      console.error("Error creating new chat:", error)
    }
  }

  const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await deleteChatSession(id)
      setSessions(sessions.filter((session) => session.id !== id))

      if (currentChat?.id === id) {
        setCurrentChat(null)
      }
    } catch (error) {
      console.error("Error deleting chat:", error)
    }
  }

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <Button onClick={handleNewChat} className="w-full justify-start gap-2">
        <Plus className="h-4 w-4" />
        New Chat
      </Button>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 pt-4">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">No chat history</p>
          ) : (
            sessions.map((session) => (
              <Button
                key={session.id}
                variant={currentChat?.id === session.id ? "secondary" : "ghost"}
                className="justify-between px-3 py-2 text-left"
                onClick={() => setCurrentChat(session)}
              >
                <span className="truncate">{session.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => handleDeleteChat(session.id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
