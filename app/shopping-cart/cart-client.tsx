"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Trash, Plus, Minus, ChevronRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { formatKesPrice } from "@/lib/utils";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useInventory } from "@/hooks/useInventoryFixed";

export default function CartClient() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, updateItemQuantity, clearCart, totalPrice } = useCart();
  const { isSignedIn, isLoaded } = useUser();
  const { getStock, updateStock, refreshInventory } = useInventory();
  const [inventoryValid, setInventoryValid] = useState(true);

  // Client-side only code
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check inventory validity whenever cart items change
  useEffect(() => {
    if (isMounted) {
      const checkInventory = async () => {
        await validateInventory();
      };
      checkInventory();
    }
  }, [items, isMounted]);

  // Validate that all items in cart have sufficient inventory
  const validateInventory = async () => {
    let valid = true;
    
    for (const item of items) {
      const availableStock = getStock(item.id);
      if (availableStock < item.quantity) {
        valid = false;
        toast.error(`Not enough stock for ${item.name}. Only ${availableStock} available.`, {
          id: `inventory-check-${item.id}`,
          duration: 5000,
        });
      }
    }
    
    setInventoryValid(valid);
    return valid;
  };

  // Prevent hydration errors by returning null during SSR
  if (!isMounted) {
    return null;
  }

  const handleCheckout = async () => {
    // Check if user is logged in
    if (!isSignedIn) {
      toast.error("Please sign in to proceed to checkout", {
        id: "checkout-auth-required",
        duration: 3000,
      });
      return;
    }

    // Validate inventory before checkout
    if (!await validateInventory()) {
      return;
    }

    // Show loading toast
    toast.loading("Processing your order...", {
      id: "checkout-processing",
      duration: 10000,
    });

    // Process inventory updates for all items
    let allUpdatesSuccessful = true;
    const updatePromises: Promise<boolean>[] = [];
    
    for (const item of items) {
      const promise = updateStock(item.id, item.quantity)
        .catch(error => {
          console.error(`Failed to update stock for item ${item.id}:`, error);
          return false;
        });
      updatePromises.push(promise);
    }
    
    // Wait for all inventory updates to complete
    const results = await Promise.all(updatePromises);
    allUpdatesSuccessful = results.every(result => result === true);

    // Dismiss loading toast
    toast.dismiss("checkout-processing");

    if (!allUpdatesSuccessful) {
      toast.error("Some items in your cart are no longer available in the requested quantity", {
        id: "checkout-inventory-error",
        duration: 3000,
      });
      
      // Refresh inventory to get latest stock levels
      await refreshInventory();
      // Check inventory again but don't use the result here
      validateInventory().catch(error => {
        console.error("Error validating inventory:", error);
      });
      return;
    }

    // If all inventory updates are successful, proceed to checkout
    toast.success("Order placed successfully! Redirecting to payment...", {
      id: "checkout-success",
      duration: 2000,
    });
    
    // Clear the cart after successful checkout
    clearCart();

    // Redirect to payment page
    setTimeout(() => {
      window.location.href = "/payment";
    }, 2000);
  };

  // Handle quantity increase with inventory check
  const handleIncreaseQuantity = async (id: number, currentQuantity: number) => {
    const availableStock = getStock(id);
    
    if (currentQuantity < availableStock) {
      updateItemQuantity(id, currentQuantity + 1);
    } else {
      const item = items.find(item => item.id === id);
      toast.error(`Sorry, only ${availableStock} units of ${item?.name} available`, {
        id: `max-quantity-${id}`,
        duration: 2000,
      });
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6">
          <ShoppingCart className="h-10 w-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-semibold mb-3">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. 
          Browse our products and find something you'll love!
        </p>
        <Link href="/">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-medium inline-flex items-center"
          >
            Start Shopping
            <ChevronRight className="ml-2 h-4 w-4" />
          </motion.button>
        </Link>
      </motion.div>
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid md:grid-cols-3 gap-8"
    >
      <div className="md:col-span-2">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Total</div>
            </div>
          </div>

          <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 border-b"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                      {item.image ? (
                        <Image 
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full">
                          <ShoppingCart className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
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
                    <motion.button 
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      whileTap={{ scale: 0.95 }}
                      className="px-2 py-1"
                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </motion.button>
                    <span className="px-3 py-1 border-x">{item.quantity}</span>
                    <motion.button 
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      whileTap={{ scale: 0.95 }}
                      className="px-2 py-1"
                      onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                    >
                      <Plus className="h-3 w-3" />
                    </motion.button>
                  </div>
                  <div className="col-span-1 text-center font-medium">
                    {formatKesPrice(item.price * item.quantity)}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <motion.button 
                      whileHover={{ scale: 1.1, color: "#ef4444" }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => {
                        removeItem(item.id);
                        toast.success(`${item.name} removed from cart`);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="p-4 flex justify-between">
            <Link href="/">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 inline-flex items-center"
              >
                <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                Continue Shopping
              </motion.button>
            </Link>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "#fee2e2", borderColor: "#f87171", color: "#ef4444" }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-gray-300 rounded-md hover:text-red-500 hover:border-red-300 hover:bg-red-50"
              onClick={() => {
                clearCart();
                toast.success("Cart cleared");
              }}
            >
              Clear Cart
            </motion.button>
          </div>
        </div>
      </div>

      <div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6 sticky top-24"
        >
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
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="border-t pt-3 mt-3"
            >
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-lg">{formatKesPrice(total)}</span>
              </div>
            </motion.div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full mt-6 py-3 rounded-md font-medium flex items-center justify-center ${
              isSignedIn && inventoryValid 
                ? "bg-orange-500 hover:bg-orange-600 text-white" 
                : "bg-gray-300 cursor-not-allowed text-gray-600"
            }`}
            onClick={handleCheckout}
            disabled={!isSignedIn || !inventoryValid}
          >
            {isSignedIn ? (
              <>
                {inventoryValid ? "Proceed to Checkout" : "Some Items Unavailable"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Sign in to Checkout
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </motion.button>
          
          <div className="mt-6 text-sm text-gray-500">
            <p className="flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure Checkout
            </p>
            <div className="flex justify-center space-x-2">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>PayPal</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
