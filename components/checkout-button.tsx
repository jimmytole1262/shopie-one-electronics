import Link from 'next/link';

export default function CheckoutButton() {
  const handleCheckout = async () => {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items })
    });

    const { url } = await response.json();
    window.location.href = url; // Direct redirect to Stripe
  };

  return (
    <button 
      className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
      onClick={handleCheckout}
    >
      Proceed to Checkout
    </button>
  );
}
