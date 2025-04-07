"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 6899,
    image: "https://cdn.pixabay.com/photo/2016/10/06/22/29/headphones-1720164_640.jpg",
    category: "Audio",
    isNew: true
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    price: 7999,
    image: "https://cdn.pixabay.com/photo/2015/06/25/17/21/smart-watch-821557_640.jpg",
    category: "Wearables",
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 9359,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80",
    category: "Audio",
    discount: 10
  },
  {
    id: 4,
    name: "Wireless Earbuds",
    price: 1299,
    image: "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80",
    category: "Audio",
    isPopular: true
  },
  {
    id: 5,
    name: "Premium Headphones",
    price: 12499,
    image: "https://cdn.pixabay.com/photo/2018/09/17/14/27/headphones-3683983_640.jpg",
    category: "Audio",
  },
  {
    id: 6,
    name: "Wireless Earbuds Pro",
    price: 2499,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80",
    category: "Audio",
    isNew: true
  },
  {
    id: 7,
    name: "Noise Cancelling Headset",
    price: 9999,
    image: "https://cdn.pixabay.com/photo/2018/01/16/10/18/headphones-3085681_640.jpg",
    category: "Audio",
  },
  {
    id: 8,
    name: "Portable Charger",
    price: 899,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80",
    category: "Accessories",
    discount: 15
  },
  {
    id: 9,
    name: "Gaming Mouse",
    price: 3499,
    image: "https://images.unsplash.com/photo-1613141411244-0e4ac259d217?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80",
    category: "Gaming",
    isPopular: true
  },
  {
    id: 10,
    name: "Gaming Keyboard",
    price: 5899,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80",
    category: "Gaming",
    isNew: true
  },
  {
    id: 11,
    name: "Gaming PC",
    price: 59999,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80",
    category: "Gaming",
    featured: true
  },
  {
    id: 12,
    name: "Gaming Headset",
    price: 7549,
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80",
    category: "Gaming",
    discount: 10
  },
]

const categories = [
  { id: "audio", label: "Audio" },
  { id: "wearables", label: "Wearables" },
  { id: "accessories", label: "Accessories" },
  { id: "gaming", label: "Gaming" },
  { id: "smartphones", label: "Smartphones" },
  { id: "laptops", label: "Laptops" },
]

export default function ShopPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  // Set max price range based on most expensive product
  const maxPrice = Math.max(...products.map(product => product.price))
  const [priceRange, setPriceRange] = useState<number[]>([0, maxPrice])
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [isMounted, setIsMounted] = useState(false)
  
  // Client-side only code
  useEffect(() => {
    setIsMounted(true)
    // Initialize with all products
    applyFilters()
  }, [])

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  // Apply filters
  const applyFilters = () => {
    let filtered = [...products]
    
    // Filter by category if any selected
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category.toLowerCase())
      )
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    
    setFilteredProducts(filtered)
    
    // On mobile, close the filter panel after applying
    if (window.innerWidth < 768) {
      setShowFilters(false)
    }
  }

  // Reset filters
  const resetFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, maxPrice])
    setFilteredProducts(products)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  // Format price as Kenyan Shillings
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Shop</h1>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            variant="outline" 
            className="md:hidden flex items-center gap-2"
          >
            Filters
          </Button>
          <div className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Filters - Desktop (always visible) */}
        <div className="hidden md:block">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="font-medium mb-4">Categories</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`desktop-${category.id}`} 
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <Label 
                      htmlFor={`desktop-${category.id}`} 
                      className="cursor-pointer"
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Price Range</h3>
              <Slider 
                value={priceRange} 
                onValueChange={setPriceRange} 
                min={0} 
                max={maxPrice} 
                step={500} 
                className="mb-6"
              />
              <div className="flex justify-between mt-2">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button 
                onClick={applyFilters}
                className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-300"
              >
                Apply Filters
              </Button>
              <Button 
                onClick={resetFilters} 
                variant="outline" 
                className="w-full"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Filters - Mobile (toggleable) */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              className="fixed inset-0 bg-white z-50 p-6 overflow-auto md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Mobile close button */}
              <div className="flex justify-between items-center md:hidden">
                <h3 className="font-semibold">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowFilters(false)}
                  className="h-8 w-8"
                >
                  <X size={16} />
                </Button>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-medium mb-4">Categories</h3>
                <div className="space-y-3 grid grid-cols-2 md:grid-cols-1 gap-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={category.id} 
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <Label 
                        htmlFor={category.id} 
                        className="cursor-pointer"
                      >
                        {category.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-medium mb-4">Price Range</h3>
                <Slider 
                  value={priceRange} 
                  onValueChange={setPriceRange} 
                  min={0} 
                  max={maxPrice} 
                  step={500} 
                  className="mb-6"
                />
                <div className="flex justify-between mt-2">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </motion.div>

              <motion.div 
                className="flex flex-col space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  onClick={applyFilters}
                  className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-300"
                >
                  Apply Filters
                </Button>
                <Button 
                  onClick={resetFilters} 
                  variant="outline" 
                  className="w-full"
                >
                  Reset
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <div className="md:col-span-3">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-gray-500">No products match your filters</p>
                <Button 
                  onClick={resetFilters} 
                  variant="link" 
                  className="mt-2 text-orange-500"
                >
                  Reset filters
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
