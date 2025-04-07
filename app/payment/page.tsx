"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/hooks/useCart"
import { formatKesPrice } from "@/lib/utils"
import { ArrowLeft, Check, CreditCard, Smartphone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { sendOrderConfirmationEmail, OrderDetails } from "@/lib/email-service"

export default function PaymentPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [isMounted, setIsMounted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mpesa">("card")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderReference, setOrderReference] = useState("")
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
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
    mpesaPhone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  // Client-side only code
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Prevent hydration errors by returning null during SSR
  if (!isMounted) {
    return null
  }

  // Calculate order summary
  const subtotal = totalPrice()
  const shipping = items.length > 0 ? 1299 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  // Generate random order reference
  const generateOrderReference = () => {
    const prefix = "SO-"
    const randomNum = Math.floor(100000 + Math.random() * 900000)
    const timestamp = new Date().getTime().toString().slice(-4)
    return `${prefix}${randomNum}-${timestamp}`
  }

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
      newErrors.email = "Please enter a valid email"
      isValid = false
    } else {
      newErrors.email = ""
    }
    
    // Validate phone
    const phoneRegex = /^0\d{9}$/
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
      isValid = false
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Kenyan phone number (e.g., 0711234567)"
      isValid = false
    } else {
      newErrors.phone = ""
    }
    
    // Validate payment method specific fields
    if (paymentMethod === "mpesa") {
      if (!formData.mpesaPhone.trim()) {
        newErrors.mpesaPhone = "M-Pesa phone number is required"
        isValid = false
      } else if (!phoneRegex.test(formData.mpesaPhone)) {
        newErrors.mpesaPhone = "Please enter a valid Kenyan phone number (e.g., 0711234567)"
        isValid = false
      } else {
        newErrors.mpesaPhone = ""
      }
    } else {
      // Card validation
      const cardNumberRegex = /^\d{16}$/
      const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
      const cvvRegex = /^\d{3}$/
      
      if (!formData.cardNumber.replace(/\s/g, "").trim()) {
        newErrors.cardNumber = "Card number is required"
        isValid = false
      } else if (!cardNumberRegex.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number"
        isValid = false
      } else {
        newErrors.cardNumber = ""
      }
      
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = "Expiry date is required"
        isValid = false
      } else if (!expiryDateRegex.test(formData.expiryDate)) {
        newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)"
        isValid = false
      } else {
        newErrors.expiryDate = ""
      }
      
      if (!formData.cvv.trim()) {
        newErrors.cvv = "CVV is required"
        isValid = false
      } else if (!cvvRegex.test(formData.cvv)) {
        newErrors.cvv = "Please enter a valid 3-digit CVV"
        isValid = false
      } else {
        newErrors.cvv = ""
      }
    }
    
    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
      
      setFormData({
        ...formData,
        [name]: formattedValue
      })
      return
    }
    
    // Format expiry date with slash
    if (name === "expiryDate") {
      let formattedValue = value.replace(/\//g, "")
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`
      }
      
      setFormData({
        ...formData,
        [name]: formattedValue
      })
      return
    }
    
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    // Generate order reference
    const reference = generateOrderReference()
    
    // Create order details
    const orderDate = new Date()
    const estimatedDeliveryDate = new Date()
    estimatedDeliveryDate.setDate(orderDate.getDate() + 5) // Delivery in 5 days
    
    const orderDetails: OrderDetails = {
      orderReference: reference,
      customerName: formData.fullName,
      customerEmail: formData.email,
      items: items,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      orderDate: orderDate,
      estimatedDeliveryDate: estimatedDeliveryDate,
      status: 'received',
      shippingAddress: "" // In a real app, we would collect this
    }
    
    try {
      // Send order confirmation email
      await sendOrderConfirmationEmail(orderDetails)
      
      // Update UI
      setOrderReference(reference)
      setIsSuccess(true)
      clearCart() // Clear the cart after successful payment
    } catch (error) {
      console.error("Failed to send order confirmation email:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success screen
  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto py-12 px-4"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="h-10 w-10 text-green-600" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-2xl font-bold mb-4"
          >
            Payment Successful!
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-600 mb-6"
          >
            Thank you for your purchase. A confirmation email has been sent to {formData.email}.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-50 rounded-lg p-4 mb-6"
          >
            <p className="text-gray-600">Order Reference:</p>
            <p className="text-lg font-semibold">{orderReference}</p>
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md font-medium w-full md:w-auto"
                onClick={() => router.push(`/order/track?ref=${orderReference}`)}
              >
                Track Your Order
              </motion.button>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-md font-medium w-full md:w-auto"
              >
                Continue Shopping
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto py-8 px-4"
    >
      <Link href="/shopping-cart" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Return to Cart
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Payment Form */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-semibold mb-6">Payment Details</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Personal Information */}
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
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                  )}
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
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="johndoe@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
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
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0711234567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
                
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-center py-3 px-4 rounded-md border ${
                        paymentMethod === "card"
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border-gray-300 text-gray-700"
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Credit/Debit Card
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-center py-3 px-4 rounded-md border ${
                        paymentMethod === "mpesa"
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border-gray-300 text-gray-700"
                      }`}
                      onClick={() => setPaymentMethod("mpesa")}
                    >
                      <Smartphone className="h-5 w-5 mr-2" />
                      M-Pesa
                    </motion.button>
                  </div>
                </div>
                
                {/* Payment Method Specific Fields */}
                <AnimatePresence mode="wait">
                  {paymentMethod === "card" ? (
                    <motion.div
                      key="card-fields"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          maxLength={19}
                          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                            errors.cardNumber ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="1234 5678 9012 3456"
                        />
                        {errors.cardNumber && (
                          <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
                        )}
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
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            maxLength={5}
                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                              errors.expiryDate ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="MM/YY"
                          />
                          {errors.expiryDate && (
                            <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            maxLength={3}
                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                              errors.cvv ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="123"
                          />
                          {errors.cvv && (
                            <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="mpesa-fields"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div>
                        <label htmlFor="mpesaPhone" className="block text-sm font-medium text-gray-700 mb-1">
                          M-Pesa Phone Number
                        </label>
                        <input
                          type="tel"
                          id="mpesaPhone"
                          name="mpesaPhone"
                          value={formData.mpesaPhone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                            errors.mpesaPhone ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="07XX XXX XXX"
                        />
                        {errors.mpesaPhone && (
                          <p className="mt-1 text-sm text-red-500">{errors.mpesaPhone}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-medium flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Pay Now"
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
        
        {/* Order Summary */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-1"
        >
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatKesPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{formatKesPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span>{formatKesPrice(tax)}</span>
              </div>
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="border-t pt-3 mt-3"
              >
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-lg">{formatKesPrice(total)}</span>
                </div>
              </motion.div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">We Accept</h3>
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 rounded p-2">
                  <Image src="/visa.svg" alt="Visa" width={40} height={30} />
                </div>
                <div className="bg-gray-100 rounded p-2">
                  <Image src="/mastercard.svg" alt="Mastercard" width={40} height={30} />
                </div>
                <div className="bg-gray-100 rounded p-2">
                  <Image src="/paypal.svg" alt="PayPal" width={40} height={30} />
                </div>
                <div className="bg-gray-100 rounded p-2">
                  <Image src="/mpesa.svg" alt="M-Pesa" width={40} height={30} />
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p className="flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Checkout
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
