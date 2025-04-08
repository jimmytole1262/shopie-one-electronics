"use client"

import { ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

/**
 * A custom spinner component that uses ShoppingCart icon from lucide-react
 * This component is created to avoid issues with missing Loader/Loader2 icons
 */
export function Spinner({ className, size = "md" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <ShoppingCart 
      className={cn(
        "animate-spin text-gray-400", 
        sizeClasses[size],
        className
      )} 
    />
  )
}
