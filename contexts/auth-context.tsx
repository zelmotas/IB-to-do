"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User, Session, AuthError } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  updateProfile: (profile: { full_name?: string; avatar_url?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Check active session
        const {
          data: { session: activeSession },
        } = await supabase.auth.getSession()
        setSession(activeSession)
        setUser(activeSession?.user ?? null)

        // Listen for auth changes
        const {
          data: { subscription },
        } = await supabase.auth.onAuthStateChange((_event, newSession) => {
          setSession(newSession)
          setUser(newSession?.user ?? null)

          // Refresh the page to update server-side data
          if (_event === "SIGNED_IN" || _event === "TOKEN_REFRESHED") {
            router.refresh()
          }
        })

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error setting up auth:", error)
        toast({
          title: "Authentication Error",
          description: "There was a problem connecting to the authentication service.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    setupAuth()
  }, [router, toast, supabase.auth])

  const signUp = async (email: string, password: string, metadata?: { full_name?: string }) => {
    setIsLoading(true)
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) throw error

      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      })

      // If email confirmation is disabled, user will be signed in automatically
      if (data.session) {
        router.push("/dashboard")
      } else {
        router.push("/auth/verify-email")
      }
    } catch (error) {
      const authError = error as AuthError
      console.error("Error signing up:", authError)
      toast({
        title: "Sign up failed",
        description: authError.message || "There was a problem creating your account.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      const authError = error as AuthError
      console.error("Error signing in:", authError)
      toast({
        title: "Sign in failed",
        description: authError.message || "Invalid email or password.",
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
      if (error) throw error

      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Sign out failed",
        description: "There was a problem signing you out.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) throw error

      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password.",
      })
    } catch (error) {
      const authError = error as AuthError
      console.error("Error resetting password:", authError)
      toast({
        title: "Password reset failed",
        description: authError.message || "There was a problem sending the password reset email.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updatePassword = async (password: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      })

      router.push("/dashboard")
    } catch (error) {
      const authError = error as AuthError
      console.error("Error updating password:", authError)
      toast({
        title: "Password update failed",
        description: authError.message || "There was a problem updating your password.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (profile: { full_name?: string; avatar_url?: string }) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: profile,
      })

      if (error) throw error

      // Also update the profile in the users table
      if (user) {
        const { error: profileError } = await supabase.from("users").update(profile).eq("id", user.id)

        if (profileError) throw profileError
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Profile update failed",
        description: "There was a problem updating your profile.",
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
        session,
        isLoading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
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
