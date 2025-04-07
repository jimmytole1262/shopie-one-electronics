"use client"

import { useState, useEffect } from "react"
import { 
  ShoppingCart, 
  User, 
  Calendar
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'

// Date filter options
type DateFilterType = "weekly" | "monthly" | "yearly" | "all"

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
  monthlyRevenue: Array<{
    name: string;
    revenue: number;
    profit: number;
  }>;
  weeklyRevenue: Array<{
    name: string;
    revenue: number;
    profit: number;
  }>;
  orderVolume: Array<{
    name: string;
    orders: number;
  }>;
}

// Format currency in KES
const formatKesPrice = (price: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']
const AREA_COLORS = ['#8884d8', '#82ca9d', '#ffc658']

// Date filter component
const DateFilter = ({ value, onChange }: { value: DateFilterType, onChange: (value: DateFilterType) => void }) => {
  return (
    <div className="flex items-center space-x-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={(val) => onChange(val as DateFilterType)}>
        <SelectTrigger className="w-[180px] h-8">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="weekly">Last 7 days</SelectItem>
          <SelectItem value="monthly">Last 30 days</SelectItem>
          <SelectItem value="yearly">This year</SelectItem>
          <SelectItem value="all">All time</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export function OverviewCards({ dateFilter = 'monthly' }: { dateFilter?: DateFilterType }) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
    )
  }
  
  const { summary } = analyticsData
  
  // Format revenue as currency
  const formatCurrency = (value: number) => {
    return formatKesPrice(value);
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Products</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
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
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{summary.activeUsers}</div>
          <p className="text-xs text-muted-foreground">+19% from average</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function RevenueChart() {
  const [dateFilter, setDateFilter] = useState<DateFilterType>('monthly')
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/analytics')
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }
        const data = await response.json()
        setAnalyticsData(data)
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      }
    }
    
    fetchData()
  }, [])
  
  if (!analyticsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    )
  }
  
  let data;
  if (dateFilter === 'weekly') {
    data = analyticsData.weeklyRevenue;
  } else {
    data = analyticsData.monthlyRevenue;
  }
  
  // Get description based on date filter
  const getDescription = () => {
    switch (dateFilter) {
      case 'weekly':
        return 'Revenue for the last 7 days'
      case 'monthly':
        return 'Revenue by month for the current year'
      case 'yearly':
        return 'Revenue by month for the current year'
      case 'all':
        return 'Revenue by month for the current year'
      default:
        return 'Revenue overview'
    }
  }
  
  // Function to render the appropriate chart based on chartType
  const renderChart = () => {
    if (chartType === 'line') {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatKesPrice(value)}
          />
          <Tooltip formatter={(value: number) => [formatKesPrice(value), 'Revenue']} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="profit"
            name="Profit"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      )
    } else if (chartType === 'bar') {
      return (
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatKesPrice(value)}
          />
          <Tooltip formatter={(value: number) => [formatKesPrice(value), 'Revenue']} />
          <Legend />
          <Bar
            dataKey="revenue"
            name="Revenue"
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="profit"
            name="Profit"
            fill="#82ca9d"
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
      )
    } else {
      return (
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatKesPrice(value)}
          />
          <Tooltip formatter={(value: number) => [formatKesPrice(value), 'Revenue']} />
          <Legend />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="profit"
            name="Profit"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.3}
          />
        </AreaChart>
      )
    }
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-500" />
            Revenue Overview
          </CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Tabs 
            defaultValue={chartType} 
            className="w-[220px]"
            onValueChange={(value) => setChartType(value as 'line' | 'bar' | 'area')}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="bar">Bar</TabsTrigger>
              <TabsTrigger value="area">Area</TabsTrigger>
            </TabsList>
          </Tabs>
          <DateFilter value={dateFilter} onChange={setDateFilter} />
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        {renderChart()}
        
        {/* Revenue stats summary */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Revenue</div>
            <div className="text-2xl font-bold mt-1">
              {formatKesPrice(data.reduce((sum, item) => sum + item.revenue, 0))}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Average</div>
            <div className="text-2xl font-bold mt-1 text-blue-600">
              {formatKesPrice(data.reduce((sum, item) => sum + item.revenue, 0) / data.length)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Profit</div>
            <div className="text-2xl font-bold mt-1 text-green-600">
              {formatKesPrice(data.reduce((sum, item) => sum + item.profit, 0))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductPerformanceChart() {
  const [dateFilter, setDateFilter] = useState<DateFilterType>('monthly')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/analytics')
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }
        const data = await response.json()
        setAnalyticsData(data)
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      }
    }
    
    fetchData()
  }, [])
  
  if (!analyticsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Performance</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    )
  }
  
  // Transform category data for the pie chart
  const data = Object.entries(analyticsData.productsByCategory).map(([category, data], index) => ({
    name: category,
    value: data.count,
    revenue: data.revenue,
    stock: data.stock
  }));
  
  // Get description based on date filter
  const getDescription = () => {
    return 'Sales distribution by category';
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-purple-500" />
            Product Performance
          </CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </div>
        <DateFilter value={dateFilter} onChange={setDateFilter} />
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => {
                if (name === 'value') return [`${value} products`, 'Count'];
                return [value, name];
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Category stats summary */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Categories</div>
            <div className="text-2xl font-bold mt-1">
              {data.length}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Products</div>
            <div className="text-2xl font-bold mt-1 text-purple-600">
              {data.reduce((sum, item) => sum + item.value, 0)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Stock</div>
            <div className="text-2xl font-bold mt-1 text-indigo-600">
              {data.reduce((sum, item) => sum + item.stock, 0)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function OrderVolumeChart() {
  const [dateFilter, setDateFilter] = useState<DateFilterType>('monthly')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/analytics')
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }
        const data = await response.json()
        setAnalyticsData(data)
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      }
    }
    
    fetchData()
  }, [])
  
  if (!analyticsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Volume</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    )
  }
  
  const data = analyticsData.orderVolume;
  
  // Get description based on date filter
  const getDescription = () => {
    return 'Monthly order volume';
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-green-500" />
            Order Volume
          </CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </div>
        <DateFilter value={dateFilter} onChange={setDateFilter} />
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              formatter={(value) => [`${value} orders`, 'Orders']}
            />
            <Bar
              dataKey="orders"
              name="Orders"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
        
        {/* Order stats summary */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Orders</div>
            <div className="text-2xl font-bold mt-1">
              {data.reduce((sum, item) => sum + item.orders, 0)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Average</div>
            <div className="text-2xl font-bold mt-1 text-green-600">
              {Math.round(data.reduce((sum, item) => sum + item.orders, 0) / data.length)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Peak Month</div>
            <div className="text-2xl font-bold mt-1 text-amber-600">
              {data.reduce((max, item) => item.orders > max.orders ? item : max, data[0]).name}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CustomerMetricsChart() {
  const [dateFilter, setDateFilter] = useState<DateFilterType>('weekly')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/analytics')
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }
        const data = await response.json()
        setAnalyticsData(data)
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      }
    }
    
    fetchData()
  }, [])
  
  if (!analyticsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Metrics</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    )
  }
  
  const data = analyticsData.topProducts;
  
  // Get description based on date filter
  const getDescription = () => {
    return 'Top products by sales';
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-orange-500" />
            Customer Metrics
          </CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </div>
        <DateFilter value={dateFilter} onChange={setDateFilter} />
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              formatter={(value) => [`${value} sales`, 'Sales']}
            />
            <Bar
              dataKey="sales"
              name="Sales"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
        
        {/* Order stats summary */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Sales</div>
            <div className="text-2xl font-bold mt-1">
              {data.reduce((sum, item) => sum + item.sales, 0)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Average</div>
            <div className="text-2xl font-bold mt-1 text-green-600">
              {Math.round(data.reduce((sum, item) => sum + item.sales, 0) / data.length)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Top Product</div>
            <div className="text-2xl font-bold mt-1 text-amber-600">
              {data.reduce((max, item) => item.sales > max.sales ? item : max, data[0]).name}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalyticsDashboard() {
  const [dateFilter, setDateFilter] = useState<DateFilterType>('monthly')
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <DateFilter value={dateFilter} onChange={setDateFilter} />
      </div>
      
      <OverviewCards dateFilter={dateFilter} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-2 lg:col-span-4">
          <RevenueChart />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <ProductPerformanceChart />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-2 lg:col-span-4">
          <OrderVolumeChart />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <CustomerMetricsChart />
        </div>
      </div>
    </div>
  )
}
