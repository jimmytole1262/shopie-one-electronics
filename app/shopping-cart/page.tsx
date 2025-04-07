import CartClient from './cart-client'

export default function ShoppingCartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <CartClient />
    </div>
  )
}
