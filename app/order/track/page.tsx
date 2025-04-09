"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { getOrderByReference } from "@/lib/email-service"
import { formatKesPrice } from "@/lib/utils"
import { Search, MapPin } from "lucide-react"
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-md mb-8"
      >
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
            <motion.button
              onClick={handleTrackOrder}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Tracking...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Track Order
                </>
              )}
            </motion.button>
          </div>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-3 bg-red-50 text-red-700 rounded-md"
          >
            {error}
          </motion.div>
        )}
      </motion.div>
      
      {/* Order Details */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {/* Order Status */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Order #{order.orderReference}</h2>
                <p className="text-gray-600">Placed on {formatDate(order.orderDate)}</p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                  style={{ width: `${(getStatusIndex(order.status) + 1) * 25}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <div className="w-1/4 text-center">
                  <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${getStatusIndex(order.status) >= 0 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <p className="mt-1">Received</p>
                </div>
                <div className="w-1/4 text-center">
                  <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${getStatusIndex(order.status) >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <p className="mt-1">Processing</p>
                </div>
                <div className="w-1/4 text-center">
                  <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${getStatusIndex(order.status) >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <p className="mt-1">Shipped</p>
                </div>
                <div className="w-1/4 text-center">
                  <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${getStatusIndex(order.status) >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <p className="mt-1">Delivered</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Delivery Information */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Delivery</h3>
                <p className="font-medium">{formatDate(order.estimatedDeliveryDate)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Tracking Number</h3>
                <p className="font-medium">{order.trackingNumber || "Not available yet"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Shipping Address</h3>
                <p className="font-medium">{order.shippingAddress || "Not available"}</p>
              </div>
            </div>
          </div>
          
          {/* Delivery Map */}
          {getStatusIndex(order.status) >= 2 && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium mb-4">Delivery Location</h3>
              <DeliveryMap 
                orderStatus={order.status}
                estimatedDeliveryDate={new Date(order.estimatedDeliveryDate)}
                shippingAddress={order.shippingAddress || "Not available"}
              />
            </div>
          )}
          
          {/* Order Items */}
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Order Items</h3>
            <div className="overflow-x-auto">
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
        </motion.div>
      )}
    </div>
  )
}
