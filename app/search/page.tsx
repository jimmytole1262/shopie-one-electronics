"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Spinner } from "@/components/ui/spinner"
import ProductCard from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatKesPrice } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

// Product type definition
interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  featured?: boolean
  isNew?: boolean
  discount?: number
  isPopular?: boolean
  stock?: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams?.get("q") || ""
  
  const [searchTerm, setSearchTerm] = useState(query)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Function to perform the actual search from Supabase
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery) {
      setProducts([])
      return
    }

    try {
      // Split search terms for better matching
      const searchTerms = searchQuery.toLowerCase().split(' ')
      
      // Fetch all products from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
      
      if (error) {
        console.error('Error fetching products:', error)
        return
      }
      
      if (!data || data.length === 0) {
        setProducts([])
        return
      }
      
      // Filter products client-side based on search terms
      const filtered = data.filter(product => {
        const productName = product.name?.toLowerCase() || ''
        const productCategory = product.category?.toLowerCase() || ''
        
        // Check if any search term is included in the product name or category
        return searchTerms.some(term => 
          productName.includes(term) || 
          productCategory.includes(term)
        )
      })
      
      // Map to ensure all products have the correct format
      const formattedProducts = filtered.map(product => ({
        id: parseInt(product.id),
        name: product.name || 'Unnamed Product',
        price: parseFloat(product.price) || 0,
        image: product.image || '/placeholder.svg?height=300&width=300',
        category: product.category || 'Uncategorized',
        featured: product.featured || false,
        isNew: product.isNew || false,
        discount: product.discount || 0,
        isPopular: product.isPopular || false,
        stock: product.stock || 0
      }))
      
      setProducts(formattedProducts)
    } catch (error) {
      console.error('Error in search:', error)
      setProducts([])
    }
  }

  // Effect to handle URL query parameter changes
  useEffect(() => {
    // Update the search term state when the URL query changes
    setSearchTerm(query)
    
    // Fetch products based on search query
    setLoading(true)
    const timer = setTimeout(async () => {
      await performSearch(query)
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Update URL with search query and navigate
    const params = new URLSearchParams(searchParams.toString())
    params.set("q", searchTerm)
    
    // Use router.push to properly update the URL and trigger a navigation
    router.push(`/search?${params.toString()}`)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Search Products
      </motion.div>

      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
          <Input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
            Search
          </Button>
        </form>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" className="text-orange-500" />
        </div>
      ) : (
        <>
          {query && (
            <motion.div 
              className="mb-4 text-slate-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {products.length === 0 
                ? `No products found for "${query}"` 
                : `Found ${products.length} product${products.length === 1 ? '' : 's'} for "${query}"`}
            </motion.div>
          )}

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </>
      )}
    </div>
  )
}
