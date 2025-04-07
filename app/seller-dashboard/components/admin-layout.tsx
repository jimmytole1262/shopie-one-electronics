"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import ProductForm from "../product-form"
import DashboardSidebar from "./dashboard-sidebar"

// Import content components
import OverviewContent from "./content/overview-content"
import ProductsContent from "./content/products-content"
import OrdersContent from "./content/orders-content"
import AnalyticsContent from "./content/analytics-content"
import AdminsContent from "./content/admins-content"
import SettingsContent from "./content/settings-content"

// Ensure TypeScript recognizes these imports
type ContentProps = {
  onEditProduct?: (product: any) => void;
}

export default function AdminLayout() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams ? searchParams.get('tab') : null
  
  const [activeTab, setActiveTab] = useState(tabParam || "overview")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isMounted, setIsMounted] = useState(false)
  
  // Handle client-side only rendering to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Update the URL when tab changes
  useEffect(() => {
    if (isMounted) {
      const url = new URL(window.location.href)
      url.searchParams.set('tab', activeTab)
      window.history.pushState({}, '', url)
    }
  }, [activeTab, isMounted])

  // Handle tab change from sidebar
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedProduct(null)
  }

  // Handle add product button click
  const handleAddProduct = () => {
    setIsFormOpen(true)
  }

  // If not mounted yet, render a loading spinner to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex justify-center items-center min-h-screen" suppressHydrationWarning={true}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" suppressHydrationWarning={true}></div>
      </div>
    )
  }

  // Render the appropriate content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewContent />
      case "products":
        return <ProductsContent onEditProduct={setSelectedProduct} />
      case "orders":
        return <OrdersContent />
      case "analytics":
        return <AnalyticsContent />
      case "admins":
        return <AdminsContent />
      case "settings":
        return <SettingsContent />
      default:
        return <OverviewContent />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        onAddProduct={handleAddProduct}
      />
      
      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold">Seller Dashboard</h2>
            <p className="text-muted-foreground">Manage your products and track your sales</p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <ProductForm 
                product={selectedProduct} 
                onSuccess={() => {
                  setIsFormOpen(false)
                  setSelectedProduct(null)
                }} 
                onCancel={handleFormClose} 
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Dynamic content area */}
        {renderContent()}
      </div>
    </div>
  )
}
