import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4">
        <h1 className="text-xl font-semibold">IB Assistant</h1>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
