import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white dark:from-orange-950/20 dark:to-background">
        <Link href="/" className="absolute left-8 top-8 flex items-center text-lg font-bold">
          <div className="relative mr-2 h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-orange-500 to-amber-300">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold">R</div>
          </div>
          RunAsh
        </Link>

        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-4 p-4 md:grid-cols-2 md:gap-8">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Welcome back to RunAsh AI</h1>
              <p className="text-muted-foreground md:text-xl">
                Sign in to your account to continue your AI-powered streaming journey
              </p>
            </div>
            <div className="hidden md:block">
              <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-gradient-to-br from-orange-500 to-amber-300 p-1">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="max-w-md text-center text-white">
                    <div className="mb-4 text-4xl font-bold">Elevate Your Streams</div>
                    <p className="text-lg">Access your dashboard, manage streams, and connect with your audience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
