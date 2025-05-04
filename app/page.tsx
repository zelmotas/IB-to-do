"use client"

import { useEffect } from "react"
import { IbTodoTracker } from "@/components/ib-todo-tracker"

export default function Home() {
  useEffect(() => {
    fetch("/api/track")
  }, [])

  return (
    <main className="min-h-screen p-4 md:p-8">
      <IbTodoTracker />
    </main>
  )
}
