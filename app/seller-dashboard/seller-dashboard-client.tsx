"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Edit, Plus, Loader2, DollarSign, Package, ShoppingCart, TrendingUp, Users, LayoutDashboard, BarChart, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import ProductForm from "./product-form"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { OverviewCards, RevenueChart, ProductPerformanceChart, OrderVolumeChart } from "./components/analytics-charts"
import DashboardSidebar from "./components/dashboard-sidebar"

// Define product type
interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
}

// Define order type
interface Order {
  id: string
  customer: string
  date: string
  amount: number
  status: string
}

interface Admin {
  id: string
  email: string
  role: string
  created_at: string
}

const ADMIN_EMAIL = 'jimmytole1262@gmail.com'

export default function SellerDashboardClient(): React.ReactNode {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams ? searchParams.get('tab') : null
  
  const [isMounted, setIsMounted] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false)
  const [isAddingAdmin, setIsAddingAdmin] = useState(false)
  const [isRemovingAdmin, setIsRemovingAdmin] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  
  // Handle client-side only rendering to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/products')
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error("Authentication error: You don't have permission to access this resource")
          return
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
      toast.error("Failed to load products")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to sync products (real-time updates)
  const syncProducts = async () => {
    try {
      setIsSyncing(true)
      const response = await fetch('/api/products?sync=true')
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setProducts(data)
      toast.success("Products synchronized successfully")
    } catch (error) {
      console.error("Failed to sync products:", error)
      toast.error("Failed to sync products")
    } finally {
      setIsSyncing(false)
    }
  }
  
  // Initial fetch of products - only fetch once when component mounts
  useEffect(() => {
    fetchProducts()
    // No polling interval to prevent frequent reloading
  }, [])
  
  // Fetch admins
  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoadingAdmins(true)
      try {
        const response = await fetch('/api/admins')
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            toast.error("Authentication error: You don't have permission to access this resource")
            return
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        setAdmins(data)
      } catch (error) {
        console.error("Failed to fetch admins:", error)
        toast.error("Failed to load admins")
      } finally {
        setIsLoadingAdmins(false)
      }
    }
    
    fetchAdmins()
  }, [])
  
  // Handle product deletion
  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            toast.error("Authentication error: You don't have permission to delete products")
            return
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        
        // Update products state
        setProducts(products.filter(product => product.id !== id))
        toast.success("Product deleted successfully")
      } catch (error) {
        console.error("Error deleting product:", error)
        toast.error("An error occurred while deleting the product")
      }
    }
  }
  
  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsFormOpen(true)
  }
  
  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedProduct(null)
  }
  
  // Handle form success
  const handleFormSuccess = () => {
    // Close the form
    setIsFormOpen(false)
    setSelectedProduct(null)
    
    // Sync products to update the list in real-time without page reload
    syncProducts()
    
    // No router.refresh() call to prevent full page reload
  }
  
  // Handle add admin
  const handleAddAdmin = async () => {
    if (!newAdminEmail) return
    
    setIsAddingAdmin(true)
    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newAdminEmail }),
      })
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error("Authentication error: You don't have permission to add admins")
          return
        }
        
        try {
          const error = await response.json()
          toast.error(error.error || `Error ${response.status}: ${response.statusText}`)
        } catch {
          toast.error(`Error ${response.status}: ${response.statusText}`)
        }
        return
      }
      
      const newAdmin = await response.json()
      setAdmins([newAdmin, ...admins])
      setNewAdminEmail('')
      toast.success(`Added ${newAdminEmail} as admin`)
    } catch (error) {
      console.error('Error adding admin:', error)
      toast.error('An error occurred while adding the admin')
    } finally {
      setIsAddingAdmin(false)
    }
  }
  
  // Handle remove admin
  const handleRemoveAdmin = async (id: string) => {
    if (confirm("Are you sure you want to remove this admin?")) {
      setIsRemovingAdmin(true)
      try {
        const response = await fetch(`/api/admins/${id}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            toast.error("Authentication error: You don't have permission to remove admins")
            return
          }
          
          try {
            const error = await response.json()
            toast.error(error.error || `Error ${response.status}: ${response.statusText}`)
          } catch {
            toast.error(`Error ${response.status}: ${response.statusText}`)
          }
          return
        }
        
        // Update admins state
        setAdmins(admins.filter(admin => admin.id !== id))
        toast.success("Admin removed successfully")
      } catch (error) {
        console.error("Error removing admin:", error)
        toast.error("An error occurred while removing the admin")
      } finally {
        setIsRemovingAdmin(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // If not mounted yet, render a loading spinner to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex justify-center items-center min-h-screen" suppressHydrationWarning={true}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" suppressHydrationWarning={true}></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden" suppressHydrationWarning={true}>
      {/* Sidebar */}
      <DashboardSidebar 
        activeTab={tabParam || "overview"} 
        onTabChange={(tabId: string) => {
          // Update URL when tab changes without full page reload
          const url = new URL(window.location.href);
          url.searchParams.set('tab', tabId);
          window.history.pushState({}, '', url);
          router.replace(`?tab=${tabId}`, { scroll: false });
        }}
        onAddProduct={() => setIsFormOpen(true)}
      />
      
      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold">Seller Dashboard</h2>
            <p className="text-muted-foreground">Manage your products and track your sales</p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <ProductForm 
                product={selectedProduct} 
                onSuccess={handleFormSuccess} 
                onCancel={handleFormClose} 
              />
            </DialogContent>
          </Dialog>
        </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$15,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">+12 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24</div>
            <p className="text-xs text-muted-foreground">+19% from average</p>
          </CardContent>
        </Card>
      </div>

      <Tabs 
        defaultValue={tabParam || "overview"} 
        className="space-y-4"
        onValueChange={(value) => {
          // Update URL when tab changes without full page reload
          const url = new URL(window.location.href);
          url.searchParams.set('tab', value);
          window.history.pushState({}, '', url);
        }}
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 font-medium relative group"
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:inline">Overview</span>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap md:hidden">
              Overview
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="products" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 font-medium relative group"
          >
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden md:inline">Products</span>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap md:hidden">
              Products
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="orders" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 font-medium relative group"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden md:inline">Orders</span>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap md:hidden">
              Orders
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 font-medium relative group"
          >
            <div className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className="hidden md:inline">Analytics</span>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap md:hidden">
              Analytics
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="admins" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 font-medium relative group"
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Admins</span>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap md:hidden">
              Admins
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 font-medium relative group"
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Settings</span>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap md:hidden">
              Settings
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="p-6">
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
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Wireless Earbuds</p>
                      <p className="text-xs text-muted-foreground">142 units sold</p>
                    </div>
                    <div className="text-sm font-medium">$18,459</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <Package className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Smart Watch</p>
                      <p className="text-xs text-muted-foreground">89 units sold</p>
                    </div>
                    <div className="text-sm font-medium">$22,249</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <Package className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Bluetooth Speaker</p>
                      <p className="text-xs text-muted-foreground">65 units sold</p>
                    </div>
                    <div className="text-sm font-medium">$5,849</div>
                  </div>
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
        </TabsContent>

        <TabsContent value="products" className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Manage your product inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-gray-50 p-3 text-sm font-medium">
                  <div className="col-span-4">Product</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Stock</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Actions</div>
                </div>
                <div className="divide-y">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <div key={product.id} className="grid grid-cols-12 items-center p-3">
                        <div className="col-span-4 flex items-center">
                          <div className="h-10 w-10 rounded-md bg-gray-100 mr-2">
                            {product.image_url && (
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">
                              {product.description}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2">${product.price.toFixed(2)}</div>
                        <div className="col-span-2">{product.stock}</div>
                        <div className="col-span-2">{product.category}</div>
                        <div className="col-span-2 flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      No products found. Add your first product to get started.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>View and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-gray-50 p-3 text-sm font-medium">
                  <div className="col-span-1">ID</div>
                  <div className="col-span-3">Customer</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Actions</div>
                </div>
                <div className="divide-y">
                  <div className="grid grid-cols-12 items-center p-3">
                    <div className="col-span-1">#1001</div>
                    <div className="col-span-3">John Smith</div>
                    <div className="col-span-2">2023-05-10</div>
                    <div className="col-span-2">$129.99</div>
                    <div className="col-span-2">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Completed
                      </span>
                    </div>
                    <div className="col-span-2">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 items-center p-3">
                    <div className="col-span-1">#1002</div>
                    <div className="col-span-3">Sarah Johnson</div>
                    <div className="col-span-2">2023-05-11</div>
                    <div className="col-span-2">$249.99</div>
                    <div className="col-span-2">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        Processing
                      </span>
                    </div>
                    <div className="col-span-2">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 items-center p-3">
                    <div className="col-span-1">#1003</div>
                    <div className="col-span-3">Michael Brown</div>
                    <div className="col-span-2">2023-05-12</div>
                    <div className="col-span-2">$89.99</div>
                    <div className="col-span-2">
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Shipped
                      </span>
                    </div>
                    <div className="col-span-2">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage admin users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Admin Users</h3>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 border-b bg-gray-50 p-3 text-sm font-medium">
                      <div className="col-span-5">Email</div>
                      <div className="col-span-3">Role</div>
                      <div className="col-span-2">Added On</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                    <div className="divide-y">
                      {isLoadingAdmins ? (
                        <div className="p-8 text-center">
                          <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500"></div>
                        </div>
                      ) : admins && admins.length > 0 ? (
                        admins.map((admin) => (
                          <div key={admin.id} className="grid grid-cols-12 items-center p-3">
                            <div className="col-span-5">{admin.email}</div>
                            <div className="col-span-3">{admin.role || 'Admin'}</div>
                            <div className="col-span-2">{new Date(admin.created_at).toLocaleDateString()}</div>
                            <div className="col-span-2">
                              {admin.email !== ADMIN_EMAIL ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-500 border-red-200 hover:bg-red-50"
                                  onClick={() => handleRemoveAdmin(admin.id)}
                                  disabled={isRemovingAdmin}
                                >
                                  Remove
                                </Button>
                              ) : (
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Primary Admin</span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          No users found.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border mt-6">
                  <h3 className="text-lg font-medium mb-4">Add New User</h3>
                  <div className="flex gap-4">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleAddAdmin}
                      disabled={isAddingAdmin || !newAdminEmail}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isAddingAdmin ? 'Adding...' : 'Add User'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="p-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Analytics Dashboard</CardTitle>
              <CardDescription>Comprehensive overview of your store performance</CardDescription>
            </CardHeader>
            <CardContent>
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
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Seller Settings</CardTitle>
              <CardDescription>Manage your seller account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="store-name" className="text-sm font-medium">
                    Store Name
                  </label>
                  <Input id="store-name" defaultValue="TechGadgets Store" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="store-description" className="text-sm font-medium">
                    Store Description
                  </label>
                  <Textarea
                    id="store-description"
                    defaultValue="We sell high-quality tech gadgets and accessories at competitive prices."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Contact Email
                    </label>
                    <Input id="email" type="email" defaultValue="admin@shopie-one.co.ke" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Contact Phone
                    </label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
