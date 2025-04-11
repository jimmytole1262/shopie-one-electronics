"use client"

import ProductCard from "@/components/product-card"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  featured?: boolean
  isNew?: boolean
  discount?: number
  isPopular?: boolean
}

// Fallback products in case API fails
const fallbackFeaturedProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 24999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "Audio",
    featured: true,
    discount: 10,
  },
  {
    id: 2,
    name: "Wireless Earbuds Pro",
    price: 14999,
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop",
    category: "Audio",
    featured: true,
    isNew: true,
  },
  {
    id: 3,
    name: "Noise Cancelling Gaming Headset",
    price: 19999,
    image: "https://images.unsplash.com/photo-1600086827875-a63b01f1335c?w=500&h=500&fit=crop",
    category: "Gaming",
    featured: true,
  },
]

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>(fallbackFeaturedProducts)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true)
        
        // Safely attempt to fetch products from Supabase
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('featured', true)
            .limit(8)
            
          // If we have valid data, use it
          if (!error && data && data.length > 0) {
            const validatedProducts = data.map(product => ({
              id: product.id || Math.random(),
              name: product.name || 'Product',
              price: typeof product.price === 'number' ? product.price : 
                    typeof product.price === 'string' ? parseFloat(product.price) : 0,
              image: product.image_url || '/placeholder-product.png',
              category: product.category || 'Uncategorized',
              featured: true
            }))
            
            setProducts(validatedProducts)
          } else {
            // Silently use fallback products
            console.log('Using fallback products (no data or error from Supabase)')
          }
        } catch (supabaseError) {
          // Silently use fallback products
          console.log('Using fallback products (Supabase error)')
        }
      } catch (error) {
        // Silently use fallback products
        console.log('Using fallback products (general error)')
      } finally {
        setIsLoading(false)
      }
    }
    
    // Use requestAnimationFrame to avoid React setState during render issues
    if (typeof window !== 'undefined') {
      const frame = requestAnimationFrame(() => {
        fetchFeaturedProducts()
      })
      
      return () => cancelAnimationFrame(frame)
    }
  }, [])
  
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center mb-2">Featured Products</h2>
      <div className="flex justify-center mb-10">
        <div className="w-24 h-1 bg-orange-500 rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
