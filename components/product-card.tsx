"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart, Loader2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/animated-button"
import { formatKesPrice } from "@/lib/utils"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  featured?: boolean
  isNew?: boolean
  discount?: number
  isPopular?: boolean
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { addItem } = useCart();
  const { addItem: addToWishlist, isItemInWishlist } = useWishlist();
  
  // Client-side only code to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // Add to cart using the store - convert Product to CartItem
      addItem({
        ...product,
        quantity: 1 // Add the required quantity property
      });
      // Toast notification is now handled in the useCart hook
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
  };

  // During SSR, return a simpler version to prevent hydration errors
  if (!isMounted) {
    return (
      <div className="overflow-hidden border border-slate-200 rounded-lg group">
        <div className="border-0 shadow-none">
          <div className="relative">
            <div className="aspect-square relative overflow-hidden bg-slate-50"></div>
          </div>
          <div className="p-4">
            <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
            <h3 className="font-medium text-lg mb-2 line-clamp-1">{product.name}</h3>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-lg">KSh {product.price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="overflow-hidden border border-slate-200 rounded-lg group" suppressHydrationWarning>
      <Card className="border-0 shadow-none">
      <div className="relative" suppressHydrationWarning>
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square relative overflow-hidden bg-slate-50">
            <img
              src={product.image || "/images/product-placeholder.svg"}
              alt={product.name}
              className="object-cover w-full h-full transition-transform group-hover:scale-105"
            />
          </div>
        </Link>

        {product.isNew && <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">New</Badge>}

        {product.discount && (
          <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>
        )}

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-2 right-2"
        >
          <Button
            size="icon"
            variant="ghost"
            className={`rounded-full ${isItemInWishlist(product.id) ? 'bg-red-100 text-red-500' : 'bg-white/80 hover:bg-white'} transition-all`}
            onClick={handleAddToWishlist}
          >
            <Heart className={`h-5 w-5 ${isItemInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-700'}`} />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </motion.div>
      </div>

      <CardContent className="p-4" suppressHydrationWarning>
        <div className="text-sm text-muted-foreground mb-1" suppressHydrationWarning>{product.category}</div>
        <Link href={`/products/${product.id}`} className="hover:underline">
          <h3 className="font-medium text-lg mb-2 line-clamp-1">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2">
          {product.discount ? (
            <>
              <p className="font-semibold text-lg">
                {formatKesPrice((product.price * (100 - product.discount)) / 100)}
              </p>
              <p className="text-sm text-muted-foreground line-through">
                {formatKesPrice(product.price)}
              </p>
            </>
          ) : (
            <p className="font-semibold text-lg">{formatKesPrice(product.price)}</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0" suppressHydrationWarning>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full"
          suppressHydrationWarning
        >
          <AnimatedButton 
            className="w-full gap-2 bg-orange-500 hover:bg-orange-600 transition-all duration-300" 
            onClick={handleAddToCart}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {!isLoading && (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: isLoading ? 360 : 0 }}
                transition={{ duration: 0.5 }}
                className="mr-1"
              >
                <ShoppingCart className="h-4 w-4" />
              </motion.div>
            )}
            Add to cart
          </AnimatedButton>
        </motion.div>
      </CardFooter>
    </Card>
    </motion.div>
  )
}
