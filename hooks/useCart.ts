"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { toast } from "sonner";

// Define types for cart items
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  [key: string]: any; // Allow for additional properties
}

// Define the cart context type
interface CartContextType {
  items: CartItem[];
  totalItems: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateItemQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  isItemInCart: (id: number) => boolean;
  totalPrice: () => number;
}

// Create default values for the context
const defaultCartContext: CartContextType = {
  items: [],
  totalItems: 0,
  addItem: () => {},
  removeItem: () => {},
  updateItemQuantity: () => {},
  clearCart: () => {},
  isItemInCart: () => false,
  totalPrice: () => 0
};

// Create the cart context
const CartContext = createContext<CartContextType>(defaultCartContext);

interface CartProviderProps {
  children: React.ReactNode;
}

// Provider component that wraps the app and provides cart functionality
export function CartProvider({ children }: CartProviderProps): React.ReactElement {
  // State for cart items
  const [items, setItems] = useState<CartItem[]>([]);
  // State to track if component is mounted (client-side)
  const [mounted, setMounted] = useState(false);
  
  // Calculate total items in cart
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        // Reset if corrupt
        localStorage.removeItem("cart");
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, mounted]);
  
  // Add item to cart
  const addItem = (item: CartItem) => {
    // Ensure item has the right structure
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      quantity: 1,
      // Copy any other properties
      ...Object.keys(item).reduce((acc, key) => {
        if (!['id', 'name', 'price', 'image', 'category', 'quantity'].includes(key)) {
          acc[key] = item[key];
        }
        return acc;
      }, {} as Record<string, any>)
    };

    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.id === cartItem.id);
      
      if (existingItemIndex > -1) {
        // Item exists, increment quantity
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = (existingItem.quantity || 1) + 1;
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity
        };
        
        // Only show one notification
        toast.success(`${cartItem.name} quantity updated to ${newQuantity}`, {
          id: `cart-item-${cartItem.id}`, // Use a consistent ID to prevent duplicates
        });
        
        return updatedItems;
      } else {
        // Item doesn't exist, add it with quantity 1
        toast.success(`${cartItem.name} added to cart`, {
          id: `cart-item-${cartItem.id}`, // Use a consistent ID to prevent duplicates
        });
        return [...prevItems, cartItem];
      }
    });
  };
  
  // Remove item from cart
  const removeItem = (id: number) => {
    const itemToRemove = items.find(item => item.id === id);
    if (itemToRemove) {
      toast.info(`${itemToRemove.name} removed from cart`, {
        id: `cart-item-${id}`, // Use a consistent ID to prevent duplicates
      });
    }
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  // Update item quantity
  const updateItemQuantity = (id: number, quantity: number) => {
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    // If quantity is 0 or less, remove the item
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
    
    toast.success(`Updated ${item.name} quantity to ${quantity}`, {
      id: `cart-item-${id}`, // Use a consistent ID to prevent duplicates
    });
  };
  
  // Calculate total price
  const totalPrice = () => {
    return items.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  };
  
  // Clear cart
  const clearCart = () => {
    setItems([]);
    toast.info("Cart has been cleared", {
      id: 'clear-cart', // Use a consistent ID to prevent duplicates
    });
  };
  
  // Check if item is in cart
  const isItemInCart = (id: number) => {
    return items.some(item => item.id === id);
  };
  
  // Create the context value object
  const contextValue: CartContextType = {
    items,
    totalItems,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    isItemInCart,
    totalPrice
  };
  
  // Return empty cart during SSR to prevent hydration mismatch
  if (!mounted) {
    return React.createElement(
      CartContext.Provider,
      { value: defaultCartContext },
      children
    );
  }
  
  return React.createElement(
    CartContext.Provider,
    { value: contextValue },
    children
  );
}

// Custom hook to use the cart context
export function useCart(): CartContextType {
  return useContext(CartContext);
}