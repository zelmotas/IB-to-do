import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { AuthButton } from "@/components/auth/auth-button"
import { LanguageToggle } from "@/components/language-toggle"
import { AiChatAssistant } from "@/components/ai-chat-assistant"

interface ProtectedLayoutProps {
  children: ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">IB Class Tracker</h1>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <ModeToggle />
            <AuthButton />
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <AiChatAssistant />
    </div>
  )
}
