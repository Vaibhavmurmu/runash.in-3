"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const glassButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "glass-morphism text-orange-900 hover:bg-white/30 hover:scale-105",
        orange: "glass-orange text-white hover:bg-orange-500/30 hover:scale-105",
        yellow: "glass-yellow text-orange-900 hover:bg-yellow-500/30 hover:scale-105",
        white: "glass-white text-orange-900 hover:bg-white/40 hover:scale-105",
        subtle: "glass-subtle text-orange-800 hover:bg-white/20 hover:scale-105",
        solid:
          "bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 hover:scale-105 shadow-lg",
        outline: "border-2 border-orange-400 text-orange-600 hover:bg-orange-50 hover:scale-105",
        ghost: "text-orange-600 hover:bg-orange-100 hover:text-orange-700",
        secondary: "bg-white/20 text-orange-900 hover:bg-white/30 hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
      },
      effect: {
        none: "",
        shimmer: "shimmer",
        glow: "pulse-glow",
        float: "floating-animation",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      effect: "none",
    },
  },
)

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, effect, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(glassButtonVariants({ variant, size, effect, className }))} ref={ref} {...props} />
  },
)
GlassButton.displayName = "GlassButton"

export { GlassButton, glassButtonVariants }
