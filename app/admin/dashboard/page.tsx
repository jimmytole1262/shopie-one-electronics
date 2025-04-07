import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, DollarSign, Package, ShoppingCart, TrendingUp, Users } from "lucide-react"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your store and track your sales</p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600">Add New Product</Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                    <h3 className="text-2xl font-bold mt-1">$24,426</h3>
                    <p className="text-xs text-green-500 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +16% from last month
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <h3 className="text-2xl font-bold mt-1">342</h3>
                    <p className="text-xs text-green-500 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% from last month
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <ShoppingCart className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Products</p>
                    <h3 className="text-2xl font-bold mt-1">128</h3>
                    <p className="text-xs text-green-500 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8 new this month
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Package className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customers</p>
                    <h3 className="text-2xl font-bold mt-1">5,845</h3>
                    <p className="text-xs text-green-500 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +18% from last month
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="products" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>All Products</CardTitle>
                  <CardDescription>Manage your product inventory and listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Product</th>
                          <th className="text-left py-3 px-4 font-medium">Category</th>
                          <th className="text-left py-3 px-4 font-medium">Price</th>
                          <th className="text-left py-3 px-4 font-medium">Stock</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-left py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4">Wireless Headphones</td>
                          <td className="py-3 px-4">Audio</td>
                          <td className="py-3 px-4">$129.99</td>
                          <td className="py-3 px-4">24</td>
                          <td className="py-3 px-4">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Active
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500">
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Bluetooth Speaker</td>
                          <td className="py-3 px-4">Audio</td>
                          <td className="py-3 px-4">$79.99</td>
                          <td className="py-3 px-4">18</td>
                          <td className="py-3 px-4">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Active
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500">
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Wireless Earbuds</td>
                          <td className="py-3 px-4">Audio</td>
                          <td className="py-3 px-4">$89.99</td>
                          <td className="py-3 px-4">12</td>
                          <td className="py-3 px-4">
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Low Stock
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500">
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Gaming Controller</td>
                          <td className="py-3 px-4">Gaming</td>
                          <td className="py-3 px-4">$59.99</td>
                          <td className="py-3 px-4">32</td>
                          <td className="py-3 px-4">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Active
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500">
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Manage and track your customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Order ID</th>
                          <th className="text-left py-3 px-4 font-medium">Customer</th>
                          <th className="text-left py-3 px-4 font-medium">Date</th>
                          <th className="text-left py-3 px-4 font-medium">Amount</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-left py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4">#ORD-7895</td>
                          <td className="py-3 px-4">John Smith</td>
                          <td className="py-3 px-4">Apr 2, 2025</td>
                          <td className="py-3 px-4">$129.99</td>
                          <td className="py-3 px-4">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Shipped
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">#ORD-7894</td>
                          <td className="py-3 px-4">Sarah Johnson</td>
                          <td className="py-3 px-4">Apr 1, 2025</td>
                          <td className="py-3 px-4">$249.99</td>
                          <td className="py-3 px-4">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Delivered
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">#ORD-7893</td>
                          <td className="py-3 px-4">Michael Brown</td>
                          <td className="py-3 px-4">Mar 31, 2025</td>
                          <td className="py-3 px-4">$79.99</td>
                          <td className="py-3 px-4">
                            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Processing
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customers">
              <Card>
                <CardHeader>
                  <CardTitle>Customer List</CardTitle>
                  <CardDescription>View and manage your customer accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Customer</th>
                          <th className="text-left py-3 px-4 font-medium">Email</th>
                          <th className="text-left py-3 px-4 font-medium">Orders</th>
                          <th className="text-left py-3 px-4 font-medium">Spent</th>
                          <th className="text-left py-3 px-4 font-medium">Last Order</th>
                          <th className="text-left py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4">John Smith</td>
                          <td className="py-3 px-4">john.smith@example.com</td>
                          <td className="py-3 px-4">12</td>
                          <td className="py-3 px-4">$1,245.88</td>
                          <td className="py-3 px-4">Apr 2, 2025</td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Sarah Johnson</td>
                          <td className="py-3 px-4">sarah.j@example.com</td>
                          <td className="py-3 px-4">8</td>
                          <td className="py-3 px-4">$876.50</td>
                          <td className="py-3 px-4">Apr 1, 2025</td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Michael Brown</td>
                          <td className="py-3 px-4">m.brown@example.com</td>
                          <td className="py-3 px-4">5</td>
                          <td className="py-3 px-4">$432.75</td>
                          <td className="py-3 px-4">Mar 31, 2025</td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Analytics</CardTitle>
                  <CardDescription>View your sales performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-slate-50 rounded-lg">
                    <BarChart className="h-10 w-10 text-muted-foreground" />
                    <p className="ml-2 text-muted-foreground">Sales chart would appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

