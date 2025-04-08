import CheckoutButton from '@/components/checkout-button';

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hello World</h1>
      <p>This is a simple cart page.</p>
      <div id="link-status" className="mt-8 p-4 bg-green-100 text-green-800 rounded-md">
        If you see this page after clicking the cart icon, the link is working properly!
      </div>
      <div className="mt-6">
        <CheckoutButton />
      </div>
    </div>
  )
}
