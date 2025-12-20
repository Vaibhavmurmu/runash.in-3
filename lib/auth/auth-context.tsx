"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { neon } from "@/lib/neon/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await neon.auth.getSession()
        if (mounted) {
          if (error) {
            console.error("Error getting session:", error)
          }
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              full_name: session.user.user_metadata?.full_name,
              phone: session.user.user_metadata?.phone,
            })
          }
          setLoading(false)
        }
      } catch (error) {
        console.error("Error in getSession:", error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = neon.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            full_name: session.user.user_metadata?.full_name,
            phone: session.user.user_metadata?.phone,
          })
        } else {
          setUser(null)
        }
        setLoading(false)

        if (event === "SIGNED_IN") {
          toast.success("Successfully signed in!")
          router.push("/")
        } else if (event === "SIGNED_OUT") {
          toast.success("Successfully signed out!")
          router.push("/auth/login")
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await neon.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      console.error("Sign in error:", error)
      return { error: { message: "Network error. Please try again." } }
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await neon.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })
      return { error }
    } catch (error) {
      console.error("Sign up error:", error)
      return { error: { message: "Network error. Please try again." } }
    }
  }

  const signOut = async () => {
    try {
      await neon.auth.signOut()
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("Error signing out")
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
  }
