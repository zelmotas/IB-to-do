import { createClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // After successful authentication and before redirect
  // Add this line before the redirect
  if (typeof window !== "undefined") {
    // This will run on the client side after hydration
    const SessionStorage = {
      set: (key: string, value: any) => {
        sessionStorage.setItem(key, JSON.stringify(value))
      },
    }
    SessionStorage.set("login_timestamp", Date.now())
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
