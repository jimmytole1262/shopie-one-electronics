import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, ShoppingCart, User } from "lucide-react"
import Image from "next/image"

export default function UserProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <Tabs defaultValue="profile" className="mb-12">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium">
                        First Name
                      </label>
                      <Input id="first-name" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last-name" className="text-sm font-medium">
                        Last Name
                      </label>
                      <Input id="last-name" defaultValue="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone
                    </label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="h-12 w-12 text-slate-400" />
                    </div>
                    <Button size="sm" className="absolute bottom-0 right-0 h-8 w-8 p-0 rounded-full">
                      <span className="sr-only">Change avatar</span>+
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View and track your orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Order ID</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Total</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">#ORD-7895</td>
                      <td className="py-3 px-4">Apr 2, 2025</td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Shipped
                        </span>
                      </td>
                      <td className="py-3 px-4">$129.99</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">#ORD-7894</td>
                      <td className="py-3 px-4">Apr 1, 2025</td>
                      <td className="py-3 px-4">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Delivered
                        </span>
                      </td>
                      <td className="py-3 px-4">$249.99</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">#ORD-7893</td>
                      <td className="py-3 px-4">Mar 31, 2025</td>
                      <td className="py-3 px-4">
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Processing
                        </span>
                      </td>
                      <td className="py-3 px-4">$79.99</td>
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

        <TabsContent value="addresses">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>Your default shipping address</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="font-medium">John Doe</p>
                  <p>123 Main Street</p>
                  <p>Apt 4B</p>
                  <p>San Francisco, CA 94103</p>
                  <p>United States</p>
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
                <CardDescription>Your default billing address</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="font-medium">John Doe</p>
                  <p>123 Main Street</p>
                  <p>Apt 4B</p>
                  <p>San Francisco, CA 94103</p>
                  <p>United States</p>
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Add New Address</CardTitle>
                <CardDescription>Add a new shipping or billing address</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="new-first-name" className="text-sm font-medium">
                        First Name
                      </label>
                      <Input id="new-first-name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="new-last-name" className="text-sm font-medium">
                        Last Name
                      </label>
                      <Input id="new-last-name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="new-address1" className="text-sm font-medium">
                      Address Line 1
                    </label>
                    <Input id="new-address1" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="new-address2" className="text-sm font-medium">
                      Address Line 2 (Optional)
                    </label>
                    <Input id="new-address2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="new-city" className="text-sm font-medium">
                        City
                      </label>
                      <Input id="new-city" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="new-state" className="text-sm font-medium">
                        State/Province
                      </label>
                      <Input id="new-state" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="new-zip" className="text-sm font-medium">
                        ZIP/Postal Code
                      </label>
                      <Input id="new-zip" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="new-country" className="text-sm font-medium">
                        Country
                      </label>
                      <Input id="new-country" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="new-phone" className="text-sm font-medium">
                      Phone
                    </label>
                    <Input id="new-phone" />
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600">Add Address</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
              <CardDescription>Products you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              {[1, 2, 3].length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="border rounded-lg overflow-hidden">
                      <div className="aspect-square relative">
                        <Image
                          src="/placeholder.svg?height=300&width=300"
                          alt="Product"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">Wireless Headphones</h3>
                        <p className="text-lg font-semibold mb-3">$129.99</p>
                        <div className="flex gap-2">
                          <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button variant="outline" size="icon" className="text-red-500">
                            <span className="sr-only">Remove</span>
                            &times;
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                    <Package className="h-8 w-8 text-slate-500" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
                  <p className="text-muted-foreground mb-6">
                    Save items you like to your wishlist and they'll appear here.
                  </p>
                  <Button asChild className="bg-orange-500 hover:bg-orange-600">
                    <a href="/shop">Continue Shopping</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

