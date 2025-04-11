"use client";

import { CartProvider } from "@/hooks/useCart";
import { WishlistProvider } from "@/hooks/useWishlist";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import React, { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps): React.ReactElement {
  const [mounted, setMounted] = useState(false);

  // Use requestAnimationFrame to avoid React setState during render issues
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  // Only render the actual content when mounted
  if (!mounted) {
    // Return a placeholder with the same structure to avoid layout shifts
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <CartProvider>
        <WishlistProvider>
          {children}
          {/* Moved Toaster here to avoid issues with multiple toaster instances */}
          <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{
              duration: 3000,
              className: "toast-custom-class",
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
