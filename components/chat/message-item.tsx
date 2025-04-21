import type { Message } from "@/types/chat"
import { Avatar } from "@/components/ui/avatar"
import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

interface MessageItemProps {
  message: Message
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex w-full items-start gap-4 py-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </Avatar>
      )}

      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2 rounded-lg px-4 py-3",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        {isUser ? (
          <p className="text-sm">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        <span className="text-xs opacity-70">{new Date(message.createdAt).toLocaleTimeString()}</span>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
          <User className="h-4 w-4" />
        </Avatar>
      )}
    </div>
  )
}
