"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
  image_url: string
  category: string
  description: string
  is_popular: boolean
}

export default function UpdateProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const markAllAsPopular = async () => {
    try {
      setUpdating(true)
      toast.info("Updating all products to popular status...")
      
      // Update each product one by one
      for (const product of products) {
        if (!product.is_popular) {
          await fetch(`/api/products/${product.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...product,
              is_popular: true
            }),
          })
        }
      }
      
      toast.success("All products have been marked as popular!")
      fetchProducts()
    } catch (error) {
      console.error(error)
      toast.error('Failed to update products')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Update All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Found {products.length} products in the database.</p>
            <p>Popular products: {products.filter(p => p.is_popular).length}</p>
            <p>Non-popular products: {products.filter(p => !p.is_popular).length}</p>
            
            <Button 
              onClick={markAllAsPopular}
              disabled={updating || products.every(p => p.is_popular)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Mark All Products as Popular"
              )}
            </Button>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Product List</h3>
            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category} - ${product.price}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${product.is_popular ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {product.is_popular ? 'Popular' : 'Not Popular'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
