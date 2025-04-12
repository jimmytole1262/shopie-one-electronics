import Link from "next/link"
import { Search, ShoppingCart, Heart, Clock } from "lucide-react"
import SimpleCartButton from "./simple-cart-button"
import { AuthButtons } from "./auth-buttons"
import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { useWishlist } from "@/hooks/useWishlist"
import { useState, useEffect } from "react"
import ThemeToggle from "./theme-toggle"

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  // Check if the current user is the admin
  const { isSignedIn, user } = useUser();
  const isAdmin = isSignedIn && user?.primaryEmailAddress?.emailAddress === "jimmytole1262@gmail.com";
  const { totalItems } = useWishlist();
  const [isMounted, setIsMounted] = useState(false);

  // Client-side only code to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="border-b main-site-header">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-orange-500">S</span>
            <span className="text-xl font-semibold">hopie-one Electronics</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/shop" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Shop
          </Link>
          <Link
            href="/about-us"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Contact
          </Link>
          
          {/* Only show Seller Dashboard to admin */}
          {isAdmin && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-orange-500 font-semibold transition-colors hover:text-orange-600"
            >
              Seller Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <form action="/search" className="relative hidden md:flex items-center">
            <input 
              type="text" 
              name="q" 
              placeholder="Search products..." 
              className="pl-3 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-40 lg:w-64 transition-all duration-300"
            />
            <button type="submit" className="absolute right-2 inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 transition-colors duration-300">
              <Search className="h-4 w-4 text-gray-700 hover:text-orange-500 transition-colors duration-300" />
              <span className="sr-only">Search</span>
            </button>
          </form>
          <button onClick={() => window.location.href = '/search'} className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors duration-300">
            <Search className="h-5 w-5 text-gray-700 hover:text-orange-500 transition-colors duration-300" />
            <span className="sr-only">Search</span>
          </button>
          
          <ThemeToggle />
          
          <Link href="/order/track">
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors duration-300 group"
            >
              <Clock className="h-5 w-5 text-gray-700 hover:text-orange-500 transition-colors duration-300" />
              <span className="sr-only">Track Order</span>
              <span className="absolute -bottom-6 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">Track</span>
            </motion.div>
          </Link>
          
          <Link href="/wishlist">
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors duration-300"
            >
              <Heart className="h-5 w-5 text-gray-700 hover:text-orange-500 transition-colors duration-300" />
              <span className="sr-only">Wishlist</span>
              {isMounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full">
                  {totalItems}
                </span>
              )}
            </motion.div>
          </Link>
          
          <SimpleCartButton />
          <AuthButtons />
        </div>
        {children}
      </div>
    </header>
  )
}
