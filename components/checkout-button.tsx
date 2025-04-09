import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutButton() {
  const router = useRouter();
  
  const handleCheckout = async () => {
    // Redirect to payment page
    router.push('/payment');
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
