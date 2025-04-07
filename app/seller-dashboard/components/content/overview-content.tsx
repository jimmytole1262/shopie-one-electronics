"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import { RevenueChart, ProductPerformanceChart, OrderVolumeChart } from "../analytics-charts"
import { useState, useEffect } from "react"
import { formatKesPrice } from "@/lib/utils"

// Interface for analytics data
interface AnalyticsData {
  summary: {
    totalRevenue: number;
    totalProducts: number;
    totalOrders: number;
    activeUsers: number;
  };
  productsByCategory: Record<string, { count: number, revenue: number, stock: number }>;
  topProducts: Array<{
    id: number;
    name: string;
    quantity: number;
    sales: number;
    stock: number;
  }>;
}

export default function OverviewContent() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminEmail, setAdminEmail] = useState('jimmytole1262@gmail.com')

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('/api/analytics')
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }
        const data = await response.json()
        setAnalyticsData(data)
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading || !analyticsData) {
    return (
      <>
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Welcome to Your Dashboard</h3>
          <p className="text-sm text-gray-700 mb-2">This overview shows your store's key performance metrics and analytics.</p>
          <p className="text-sm text-gray-700">Current admin: <span className="font-medium">{adminEmail}</span></p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-gray-100 animate-pulse rounded"></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-gray-100 animate-pulse rounded"></div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  const { summary, topProducts } = analyticsData

  return (
    <>
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
        <h3 className="text-lg font-semibold text-green-700 mb-2">Welcome to Your Dashboard</h3>
        <p className="text-sm text-gray-700 mb-2">This overview shows your store's key performance metrics and analytics.</p>
        <p className="text-sm text-gray-700">Current admin: <span className="font-medium">{adminEmail}</span></p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">●</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatKesPrice(summary.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">●</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalProducts}</div>
            <p className="text-xs text-muted-foreground">+{Math.round(summary.totalProducts * 0.1)} since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{summary.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+{Math.round(summary.totalOrders * 0.2)} since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">●</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{summary.activeUsers}</div>
            <p className="text-xs text-muted-foreground">+19% from average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Your store's revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <RevenueChart />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts && topProducts.slice(0, 3).map((product, index) => (
                <div key={product.id} className="flex items-center">
                  <div className={`w-9 h-9 rounded-full bg-${index === 0 ? 'blue' : index === 1 ? 'purple' : 'orange'}-100 flex items-center justify-center mr-3`}>
                    <div className={`h-5 w-5 text-${index === 0 ? 'blue' : index === 1 ? 'purple' : 'orange'}-600`}>●</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.quantity} units sold</p>
                  </div>
                  <div className="text-sm font-medium">{formatKesPrice(product.sales)}</div>
                </div>
              ))}
              {(!topProducts || topProducts.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  No product data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Volume</CardTitle>
            <CardDescription>Recent order activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <OrderVolumeChart />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>Sales distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ProductPerformanceChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
