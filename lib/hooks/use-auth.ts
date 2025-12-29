"use client"

import { useEffect, useState } from "react"
import { signIn as nextSignIn, signOut as nextSignOut, useSession } from "next-auth/react"

export function useAuth() {
  const { data, status } = useSession()
  const [isLoading, setIsLoading] = useState(status === "loading")

  useEffect(() => {
    setIsLoading(status === "loading")
  }, [status])

  return {
    user: data?.user ?? null,
    isAuthenticated: !!data?.user,
    isLoading,
    signIn: (email: string, password: string) => nextSignIn("credentials", { email, password, redirect: false }),
    signOut: () => nextSignOut({ redirect: false }),
  }
}
