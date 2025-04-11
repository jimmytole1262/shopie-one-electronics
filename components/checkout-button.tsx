"use client";

import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

export default function CheckoutButton() {
  const router = useRouter();
  const { items } = useCart();
  
  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      return;
    }
    
    try {
      // Store cart items in localStorage to preserve them during navigation
      if (typeof window !== 'undefined') {
        // Create a clean copy of the items to ensure valid JSON
        const cleanItems = items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category || "Unknown"
        }));
        
        // Store the clean items in localStorage
        localStorage.setItem('checkout_cart_items', JSON.stringify(cleanItems));
      }
      
      // Redirect directly to payment page
      router.push('/payment');
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <button 
      className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
      onClick={handleCheckout}
      disabled={items.length === 0}
    >
      Proceed to Checkout
    </button>
  );
}
