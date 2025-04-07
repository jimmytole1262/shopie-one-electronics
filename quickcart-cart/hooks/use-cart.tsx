"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { toast } from "@/components/ui/use-toast"

export interface CartItem {
  id: string
  name: string
  price: number
  image?: string
  quantity: number
  description?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (data: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (data: CartItem) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.id === data.id)

        if (existingItem) {
          // If item exists, update quantity
          return set({
            items: currentItems.map((item) => {
              if (item.id === data.id) {
                return {
                  ...item,
                  quantity: item.quantity + 1,
                }
              }
              return item
            }),
          })
        }

        // If item doesn't exist, add it
        set({ items: [...currentItems, { ...data, quantity: 1 }] })
        toast({
          title: "Item added to cart",
          description: `${data.name} has been added to your cart.`,
        })
      },
      removeItem: (id: string) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        })
        toast({
          title: "Item removed",
          description: "Item has been removed from your cart.",
          variant: "destructive",
        })
      },
      updateQuantity: (id: string, quantity: number) => {
        set({
          items: get().items.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                quantity,
              }
            }
            return item
          }),
        })
      },
      clearCart: () => {
        set({ items: [] })
        toast({
          title: "Cart cleared",
          description: "All items have been removed from your cart.",
          variant: "destructive",
        })
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

