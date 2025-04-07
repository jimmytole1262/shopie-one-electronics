"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  discount?: number;
  isPopular?: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create(
  persist<CartStore>(
    (set, get) => ({
      // Initialize with empty state to prevent hydration mismatch
      items: [],
      
      addItem: (product: Product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.product.id === product.id);
        
        if (existingItem) {
          // If item already exists, increase quantity
          set({
            items: currentItems.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // If item doesn't exist, add it with quantity 1
          set({
            items: [...currentItems, { product, quantity: 1 }],
          });
        }
        
        // State is automatically persisted by zustand/persist
      },
      
      removeItem: (productId: number) => {
        const currentItems = get().items;
        const updatedItems = currentItems.filter(item => item.product.id !== productId);
        
        set({ items: updatedItems });
        
        // State is automatically persisted by zustand/persist
      },
      
      updateQuantity: (productId: number, quantity: number) => {
        const currentItems = get().items;
        let updatedItems;
        
        if (quantity <= 0) {
          // If quantity is 0 or negative, remove the item
          updatedItems = currentItems.filter(item => item.product.id !== productId);
          set({ items: updatedItems });
        } else {
          // Otherwise update the quantity
          updatedItems = currentItems.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          );
          set({ items: updatedItems });
        }
        
        // State is automatically persisted by zustand/persist
      },
      
      clearCart: () => {
        set({ items: [] });
        
        // State is automatically persisted by zustand/persist
      },
      
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      totalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'shopie-one-storage', // name of the item in localStorage
      skipHydration: true, // Skip hydration to prevent hydration mismatch errors
    }
  )
);
