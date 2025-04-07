"use client"

import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isNew?: boolean
  discount?: number
  isPopular?: boolean
}

// Fallback products with high-quality images in case API fails
const fallbackPopularProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category: 'Audio',
    isNew: true,
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop',
    category: 'Wearables',
    discount: 15,
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500&h=500&fit=crop',
    category: 'Audio',
  },
  {
    id: 4,
    name: 'Wireless Earbuds',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop',
    category: 'Audio',
    isNew: true,
  },
]

export default function PopularProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Use fallback products immediately to prevent loading state
        setProducts(fallbackPopularProducts)
        
        // First try to get products from localStorage cache
        let initialProducts = []
        if (typeof window !== 'undefined') {
          const cachedProducts = localStorage.getItem('popularProducts')
          
          if (cachedProducts) {
            try {
              initialProducts = JSON.parse(cachedProducts)
              // Show cached products immediately while fetching fresh data
              if (initialProducts.length > 0) {
                setProducts(initialProducts)
              }
            } catch (e) {
              console.error('Error parsing cached products:', e)
              // Continue with fetch if cache parsing fails
            }
          }
        }
        
        // Add a shorter timeout to the fetch request to prevent long waits
        const controller = new AbortController();
        let timeoutId: NodeJS.Timeout | null = null;
        
        // Create a more robust timeout mechanism
        const setupTimeout = () => {
          return setTimeout(() => {
            console.log('API request timed out, using fallback products');
            // Only abort if the controller is not already aborted
            if (!controller.signal.aborted) {
              controller.abort('Timeout exceeded');
            }
          }, 5000); // 5 second timeout
        };
        
        timeoutId = setupTimeout();
        
        try {
          // Use a try-catch block specifically for the fetch operation
          const response = await fetch('/api/products', {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json'
            },
            // Add cache: 'no-store' to prevent caching issues
            cache: 'no-store'
          });
          
          // Clear the timeout if the request completes successfully
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          
          // Check for HTML response (which would indicate an error page)
          const contentType = response.headers.get('content-type')
          if (!contentType || !contentType.includes('application/json')) {
            console.error('Received non-JSON response:', contentType)
            throw new Error('Invalid response format - expected JSON')
          }
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`)
          }
          
          // Safely parse JSON
          let data
          try {
            data = await response.json()
          } catch (parseError) {
            console.error('JSON parsing error:', parseError)
            throw new Error('Failed to parse API response as JSON')
          }
          
          // Ensure data is an array
          if (!Array.isArray(data)) {
            console.error('API response is not an array:', typeof data)
            throw new Error('Invalid API response format - expected array')
          }
          
          // Filter to only include popular products
          const popularProducts = data.filter((product: any) => product.is_popular === true)
          
          if (popularProducts.length === 0 && data.length > 0) {
            // If we have products but none are marked as popular, use the first few
            console.log('No products marked as popular, using first few products instead')
            popularProducts.push(...data.slice(0, 4))
          }
          
          // Transform the data to match our Product interface
          const transformedProducts = popularProducts.map((product: any) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.original_price,
            image: product.image_url || '/placeholder.svg?height=300&width=300',
            category: product.category || 'Uncategorized',
            isNew: product.is_new,
            discount: product.discount,
            isPopular: product.is_popular
          }))
          
          if (transformedProducts.length > 0) {
            setProducts(transformedProducts)
            // Cache the products for future use
            if (typeof window !== 'undefined') {
              localStorage.setItem('popularProducts', JSON.stringify(transformedProducts))
            }
          } else {
            throw new Error('No popular products found')
          }
          
        } catch (fetchError: any) {
          // Handle specific fetch errors
          if (fetchError.name === 'AbortError') {
            console.error('Fetch request timed out')
            // Don't set error message if we have fallback products
            // This prevents the error message from showing to users
            toast.error('Network request timed out. Using cached data.', {
              duration: 3000,
              position: 'bottom-right',
            })
          } else {
            console.error('Fetch operation failed:', fetchError.message)
            // Only show error toast if it's not a timeout
            if (fetchError.message !== 'The user aborted a request.') {
              toast.error('Could not load latest products. Using cached data.', {
                duration: 3000,
                position: 'bottom-right',
              })
            }
          }
          
          // Only throw if we don't have fallback products
          if (products.length === 0) {
            throw fetchError
          }
        }
      } catch (error) {
        console.error('Failed to fetch popular products:', error)
        // Use static placeholder data if API fails and we have no cached data
        setProducts(fallbackPopularProducts)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPopularProducts()
  }, [])

  // Don't show loading state, always render products (either fallback or real)
  // This helps prevent hydration errors

  return (
    <section className="container mx-auto px-4 py-12" suppressHydrationWarning>
      <h2 className="text-2xl font-bold mb-8" suppressHydrationWarning>Popular products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" suppressHydrationWarning>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="flex justify-center mt-10" suppressHydrationWarning>
        <Button variant="outline" className="border-slate-200">
          See more
        </Button>
      </div>
      {isLoading && (
        <div className="absolute top-0 right-0 p-2">
          <X className="h-4 w-4 text-orange-500 animate-spin" />
        </div>
      )}
    </section>
  )
}
