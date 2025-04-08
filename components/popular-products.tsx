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
    price: 12999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category: 'Audio',
    isNew: true,
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    price: 19999,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop',
    category: 'Wearables',
    discount: 15,
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500&h=500&fit=crop',
    category: 'Audio',
  },
  {
    id: 4,
    name: 'Wireless Earbuds',
    price: 8999,
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
          // Import Supabase client
          const { createClient } = await import('@supabase/supabase-js')
          
          // Initialize Supabase client
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
          const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
          
          // Check if Supabase is configured
          if (supabaseUrl && supabaseKey) {
            try {
              const supabase = createClient(supabaseUrl, supabaseKey)
              
              // Fetch products from Supabase
              const { data: supabaseData, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })
              
              if (error) {
                console.error('Supabase fetch error:', error)
                throw error
              }
              
              if (supabaseData && supabaseData.length > 0) {
                // Process Supabase data
                let popularProducts = supabaseData.filter((product: any) => product.is_popular === true);
                
                // If no popular products found, use the first 4
                if (popularProducts.length === 0) {
                  popularProducts = supabaseData.slice(0, Math.min(4, supabaseData.length));
                }
                
                // Transform the data to match our Product interface
                let transformedProducts = popularProducts.map((product: any) => {
                  return {
                    id: product.id,
                    name: product.name,
                    price: parseFloat(product.price),
                    originalPrice: product.original_price ? parseFloat(product.original_price) : undefined,
                    image: product.image_url || '/placeholder.svg?height=300&width=300',
                    category: product.category || 'Uncategorized',
                    isNew: product.is_new,
                    discount: product.discount,
                    isPopular: product.is_popular
                  };
                });
                
                if (transformedProducts.length > 0) {
                  setProducts(transformedProducts)
                  // Cache the products for future use
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('popularProducts', JSON.stringify(transformedProducts))
                  }
                  return; // Exit early if we have Supabase data
                }
              }
              
              // If we get here, Supabase didn't have data we could use
              throw new Error('No usable data from Supabase');
              
            } catch (supabaseError) {
              console.error('Supabase error:', supabaseError)
              // Fall back to API if Supabase fails
            }
          }
          
          // Fallback to API if Supabase is not configured or failed
          const response = await fetch('/api/products', {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            },
            // Disable caching completely
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
            // If we get an HTML response instead of JSON, use fallback data
            console.error('Received non-JSON response:', contentType)
            // Use fallback data instead of throwing an error
            setProducts(fallbackPopularProducts)
            return
          }
          
          if (!response.ok) {
            console.error(`API error: ${response.status} ${response.statusText}`)
            setProducts(fallbackPopularProducts)
            return
          }
          
          // Safely parse JSON
          let data
          try {
            // Get the response as text first to check for HTML content
            const text = await response.text()
            
            // Check if the text is valid JSON before parsing
            if (!text || text.trim() === '') {
              console.error('Empty response received')
              setProducts(fallbackPopularProducts)
              return
            }
            
            // Check for HTML content explicitly
            if (text.includes('<!DOCTYPE') || text.includes('<html')) {
              console.error('Received HTML instead of JSON')
              setProducts(fallbackPopularProducts)
              return
            }
            
            // Try to parse the JSON safely
            try {
              data = JSON.parse(text)
            } catch (jsonError) {
              console.error('JSON parsing error:', jsonError)
              setProducts(fallbackPopularProducts)
              return
            }
          } catch (parseError) {
            console.error('Error reading response:', parseError)
            setProducts(fallbackPopularProducts)
            return
          }
          
          // Ensure data is properly structured
          if (!data) {
            console.error('No data received from API')
            return
          }
          
          // Handle different response formats
          if (!Array.isArray(data)) {
            // Check if data has a products property that's an array
            if (data.products && Array.isArray(data.products)) {
              data = data.products
            } else {
              console.error('API response is not in expected format:', typeof data)
              return
            }
          }
          
          // Create a mutable array to store our popular products
          let popularProducts: any[] = [];
          
          try {
            // Try to filter for popular products, but this might fail if the column doesn't exist
            popularProducts = data.filter((product: any) => product.is_popular === true);
          } catch (err) {
            console.log('Error filtering popular products:', err);
            // Column likely doesn't exist, continue with empty array
          }
          
          // If we have no popular products or the filter failed, use random products
          if (popularProducts.length === 0 && data.length > 0) {
            console.log('No products marked as popular, using random products instead');
            // Shuffle the array to get random products
            const shuffled = [...data].sort(() => 0.5 - Math.random());
            // Take the first 4 items or all if less than 4
            popularProducts = shuffled.slice(0, Math.min(4, shuffled.length));
          }
          
          // Transform the data to match our Product interface
          let transformedProducts = popularProducts.map((product: any) => {
            // Convert price to a number in cents (whole number)
            let price = product.price;
            if (typeof price === 'string') {
              price = Math.round(parseFloat(price) * 100);
            } else if (typeof price === 'number' && price < 1000) {
              // If price is already a number but in dollars format (e.g. 59.99), convert to cents
              price = Math.round(price * 100);
            }
            
            // Convert original price if it exists
            let originalPrice = product.original_price;
            if (originalPrice) {
              if (typeof originalPrice === 'string') {
                originalPrice = Math.round(parseFloat(originalPrice) * 100);
              } else if (typeof originalPrice === 'number' && originalPrice < 1000) {
                originalPrice = Math.round(originalPrice * 100);
              }
            }
            
            return {
              id: product.id,
              name: product.name,
              price: price,
              originalPrice: originalPrice || undefined,
              image: product.image_url || '/placeholder.svg?height=300&width=300',
              category: product.category || 'Uncategorized',
              isNew: product.is_new,
              discount: product.discount,
              isPopular: product.is_popular
            };
          })
          
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
            // Don't show toast notifications for timeouts
          } else {
            console.error('Fetch operation failed:', fetchError.message)
            // Don't show error toast at all - silently use cached data
            // This prevents the error message from showing to users
          }
          
          // If we have fallback products, use them
          if (fallbackPopularProducts.length > 0) {
            setProducts(fallbackPopularProducts)
          }
          
          // Always log the full error for debugging
          console.error('Full fetch error:', fetchError)
          
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
        <Button 
          variant="outline" 
          className="border-slate-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors"
          onClick={() => window.location.href = '/shop'}
        >
          See more products
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
