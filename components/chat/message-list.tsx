"use client"

import { useRef, useEffect } from "react"
import type { Message } from "@/types/chat"
import { MessageItem } from "./message-item"

interface MessageListProps {
  messages: Message[]
  isLoading?: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom when messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="max-w-md text-center">
          <h3 className="text-lg font-semibold">Welcome to IB Assistant</h3>
          <p className="text-muted-foreground">
            Ask any question about your IB studies, and I'll help you find the answers.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-2 w-2 animate-bounce rounded-full bg-current"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-current" style={{ animationDelay: "0.2s" }}></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-current" style={{ animationDelay: "0.4s" }}></div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
