"use client"

import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/hooks/use-cart"

export default function CartIcon() {
  const router = useRouter()
  const { toast } = useToast()
  const { items } = useCart()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const cartItemCount = isMounted ? items.length : 0

  const handleCartClick = () => {
    if (cartItemCount === 0) {
      toast({
        title: "Your cart is empty",
        description: "Add some items to your cart first",
        variant: "destructive",
      })
      return
    }
    router.push("/cart")
  }

  return (
    <Button onClick={handleCartClick} variant="ghost" size="icon" className="relative" aria-label="Shopping cart">
      <ShoppingCart className="h-5 w-5" />
      {cartItemCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">
          {cartItemCount}
        </Badge>
      )}
    </Button>
  )
}

