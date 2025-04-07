import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">About Shopie-one Electronics</h1>
        <p className="text-lg text-muted-foreground">
          We're on a mission to make online shopping faster, easier, and more enjoyable.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="mb-4">
            Shopie-one Electronics was founded in 2020 with a simple idea: online shopping should be quick, convenient, and
            stress-free. What started as a small operation has grown into a trusted e-commerce platform serving
            thousands of customers.
          </p>
          <p>
            We partner with trusted brands and sellers to bring you quality products at competitive prices, all
            delivered right to your doorstep with our quick shipping options.
          </p>
        </div>
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
          <Image 
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
            alt="Shopie-one Electronics team" 
            fill 
            className="object-cover hover:scale-105 transition-transform duration-500" 
          />
        </div>
      </div>

      <div className="mb-16">
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg mb-8">
          <Image 
            src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
            alt="Our modern electronics store" 
            fill 
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Our Modern Facilities</h2>
              <p>State-of-the-art warehousing and quality control to ensure you get only the best products.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-slate-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-3">Our Mission</h3>
          <p>
            To create the most convenient and reliable online shopping experience, connecting customers with quality
            products they'll love.
          </p>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-3">Our Vision</h3>
          <p>
            To become the go-to e-commerce platform known for exceptional customer service, quality products, and
            innovative shopping solutions.
          </p>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-3">Our Values</h3>
          <p>
            Customer satisfaction, transparency, quality, innovation, and community are at the heart of everything we
            do.
          </p>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">Join Our Community</h2>
        <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
          Start Shopping
        </Button>
      </div>
    </div>
  )
}
