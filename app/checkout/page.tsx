import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';

type PaymentMethod = 'card' | 'mpesa';

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      if (paymentMethod === 'card') {
        // Process card payment
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
        const supabase = createClient();
        
        const { data: { session } } = await supabase
          .from('checkout_sessions')
          .insert([{ payment_method: 'card' }])
          .select()
          .single();
        
        await stripe?.redirectToCheckout({ sessionId: session.id });
      } else {
        // Process M-Pesa payment
        const supabase = createClient();
        
        const { error } = await supabase
          .from('mpesa_payments')
          .insert([{
            phone: mpesaPhone,
            amount: 1000, // Replace with actual amount
            status: 'pending'
          }]);
        
        if (error) throw error;
        
        toast.success('M-Pesa payment initiated. Please complete payment on your phone');
        router.push('/order-confirmation');
      }
    } catch (error) {
      toast.error('Payment failed. Please try again');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md ${paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setPaymentMethod('card')}
          >
            Credit Card
          </button>
          <button
            className={`px-4 py-2 rounded-md ${paymentMethod === 'mpesa' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setPaymentMethod('mpesa')}
          >
            M-Pesa
          </button>
        </div>

        {paymentMethod === 'card' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 border rounded-md"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full p-2 border rounded-md"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">CVC</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full p-2 border rounded-md"
                  value={cardDetails.cvc}
                  onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-1">M-Pesa Phone Number</label>
            <input
              type="tel"
              placeholder="07XX XXX XXX"
              className="w-full p-2 border rounded-md"
              value={mpesaPhone}
              onChange={(e) => setMpesaPhone(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-2">You'll receive an M-Pesa prompt on this number</p>
          </div>
        )}
      </div>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
      >
        {isProcessing ? 'Processing...' : `Pay with ${paymentMethod === 'card' ? 'Card' : 'M-Pesa'}`}
      </button>
    </div>
  );
}
