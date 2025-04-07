"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";

export default function CartIcon() {
  const [isMounted, setIsMounted] = useState(false);
  const { totalItems } = useCart();
  
  // Client-side only code to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Prevent hydration errors by returning a simple loading state during SSR
  if (!isMounted) {
    return (
      <div className="relative">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full">
          <ShoppingCart className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <Link href="/cart">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors duration-300">
          <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-orange-500 transition-colors duration-300" />
        </div>
      </Link>
      
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-medium text-white shadow-md">
          {totalItems}
        </span>
      )}
    </div>
  );
}
