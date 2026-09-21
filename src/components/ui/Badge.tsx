import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400",
        {
          "bg-teal-400/10 text-teal-400 border border-teal-400/20": variant === "default",
          "bg-navy-700 text-slate-300 border border-navy-600": variant === "secondary",
          "text-slate-300 border border-navy-600": variant === "outline",
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20": variant === "success",
          "bg-amber-500/10 text-amber-400 border border-amber-500/20": variant === "warning",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
