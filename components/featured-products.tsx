import ProductCard from "@/components/product-card"

// Static featured products with high-quality images
const featuredProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "Audio",
    featured: true,
    discount: 10,
  },
  {
    id: 2,
    name: "Wireless Earbuds Pro",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop",
    category: "Audio",
    featured: true,
    isNew: true,
  },
  {
    id: 3,
    name: "Noise Cancelling Gaming Headset",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1600086827875-a63b01f1335c?w=500&h=500&fit=crop",
    category: "Gaming",
    featured: true,
  },
]

export default function FeaturedProducts() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center mb-2">Featured Products</h2>
      <div className="flex justify-center mb-10">
        <div className="w-24 h-1 bg-orange-500 rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

