"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-orange-500">
              Shopie-one Electronics
            </Link>
          </div>
          <div className="ml-auto">
            <Link href="/">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-orange-500 text-orange-500 hover:bg-orange-50"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
