"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import { formatKesPrice } from "@/lib/utils";

export default function ClientCart() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, updateItemQuantity, clearCart, totalPrice } = useCart();

  // Client-side only code
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration errors by returning null during SSR
  if (!isMounted) {
    return null;
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
          <ShoppingCart className="h-8 w-8 text-slate-500" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/">
          <Button className="bg-orange-500 hover:bg-orange-600">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  // Calculate derived values
  const subtotal = totalPrice();
  const shipping = items.length > 0 ? 9.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  
  // Convert to KES for display
  const kesSubtotal = subtotal * 130;
  const kesShipping = shipping * 130;
  const kesTax = tax * 130;
  const kesTotal = total * 130;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <div className="grid grid-cols-12 gap-4 font-semibold">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Total</div>
            </div>
          </div>

          {items.map((item) => (
            <div key={item.id} className="p-4 border-b">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-6 flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden">
                    <Image 
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  {formatKesPrice(item.price)}
                </div>
                <div className="col-span-2 flex justify-center items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="col-span-1 text-center">
                  {formatKesPrice(item.price * item.quantity)}
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="p-4 flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
            <Button 
              variant="outline" 
              className="text-red-500 hover:text-red-700 hover:bg-red-50 hover:border-red-100"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatKesPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{formatKesPrice(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (8%)</span>
              <span>{formatKesPrice(tax)}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatKesPrice(total)}</span>
              </div>
            </div>
          </div>
          <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
