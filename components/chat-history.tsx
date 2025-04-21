"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DataService } from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Send, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
}

export function ChatHistory() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [chatHistory, setChatHistory] = useState<any>(null)

  // Fetch chat history on component mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) return

      try {
        const history = await DataService.getChatHistory(user.id)
        if (history) {
          setChatHistory(history)
          setMessages(history.messages || [])
        } else {
          // Add welcome message if no history exists
          const welcomeMessage: Message = {
            id: "welcome",
            role: "assistant",
            content: "Hello! I'm your IB study assistant. How can I help you today?",
            timestamp: new Date().toISOString(),
          }
          setMessages([welcomeMessage])

          // Save welcome message to database
          await DataService.saveChatHistory(user.id, [welcomeMessage])
        }
      } catch (error) {
        console.error("Error fetching chat history:", error)
        toast({
          title: "Error",
          description: "Failed to load chat history. Please refresh the page.",
          variant: "destructive",
        })
      }
    }

    fetchChatHistory()
  }, [user, toast])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Update chat history when messages change
  useEffect(() => {
    const updateChatHistory = async () => {
      if (!user || messages.length === 0) return

      try {
        await DataService.saveChatHistory(user.id, messages)
      } catch (error) {
        console.error("Error saving chat history:", error)
      }
    }

    updateChatHistory()
  }, [messages, user])

  const handleSendMessage = async () => {
    if (!user || !input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call AI API
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map((msg) => ({ role: msg.role, content: msg.content })),
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      const aiResponseText = data.choices[0].message.content || "I'm sorry, I couldn't generate a response."

      const aiResponse: Message = {
        id: Date.now().toString() + "-ai",
        role: "assistant",
        content: aiResponseText,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error sending message:", error)

      // Add fallback response
      const fallbackResponse: Message = {
        id: Date.now().toString() + "-fallback",
        role: "assistant",
        content: "I'm currently having trouble connecting. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, fallbackResponse])

      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = async () => {
    if (!user) return

    try {
      // Add welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: "Hello! I'm your IB study assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
      }

      setMessages([welcomeMessage])

      // Save to database
      await DataService.saveChatHistory(user.id, [welcomeMessage])

      toast({
        title: "Chat cleared",
        description: "Your chat history has been cleared.",
      })
    } catch (error) {
      console.error("Error clearing chat:", error)
      toast({
        title: "Error",
        description: "Failed to clear chat history. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), "h:mm a")
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>AI Assistant</CardTitle>
        <Button variant="outline" size="sm" onClick={clearChat}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Clear Chat
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-[450px] pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted border"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center mb-2">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src="/ai-assistant.png" alt="AI" />
                        <AvatarFallback className="bg-primary/20 text-xs">AI</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">AI Assistant</span>
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-3">
        <form
          className="flex w-full items-center space-x-2"
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
