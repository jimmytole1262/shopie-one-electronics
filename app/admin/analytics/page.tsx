"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart2, LineChart, PieChart } from "lucide-react"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for analytics
const salesData = [
  { month: "Jan", sales: 4500 },
  { month: "Feb", sales: 5200 },
  { month: "Mar", sales: 4800 },
  { month: "Apr", sales: 5800 },
  { month: "May", sales: 6200 },
  { month: "Jun", sales: 7500 },
  { month: "Jul", sales: 8200 },
  { month: "Aug", sales: 7800 },
  { month: "Sep", sales: 8500 },
  { month: "Oct", sales: 9200 },
  { month: "Nov", sales: 10500 },
  { month: "Dec", sales: 12000 },
]

const categoryData = [
  { category: "Audio", percentage: 35 },
  { category: "Wearables", percentage: 25 },
  { category: "Smartphones", percentage: 20 },
  { category: "Laptops", percentage: 15 },
  { category: "Accessories", percentage: 5 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("year")
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Filter data based on time range
  const getFilteredData = () => {
    if (timeRange === "month") {
      return salesData.slice(-1)
    } else if (timeRange === "quarter") {
      return salesData.slice(-3)
    } else if (timeRange === "halfYear") {
      return salesData.slice(-6)
    } else {
      return salesData
    }
  }

  const filteredData = getFilteredData()
  const totalSales = filteredData.reduce((sum, item) => sum + item.sales, 0)
  
  // Calculate max value for chart scaling
  const maxSales = Math.max(...filteredData.map(item => item.sales))
  const chartHeight = 250

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Track your store performance and sales</p>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="halfYear">Last 6 Months</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                  <h3 className="text-2xl font-bold">${totalSales.toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-muted-foreground">Average Order Value</p>
                  <h3 className="text-2xl font-bold">${Math.round(totalSales / filteredData.length / 5).toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                  <h3 className="text-2xl font-bold">3.2%</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="sales">
            <TabsList className="mb-6">
              <TabsTrigger value="sales" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span>Sales Trends</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span>Product Performance</span>
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span>Category Distribution</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sales">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Trends</CardTitle>
                  <CardDescription>View your sales performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {isClient && (
                    <div className="h-[300px] w-full">
                      <div className="flex h-[250px] items-end gap-2">
                        {filteredData.map((item, index) => (
                          <div key={index} className="relative flex h-full flex-1 flex-col items-center justify-end">
                            <div 
                              className="w-full bg-orange-500 rounded-t-sm transition-all duration-300 ease-in-out hover:bg-orange-600"
                              style={{ height: `${(item.sales / maxSales) * chartHeight}px` }}
                            ></div>
                            <span className="mt-2 text-xs text-muted-foreground">{item.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>Products with the highest sales volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Premium Wireless Headphones</span>
                        <span className="text-sm font-medium">$12,450</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Smart Watch Pro</span>
                        <span className="text-sm font-medium">$8,320</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: "65%" }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Bluetooth Speaker</span>
                        <span className="text-sm font-medium">$5,680</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: "45%" }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Wireless Earbuds</span>
                        <span className="text-sm font-medium">$4,250</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: "35%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Distribution of sales across product categories</CardDescription>
                </CardHeader>
                <CardContent>
                  {isClient && (
                    <div className="flex gap-8">
                      <div className="relative h-[200px] w-[200px]">
                        <div className="h-full w-full rounded-full bg-slate-100">
                          {categoryData.map((item, index) => {
                            const offset = categoryData
                              .slice(0, index)
                              .reduce((sum, curr) => sum + curr.percentage, 0);
                            return (
                              <div
                                key={index}
                                className="absolute inset-0"
                                style={{
                                  background: `conic-gradient(transparent ${offset}%, ${getColorForIndex(index)} ${offset}%, ${getColorForIndex(index)} ${offset + item.percentage}%, transparent ${offset + item.percentage}%)`,
                                  borderRadius: "100%"
                                }}
                              />
                            );
                          })}
                          <div className="absolute inset-[15%] rounded-full bg-white"></div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center gap-2">
                        {categoryData.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div 
                              className="h-3 w-3 rounded-full" 
                              style={{ backgroundColor: getColorForIndex(index) }}
                            ></div>
                            <span className="text-sm">{item.category} ({item.percentage}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

// Helper function to get color for pie chart
function getColorForIndex(index: number): string {
  const colors = [
    "#f97316", // orange-500
    "#3b82f6", // blue-500
    "#8b5cf6", // violet-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
  ];
  return colors[index % colors.length];
}
