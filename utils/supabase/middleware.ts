import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export function createClient(request: NextRequest) {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // If the cookie is updated, update the response headers
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set(name, value, options)
        },
        remove(name: string, options: any) {
          // If the cookie is removed, update the response headers
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.delete(name)
        },
      },
    },
  )

  return { supabase, response }
}
