"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewCards, RevenueChart, ProductPerformanceChart, OrderVolumeChart } from "../analytics-charts"

export default function AnalyticsContent() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Analytics Dashboard</CardTitle>
        <CardDescription>Comprehensive overview of your store performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-md">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Understanding Your Analytics</h3>
          <p className="text-sm text-gray-700 mb-2">These charts show your store's performance over time, helping you identify trends and make data-driven decisions.</p>
          <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>Revenue Chart: Track your daily and monthly earnings</li>
            <li>Product Performance: See which products are selling best</li>
            <li>Order Volume: Monitor order frequency and patterns</li>
          </ul>
        </div>
        <OverviewCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <RevenueChart />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ProductPerformanceChart />
          <OrderVolumeChart />
        </div>
      </CardContent>
    </Card>
  )
}
