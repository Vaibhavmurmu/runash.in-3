import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
// import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
// import { AuthProvider } from "@/lib/auth/auth-context"
// import { I18nProvider } from "@/lib/i18n/context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RunAsh AI Pay - Smart UPI Payments",
  description:
    "AI-powered UPI payment app with liquid glass design. Send money, pay bills, and manage finances with ease.",
  keywords: ["UPI", "payments", "AI", "fintech", "mobile payments", "digital wallet"],
  authors: [{ name: "RunAsh Team" }],
  creator: "RunAsh",
  publisher: "RunAsh",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL) : undefined,
  openGraph: {
    title: "RunAsh AI Pay - Smart UPI Payments",
    description: "AI-powered UPI payment app with liquid glass design",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://runash-pay.vercel.app",
    siteName: "RunAsh AI Pay",
    images: [
      {
        url: "/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "RunAsh AI Pay",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RunAsh AI Pay - Smart UPI Payments",
    description: "AI-powered UPI payment app with liquid glass design",
    images: ["/placeholder-logo.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RunAsh AI Pay",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/placeholder-logo.png" />
        <link rel="apple-touch-icon" href="/placeholder-logo.png" />
        <meta name="theme-color" content="#f97316" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RunAsh AI Pay" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {/*  <I18nProvider> */}
          {/*  <AuthProvider> */}
              {children}
              <Toaster />
          {/*  </AuthProvider> */}
          {/*  </I18nProvider> */}
        </ThemeProvider>
      </body>
    </html>
  )
  }
