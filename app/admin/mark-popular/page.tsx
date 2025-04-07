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

export default function MarkPopularPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)

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

  const togglePopular = async (product: Product) => {
    try {
      setUpdating(product.id)
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          is_popular: !product.is_popular
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      toast.success(`${product.name} is now ${!product.is_popular ? 'popular' : 'not popular'}`)
      fetchProducts()
    } catch (error) {
      console.error(error)
      toast.error('Failed to update product')
    } finally {
      setUpdating(null)
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
      <h1 className="text-2xl font-bold mb-6">Mark Products as Popular</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg truncate">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="aspect-video relative bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={product.image_url || "/placeholder.svg"} 
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="font-medium">${product.price.toFixed(2)}</p>
                  </div>
                  <Button
                    onClick={() => togglePopular(product)}
                    variant={product.is_popular ? "default" : "outline"}
                    disabled={updating === product.id}
                    className={product.is_popular ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    {updating === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {product.is_popular ? "Popular" : "Mark as Popular"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
