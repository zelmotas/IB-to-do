"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, X, Paperclip, Loader2, Maximize2, Minimize2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  attachments?: {
    name: string
    url: string
    type: string
  }[]
}

export function AiChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [fileUploading, setFileUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isTyping, setIsTyping] = useState(false)
  const [typingText, setTypingText] = useState("")
  const [typingIndex, setTypingIndex] = useState(0)
  const [fullResponse, setFullResponse] = useState("")

  //  setTypingIndex] = useState(0)

  // Load chat history from localStorage when component mounts
  useEffect(() => {
    if (user) {
      const savedMessages = localStorage.getItem(`chat_history_${user.id}`)
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages)
          // Convert string timestamps back to Date objects
          const messagesWithDateObjects = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
          setMessages(messagesWithDateObjects)
        } catch (error) {
          console.error("Error parsing saved messages:", error)
        }
      } else {
        // Add welcome message if no history exists
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: t("aiWelcomeMessage"),
            timestamp: new Date(),
          },
        ])
      }
    } else {
      // Add welcome message for non-logged in users
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: t("aiWelcomeMessage"),
          timestamp: new Date(),
        },
      ])
    }
  }, [user, t])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`chat_history_${user.id}`, JSON.stringify(messages))
    }
  }, [messages, user])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Typing animation effect
  useEffect(() => {
    if (isTyping && typingIndex < fullResponse.length) {
      const timer = setTimeout(() => {
        setTypingText(fullResponse.substring(0, typingIndex + 1))
        setTypingIndex(typingIndex + 1)
      }, 10) // Adjust speed as needed
      return () => clearTimeout(timer)
    } else if (isTyping && typingIndex >= fullResponse.length) {
      setIsTyping(false)

      // Add the full response as a message
      const aiResponse: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: fullResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
      setFullResponse("")
      setTypingText("")
      setTypingIndex(0)
    }
  }, [isTyping, typingIndex, fullResponse])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Format messages for the API
      const apiMessages = messages
        .filter((msg) => msg.role === "user" || msg.role === "assistant")
        .slice(-10) // Get last 10 messages for context
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))

      // Add the new user message
      apiMessages.push({
        role: "user",
        content: input,
      })

      // Add a system message to provide context about the app
      apiMessages.unshift({
        role: "system",
        content:
          "You are an AI assistant helping an IB (International Baccalaureate) student with their studies. You can help with homework questions, explain concepts, provide study tips, and assist with organizing tasks. Be concise, helpful, and educational.",
      })

      // Call our secure API endpoint
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API response error:", response.status, errorData)
        throw new Error(`API request failed with status ${response.status}: ${errorData.details || ""}`)
      }

      const data = await response.json()
      const aiResponseText = data.choices[0].message.content || "I'm sorry, I couldn't generate a response."

      // Start typing animation
      setFullResponse(aiResponseText)
      setTypingIndex(0)
      setTypingText("")
      setIsTyping(true)
    } catch (error) {
      console.error("Error sending message:", error)

      // Show toast notification
      toast({
        title: "Error",
        description: "There was a problem connecting to the AI service. Please try again later.",
        variant: "destructive",
      })

      // Add a fallback response
      const fallbackResponse: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "I'm currently having trouble connecting to my knowledge base. Please try again in a moment or ask a different question.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, fallbackResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setFileUploading(true)

    try {
      // Create file message
      const fileMessages: Message[] = Array.from(files).map((file) => ({
        id: Date.now().toString() + file.name,
        role: "user",
        content: `I've uploaded a file: ${file.name}`,
        timestamp: new Date(),
        attachments: [
          {
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type,
          },
        ],
      }))

      setMessages((prev) => [...prev, ...fileMessages])

      // Add a simple response about the files
      const fallbackResponse: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "I see you've uploaded some files. While I can't access their contents directly, I can help you discuss or analyze them if you tell me more about what they contain. How can I assist you with these files?",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, fallbackResponse])
    } catch (error) {
      console.error("Error handling file upload:", error)

      // Show toast notification
      toast({
        title: "Error",
        description: "There was a problem processing your files.",
        variant: "destructive",
      })

      // Add fallback response
      const fallbackResponse: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "I encountered an error while processing your files. Please try again or describe the content of the files so I can help you better.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, fallbackResponse])
    } finally {
      setFileUploading(false)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const clearChat = () => {
    // Keep only the welcome message
    const welcomeMessage = {
      id: "welcome",
      role: "assistant",
      content: t("aiWelcomeMessage"),
      timestamp: new Date(),
    }

    setMessages([welcomeMessage])
  }

  return (
    <>
      {/* Floating action button */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, type: "spring" }}
        >
          <Button
            className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50 bg-primary hover:bg-primary/90"
            onClick={() => setIsOpen(true)}
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </motion.div>
      )}

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed z-50"
            style={{
              bottom: "1.5rem",
              right: "1.5rem",
              width: isExpanded ? "calc(100% - 3rem)" : "350px",
              height: isExpanded ? "calc(100% - 3rem)" : "500px",
              maxWidth: isExpanded ? "1200px" : "350px",
            }}
          >
            <Card className="h-full shadow-xl flex flex-col overflow-hidden border-2">
              <CardHeader className="p-3 border-b flex flex-row items-center justify-between bg-primary/5">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/ai-assistant.png" alt="AI" />
                    <AvatarFallback className="bg-primary/20">AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-sm">{t("aiAssistant")}</h3>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-primary/10"
                    onClick={clearChat}
                    title="Clear chat"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-primary/10"
                    onClick={() => setIsExpanded(!isExpanded)}
                    title={isExpanded ? "Minimize" : "Maximize"}
                  >
                    {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-primary/10"
                    onClick={() => setIsOpen(false)}
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-lg p-3",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 border border-border/50",
                          )}
                        >
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mb-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center text-xs mb-1">
                                  <Paperclip className="h-3 w-3 mr-1" />
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-primary transition-colors"
                                  >
                                    {attachment.name}
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                          <div
                            className={cn(
                              "text-xs mt-1",
                              message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground",
                            )}
                          >
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isLoading && (
                    <motion.div
                      className="flex justify-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="bg-muted/50 max-w-[85%] rounded-lg p-3 border border-border/50">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">{t("aiThinking")}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {isTyping && (
                    <motion.div
                      className="flex justify-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="bg-muted/50 max-w-[85%] rounded-lg p-3 border border-border/50">
                        <div className="text-sm whitespace-pre-wrap">{typingText}</div>
                        <div className="text-xs mt-1 text-muted-foreground">{formatTime(new Date())}</div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <CardFooter className="p-3 border-t">
                <form
                  className="flex items-center w-full space-x-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0 rounded-full hover:bg-primary/10"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={fileUploading || isLoading || isTyping}
                  >
                    {fileUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
                  </Button>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} multiple />
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("typeMessage")}
                    className="flex-1 border-primary/20 focus:border-primary"
                    disabled={isLoading || fileUploading || isTyping}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0 rounded-full bg-primary hover:bg-primary/90"
                    disabled={!input.trim() || isLoading || fileUploading || isTyping}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
