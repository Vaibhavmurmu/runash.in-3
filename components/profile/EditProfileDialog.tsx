"use client"

import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"

type User = {
  id: number
  email: string
  name?: string | null
  username?: string | null
  platforms?: string[] | null
  content_types?: string[] | null
  role?: string | null
}

type Props = {
  user: User | null
  open: boolean
  onClose: () => void
  onSaved: (user: User) => void
}

export default function EditProfileDialog({ user, open, onClose, onSaved }: Props) {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [platforms, setPlatforms] = useState<string[]>([])
  const [contentTypes, setContentTypes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name ?? "")
      setUsername(user.username ?? "")
      setPlatforms(user.platforms ?? user.content_types ?? [])
      setContentTypes(user.content_types ?? [])
      setError(null)
      setUsernameAvailable(null)
    }
  }, [user, open])

  const toggleCheckbox = (listSetter: (v: any) => void, value: string, current: string[]) => {
    if (current.includes(value)) {
      listSetter(current.filter((x) => x !== value))
    } else {
      listSetter([...current, value])
    }
  }

  const checkUsername = async (u: string) => {
    if (!u || u.length < 3) {
      setUsernameAvailable(null)
      return
    }
    try {
      const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(u)}`)
      if (res.ok) {
        const body = await res.json()
        setUsernameAvailable(!body.taken)
      } else {
        setUsernameAvailable(null)
      }
    } catch {
      setUsernameAvailable(null)
    }
  }

  useEffect(() => {
    const t = setTimeout(() => {
      if (username) checkUsername(username)
    }, 500)
    return () => clearTimeout(t)
  }, [username])

  const handleSave = async () => {
    setError(null)
    setIsLoading(true)
    try {
      const registeredEmail = typeof window !== "undefined" ? window.localStorage.getItem("runash_registered_email") : null
      if (!registeredEmail && !user?.email) {
        setError("Unable to identify current user. Please sign in again.")
        setIsLoading(false)
        return
      }

      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registeredEmail ?? user?.email,
          name,
          username: username || null,
          platforms,
          contentTypes,
          role: user?.role ?? "user",
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body?.message || `Failed to save (${res.status})`)
      } else {
        const body = await res.json()
        onSaved(body.user)
        onClose()
      }
    } catch (err) {
      setError("Network error while saving profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) onClose() }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && <div className="text-sm text-red-600">{error}</div>}

          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label>Username</Label>
            <Input value={username ?? ""} onChange={(e) => setUsername(e.target.value)} />
            <div className="text-xs mt-1">
              {usernameAvailable === true && <span className="text-green-600">Username available</span>}
              {usernameAvailable === false && <span className="text-red-600">Username taken</span>}
              {usernameAvailable === null && <span className="text-muted-foreground">Choose a username (3-30 chars)</span>}
            </div>
          </div>

          <div>
            <Label className="mb-2">Streaming Platforms</Label>
            <div className="grid grid-cols-2 gap-2">
              {["Twitch", "YouTube", "Facebook", "Instagram"].map((p) => (
                <label key={p} className="flex items-center gap-2">
                  <Checkbox
                    checked={platforms.includes(p)}
                    onCheckedChange={(checked) => toggleCheckbox(setPlatforms, p, platforms)}
                    id={`edit-platform-${p}`}
                  />
                  <span className="text-sm">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2">Content types</Label>
            <div className="grid grid-cols-2 gap-2">
              {["Creative", "Selling", "Businesses", "IRL"].map((c) => (
                <label key={c} className="flex items-center gap-2">
                  <Checkbox
                    checked={contentTypes.includes(c)}
                    onCheckedChange={(checked) => toggleCheckbox(setContentTypes, c, contentTypes)}
                    id={`edit-content-${c}`}
                  />
                  <span className="text-sm">{c}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Saving...</> : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
