"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { SessionStorage } from "@/lib/session-storage"

interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (token: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          const { user: supabaseUser } = session

          if (supabaseUser) {
            setUser({
              id: supabaseUser.id,
              email: supabaseUser.email || "",
              name: supabaseUser.user_metadata?.name,
              avatar_url: supabaseUser.user_metadata?.avatar_url,
            })

            // Check if this is a new login session
            const lastLoginId = SessionStorage.get("last_login_id")
            if (!lastLoginId || lastLoginId !== session.access_token) {
              // This is a new login
              SessionStorage.set("login_timestamp", Date.now())
              SessionStorage.set("last_login_id", session.access_token)

              // Set a flag to completely disable sync notifications for 30 seconds
              SessionStorage.set("disable_sync_notifications", true)

              // Clear the flag after 30 seconds
              setTimeout(() => {
                SessionStorage.remove("disable_sync_notifications")
              }, 30000)
            }
          }
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && session.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name,
          avatar_url: session.user.user_metadata?.avatar_url,
        })

        // If this is a sign-in event, mark it as a new login
        if (event === "SIGNED_IN") {
          SessionStorage.set("login_timestamp", Date.now())
          SessionStorage.set("last_login_id", session.access_token)

          // Set a flag to completely disable sync notifications for 30 seconds
          SessionStorage.set("disable_sync_notifications", true)

          // Clear the flag after 30 seconds
          setTimeout(() => {
            SessionStorage.remove("disable_sync_notifications")
          }, 30000)
        }
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      // Track login in session storage to prevent duplicate notifications
      SessionStorage.set("login_timestamp", Date.now())

      // Set a flag to completely disable sync notifications for 30 seconds
      SessionStorage.set("disable_sync_notifications", true)

      // Store the session ID to track new logins
      if (data.session) {
        SessionStorage.set("last_login_id", data.session.access_token)
      }

      toast({
        title: "Sign in successful",
        description: `Welcome back, ${email}!`,
      })

      return
    } catch (error: any) {
      console.error("Sign in error:", error)
      toast({
        title: "Sign in error",
        description: error.message || "Incorrect email or password",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Account created successfully",
        description: `Welcome, ${email}! Please check your email to confirm your account.`,
      })

      return
    } catch (error: any) {
      console.error("Sign up error:", error)
      toast({
        title: "Sign up error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      // Clear login tracking
      SessionStorage.remove("login_timestamp")
      SessionStorage.remove("last_login_id")
      SessionStorage.remove("disable_sync_notifications")

      toast({
        title: "Signed out successfully",
        description: "See you soon!",
      })
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      // Set login timestamp before redirecting to OAuth
      SessionStorage.set("login_timestamp", Date.now())

      // Set a flag to completely disable sync notifications after redirect
      SessionStorage.set("pending_oauth_login", true)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("Google sign in error:", error)
      toast({
        title: "Sign in error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    }
  }

  const signInWithGithub = async () => {
    try {
      // Set login timestamp before redirecting to OAuth
      SessionStorage.set("login_timestamp", Date.now())

      // Set a flag to completely disable sync notifications after redirect
      SessionStorage.set("pending_oauth_login", true)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("GitHub sign in error:", error)
      toast({
        title: "Sign in error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    }
  }

  const resetPassword = async (email: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Email sent",
        description: "Please check your email to reset your password.",
      })
    } catch (error: any) {
      console.error("Password reset error:", error)
      toast({
        title: "Reset error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updatePassword = async (token: string, newPassword: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })
    } catch (error: any) {
      console.error("Update password error:", error)
      toast({
        title: "Update error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        signInWithGithub,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
