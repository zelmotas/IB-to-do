"use client"

import { useEffect, useState } from "react"
import { useChat, ChatProvider } from "@/contexts/chat-context"
import { MessageList } from "@/components/chat/message-list"
import { MessageInput } from "@/components/chat/message-input"
import { ChatHistory } from "@/components/chat/chat-history"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { createChatSession, getChatSessions } from "@/services/chat-service"
import { useLanguage } from "@/contexts/language-context"

function ChatInterface() {
  const { currentChat, isLoading, sendMessage, setCurrentChat } = useChat()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Try to load the most recent chat session
        const sessions = await getChatSessions()

        if (sessions.length > 0) {
          setCurrentChat(sessions[0])
        } else {
          // Create a new chat session if none exists
          const newChat = await createChatSession("New Chat")
          setCurrentChat(newChat)
        }
      } catch (error) {
        console.error("Error initializing chat:", error)
      }
    }

    if (!currentChat) {
      initializeChat()
    }
  }, [currentChat, setCurrentChat])

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden w-80 border-r md:block">
        <ChatHistory />
      </div>

      {/* Mobile menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute left-4 top-4 z-10 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <ChatHistory />
        </SheetContent>
      </Sheet>

      {/* Chat area */}
      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-auto">
          <MessageList messages={currentChat?.messages || []} isLoading={isLoading} />
        </div>
        <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  )
}
