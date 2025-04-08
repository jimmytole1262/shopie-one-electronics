"use client"

import { Toaster as SonnerToaster } from "sonner"
import { useEffect, useState } from "react"

export function Toaster() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <SonnerToaster 
      position="top-right"
      toastOptions={{
        style: {
          background: "white",
          color: "black",
          border: "1px solid #E2E8F0",
          borderRadius: "0.5rem",
        },
        className: "shadow-lg",
        duration: 3000,
      }}
      closeButton
      richColors
    />
  )
}
