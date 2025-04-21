import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Create a singleton instance of the Supabase client
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables")
  }

  if (!supabaseClient) {
    supabaseClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          storageKey: "ib-tracker-auth",
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      },
    )
  }

  return supabaseClient
}
