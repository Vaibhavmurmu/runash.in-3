"use client"

import { useEffect, useState } from "react"

type Props = {
  location?: {
    ip?: string
    city?: string
    country?: string
    country_name?: string
    language?: string
  } | null
}

export default function EnhancedNewsletterSignup({ location }: Props) {
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [consent, setConsent] = useState(true)

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(null), 6000)
      return () => clearTimeout(t)
    }
  }, [success])

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setError(null)
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email")
      return
    }
    setSubmitting(true)
    try {
      // submit to /api/newsletter — the API route can enrich with location/language
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          consent,
          location,
          timestamp: new Date().toISOString(),
        }),
      })
      setSuccess("Thanks — you're subscribed!")
      setEmail("")
    } catch (e) {
      setError("Subscription failed — please try again later")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900/40 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
      <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Get product updates & invites</h4>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
        Join our newsletter for release notes, early access invites, and pricing alerts. We send occasional emails only.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-md px-3 py-2 border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60"
        >
          {submitting ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      <div className="flex items-center gap-2 mt-3 text-sm">
        <input id="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} type="checkbox" />
        <label className="text-gray-600 dark:text-gray-300" htmlFor="consent">
          I agree to receive occasional product emails
        </label>
      </div>

      {success && <div className="mt-3 text-sm text-green-600 dark:text-green-400">{success}</div>}
      {error && <div className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</div>}

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Detected locale: <strong>{location?.country_name || "Unknown"}</strong> · Language: <strong>{location?.language || navigator.language}</strong>
      </div>
    </div>
  )
}
