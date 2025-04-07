"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ProductCard from "@/components/product-card"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Product {
  id: number
  name: string
  price: number
  image_url: string
  image: string // Added to match ProductCard requirements
  category: string
  description: string
  stock: number
  featured?: boolean
  isNew?: boolean
  discount?: number
}

export default function DatabaseProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        console.log('API Response:', data)
        
        // Transform the data to match the ProductCard component's expected format
        const transformedProducts = data.map((product: any) => {
          // Generate actual product image URLs based on product category
          let imageUrl = product.image_url;
          
          if (!imageUrl || imageUrl.includes('placeholder')) {
            // Use category-specific real product images from reliable sources
            if (product.category === 'Audio') {
              if (product.name.toLowerCase().includes('headphone') || product.name.toLowerCase().includes('headset')) {
                imageUrl = 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80';
              } else if (product.name.toLowerCase().includes('speaker')) {
                imageUrl = 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80';
              } else {
                imageUrl = 'https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80';
              }
            } else if (product.category === 'Wearables') {
              imageUrl = 'https://images.unsplash.com/photo-1617625802912-cde586faf331?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80';
            } else if (product.category === 'Gaming') {
              if (product.name.toLowerCase().includes('keyboard')) {
                imageUrl = 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80';
              } else if (product.name.toLowerCase().includes('pc')) {
                imageUrl = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80';
              } else if (product.name.toLowerCase().includes('headset')) {
                imageUrl = 'https://images.unsplash.com/photo-1599669454699-248893623440?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80';
              } else {
                imageUrl = 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80';
              }
            } else {
              imageUrl = 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80';
            }
          }
          
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            // Use the generated image URL
            image: imageUrl,
            category: product.category || 'Uncategorized',
            // These are the properties that ProductCard expects
            featured: false,
            isNew: product.name.toLowerCase().includes('new') || Math.random() > 0.7,  // Randomly mark some products as new
            discount: product.name.toLowerCase().includes('bluetooth speaker') ? 10 : 0  // Add 10% discount to Bluetooth Speaker
          };
        })
        
        console.log('Transformed Products:', transformedProducts)
        
        setProducts(transformedProducts)
      } catch (error) {
        console.error("Failed to fetch products:", error)
        setError("Failed to load products. Please try again later.")
        // Log the error for debugging
        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`)
        }
      } finally {
        setIsLoading(false)
      }
    }

  // Fetch products when component mounts or when refresh is triggered
  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastRefresh])
  
  // Function to manually refresh products
  const handleRefresh = () => {
    setLastRefresh(new Date())
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">No products found from the database.</p>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Products
        </Button>
      </div>
    )
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Products from Seller Dashboard</h2>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          className="flex items-center gap-2"
          size="sm"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      <AnimatePresence>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </section>
  )
}
