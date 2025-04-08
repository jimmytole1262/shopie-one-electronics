"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { EditIcon, DeleteIcon, PlusIcon, LoadingIcon } from "@/components/admin/admin-icons"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface Product {
  id: number
  name: string
  price: number
  description: string
  image_url: string
  category: string
  stock: number
  is_popular: boolean
  is_new: boolean
  discount?: number
  original_price?: number
}

const CATEGORIES = ["Audio", "Wearables", "Accessories", "Gaming", "Smartphones", "Laptops"]

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    price: 0,
    description: "",
    image_url: "",
    category: "Audio",
    stock: 10,
    is_popular: true,
    is_new: false,
    discount: 0
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      console.log('Fetching products...')
      
      // Add cache-busting parameter to avoid browser caching
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/products?_=${timestamp}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
      }
      
      // Safely parse the JSON response
      const text = await response.text()
      console.log('Received response:', text.substring(0, 100) + (text.length > 100 ? '...' : ''))
      
      let data
      try {
        // Only try to parse if we have content
        if (text && text.trim()) {
          // Check if the response starts with HTML (which would indicate an error)
          if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
            console.error('Received HTML instead of JSON:', text.substring(0, 200))
            toast.error('Server returned HTML instead of JSON. Please check server logs.')
            return
          }
          
          data = JSON.parse(text)
        } else {
          console.error('Empty response received')
          toast.error('Server returned an empty response')
          return
        }
      } catch (parseError) {
        console.error('Failed to parse products JSON:', parseError, '\nResponse text:', text.substring(0, 200))
        toast.error('Failed to parse product data')
        return
      }
      
      // Validate the data is an array
      if (!Array.isArray(data)) {
        console.error('Products data is not an array:', data)
        toast.error('Invalid product data format')
        return
      }
      
      console.log(`Successfully fetched ${data.length} products`)
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error(`Failed to load products: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let parsedValue: string | number = value
    
    // Handle numeric inputs
    if (name === 'price' || name === 'stock' || name === 'discount' || name === 'original_price') {
      parsedValue = value === '' ? 0 : Number(value)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const openAddDialog = () => {
    setCurrentProduct(null)
    setFormData({
      name: "",
      price: 0,
      description: "",
      image_url: "",
      category: "Audio",
      stock: 10,
      is_popular: true,
      is_new: false,
      discount: 0
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product)
    // Convert price from cents to dollars for display
    const displayPrice = product.price / 100
    const displayOriginalPrice = product.original_price ? product.original_price / 100 : undefined
    
    setFormData({
      ...product,
      price: displayPrice,
      original_price: displayOriginalPrice
    })
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.name?.trim()) {
        toast.error('Product name is required')
        return
      }
      
      if (!formData.price || Number(formData.price) <= 0) {
        toast.error('Product price must be greater than 0')
        return
      }
      
      if (!formData.category) {
        toast.error('Product category is required')
        return
      }
      
      setIsSubmitting(true)
      
      // Convert price from dollars to cents for storage
      const dataToSubmit = {
        ...formData,
        price: Math.round((formData.price as number) * 100),
        original_price: formData.original_price ? Math.round((formData.original_price as number) * 100) : undefined,
        // Ensure stock is a number
        stock: formData.stock ? Number(formData.stock) : 0
      }
      
      console.log(`Submitting product data:`, dataToSubmit)
      
      let response
      
      if (currentProduct) {
        // Update existing product
        response = await fetch(`/api/products/${currentProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSubmit),
          // Remove credentials to avoid CORS issues
        })
      } else {
        // Create new product
        response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSubmit),
          // Remove credentials to avoid CORS issues
        })
      }
      
      // Handle non-JSON responses safely
      let result
      try {
        // First try to get the response as text
        const responseText = await response.text()
        
        // Only try to parse as JSON if it's not empty
        if (responseText && responseText.trim()) {
          try {
            result = JSON.parse(responseText)
          } catch (parseError) {
            console.error('Failed to parse response as JSON:', parseError, '\nResponse text:', responseText)
            // If we can't parse as JSON but the response was OK, we'll still consider it a success
            if (!response.ok) {
              throw new Error(`Failed to parse server response: ${responseText.substring(0, 100)}`)
            }
          }
        }
      } catch (textError) {
        console.error('Error getting response text:', textError)
        if (!response.ok) {
          throw new Error(`Failed to process response: ${response.status} ${response.statusText}`)
        }
      }
      
      // If the response wasn't OK, throw an error
      if (!response.ok) {
        let errorMessage = `Failed to save product: ${response.status} ${response.statusText}`
        if (result && result.error) {
          errorMessage = result.error
        }
        throw new Error(errorMessage)
      }
      
      toast.success(currentProduct ? `Product "${formData.name}" updated successfully` : `Product "${formData.name}" created successfully`)
      setIsDialogOpen(false)
      
      // Add a short delay before refreshing to ensure the server has processed the change
      setTimeout(() => {
        fetchProducts() // Refresh the product list
      }, 500)
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error(`Failed to save product: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!currentProduct) return
    
    try {
      setIsSubmitting(true)
      
      console.log(`Deleting product with ID: ${currentProduct.id}`)
      
      const response = await fetch(`/api/products/${currentProduct.id}`, {
        method: 'DELETE',
        // Remove credentials to avoid CORS issues
      })
      
      // Handle non-JSON responses safely
      let result
      try {
        // First try to get the response as text
        const responseText = await response.text()
        
        // Only try to parse as JSON if it's not empty
        if (responseText && responseText.trim()) {
          try {
            result = JSON.parse(responseText)
          } catch (parseError) {
            console.error('Failed to parse response as JSON:', parseError, '\nResponse text:', responseText)
            // If we can't parse as JSON but the response was OK, we'll still consider it a success
            if (!response.ok) {
              throw new Error(`Failed to parse server response: ${responseText.substring(0, 100)}`)
            }
          }
        }
      } catch (textError) {
        console.error('Error getting response text:', textError)
        if (!response.ok) {
          throw new Error(`Failed to process response: ${response.status} ${response.statusText}`)
        }
      }
      
      // If the response wasn't OK, throw an error
      if (!response.ok) {
        let errorMessage = `Failed to delete product: ${response.status} ${response.statusText}`
        if (result && result.error) {
          errorMessage = result.error
        }
        throw new Error(errorMessage)
      }
      
      toast.success(`Product "${currentProduct.name}" deleted successfully`)
      setIsDeleteDialogOpen(false)
      
      // Add a short delay before refreshing to ensure the server has processed the change
      setTimeout(() => {
        fetchProducts() // Refresh the product list
      }, 500)
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader />
          <main className="p-6 flex justify-center items-center">
            <LoadingIcon className="h-10 w-10 text-orange-500" />
            <p className="mt-4 text-gray-500">Loading products...</p>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Product Management</h1>
              <p className="text-muted-foreground">Manage your store's products</p>
            </div>
            <Button 
              className="bg-orange-500 hover:bg-orange-600"
              onClick={openAddDialog}
            >
              <PlusIcon />
              Add New Product
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Products ({products.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Image</th>
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Price</th>
                      <th className="text-left py-3 px-4 font-medium">Category</th>
                      <th className="text-left py-3 px-4 font-medium">Stock</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b">
                        <td className="py-3 px-4">
                          <div className="w-12 h-12 rounded overflow-hidden">
                            <img 
                              src={product.image_url || '/placeholder.svg?height=48&width=48'} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg?height=48&width=48'
                              }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{product.name}</td>
                        <td className="py-3 px-4">${(product.price / 100).toFixed(2)}</td>
                        <td className="py-3 px-4">{product.category}</td>
                        <td className="py-3 px-4">{product.stock}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1">
                            {product.is_popular && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Popular
                              </span>
                            )}
                            {product.is_new && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                New
                              </span>
                            )}
                            {product.discount && product.discount > 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                {product.discount}% Off
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditDialog(product)}
                            >
                              <EditIcon />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openDeleteDialog(product)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <DeleteIcon />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-muted-foreground">
                          No products found. Add your first product to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Product Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price || 0}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category || 'Audio'}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock || 0}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  value={formData.discount || 0}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original_price">Original Price ($)</Label>
                <Input
                  id="original_price"
                  name="original_price"
                  type="number"
                  value={formData.original_price || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url || ''}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
              {formData.image_url && (
                <div className="mt-2 w-24 h-24 rounded overflow-hidden">
                  <img 
                    src={formData.image_url}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg?height=96&width=96'
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_popular"
                  checked={formData.is_popular || false}
                  onCheckedChange={(checked) => handleSwitchChange('is_popular', checked)}
                />
                <Label htmlFor="is_popular">Popular Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_new"
                  checked={formData.is_new || false}
                  onCheckedChange={(checked) => handleSwitchChange('is_new', checked)}
                />
                <Label htmlFor="is_new">New Product</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingIcon className="mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                'Save Product'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete "{currentProduct?.name}"? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingIcon className="mr-2 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
