// app/order/track/page.tsx (NEW FILE)
import { Suspense } from 'react'
import OrderTrackingContent from './OrderTrackingContent'

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Track Your Order</h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <OrderTrackingContent />
    </Suspense>
  )
}