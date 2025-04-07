import type { Metadata } from "next"
import CartClient from "./cart-client"

export const metadata: Metadata = {
  title: "Cart | QuickCart",
  description: "View your shopping cart and checkout",
}

export default function CartPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <CartClient />
    </div>
  )
}

