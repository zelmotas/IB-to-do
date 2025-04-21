import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = await createClient()

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Redirect to the dashboard after successful authentication
    return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
  }

  // If there's no code, redirect to the login page
  return NextResponse.redirect(new URL("/login", requestUrl.origin))
}
