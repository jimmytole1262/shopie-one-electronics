"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, updateItemQuantity, totalPrice } = useCart();

  // Client-side only code
  useEffect(() => {
    // Use requestAnimationFrame to avoid React setState during render
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    
    return () => cancelAnimationFrame(frame);
  }, []);

  // Handle checkout
  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      return;
    }
    
    try {
      // Store cart items in localStorage to preserve them during navigation
      if (typeof window !== 'undefined') {
        // Make sure we're storing valid JSON by creating a clean copy of the items
        const cleanItems = items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category || "Unknown"
        }));
        
        localStorage.setItem('checkout_cart_items', JSON.stringify(cleanItems));
      }
      
      // Redirect directly to payment page
      router.push('/payment');
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Prevent hydration errors by returning a skeleton during SSR
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <ShoppingCart className="h-8 w-8 text-slate-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = totalPrice();
  const shipping = 250; // Fixed shipping cost
  const tax = Math.round(subtotal * 0.16); // 16% VAT
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="flex-grow">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Cart Items ({items.length})</h2>
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="py-4 flex items-center">
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        KES {item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Decrease</span>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="mx-2 text-gray-700">{item.quantity}</span>
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Increase</span>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
                        </svg>
                      </button>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 rounded-full text-red-400 hover:text-red-500"
                      >
                        <span className="sr-only">Remove</span>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">KES {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">KES {shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (16%)</span>
                <span className="font-medium">KES {tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">KES {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
