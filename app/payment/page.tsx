"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/useCart"
import { formatKesPrice } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

// Define the OrderDetails interface
interface OrderDetails {
  orderReference: string;
  customerName: string;
  customerEmail: string;
  items: any[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  orderDate: Date;
  estimatedDeliveryDate: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  trackingNumber: string;
  shippingAddress: string;
  paymentMethod: 'card' | 'mpesa';
}

export default function PaymentPage() {
  const router = useRouter()
  const { items: cartItems, totalPrice, clearCart } = useCart()
  const [isMounted, setIsMounted] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mpesa">("card")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderReference, setOrderReference] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    mpesaPhone: ""
  })
  
  // Error state
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    mpesaPhone: ""
  })
  
  // Generate random order reference
  const generateOrderReference = () => {
    const prefix = "SO-"
    const randomNum = Math.floor(100000 + Math.random() * 900000)
    const timestamp = new Date().getTime().toString().slice(-4)
    return `${prefix}${randomNum}-${timestamp}`
  }

  // Generate random tracking number
  const generateTrackingNumber = () => {
    const prefix = "TRK"
    const randomNum = Math.floor(10000000 + Math.random() * 90000000)
    return `${prefix}${randomNum}`
  }

  // Client-side only code
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true)
    })
    
    // Generate order reference and tracking number when component mounts
    const reference = generateOrderReference()
    const tracking = generateTrackingNumber()
    setOrderReference(reference)
    setTrackingNumber(tracking)
    
    return () => cancelAnimationFrame(frame)
  }, [])
  
  // Load cart items from localStorage
  useEffect(() => {
    if (isMounted) {
      // First try to use the cart items from context
      if (cartItems && cartItems.length > 0) {
        setItems(cartItems);
        return;
      }
      
      // If cart context is empty, try to restore from localStorage
      try {
        const storedItems = localStorage.getItem('checkout_cart_items');
        
        // Validate the stored items before parsing
        if (storedItems && storedItems.trim().startsWith('[') && storedItems.trim().endsWith(']')) {
          try {
            const parsedItems = JSON.parse(storedItems);
            if (Array.isArray(parsedItems) && parsedItems.length > 0) {
              // Validate each item has the required properties
              const validItems = parsedItems.filter(item => 
                item && 
                typeof item === 'object' && 
                'id' in item && 
                'name' in item && 
                'price' in item && 
                'quantity' in item
              );
              
              if (validItems.length > 0) {
                setItems(validItems);
                return;
              }
            }
          } catch (parseError) {
            console.error('Error parsing cart items:', parseError);
            // Clear invalid data
            localStorage.removeItem('checkout_cart_items');
          }
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
      }
      
      // If we get here, we couldn't restore the cart
      const redirectTimer = setTimeout(() => {
        toast.error("Your cart is empty or contains invalid data. Please add items before checkout.");
        router.push('/cart');
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isMounted, cartItems, router]);

  // Calculate order summary
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 250, // Fixed shipping cost
    tax: 0,
    total: 0
  })

  // Update order summary whenever items change or component mounts
  useEffect(() => {
    if (isMounted && items.length > 0) {
      // Calculate totals based on local items state
      const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
      const shipping = 250; // Fixed shipping cost
      const tax = Math.round(subtotal * 0.16); // 16% VAT
      const total = subtotal + shipping + tax;
      
      setOrderSummary({
        subtotal,
        shipping,
        tax,
        total
      });
    }
  }, [items, isMounted]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ""
      })
    }
  }

  // Validate form
  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }
    
    // Validate required fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
      isValid = false
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
      isValid = false
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
      isValid = false
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required"
      isValid = false
    }
    
    if (!formData.country.trim()) {
      newErrors.country = "Country is required"
      isValid = false
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required"
      isValid = false
    }
    
    // Payment method specific validation
    if (paymentMethod === "card") {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required"
        isValid = false
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Invalid card number"
        isValid = false
      }
      
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = "Expiry date is required"
        isValid = false
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Invalid format (MM/YY)"
        isValid = false
      }
      
      if (!formData.cvv.trim()) {
        newErrors.cvv = "CVV is required"
        isValid = false
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "Invalid CVV"
        isValid = false
      }
    } else {
      if (!formData.mpesaPhone.trim()) {
        newErrors.mpesaPhone = "Phone number is required"
        isValid = false
      } else if (!/^0[17]\d{8}$/.test(formData.mpesaPhone)) {
        newErrors.mpesaPhone = "Invalid phone number"
        isValid = false
      }
    }
    
    setErrors(newErrors)
    return isValid
  }

  // Send order confirmation email
  const sendOrderConfirmationEmail = async (orderDetails: OrderDetails) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  // Save order to localStorage
  const saveOrderToLocalStorage = (orderDetails: OrderDetails) => {
    if (typeof window !== 'undefined') {
      // Get existing orders
      const existingOrders = JSON.parse(localStorage.getItem('shopie-one-orders') || '[]');
      
      // Add new order
      const updatedOrders = [...existingOrders, orderDetails];
      
      // Save back to localStorage
      localStorage.setItem('shopie-one-orders', JSON.stringify(updatedOrders));
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create order details
      const orderDetails: OrderDetails = {
        orderReference,
        customerName: formData.fullName,
        customerEmail: formData.email,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category || "Unknown"
        })),
        subtotal: orderSummary.subtotal,
        shipping: orderSummary.shipping,
        tax: orderSummary.tax,
        total: orderSummary.total,
        orderDate: new Date(),
        estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'pending',
        trackingNumber,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.country}, ${formData.postalCode}`,
        paymentMethod
      }
      
      // Save order to localStorage
      saveOrderToLocalStorage(orderDetails)
      
      // Send confirmation email
      try {
        await sendOrderConfirmationEmail(orderDetails)
      } catch (error) {
        console.error("Error sending confirmation email:", error)
        // Continue with order processing even if email fails
      }
      
      // Set success state first before clearing the cart
      setIsSuccess(true)
      
      // Show success toast
      toast.success("Payment successful! Your order has been placed.")
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Payment failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      // Store the current order details for tracking
      if (typeof window !== 'undefined') {
        // Flag to indicate we have a successful order
        localStorage.setItem('has_successful_order', 'true');
      }
      
      // Add event listener for navigation
      const handleBeforeUnload = () => {
        // Clear cart when navigating away from this page
        clearCart();
        localStorage.removeItem('checkout_cart_items');
        localStorage.removeItem('has_successful_order');
      };
      
      // Add event listener for navigation
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      // Clean up event listener
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        // Also clear cart when component unmounts (navigating away)
        clearCart();
        localStorage.removeItem('checkout_cart_items');
        localStorage.removeItem('has_successful_order');
      };
    }
  }, [isSuccess, clearCart]);

  // Prevent hydration errors by returning a skeleton during SSR
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  // Success state - show order confirmation
  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase</p>
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order Reference:</span>
              <span className="font-medium">{orderReference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tracking Number:</span>
              <span className="font-medium">{trackingNumber}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              We've sent a confirmation email to <span className="font-medium">{formData.email}</span> with your order details and tracking information.
            </p>
            <p className="text-gray-600">
              Use your tracking number to follow the status of your order.
            </p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatKesPrice(orderSummary.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">{formatKesPrice(orderSummary.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (16%)</span>
                <span className="font-medium">{formatKesPrice(orderSummary.tax)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">{formatKesPrice(orderSummary.total)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
            <Link 
              href={`/tracking?number=${trackingNumber}`}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Track Your Order
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Shipping and Payment Form */}
        <div className="flex-grow">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <form onSubmit={handlePaymentSubmit}>
                {/* Shipping Information */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.postalCode && <p className="mt-1 text-sm text-red-500">{errors.postalCode}</p>}
                    </div>
                  </div>
                </div>
                
                {/* Payment Method */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                  
                  <div className="flex gap-4 mb-6">
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-md ${paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      Credit Card
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-md ${paymentMethod === 'mpesa' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                      onClick={() => setPaymentMethod('mpesa')}
                    >
                      M-Pesa
                    </button>
                  </div>
                  
                  {paymentMethod === 'card' ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {errors.expiryDate && <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {errors.cvv && <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="mpesaPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        M-Pesa Phone Number
                      </label>
                      <input
                        type="tel"
                        id="mpesaPhone"
                        name="mpesaPhone"
                        placeholder="07XX XXX XXX"
                        value={formData.mpesaPhone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md ${errors.mpesaPhone ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.mpesaPhone && <p className="mt-1 text-sm text-red-500">{errors.mpesaPhone}</p>}
                      <p className="mt-2 text-sm text-gray-500">You will receive an M-Pesa prompt on this number</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  >
                    {isSubmitting ? 'Processing...' : `Pay ${formatKesPrice(orderSummary.total)}`}
                  </button>
                </div>
              </form>
              
              <div className="mt-4">
                <Link 
                  href="/cart"
                  className="block text-center text-blue-600 hover:text-blue-800"
                >
                  Return to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="max-h-60 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center py-2 border-b border-gray-100">
                  <div className="w-12 h-12 relative flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatKesPrice(orderSummary.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">{formatKesPrice(orderSummary.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (16%)</span>
                <span className="font-medium">{formatKesPrice(orderSummary.tax)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">{formatKesPrice(orderSummary.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
