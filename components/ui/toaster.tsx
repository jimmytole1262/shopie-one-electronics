"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
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
    />
  )
}
