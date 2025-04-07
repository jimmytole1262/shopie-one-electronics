"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
}

interface ProductsContentProps {
  onEditProduct: (product: Product) => void
}

export default function ProductsContent({ onEditProduct }: ProductsContentProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
      console.log('Fetched products:', data)
      setProducts(data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
      toast.error("Failed to load products")
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch of products
  useEffect(() => {
    fetchProducts()
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
        // Refresh products list
        fetchProducts()
      } catch (error) {
        console.error("Error deleting product:", error)
        toast.error("An error occurred while deleting the product")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>Manage your product inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <h3 className="text-lg font-semibold text-amber-700 mb-2">Product Management</h3>
          <p className="text-sm text-gray-700 mb-2">This section allows you to manage all products in your store inventory.</p>
          <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>View all your current products</li>
            <li>Edit product details by clicking the edit icon</li>
            <li>Remove products from your inventory</li>
          </ul>
        </div>
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-sm font-medium">
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3">Ksh {product.price.toLocaleString()}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <a
                          href="#"
                          className="text-blue-500 hover:underline font-medium text-sm md:text-base inline-block px-1 py-0.5"
                          onClick={(e) => {
                            e.preventDefault();
                            onEditProduct(product);
                          }}
                        >
                          Edit
                        </a>
                        <a
                          href="#"
                          className="text-red-500 hover:underline font-medium text-sm md:text-base inline-block px-1 py-0.5"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteProduct(product.id);
                          }}
                        >
                          Delete
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No products found. Add your first product to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
