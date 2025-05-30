"use client";

import React, { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { InventoryProvider } from "@/hooks/useInventoryFixed";
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Providers } from "./providers"
import ErrorSuppressor from "@/components/error-suppressor"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Define admin email as a constant to ensure consistency
  const ADMIN_EMAIL = 'jimmytole1262@gmail.com';

  useEffect(() => {
    // Use requestAnimationFrame to avoid React setState during render issues
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    
    const checkAdminStatus = async () => {
      try {
        // Check if user is logged in with Clerk
        const userResponse = await fetch('/api/auth/session');
        const userData = await userResponse.json();
        
        // STRICT: Only set isAdmin to true if the email is exactly jimmytole1262@gmail.com
        const userEmail = userData.user?.emailAddresses?.[0]?.emailAddress;
        if (userEmail === ADMIN_EMAIL) {
          console.log('Admin access granted in layout');
          setIsAdmin(true);
        } else {
          console.log('Not admin in layout:', userEmail);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Failed to check admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
    
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <ClerkProvider>
          <Providers>
            <InventoryProvider>
              <ErrorSuppressor />
              <div className="flex min-h-screen flex-col" suppressHydrationWarning={true}>
                <Header>
                  {isMounted && isAdmin && (
                    <Link
                      href="/seller-dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Seller Dashboard
                    </Link>
                  )}
                </Header>
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </InventoryProvider>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}