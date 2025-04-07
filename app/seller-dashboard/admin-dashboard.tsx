"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart, 
  Users, 
  Settings,
  Plus,
  DollarSign,
  TrendingUp
} from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import ProductForm from "./product-form"
import { OverviewCards, RevenueChart, ProductPerformanceChart, OrderVolumeChart } from "./components/analytics-charts"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedProduct(null)
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar - hidden on mobile, shown on tablet and up */}
      <div className="hidden md:flex md:w-64 lg:w-72 bg-white border-r border-gray-200 p-4 flex-col overflow-y-auto">

        <div className="mb-6">
          <h2 className="text-xl font-bold">Shopie-one</h2>
          <p className="text-sm text-gray-500">Admin Dashboard</p>
        </div>
        
        <div className="space-y-1">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </Button>
          
          <Button
            variant={activeTab === "products" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("products")}
          >
            <Package className="mr-2 h-4 w-4" />
            Products
          </Button>
          
          <Button
            variant={activeTab === "orders" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Orders
          </Button>
          
          <Button
            variant={activeTab === "analytics" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          
          <Button
            variant="outline"
            className="w-full md:w-auto justify-start mt-4 border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white transition-colors duration-200 flex items-center"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add New Product</span>
            <span className="sm:hidden">Add Product</span>
          </Button>
          
          <Button
            variant={activeTab === "admins" ? "default" : "ghost"}
            className="w-full justify-start mt-4"
            onClick={() => setActiveTab("admins")}
          >
            <Users className="mr-2 h-4 w-4" />
            Admins
          </Button>
          
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
      
      {/* Mobile sidebar toggle - only visible on small screens */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4">
        <div>
          <h2 className="text-xl font-bold">Shopie-one</h2>
          <p className="text-sm text-gray-500">Admin Dashboard</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => {
            // Toggle a mobile menu here if needed
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
              mobileMenu.classList.toggle('hidden');
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          <span className="sr-only">Menu</span>
        </Button>
      </div>

      {/* Mobile menu - hidden by default */}
      <div id="mobile-menu" className="md:hidden hidden bg-white border-b border-gray-200 p-4 space-y-2">
        <Button
          variant={activeTab === "overview" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("overview")}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Overview
        </Button>
        
        <Button
          variant={activeTab === "products" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("products")}
        >
          <Package className="mr-2 h-4 w-4" />
          Products
        </Button>
        
        <Button
          variant={activeTab === "orders" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("orders")}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Orders
        </Button>
          
        <Button
          variant={activeTab === "analytics" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("analytics")}
        >
          <BarChart className="mr-2 h-4 w-4" />
          Analytics
        </Button>
        
        <Button
          variant="outline"
          className="w-full justify-start mt-4 border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white transition-colors duration-200 flex items-center"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
        
        <Button
          variant={activeTab === "admins" ? "default" : "ghost"}
          className="w-full justify-start mt-4"
          onClick={() => setActiveTab("admins")}
        >
          <Users className="mr-2 h-4 w-4" />
          Admins
        </Button>
        
        <Button
          variant={activeTab === "settings" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold">
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "products" && "Product Management"}
            {activeTab === "orders" && "Order Management"}
            {activeTab === "analytics" && "Analytics Dashboard"}
            {activeTab === "admins" && "Admin Management"}
            {activeTab === "settings" && "Settings"}
          </h1>
          
          {activeTab === "products" && (
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600">Add New Product</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <ProductForm 
                  product={selectedProduct} 
                  onSuccess={() => {
                    setIsFormOpen(false)
                    setSelectedProduct(null)
                  }} 
                  onCancel={handleFormClose} 
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        {/* Dynamic content based on active tab */}
        {activeTab === "overview" && (
          <>
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
                  <div className="text-2xl font-bold">2</div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <RevenueChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Product Performance</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ProductPerformanceChart />
                </CardContent>
              </Card>
            </div>
          </>
        )}
        
        {activeTab === "products" && (
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Manage your product inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium">Products</h3>
                <p className="text-sm text-gray-500">Manage your product catalog</p>
              </div>
              
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-gray-50 p-3 text-sm font-medium">
                  <div className="col-span-4">Product</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Stock</div>
                  <div className="col-span-2">Actions</div>
                </div>
                <div className="divide-y">
                  <div className="grid grid-cols-12 items-center p-3">
                    <div className="col-span-4">Wireless Headphones</div>
                    <div className="col-span-2">Audio</div>
                    <div className="col-span-2">Ksh 16,899</div>
                    <div className="col-span-2">25</div>
                    <div className="col-span-2 flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 items-center p-3">
                    <div className="col-span-4">Smart Watch Pro</div>
                    <div className="col-span-2">Wearables</div>
                    <div className="col-span-2">Ksh 25,999</div>
                    <div className="col-span-2">15</div>
                    <div className="col-span-2 flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 items-center p-3">
                    <div className="col-span-4">Bluetooth Speaker</div>
                    <div className="col-span-2">Audio</div>
                    <div className="col-span-2">Ksh 9,359</div>
                    <div className="col-span-2">30</div>
                    <div className="col-span-2 flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {activeTab === "orders" && (
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>View and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Recent Orders</h3>
                <p className="text-sm text-gray-700">Track and manage all customer orders from this dashboard.</p>
              </div>
              
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
                    <div className="col-span-3">James Kamau</div>
                    <div className="col-span-2">2025-04-02</div>
                    <div className="col-span-2">Ksh 16,899</div>
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
                    <div className="col-span-3">Sarah Wanjiku</div>
                    <div className="col-span-2">2025-04-03</div>
                    <div className="col-span-2">Ksh 25,999</div>
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
                    <div className="col-span-3">Michael Ochieng</div>
                    <div className="col-span-2">2025-04-04</div>
                    <div className="col-span-2">Ksh 9,359</div>
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
        )}
        
        {activeTab === "analytics" && (
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
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
        )}
        
        {activeTab === "admins" && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Management</CardTitle>
              <CardDescription>Manage admin users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Admin Users</h3>
                <p className="text-sm text-gray-700">Manage access to your store's admin dashboard. The primary admin has full access to all features.</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium">Current Admins</h3>
              </div>
              
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-gray-50 p-3 text-sm font-medium">
                  <div className="col-span-5">Email</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-2">Actions</div>
                </div>
                <div className="divide-y">
                  <div className="grid grid-cols-12 items-center p-3">
                    <div className="col-span-5">jimmytole1262@gmail.com</div>
                    <div className="col-span-3">Jimmy Tole</div>
                    <div className="col-span-2">Super Admin</div>
                    <div className="col-span-2">
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Primary</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 items-center p-3">
                    <div className="col-span-5">store-manager@shopie-one.co.ke</div>
                    <div className="col-span-3">John Mwangi</div>
                    <div className="col-span-2">Store Admin</div>
                    <div className="col-span-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 items-center p-3">
                    <div className="col-span-5">inventory@shopie-one.co.ke</div>
                    <div className="col-span-3">Alice Wambui</div>
                    <div className="col-span-2">Inventory</div>
                    <div className="col-span-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Add New Admin</h3>
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  // This would normally connect to your backend API
                  alert('Admin added successfully!');
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="admin-email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input id="admin-email" type="email" placeholder="Enter email address" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="admin-name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input id="admin-name" placeholder="Enter full name" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="admin-role" className="text-sm font-medium">
                      Role
                    </label>
                    <select 
                      id="admin-role" 
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select a role</option>
                      <option value="store-admin">Store Admin</option>
                      <option value="inventory">Inventory Manager</option>
                      <option value="orders">Orders Manager</option>
                    </select>
                  </div>
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600 w-full md:w-auto">Add Admin</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        )}
        
        {activeTab === "settings" && (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your seller account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">About Settings</h3>
                <p className="text-sm text-gray-700 mb-2">These settings control how your store appears to customers and how they can contact you.</p>
                <p className="text-sm text-gray-700">Changes made here will be reflected throughout your storefront.</p>
              </div>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="store-name" className="text-sm font-medium">
                    Store Name
                  </label>
                  <Input id="store-name" defaultValue="Shopie-One Electronics" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="store-description" className="text-sm font-medium">
                    Store Description
                  </label>
                  <Textarea
                    id="store-description"
                    defaultValue="Your premier destination for high-quality electronics, gadgets, and accessories. We offer the latest technology at competitive prices with exceptional customer service."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Contact Email
                    </label>
                    <Input id="email" type="email" defaultValue="jimmytole1262@gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Contact Phone
                    </label>
                    <Input id="phone" defaultValue="+254 712 345 678" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="currency" className="text-sm font-medium">
                      Currency
                    </label>
                    <Input id="currency" defaultValue="KES" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="tax-rate" className="text-sm font-medium">
                      Tax Rate (%)
                    </label>
                    <Input id="tax-rate" type="number" defaultValue="16" />
                  </div>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Product Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <ProductForm 
            product={selectedProduct} 
            onSuccess={() => {
              setIsFormOpen(false);
              setSelectedProduct(null);
            }}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
