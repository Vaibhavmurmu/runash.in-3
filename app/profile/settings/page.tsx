"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfileSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleChangePassword = async () => {
    // Implement secure change password endpoint server-side — placeholder here
    setChangingPassword(true)
    try {
      // TODO: call /api/auth/change-password to verify current password and set new password
      await new Promise((r) => setTimeout(r, 800))
      alert("Password change simulated — implement server-side endpoint to make this real.")
      setCurrentPassword("")
      setNewPassword("")
    } finally {
      setChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Delete your account? This is irreversible.")) return
    setDeleting(true)
    try {
      const email = typeof window !== "undefined" ? window.localStorage.getItem("runash_registered_email") : null
      if (!email) {
        alert("Unable to find your email locally — sign in again.")
        setDeleting(false)
        return
      }
      const res = await fetch("/api/profile/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        alert("Account deleted. Redirecting to home.")
        // clear local storage keys used by the app
        window.localStorage.removeItem("runash_registered_email")
        window.localStorage.removeItem("runash_user_type")
        router.push("/")
      } else {
        const body = await res.json().catch(() => ({}))
        alert(body?.message || `Failed to delete account (${res.status})`)
      }
    } catch (err) {
      alert("Network error deleting account")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose your notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-medium">Email notifications</div>
              <div className="text-sm text-muted-foreground">Receive product updates and messages</div>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">SMS notifications</div>
              <div className="text-sm text-muted-foreground">Receive urgent alerts by SMS</div>
            </div>
            <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Change your password or manage sign-in methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            <div>
              <Label>Current password</Label>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div>
              <Label>New password</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleChangePassword} disabled={changingPassword}>
                {changingPassword ? "Updating..." : "Change password"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>Delete your account and data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Delete account</div>
              <div className="text-sm text-muted-foreground">This action cannot be undone.</div>
            </div>
            <div>
              <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
                <Trash className="mr-2 h-4 w-4" />
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
