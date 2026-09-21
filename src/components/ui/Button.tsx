import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "danger" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-teal-400 text-navy-900 hover:bg-teal-400/90 hover:shadow-[0_0_15px_rgba(100,255,218,0.3)]": variant === "default",
            "border border-teal-400/30 text-teal-400 hover:bg-teal-400/10": variant === "outline",
            "hover:bg-navy-800 text-slate-300 hover:text-white": variant === "ghost",
            "bg-red-500/10 text-red-500 hover:bg-red-500/20": variant === "danger",
            "bg-navy-700 text-white hover:bg-navy-600": variant === "secondary",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
