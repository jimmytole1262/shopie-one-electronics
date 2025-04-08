"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
// Remove toast import to prevent double notifications

// Define types for wishlist items
export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  [key: string]: any; // Allow for additional properties
}

// Define the wishlist context type
interface WishlistContextType {
  items: WishlistItem[];
  totalItems: number;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  clearWishlist: () => void;
  isItemInWishlist: (id: number) => boolean;
}

// Create default values for the context
const defaultWishlistContext: WishlistContextType = {
  items: [],
  totalItems: 0,
  addItem: () => {},
  removeItem: () => {},
  clearWishlist: () => {},
  isItemInWishlist: () => false
};

// Create the wishlist context
const WishlistContext = createContext<WishlistContextType>(defaultWishlistContext);

interface WishlistProviderProps {
  children: React.ReactNode;
}

// Provider component that wraps the app and provides wishlist functionality
export function WishlistProvider({ children }: WishlistProviderProps): React.ReactElement {
  // State for wishlist items
  const [items, setItems] = useState<WishlistItem[]>([]);
  // State to track if component is mounted (client-side)
  const [mounted, setMounted] = useState(false);
  
  // Calculate total items in wishlist
  const totalItems = items.length;
  
  // Load wishlist from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      try {
        const parsedWishlist = JSON.parse(storedWishlist);
        if (Array.isArray(parsedWishlist)) {
          setItems(parsedWishlist);
        }
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error);
        // Reset if corrupt
        localStorage.removeItem("wishlist");
      }
    }
  }, []);
  
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("wishlist", JSON.stringify(items));
    }
  }, [items, mounted]);
  
  // Add item to wishlist
  const addItem = (item: WishlistItem) => {
    // Ensure item has the right structure
    const wishlistItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      // Copy any other properties
      ...Object.keys(item).reduce((acc, key) => {
        if (!['id', 'name', 'price', 'image', 'category'].includes(key)) {
          acc[key] = item[key];
        }
        return acc;
      }, {} as Record<string, any>)
    };

    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.id === wishlistItem.id);
      
      if (existingItemIndex > -1) {
        // Item already exists in wishlist, remove it (toggle behavior)
        // Removed toast notification to prevent duplicates
        return prevItems.filter(item => item.id !== wishlistItem.id);
      } else {
        // Item doesn't exist, add it
        // Removed toast notification to prevent duplicates
        return [...prevItems, wishlistItem];
      }
    });
  };
  
  // Remove item from wishlist
  const removeItem = (id: number) => {
    const itemToRemove = items.find(item => item.id === id);
    // Removed toast notification to prevent duplicates
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  // Clear wishlist
  const clearWishlist = () => {
    setItems([]);
    // Removed toast notification to prevent duplicates
  };
  
  // Check if item is in wishlist
  const isItemInWishlist = (id: number) => {
    return items.some(item => item.id === id);
  };
  
  // Create the context value object
  const contextValue: WishlistContextType = {
    items,
    totalItems,
    addItem,
    removeItem,
    clearWishlist,
    isItemInWishlist
  };
  
  // Return empty wishlist during SSR to prevent hydration mismatch
  if (!mounted) {
    return React.createElement(
      WishlistContext.Provider,
      { value: defaultWishlistContext },
      children
    );
  }
  
  return React.createElement(
    WishlistContext.Provider,
    { value: contextValue },
    children
  );
}

// Custom hook to use the wishlist context
export function useWishlist(): WishlistContextType {
  return useContext(WishlistContext);
}
