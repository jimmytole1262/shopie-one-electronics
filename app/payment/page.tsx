"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/hooks/useCart"
import { formatKesPrice } from "@/lib/utils"
import { ChevronLeft, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { sendOrderConfirmationEmail, OrderDetails, saveOrderToLocalStorage } from "@/lib/email-service"
import { getToast } from '@/lib/toast-utils'

export default function PaymentPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [isMounted, setIsMounted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mpesa">("card")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderReference, setOrderReference] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [transactionId, setTransactionId] = useState("")
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    mpesaPhone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })
  
  // Form validation
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    mpesaPhone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  // Generate random order reference
  const generateOrderReference = () => {
    const prefix = "SO-"
    const randomNum = Math.floor(100000 + Math.random() * 900000)
    const timestamp = new Date().getTime().toString().slice(-4)
    return `${prefix}${randomNum}-${timestamp}`
  }

  // Client-side only code
  useEffect(() => {
    setIsMounted(true)
    
    // Generate order reference when component mounts
    const reference = generateOrderReference()
    setOrderReference(reference)
    
    // Redirect to cart if no items
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [router, items.length])

  // Calculate order summary
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  })

  // Update order summary whenever items change or component mounts
  useEffect(() => {
    if (isMounted && items.length > 0) {
      const calculatedSubtotal = totalPrice()
      const calculatedShipping = 1299 // Fixed shipping cost
      const calculatedTax = calculatedSubtotal * 0.08
      const calculatedTotal = calculatedSubtotal + calculatedShipping + calculatedTax
      
      setOrderSummary({
        subtotal: calculatedSubtotal,
        shipping: calculatedShipping,
        tax: calculatedTax,
        total: calculatedTotal
      })
    }
  }, [isMounted, items, totalPrice])

  // Form validation function
  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }
    
    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
      isValid = false
    } else {
      newErrors.fullName = ""
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    } else {
      newErrors.email = ""
    }
    
    // Validate phone
    const phoneRegex = /^\+?[0-9]{10,15}$/
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
      isValid = false
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
      isValid = false
    } else {
      newErrors.phone = ""
    }
    
    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
      isValid = false
    } else {
      newErrors.address = ""
    }
    
    // Validate city
    if (!formData.city.trim()) {
      newErrors.city = "City is required"
      isValid = false
    } else {
      newErrors.city = ""
    }
    
    // Validate country
    if (!formData.country.trim()) {
      newErrors.country = "Country is required"
      isValid = false
    } else {
      newErrors.country = ""
    }
    
    // Validate postal code
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required"
      isValid = false
    } else {
      newErrors.postalCode = ""
    }
    
    // Payment method specific validation
    if (paymentMethod === "card") {
      // Validate card number
      const cardNumberRegex = /^[0-9]{16}$/
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required"
        isValid = false
      } else if (!cardNumberRegex.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number"
        isValid = false
      } else {
        newErrors.cardNumber = ""
      }
      
      // Validate expiry date
      const expiryDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = "Expiry date is required"
        isValid = false
      } else if (!expiryDateRegex.test(formData.expiryDate)) {
        newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)"
        isValid = false
      } else {
        newErrors.expiryDate = ""
      }
      
      // Validate CVV
      const cvvRegex = /^[0-9]{3,4}$/
      if (!formData.cvv.trim()) {
        newErrors.cvv = "CVV is required"
        isValid = false
      } else if (!cvvRegex.test(formData.cvv)) {
        newErrors.cvv = "Please enter a valid CVV"
        isValid = false
      } else {
        newErrors.cvv = ""
      }
    } else if (paymentMethod === "mpesa") {
      // Validate M-Pesa phone number
      const mpesaPhoneRegex = /^(?:\+254|0)[17][0-9]{8}$/
      if (!formData.mpesaPhone.trim()) {
        newErrors.mpesaPhone = "M-Pesa phone number is required"
        isValid = false
      } else if (!mpesaPhoneRegex.test(formData.mpesaPhone)) {
        newErrors.mpesaPhone = "Please enter a valid M-Pesa phone number"
        isValid = false
      } else {
        newErrors.mpesaPhone = ""
      }
    }
    
    setErrors(newErrors)
    return isValid
  }
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Special formatting for card number
    if (name === "cardNumber") {
      // Remove non-digit characters
      const digitsOnly = value.replace(/\D/g, '')
      
      // Format with spaces every 4 digits
      let formattedValue = ''
      for (let i = 0; i < digitsOnly.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formattedValue += ' '
        }
        formattedValue += digitsOnly[i]
      }
      
      // Limit to 19 characters (16 digits + 3 spaces)
      const limitedValue = formattedValue.slice(0, 19)
      
      setFormData({
        ...formData,
        [name]: limitedValue
      })
    } 
    // Special formatting for expiry date
    else if (name === "expiryDate") {
      // Remove non-digit characters
      const digitsOnly = value.replace(/\D/g, '')
      
      // Format with slash after first 2 digits
      let formattedValue = ''
      if (digitsOnly.length > 0) {
        formattedValue = digitsOnly.slice(0, 2)
        if (digitsOnly.length > 2) {
          formattedValue += '/' + digitsOnly.slice(2, 4)
        }
      }
      
      setFormData({
        ...formData,
        [name]: formattedValue
      })
    }
    // Special formatting for CVV
    else if (name === "cvv") {
      // Remove non-digit characters and limit to 4 digits
      const limitedValue = value.replace(/\D/g, '').slice(0, 4)
      
      setFormData({
        ...formData,
        [name]: limitedValue
      })
    }
    // Default handling for other fields
    else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      // Show error toast
      const toast = await getToast()
      toast.error("Please fix the errors in the form")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Create order details
      const orderDate = new Date()
      const estimatedDeliveryDate = new Date()
      estimatedDeliveryDate.setDate(orderDate.getDate() + 7) // Delivery in 7 days
      
      const orderDetails: OrderDetails = {
        orderReference,
        customerName: formData.fullName,
        customerEmail: formData.email,
        items,
        subtotal: orderSummary.subtotal,
        shipping: orderSummary.shipping,
        tax: orderSummary.tax,
        total: orderSummary.total,
        orderDate,
        estimatedDeliveryDate,
        status: 'received',
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.country}, ${formData.postalCode}`,
        paymentMethod
      }
      
      // Process payment based on method
      if (paymentMethod === "card") {
        // Simulate card payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Simulate successful payment
        const transactionId = `CC-${Math.floor(100000 + Math.random() * 900000)}`
        setTransactionId(transactionId)
        
        // Update order details with transaction ID
        orderDetails.transactionId = transactionId
      } else if (paymentMethod === "mpesa") {
        // Process M-Pesa payment
        const mpesaResponse = await fetch('/api/mpesa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: formData.mpesaPhone,
            amount: orderSummary.total,
            orderReference
          }),
        })
        
        if (!mpesaResponse.ok) {
          throw new Error('Failed to process M-Pesa payment')
        }
        
        const mpesaData = await mpesaResponse.json()
        
        // Update transaction ID
        setTransactionId(mpesaData.transactionId)
        orderDetails.transactionId = mpesaData.transactionId
      }
      
      // Send order confirmation email
      const emailResponse = await sendOrderConfirmationEmail(orderDetails)
      const emailData = await emailResponse.json()
      
      // Update tracking number
      setTrackingNumber(emailData.trackingNumber)
      
      // Clear cart
      clearCart()
      
      // Show success
      setIsSuccess(true)
      
      // Show success toast
      const toast = await getToast()
      toast.success("Payment successful! Order confirmed.")
    } catch (error) {
      console.error('Payment error:', error)
      const toast = await getToast()
      toast.error("Payment failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Prevent hydration errors by returning null during SSR
  if (!isMounted) {
    return null
  }
  
  // Redirect to cart if no items
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before proceeding to checkout</p>
          <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }
  
  // Payment success screen
  if (isSuccess) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-8 text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-green-600" />
          </motion.div>
          
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Your order has been confirmed and is being processed.</p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6 max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <p className="text-gray-500 mb-1">Order Reference</p>
                <p className="font-medium">{orderReference}</p>
              </div>
              <div className="text-left">
                <p className="text-gray-500 mb-1">Tracking Number</p>
                <p className="font-medium">{trackingNumber}</p>
              </div>
              <div className="text-left">
                <p className="text-gray-500 mb-1">Payment Method</p>
                <p className="font-medium">{paymentMethod === "card" ? "Credit Card" : "M-Pesa"}</p>
              </div>
              <div className="text-left">
                <p className="text-gray-500 mb-1">Transaction ID</p>
                <p className="font-medium">{transactionId}</p>
              </div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 p-4 rounded-lg mb-6 max-w-md mx-auto"
          >
            <p className="text-sm text-blue-800">
              A confirmation email has been sent to <span className="font-medium">{formData.email}</span> with your order details.
            </p>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/order/track?ref=${orderReference}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Track Your Order
            </Link>
            <Link 
              href="/"
              className="bg-gray-100 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-8"
      >
        <div className="flex items-center mb-6">
          <Link href="/cart" className="text-blue-600 hover:text-blue-800 flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Cart
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Payment Information</h1>
        <p className="text-gray-600 mb-6">Please enter your payment information below.</p>
        
        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
          <div className="max-h-60 overflow-y-auto mb-4">
            {items.map((item, index) => (
              <div key={index} className="flex items-center py-2 border-b border-gray-200 last:border-0">
                <div className="h-12 w-12 flex-shrink-0 mr-3 bg-gray-100 rounded-md overflow-hidden">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-sm font-medium">
                  {formatKesPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatKesPrice(orderSummary.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{formatKesPrice(orderSummary.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (8%)</span>
              <span>{formatKesPrice(orderSummary.tax)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
              <span>Total</span>
              <span>{formatKesPrice(orderSummary.total)}</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1">Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleInputChange} 
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1">Phone</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleInputChange} 
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1">Address</label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1">City</label>
              <input 
                type="text" 
                name="city" 
                value={formData.city} 
                onChange={handleInputChange} 
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1">Country</label>
              <input 
                type="text" 
                name="country" 
                value={formData.country} 
                onChange={handleInputChange} 
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1">Postal Code</label>
              <input 
                type="text" 
                name="postalCode" 
                value={formData.postalCode} 
                onChange={handleInputChange} 
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1">Payment Method</label>
              <div className="flex gap-4">
                <button 
                  className={`p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 ${paymentMethod === "card" ? "bg-blue-600 text-white" : ""}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <Check className="w-5 h-5" />
                  Credit Card
                </button>
                <button 
                  className={`p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 ${paymentMethod === "mpesa" ? "bg-blue-600 text-white" : ""}`}
                  onClick={() => setPaymentMethod("mpesa")}
                >
                  <Check className="w-5 h-5" />
                  M-Pesa
                </button>
              </div>
            </div>
          </div>
          {paymentMethod === "card" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1">Card Number</label>
                <input 
                  type="text" 
                  name="cardNumber" 
                  value={formData.cardNumber} 
                  onChange={handleInputChange} 
                  className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-1">Expiry Date</label>
                <input 
                  type="text" 
                  name="expiryDate" 
                  value={formData.expiryDate} 
                  onChange={handleInputChange} 
                  className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium mb-1">M-Pesa Phone Number</label>
              <input 
                type="tel" 
                name="mpesaPhone" 
                value={formData.mpesaPhone} 
                onChange={handleInputChange} 
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.mpesaPhone && <p className="text-red-500 text-sm">{errors.mpesaPhone}</p>}
            </div>
          )}
          <button 
            type="submit" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
