"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "orange" | "yellow" | "white" | "subtle"
  effect?: "none" | "float" | "glow" | "shimmer" | "morph"
  glow?: boolean
  floating?: boolean
  shimmer?: boolean
  hover?: boolean
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", effect = "none", glow, floating, shimmer, hover, ...props }, ref) => {
    const baseClasses = "rounded-2xl border transition-all duration-300"

    const variantClasses = {
      default: "glass-morphism",
      orange: "glass-orange",
      yellow: "glass-yellow",
      white: "glass-white",
      subtle: "glass-subtle",
    }

    const effectClasses = {
      none: "",
      float: "floating-animation",
      glow: "pulse-glow",
      shimmer: "shimmer",
      morph: "morphing-border",
    }

    const conditionalClasses = cn(
      glow && "pulse-glow",
      floating && "floating-animation",
      shimmer && "shimmer",
      hover && "hover-lift",
    )

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], effectClasses[effect], conditionalClasses, className)}
        {...props}
      />
    )
  },
)
GlassCard.displayName = "GlassCard"

const GlassCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
GlassCardHeader.displayName = "GlassCardHeader"

const GlassCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent",
        className,
      )}
      {...props}
    />
  ),
)
GlassCardTitle.displayName = "GlassCardTitle"

const GlassCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
GlassCardDescription.displayName = "GlassCardDescription"

const GlassCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
GlassCardContent.displayName = "GlassCardContent"

const GlassCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
GlassCardFooter.displayName = "GlassCardFooter"

export { GlassCard, GlassCardHeader, GlassCardFooter, GlassCardTitle, GlassCardDescription, GlassCardContent }
