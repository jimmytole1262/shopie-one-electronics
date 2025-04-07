"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { getOrderByReference } from "@/lib/email-service"
import { formatKesPrice } from "@/lib/utils"
import { ShoppingBag, Settings, Truck, Check, Search, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"

// Import the map component with dynamic loading (client-side only)
const DeliveryMap = dynamic(() => import('@/components/delivery-map'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
    <p className="text-gray-500">Loading map...</p>
  </div>
})

export default function OrderTrackingPage() {
  const searchParams = useSearchParams()
  const orderRef = searchParams ? searchParams.get("ref") : null
  
  const [orderReference, setOrderReference] = useState(orderRef || "")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  
  // Define handleTrackOrder before using it in useEffect
  const handleTrackOrder = () => {
    if (!orderReference && !orderRef) {
      setError("Please enter an order reference")
      return
    }
    
    setLoading(true)
    setError("")
    
    // Use orderRef if orderReference is empty (for initial load from URL)
    const refToUse = orderReference || orderRef || ""
    
    // Fetch order details
    const orderDetails = getOrderByReference(refToUse)
    
    setTimeout(() => {
      setLoading(false)
      
      if (!orderDetails) {
        setError("Order not found. Please check the reference number and try again.")
        return
      }
      
      setOrder(orderDetails)
    }, 1000)
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderReference(e.target.value)
  }
  
  // Client-side only code
  useEffect(() => {
    setIsMounted(true)
    
    // If order reference is provided in URL, fetch order details
    if (orderRef) {
      // Small delay to ensure state is properly initialized
      setTimeout(() => {
        handleTrackOrder()
      }, 100)
    }
  }, [orderRef])
  
  // Prevent hydration errors by returning null during SSR
  if (!isMounted) {
    return null
  }
  
  const getStatusIndex = (status: string) => {
    const statuses = ["received", "processing", "shipped", "delivered"]
    return statuses.indexOf(status)
  }
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }
  
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Track Your Order</h1>
      
      {/* Order Tracking Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="orderReference" className="block text-sm font-medium text-gray-700 mb-1">
              Order Reference Number
            </label>
            <input
              type="text"
              id="orderReference"
              value={orderReference}
              onChange={handleInputChange}
              placeholder="Enter your order reference"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleTrackOrder}
              disabled={loading}
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 flex items-center justify-center"
            >
              {loading ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {loading ? "Tracking..." : "Track Order"}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
      
      {/* Order Status */}
      {order && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Status</h2>
          
          <div className="relative">
            {/* Status Timeline */}
            <div className="flex justify-between mb-4">
              {["received", "processing", "shipped", "delivered"].map((status, index) => {
                const isCompleted = getStatusIndex(order.status) >= index
                const isCurrent = order.status === status
                
                return (
                  <div key={status} className="flex flex-col items-center relative z-10 w-1/4">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                      {status === "received" && <ShoppingBag className="h-5 w-5 text-white" />}
                      {status === "processing" && <Settings className="h-5 w-5 text-white" />}
                      {status === "shipped" && <Truck className="h-5 w-5 text-white" />}
                      {status === "delivered" && <Check className="h-5 w-5 text-white" />}
                    </motion.div>
                    <p className={`mt-2 text-sm font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-blue-600 mt-1">(Current)</p>
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Timeline Line */}
            <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 z-0">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: `${getStatusIndex(order.status) * 33.33}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-green-500"
              />
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Estimated Delivery</h3>
              <p className="text-gray-900">{formatDate(order.estimatedDeliveryDate)}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Order Reference</h3>
              <p className="text-gray-900">{order.orderReference}</p>
            </div>
          </div>
          
          {/* Delivery Map */}
          <div className="mt-6">
            <div className="flex items-center mb-3">
              <MapPin className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-700">Delivery Tracking</h3>
            </div>
            <DeliveryMap 
              orderStatus={order.status}
              estimatedDeliveryDate={new Date(order.estimatedDeliveryDate)}
              shippingAddress={order.shippingAddress}
            />
            <p className="text-xs text-gray-500 mt-2">
              {order.status === 'received' ? 'Your order has been received and is being prepared at our warehouse.' :
               order.status === 'processing' ? 'Your order is being processed and will be shipped soon.' :
               order.status === 'shipped' ? 'Your order is on the way! Track its progress on the map above.' :
               'Your order has been delivered. Thank you for shopping with us!'}
            </p>
          </div>
        </div>
      )}
      
      {/* Order Details */}
      {order && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h3>
              <p className="text-gray-600">{order.shippingAddress || "Not provided"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h3>
              <p className="text-gray-600">{order.customerName}</p>
              <p className="text-gray-600">{order.customerEmail}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Order Summary</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 mr-3">
                              <Image
                                src={item.image || "/images/product-placeholder.svg"}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatKesPrice(item.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatKesPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={2} className="px-6 py-3"></td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-500">Subtotal</td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{formatKesPrice(order.subtotal)}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="px-6 py-3"></td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-500">Shipping</td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{formatKesPrice(order.shipping)}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="px-6 py-3"></td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-500">Tax</td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">{formatKesPrice(order.tax)}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="px-6 py-3"></td>
                      <td className="px-6 py-3 text-sm font-bold text-gray-900">Total</td>
                      <td className="px-6 py-3 text-sm font-bold text-gray-900">{formatKesPrice(order.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
