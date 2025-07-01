import type * as React from "react"
import { cn } from "@/lib/utils"

interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep: number
}

export function Steps({ currentStep, className, ...props }: StepsProps) {
  return <div className={cn("flex w-full", className)} {...props} />
}

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title?: string
}

export function Step({ icon, title, className, ...props }: StepProps) {
  return (
    <div className={cn("flex-1 relative", className)} {...props}>
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
          {icon}
        </div>
      </div>
      {title && <div className="mt-2 text-xs text-center font-medium">{title}</div>}
    </div>
  )
}

Steps.displayName = "Steps"
Step.displayName = "Step"
