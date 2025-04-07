import HeroSection from "@/components/hero-section"
import PopularProducts from "@/components/popular-products"
import FeaturedProducts from "@/components/featured-products"
import NewsletterSection from "@/components/newsletter-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <PopularProducts />
      <FeaturedProducts />
      <NewsletterSection />
    </div>
  )
}
