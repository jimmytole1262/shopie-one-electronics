"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";

export default function CartButton() {
  const [isMounted, setIsMounted] = useState(false);
  const { totalItems } = useCart();
  const router = useRouter();
  
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
  
  const navigateToCart = () => {
    router.push('/cart');
  };

  return (
    <div className="relative">
      <div 
        onClick={navigateToCart}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors duration-300 cursor-pointer"
        role="button"
        aria-label="View cart"
      >
        <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-orange-500 transition-colors duration-300" />
      </div>
      
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-medium text-white shadow-md">
          {totalItems}
        </span>
      )}
    </div>
  );
}