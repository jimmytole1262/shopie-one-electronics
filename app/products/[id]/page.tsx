"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import { useState, useEffect } from "react"
import { useCart } from "@/hooks/useCart"
import { toast } from "sonner"
import { useUser, SignInButton } from "@clerk/nextjs"
import { useInventory, ProductInventory } from "@/hooks/useInventoryFixed"

// This would normally come from a database or API
const product = {
  id: 1,
  name: "Premium Wireless Headphones",
  price: 249.99,
  discount: 20,
  originalPrice: 299.99,
  description:
    "Experience crystal-clear sound with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions for extended listening sessions.",
  features: [
    "Active Noise Cancellation",
    "30-hour battery life",
    "Bluetooth 5.0 connectivity",
    "Built-in microphone for calls",
    "Foldable design for easy storage",
    "Premium sound quality with deep bass",
  ],
  specifications: {
    Brand: "QuickSound",
    Model: "QS-WH100",
    Color: "Matte Black",
    Connectivity: "Bluetooth 5.0, 3.5mm jack",
    "Battery Life": "Up to 30 hours",
    "Charging Time": "2 hours",
    Weight: "250g",
  },
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&h=600&fit=crop",
  ],
  category: "Audio",
  stock: 15,
  rating: 4.8,
  reviewCount: 124,
}

const relatedProducts = [
  {
    id: 2,
    name: "Wireless Earbuds Pro",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop",
    category: "Audio",
    isNew: true,
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=300&h=300&fit=crop",
    category: "Audio",
  },
  {
    id: 4,
    name: "Noise Cancelling Headset",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
    category: "Audio",
    discount: 10,
  },
]

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(product.images[0])
  const [quantity, setQuantity] = useState(1)
  const discountedPrice = product.price - product.price * (product.discount / 100)
  const { addItem } = useCart()
  const { isSignedIn, isLoaded } = useUser()
  const [isMounted, setIsMounted] = useState(false)
  const { getStock, updateStock, setInitialInventory } = useInventory()
  const [currentStock, setCurrentStock] = useState(product.stock)

  // Prevent hydration errors
  useEffect(() => {
    setIsMounted(true)
    
    // Initialize inventory if needed
    setInitialInventory([
      { id: product.id, stock: product.stock }
    ]);
    
    // Get current stock from inventory
    const stock = getStock(product.id);
    if (stock > 0) {
      setCurrentStock(stock);
    }
  }, [])

  const handleAddToCart = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to add items to your cart", {
        id: "auth-required",
        duration: 3000,
      })
      return
    }

    // Check if there's enough stock
    if (currentStock < quantity) {
      toast.error(`Sorry, only ${currentStock} items available in stock`, {
        id: `stock-error-${product.id}`,
        duration: 3000,
      });
      return;
    }

    // Add to cart
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      category: product.category
    })

    // Update inventory in the database
    updateStock(product.id, quantity)
      .then(success => {
        if (success) {
          toast.success(`${product.name} added to cart`, {
            id: `add-to-cart-${product.id}`,
            duration: 3000,
          })
          
          // Update the current stock display
          setCurrentStock(prev => prev - quantity);
        }
      })
      .catch(error => {
        console.error("Error updating stock:", error);
        toast.error("Failed to update inventory. Please try again.");
      });
  }

  const incrementQuantity = () => {
    if (quantity < currentStock) {
      setQuantity(prev => prev + 1)
    } else {
      toast.error(`Sorry, only ${currentStock} items available in stock`, {
        id: `stock-limit-${product.id}`,
        duration: 2000,
      });
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  // To prevent hydration errors
  if (!isMounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4">
              <div className="aspect-square relative rounded-lg overflow-hidden border">
                <Image src={selectedImage || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
            </div>
            {product.images.slice(0, 4).map((image, index) => (
              <div 
                key={index} 
                className={`aspect-square relative rounded-lg overflow-hidden border cursor-pointer ${selectedImage === image ? 'ring-2 ring-orange-500' : ''}`}
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2">
          <div className="mb-2">
            <Link href="/shop" className="text-sm text-orange-500 hover:underline">
              {product.category}
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount} reviews)
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">KSh {product.price.toFixed(2)}</div>
              {product.discount > 0 && (
                <>
                  <div className="text-lg text-muted-foreground line-through">KSh {product.originalPrice.toFixed(2)}</div>
                  <div className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                    {product.discount}% OFF
                  </div>
                </>
              )}
            </div>
            <div className="text-sm text-green-600 mt-1">
              {currentStock > 10 ? (
                <>In stock ({currentStock} available)</>
              ) : currentStock > 0 ? (
                <span className="text-amber-600">Low stock! Only {currentStock} left</span>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </div>
          </div>

          <div className="border-t border-b py-4 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="font-medium">Quantity:</div>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <div className="h-8 px-3 flex items-center justify-center border-y">{quantity}</div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                  onClick={incrementQuantity}
                  disabled={quantity >= currentStock}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {isSignedIn ? (
                <Button 
                  className="bg-orange-500 hover:bg-orange-600" 
                  onClick={handleAddToCart}
                  disabled={currentStock === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> 
                  {currentStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Sign in to Buy
                  </Button>
                </SignInButton>
              )}
              <Button variant="outline">
                <Heart className="mr-2 h-4 w-4" /> Add to Wishlist
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Description:</h2>
            <p className="text-slate-600">{product.description}</p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Key Features:</h2>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Product Description</h2>
          <div className="prose max-w-none">
            <p>
              Experience audio like never before with our Premium Wireless Headphones. Designed for audiophiles and
              casual listeners alike, these headphones deliver exceptional sound quality with deep, rich bass and
              crystal-clear highs.
            </p>
            <p>
              The active noise cancellation technology blocks out ambient noise, allowing you to immerse yourself fully
              in your music, podcasts, or calls. With a comfortable over-ear design and soft cushioning, you can enjoy
              hours of listening without discomfort.
            </p>
            <p>
              Featuring Bluetooth 5.0 connectivity, these headphones pair seamlessly with your devices and maintain a
              stable connection up to 33 feet away. The built-in microphone ensures clear voice capture for calls and
              virtual meetings.
            </p>
            <p>
              With up to 30 hours of battery life on a single charge, you can enjoy your audio content all day long. The
              quick-charge feature gives you 3 hours of playback with just 10 minutes of charging.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex border-b pb-2">
                <span className="font-medium w-1/3">{key}:</span>
                <span className="text-slate-600">{value}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="bg-white p-6 rounded-lg border">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-4xl font-bold">{product.rating}</div>
                <div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">Based on {product.reviewCount} reviews</div>
                </div>
              </div>
              <Button className="w-full">Write a Review</Button>
            </div>

            <div className="md:w-2/3">
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border-b pb-6">
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">John D.</div>
                      <div className="text-sm text-muted-foreground">3 days ago</div>
                    </div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`w-4 h-4 ${j < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <h3 className="font-medium mb-2">Excellent sound quality!</h3>
                    <p className="text-slate-600">
                      These headphones exceeded my expectations. The sound quality is amazing, and the noise
                      cancellation works perfectly. Very comfortable to wear for long periods too.
                    </p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Load More Reviews
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
