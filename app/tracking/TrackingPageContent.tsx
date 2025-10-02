
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Check, Clock, ChevronLeft, Search } from "lucide-react";
import { toast } from "sonner";

interface OrderStatus {
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: Date;
  location?: string;
  description?: string;
}

interface TrackingDetails {
  trackingNumber: string;
  orderReference: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  orderDate: Date;
  estimatedDeliveryDate: Date;
  shippingAddress: string;
  statusHistory: OrderStatus[];
}

  export default function TrackingPageContent() {
  const searchParams = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [trackingDetails, setTrackingDetails] = useState<TrackingDetails | null>(null);
  const [error, setError] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Initialize tracking number from URL query parameter
  useEffect(() => {
    setIsMounted(true);
    const number = searchParams?.get("number");
    
    // Check if coming from a successful order and clear cart silently
    if (typeof window !== 'undefined') {
      const hasSuccessfulOrder = localStorage.getItem('has_successful_order');
      if (hasSuccessfulOrder === 'true') {
        // Clear cart items from localStorage directly without showing any message
        localStorage.removeItem('cart');
        localStorage.removeItem('checkout_cart_items');
        localStorage.removeItem('has_successful_order');
      }
    }
    
    if (number) {
      setTrackingNumber(number);
      handleTrackOrder(number);
    }
  }, [searchParams]);

  // Handle tracking form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }
    handleTrackOrder(trackingNumber);
  };

  // Track order function
  const handleTrackOrder = (number: string) => {
    setIsLoading(true);
    setError("");

    // Simulate API call to get tracking details
    setTimeout(() => {
      // Check localStorage for order details
      if (typeof window !== 'undefined') {
        const orders = JSON.parse(localStorage.getItem('shopie-one-orders') || '[]');
        const order = orders.find((o: any) => o.trackingNumber === number);

        if (order) {
          // Generate random status history
          const statusHistory: OrderStatus[] = [];
          const orderDate = new Date(order.orderDate);
          
          // Add order received status
          statusHistory.push({
            status: 'pending',
            date: orderDate,
            location: 'Nairobi Warehouse',
            description: 'Order received and payment confirmed'
          });
          
          // Add processing status if not too recent
          const processingDate = new Date(orderDate);
          processingDate.setHours(processingDate.getHours() + 12);
          if (processingDate <= new Date()) {
            statusHistory.push({
              status: 'processing',
              date: processingDate,
              location: 'Nairobi Warehouse',
              description: 'Order is being processed and packed'
            });
          }
          
          // Add shipped status if not too recent
          const shippedDate = new Date(orderDate);
          shippedDate.setHours(shippedDate.getHours() + 36);
          if (shippedDate <= new Date()) {
            statusHistory.push({
              status: 'shipped',
              date: shippedDate,
              location: 'Nairobi Distribution Center',
              description: 'Order has been shipped and is on the way'
            });
          }
          
          // Add delivered status if past estimated delivery date
          const deliveredDate = new Date(order.estimatedDeliveryDate);
          if (deliveredDate <= new Date()) {
            statusHistory.push({
              status: 'delivered',
              date: deliveredDate,
              location: order.shippingAddress.split(',')[0], // First part of address
              description: 'Order has been delivered successfully'
            });
          }
          
          // Create tracking details
          setTrackingDetails({
            trackingNumber: order.trackingNumber,
            orderReference: order.orderReference,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            status: statusHistory[statusHistory.length - 1].status,
            orderDate: new Date(order.orderDate),
            estimatedDeliveryDate: new Date(order.estimatedDeliveryDate),
            shippingAddress: order.shippingAddress,
            statusHistory
          });
        } else {
          setError("Tracking number not found. Please check and try again.");
        }
      }
      
      setIsLoading(false);
    }, 1500);
  };

  // Get status color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'processing':
        return 'text-blue-500';
      case 'shipped':
        return 'text-purple-500';
      case 'delivered':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  // Get status icon based on status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'processing':
        return <ShoppingCart className="h-6 w-6 text-blue-500" />;
      case 'shipped':
        return <ShoppingCart className="h-6 w-6 text-purple-500" />;
      case 'delivered':
        return <Check className="h-6 w-6 text-green-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Prevent hydration errors
  if (!isMounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/" className="mr-4">
            <ChevronLeft className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </Link>
          <h1 className="text-3xl font-bold">Track Your Order</h1>
        </div>

        {/* Tracking form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="trackingNumber" className="sr-only">
                Tracking Number
              </label>
              <input
                type="text"
                id="trackingNumber"
                placeholder="Enter your tracking number"
                value={trackingNumber}
                onChange={(e) => {
                  setTrackingNumber(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Tracking...
                </span>
              ) : (
                <span className="flex items-center">
                  <Search className="mr-2 h-4 w-4" />
                  Track Order
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Tracking results */}
        {trackingDetails && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="border-b pb-4 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Tracking Details</h2>
                  <p className="text-gray-500 text-sm">Order Reference: {trackingDetails.orderReference}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    trackingDetails.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    trackingDetails.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    trackingDetails.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {trackingDetails.status.charAt(0).toUpperCase() + trackingDetails.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tracking Number</p>
                  <p className="font-medium">{trackingDetails.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{formatDate(trackingDetails.orderDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <p className="font-medium">{formatDate(trackingDetails.estimatedDeliveryDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shipping Address</p>
                  <p className="font-medium">{trackingDetails.shippingAddress}</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
            
            <div className="space-y-6">
              {trackingDetails.statusHistory.map((status, index) => (
                <div key={index} className="relative pl-8 pb-6">
                  {/* Vertical line */}
                  {index < trackingDetails.statusHistory.length - 1 && (
                    <div className="absolute left-3 top-3 bottom-0 w-0.5 bg-gray-200"></div>
                  )}
                  
                  {/* Status dot */}
                  <div className="absolute left-0 top-0">
                    <div className={`rounded-full p-1.5 ${getStatusColor(status.status)} bg-white ring-2 ring-${status.status === 'delivered' ? 'green' : status.status === 'shipped' ? 'purple' : status.status === 'processing' ? 'blue' : 'yellow'}-500`}>
                      {getStatusIcon(status.status)}
                    </div>
                  </div>
                  
                  {/* Status content */}
                  <div>
                    <h4 className="text-base font-medium">
                      {status.status === 'pending' ? 'Order Received' :
                       status.status === 'processing' ? 'Order Processing' :
                       status.status === 'shipped' ? 'Order Shipped' :
                       'Order Delivered'}
                    </h4>
                    <p className="text-sm text-gray-500 mb-1">{formatDate(status.date)}</p>
                    {status.location && (
                      <p className="text-sm text-gray-600 mb-1">{status.location}</p>
                    )}
                    {status.description && (
                      <p className="text-sm text-gray-600">{status.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-4 border-t text-center">
              <p className="text-gray-500 mb-4">Need help with your order?</p>
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
