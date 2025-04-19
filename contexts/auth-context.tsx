"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { setCookie, getCookie, deleteCookie } from "cookies-next"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Store user credentials in localStorage for demo purposes
// In a real app, this would be handled by a backend
const USERS_STORAGE_KEY = "ib_tracker_users"

interface StoredUser extends User {
  password: string
}

function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(USERS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function storeUser(user: StoredUser) {
  const users = getStoredUsers()
  const existingUserIndex = users.findIndex((u) => u.email === user.email)

  if (existingUserIndex >= 0) {
    users[existingUserIndex] = user
  } else {
    users.push(user)
  }

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const userCookie = getCookie("user")
        if (userCookie) {
          const parsedUser = JSON.parse(userCookie as string)
          setUser(parsedUser)

          // Initialize with a default user if none exists
          const users = getStoredUsers()
          if (users.length === 0) {
            storeUser({
              id: "demo",
              email: "demo@example.com",
              password: "password",
            })
          }
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Find user in stored users
      const users = getStoredUsers()
      const foundUser = users.find((u) => u.email === email && u.password === password)

      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)

      // Store in cookie
      setCookie("user", JSON.stringify(userWithoutPassword), {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      })

      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${email}!`,
      })

      return
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
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
      // Check if user already exists
      const users = getStoredUsers()
      const existingUser = users.find((u) => u.email === email)

      if (existingUser) {
        throw new Error("User already exists")
      }

      // Create new user
      const newUser: StoredUser = {
        id: Date.now().toString(),
        email,
        password,
      }

      // Store user
      storeUser(newUser)

      // Create user object without password
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)

      // Store in cookie
      setCookie("user", JSON.stringify(userWithoutPassword), {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      })

      toast({
        title: "Compte créé avec succès",
        description: `Bienvenue, ${email}!`,
      })

      return
    } catch (error) {
      console.error("Sign up error:", error)
      toast({
        title: "Erreur d'inscription",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
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
      // Clear user state
      setUser(null)

      // Remove cookie
      deleteCookie("user", { path: "/" })

      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would redirect to Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a demo Google user
      const googleUser = {
        id: "google-" + Date.now().toString(),
        email: "google-user@example.com",
        name: "Google User",
      }

      setUser(googleUser)

      // Store in cookie
      setCookie("user", JSON.stringify(googleUser), {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      })

      toast({
        title: "Connexion Google réussie",
        description: `Bienvenue, ${googleUser.name}!`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGithub = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would redirect to GitHub OAuth
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a demo GitHub user
      const githubUser = {
        id: "github-" + Date.now().toString(),
        email: "github-user@example.com",
        name: "GitHub User",
      }

      setUser(githubUser)

      // Store in cookie
      setCookie("user", JSON.stringify(githubUser), {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      })

      toast({
        title: "Connexion GitHub réussie",
        description: `Bienvenue, ${githubUser.name}!`,
      })
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
