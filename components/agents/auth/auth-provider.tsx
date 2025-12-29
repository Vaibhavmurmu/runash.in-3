"use client"

import type React from "react"
import { createContext, useContext, useMemo } from "react"
import { signIn as nextSignIn, signOut as nextSignOut, useSession } from "next-auth/react"

export type AuthContextValue = {
  user: (Record<string, any> & { id?: string; email?: string; name?: string }) | null
  loading: boolean
  signIn: typeof nextSignIn
  signOut: typeof nextSignOut
}

const defaultValue: AuthContextValue = {
  user: null,
  loading: false,
  signIn: nextSignIn,
  signOut: nextSignOut,
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * AuthProvider
 * Wraps the app and exposes user/session state from next-auth to client components.
 * Safe for SSR/hydration: never throws if missing and provides a sane fallback.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, status } = useSession()
  const loading = status === "loading"
  const user = (data?.user as AuthContextValue["user"]) ?? null

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn: nextSignIn,
      signOut: nextSignOut,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuthContext
 * Returns a non-throwing fallback when used outside a provider to prevent SSR/prerender crashes.
 */
export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    // Non-fatal fallback to avoid runtime/prerender errors.
    return defaultValue
  }
  return ctx
}
