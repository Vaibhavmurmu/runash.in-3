"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {}

export function MainNav({ className, ...props }: MainNavProps) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/analytics",
      label: "Analytics",
      active: pathname?.startsWith("/analytics"),
    },
    {
      href: "/stream",
      label: "Stream",
      active: pathname === "/stream",
    },
    {
      href: "/recordings",
      label: "Recordings",
      active: pathname === "/recordings",
    },
    {
      href: "/schedule",
      label: "Schedule",
      active: pathname === "/schedule",
    },
  ]

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-black dark:text-white" : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
