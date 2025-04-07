import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSection() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe now & get 20% off</h2>
        <p className="text-slate-600 mb-8">
          Stay updated with the latest electronics, exclusive deals, and tech news from Shopie-One Electronics.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input type="email" placeholder="Enter your email id" className="flex-1 h-12" />
          <Button className="h-12 px-8 bg-orange-500 hover:bg-orange-600">Subscribe</Button>
        </div>
      </div>
    </section>
  )
}

