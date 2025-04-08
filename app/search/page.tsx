"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Spinner } from "@/components/ui/spinner"
import ProductCard from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatKesPrice } from "@/lib/utils"

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
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams?.get("q") || ""
  
  const [searchTerm, setSearchTerm] = useState(query)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Simulated product data with dynamic images using placeholder
  const allProducts: Product[] = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 129.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Audio",
      isNew: true
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      price: 199.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Wearables",
    },
    {
      id: 3,
      name: "Bluetooth Speaker",
      price: 79.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Audio",
      discount: 10
    },
    {
      id: 4,
      name: "Wireless Earbuds",
      price: 89.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Audio",
      isPopular: true
    },
    {
      id: 5,
      name: "Premium Headphones",
      price: 249.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Audio",
    },
    {
      id: 6,
      name: "Wireless Earbuds Pro",
      price: 149.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Audio",
      isNew: true
    },
    {
      id: 7,
      name: "Noise Cancelling Headset",
      price: 199.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Audio",
    },
    {
      id: 8,
      name: "Portable Charger",
      price: 49.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Accessories",
      discount: 15
    },
    {
      id: 9,
      name: "Gaming Mouse",
      price: 89.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Gaming",
      isPopular: true
    },
    {
      id: 10,
      name: "Gaming Keyboard",
      price: 129.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Gaming",
      isNew: true
    },
    {
      id: 11,
      name: "Gaming PC",
      price: 1999.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Gaming",
      featured: true
    },
    {
      id: 12,
      name: "Gaming Headset",
      price: 149.99,
      image: "/placeholder.svg?height=300&width=300",
      category: "Gaming",
      discount: 10
    },
  ]

  useEffect(() => {
    // Simulate API call with a delay
    setLoading(true)
    setTimeout(() => {
      if (query) {
        // Improved search to handle partial matches and be more forgiving
        const searchTerms = query.toLowerCase().split(' ')
        const filtered = allProducts.filter(product => {
          const productName = product.name.toLowerCase()
          const productCategory = product.category.toLowerCase()
          
          // Check if any search term is included in the product name or category
          return searchTerms.some(term => 
            productName.includes(term) || 
            productCategory.includes(term)
          )
        })
        setProducts(filtered)
      } else {
        setProducts([])
      }
      setLoading(false)
    }, 500)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Update URL with search query
    const url = new URL(window.location.href)
    url.searchParams.set("q", searchTerm)
    window.history.pushState({}, "", url.toString())
    
    // Filter products with improved search
    if (searchTerm) {
      // Split search term into individual words for better matching
      const searchTerms = searchTerm.toLowerCase().split(' ')
      const filtered = allProducts.filter(product => {
        const productName = product.name.toLowerCase()
        const productCategory = product.category.toLowerCase()
        
        // Check if any search term is included in the product name or category
        return searchTerms.some(term => 
          productName.includes(term) || 
          productCategory.includes(term)
        )
      })
      setProducts(filtered)
    } else {
      setProducts([])
    }
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
