"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from "@/components/ui/card"
import { ArrowRight, ChevronRight, Trash2 } from "lucide-react"
import EditProfileDialog from "@/components/profile/EditProfileDialog"
import { useRouter } from "next/navigation"

type User = {
  id: number
  email: string
  name?: string | null
  username?: string | null
  platforms?: string[] | null
  content_types?: string[] | null
  role?: string | null
  created_at?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const emailFromStorage = typeof window !== "undefined" ? window.localStorage.getItem("runash_registered_email") : null

  const fetchUser = async () => {
    setLoading(true)
    setError(null)
    try {
      const emailQuery = emailFromStorage ? `?email=${encodeURIComponent(emailFromStorage)}` : ""
      const res = await fetch(`/api/profile/me${emailQuery}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body?.message || `Failed to load profile (${res.status})`)
        setUser(null)
      } else {
        const body = await res.json()
        setUser(body.user ?? null)
      }
    } catch (err) {
      setError("Network error while loading profile")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSaved = (updated: User) => {
    setUser(updated)
    setShowEdit(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            Back home
          </Button>
        </div>
      </div>

      {error && <div className="text-sm text-red-600 mb-4">{error}</div>}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your basic account information and choose quick links.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : user ? (
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                  {/* Placeholder avatar — you can replace with uploaded avatar logic */}
                  <div className="text-2xl font-bold text-orange-600">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{user.name ?? "No name set"}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  <div className="mt-1 text-sm">
                    <span className="text-xs text-muted-foreground mr-2">username:</span>
                    <span className="font-medium">{user.username ?? "not set"}</span>
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="text-xs text-muted-foreground mr-2">role:</span>
                    <span className="font-medium">{user.role ?? "user"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <Button onClick={() => setShowEdit(true)}>Edit profile</Button>
                <Button variant="outline" onClick={() => router.push("/profile/settings")}>Settings</Button>
              </div>
            </div>
          ) : (
            <div>No profile found. Please register or sign in.</div>
          )}
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md" onClick={() => router.push("/dashboard")}>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Streaming Dashboard</div>
              <div className="text-sm text-muted-foreground">Go live, manage streams, analytics</div>
            </div>
            <ChevronRight />
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md" onClick={() => router.push("/chat")}>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="font-semibold">RunAsh Chat</div>
              <div className="text-sm text-muted-foreground">Ask the AI, manage chat commands</div>
            </div>
            <ChevronRight />
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md" onClick={() => router.push("/grocery")}>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="font-semibold">RunAsh Store (Grocery)</div>
              <div className="text-sm text-muted-foreground">Manage orders and storefront</div>
            </div>
            <ChevronRight />
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md"
          onClick={() => {
            // Seller route can be role-guarded in real apps
            router.push("/seller/dashboard")
          }}
        >
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Seller Dashboard</div>
              <div className="text-sm text-muted-foreground">Products, orders, live shopping</div>
            </div>
            <ChevronRight />
          </CardContent>
        </Card>
      </div>

      <EditProfileDialog user={user} open={showEdit} onClose={() => setShowEdit(false)} onSaved={onSaved} />
    </div>
  )
}
