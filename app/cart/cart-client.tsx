"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash, Minus, Plus, ChevronRight, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/useCart"
import { toast } from "sonner"

export default function CartClient() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const { items, removeItem, updateItemQuantity, clearCart, totalPrice } = useCart()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
          <ShoppingCart className="h-8 w-8 text-slate-500" />
        </div>
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Add some items to your cart to see them here</p>
        <Button onClick={() => router.push("/")} className="bg-orange-500 hover:bg-orange-600">
          Continue Shopping
        </Button>
      </div>
    )
  }

  // Calculate cart totals
  const subtotal = totalPrice()
  const shipping = 500.0
  const tax = subtotal * 0.16
  const total = subtotal + shipping + tax

  const handleCheckout = () => {
    // Navigate to the payment page
    router.push('/payment')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" suppressHydrationWarning>
      <div className="lg:col-span-2">
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-40 h-40">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/products/${item.id}`} className="font-semibold hover:underline">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold">KSh {(item.price * item.quantity).toFixed(2)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 flex justify-between">
          <Button variant="outline" onClick={() => router.push("/")}>
            Continue Shopping
          </Button>
          <Button 
            variant="outline" 
            onClick={() => clearCart()} 
            className="text-destructive"
          >
            Clear Cart
          </Button>
        </div>
      </div>
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>KSh {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>KSh {shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>KSh {tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>KSh {total.toFixed(2)}</span>
              </div>
              <Button 
                className="w-full mt-4 bg-orange-500 hover:bg-orange-600" 
                size="lg" 
                onClick={handleCheckout}
              >
                Checkout <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
