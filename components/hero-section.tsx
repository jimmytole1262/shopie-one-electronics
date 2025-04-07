"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

const slides = [
  {
    id: 1,
    title: "Premium Headphones for Immersive Sound",
    subtitle: "Experience crystal-clear audio with our noise-cancelling technology",
    offer: "Limited Time Offer 30% Off",
    cta: "Shop Now",
    ctaLink: "/shop",
    link: "View Collection",
    linkHref: "/shop",
    image: "/images/hero-headphones.jpg",
    bgColor: "bg-slate-100",
  },
  {
    id: 2,
    title: "Level Up Your Gaming Experience",
    subtitle: "From immersive sound to precise controls—everything you need to win",
    offer: "New Gaming Collection",
    cta: "Explore",
    ctaLink: "/shop",
    link: "Learn More",
    linkHref: "/shop",
    image: "/images/hero-gaming.jpg",
    bgColor: "bg-slate-100",
  },
  {
    id: 3,
    title: "Smart Home Devices for Modern Living",
    subtitle: "Transform your home with cutting-edge technology",
    offer: "Exclusive Online Deals",
    cta: "Shop now",
    ctaLink: "/shop",
    link: "View all",
    linkHref: "/shop",
    image: "/images/hero-smarthome.jpg",
    bgColor: "bg-slate-100",
  },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden">
      <div className={`${slides[currentSlide].bgColor} transition-colors duration-500`}>
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`container mx-auto px-4 py-16 md:py-24 ${index === currentSlide ? 'block' : 'hidden'}`}
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 max-w-xl">
                <p className="text-orange-500 font-medium mb-2">{slide.offer}</p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
                  {slide.title}
                </h1>
                <p className="text-slate-600 mb-6">{slide.subtitle}</p>
                <div className="flex flex-wrap gap-4">
                  <Link href={slide.ctaLink}>
                    <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                      {slide.cta}
                    </Button>
                  </Link>
                  {slide.link && (
                    <Link href={slide.linkHref}>
                      <Button variant="ghost" className="gap-2 text-slate-700">
                        {slide.link}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex-1 relative h-64 md:h-96 w-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${index === currentSlide ? "bg-orange-500" : "bg-slate-300"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  )
}
