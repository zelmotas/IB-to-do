"use client"

import Link from "next/link"
import { MessageSquare } from "lucide-react"

export function ChatLink() {
  return (
    <Link href="/chat" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
      <MessageSquare className="h-5 w-5" />
      <span>IB Assistant</span>
    </Link>
  )
}
