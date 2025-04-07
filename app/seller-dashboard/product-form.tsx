"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
  is_popular?: boolean
  is_new?: boolean
  discount?: number
  original_price?: number
}

type ProductFormProps = {
  product?: Product | null
  onSuccess?: () => void
  onCancel?: () => void
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    image_url: product?.image_url || "",
    category: product?.category || "",
    stock: product?.stock || 0,
    is_popular: product?.is_popular !== undefined ? product?.is_popular : true,
    is_new: product?.is_new !== undefined ? product?.is_new : true
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : 
             (name === "price" || name === "stock") ? 
             (value === '' ? 0 : parseFloat(value) || 0) : value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  // Validate form data before submission
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Product name is required")
      return false
    }
    if (!formData.description.trim()) {
      toast.error("Product description is required")
      return false
    }
    if (formData.price <= 0) {
      toast.error("Price must be greater than zero")
      return false
    }
    if (!formData.image_url.trim()) {
      toast.error("Image URL is required")
      return false
    }
    if (!formData.category) {
      toast.error("Please select a category")
      return false
    }
    if (formData.stock < 0) {
      toast.error("Stock cannot be negative")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form data
    if (!validateForm()) return
    
    setIsLoading(true)
    toast.loading(product ? "Updating product..." : "Adding new product...")

    try {
      const endpoint = product
        ? `/api/products/${product.id}`
        : "/api/products"
      
      const method = product ? "PUT" : "POST"

      // Prepare product data with all required fields
      const productData = {
        ...formData,
        // Ensure is_popular is included (already in formData but being explicit)
        is_popular: formData.is_popular, 
        is_new: formData.is_new,
        discount: formData.price < (product?.price || 0) ? Math.round(((product?.price || 0) - formData.price) / (product?.price || 1) * 100) : 0,
        original_price: product?.price || formData.price
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        toast.dismiss()
        if (response.status === 401 || response.status === 403) {
          toast.error("Authentication error: You don't have permission to manage products")
          return
        }
        
        try {
          const error = await response.json()
          throw new Error(error.error || `Error ${response.status}: ${response.statusText}`)
        } catch (e) {
          if (e instanceof SyntaxError) {
            // This catches JSON parsing errors
            throw new Error(`Error ${response.status}: ${response.statusText}`)
          }
          throw e
        }
      }

      toast.dismiss()
      toast.success(
        product 
          ? `Product "${formData.name}" updated successfully` 
          : `Product "${formData.name}" created successfully and marked as popular`
      )
      
      // Don't refresh the entire page to prevent reloading
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.dismiss()
      toast.error(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full sm:w-[500px] md:w-[600px] max-w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{product ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (KES)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={String(formData.price)}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={String(formData.stock)}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={handleCategoryChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="smart-home">Smart Home</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_popular"
                name="is_popular"
                checked={formData.is_popular}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <Label htmlFor="is_popular">Show in Popular Products</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_new"
                name="is_new"
                checked={formData.is_new}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <Label htmlFor="is_new">Mark as New Product</Label>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel} 
            disabled={isLoading}
            className="w-full sm:w-auto text-sm"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full sm:w-auto text-sm bg-orange-500 hover:bg-orange-600"
          >
            {isLoading ? (
              <>
                <span className="mr-2">Saving</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              </>
            ) : (
              product ? "Update Product" : "Add Product"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
