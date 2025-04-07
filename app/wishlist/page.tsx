"use client"

import { useWishlist } from "@/hooks/useWishlist"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useCart } from "@/hooks/useCart"
import { formatKesPrice } from "@/lib/utils"
import { toast } from "sonner"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({})

  // Client-side only code to prevent hydration errors
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleAddToCart = async (item: any) => {
    setIsLoading(prev => ({ ...prev, [item.id]: true }))
    try {
      // Add to cart using the store
      addItem({
        ...item,
        quantity: 1 // Add the required quantity property
      })
      // Remove from wishlist after adding to cart
      removeItem(item.id)
    } catch (error) {
      console.error('Failed to add to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setIsLoading(prev => ({ ...prev, [item.id]: false }))
    }
  }

  // During SSR, return a loading state to prevent hydration errors
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
        <div className="bg-slate-100 p-8 rounded-lg text-center">
          <p className="text-slate-500">Loading wishlist...</p>
        </div>
      </div>
    )
  }

  // Empty wishlist state
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
        <div className="bg-slate-100 p-8 rounded-lg text-center">
          <Heart className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-6">Add items to your wishlist to save them for later.</p>
          <Link href="/products">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Wishlist ({items.length})</h1>
        <Button 
          variant="outline" 
          className="text-red-500 border-red-500 hover:bg-red-50"
          onClick={clearWishlist}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Wishlist
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="border border-slate-200 rounded-lg overflow-hidden"
          >
            <div className="relative">
              <Link href={`/products/${item.id}`}>
                <div className="aspect-square relative overflow-hidden bg-slate-50">
                  <img
                    src={item.image || "/images/product-placeholder.svg"}
                    alt={item.name}
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                  />
                </div>
              </Link>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 rounded-full bg-red-100 text-red-500"
                onClick={() => removeItem(item.id)}
              >
                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                <span className="sr-only">Remove from wishlist</span>
              </Button>
            </div>

            <div className="p-4">
              <div className="text-sm text-muted-foreground mb-1">{item.category}</div>
              <Link href={`/products/${item.id}`} className="hover:underline">
                <h3 className="font-medium text-lg mb-2 line-clamp-1">{item.name}</h3>
              </Link>
              <div className="flex items-center gap-2 mb-4">
                <p className="font-semibold text-lg">{formatKesPrice(item.price)}</p>
                {item.discount && (
                  <p className="text-sm text-muted-foreground line-through">
                    {formatKesPrice(item.originalPrice || (item.price / (1 - item.discount / 100)))}
                  </p>
                )}
              </div>
              <Button 
                className="w-full gap-2 bg-orange-500 hover:bg-orange-600" 
                onClick={() => handleAddToCart(item)}
                disabled={isLoading[item.id]}
              >
                {isLoading[item.id] ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
                Move to Cart
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
