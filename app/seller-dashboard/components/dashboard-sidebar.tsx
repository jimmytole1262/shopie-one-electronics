"use client"

import { useState, useEffect } from "react"
import { 
  BarChart, 
  Package, 
  ShoppingCart, 
  Settings, 
  ChevronRight,
  Home,
  LayoutDashboard,
  LogOut,
  User,
  Plus,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface NavItemProps {
  icon: React.ReactNode
  title: string
  tabId: string
  isActive: boolean
  isCollapsed: boolean
  onClick: (tabId: string) => void
}

const NavItem = ({ icon, title, tabId, isActive, isCollapsed, onClick }: NavItemProps) => (
  <div className="w-full">
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group"
      onClick={() => onClick(tabId)}
    >
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 px-2 transition-all duration-300 cursor-pointer",
          isActive ? "bg-orange-50 text-orange-600 hover:bg-orange-100 font-medium" : "hover:bg-gray-100"
        )}
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isActive ? 1.2 : 1 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="text-orange-500"
        >
          {icon}
        </motion.div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className={isActive ? "font-medium" : ""}
            >
              {title}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
      {/* Enhanced tooltip that appears on hover when sidebar is collapsed */}
      {isCollapsed && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap shadow-lg">
          {title}
        </div>
      )}
    </motion.div>
  </div>
)

export default function DashboardSidebar({ activeTab, onTabChange, onAddProduct }: { 
  activeTab: string, 
  onTabChange: (tabId: string) => void,
  onAddProduct: () => void
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  // Handle client-side only rendering to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // If not mounted yet, render a simple placeholder to avoid hydration mismatch
  if (!isMounted) {
    return <div className="h-screen bg-white border-r border-gray-200 flex flex-col w-64" suppressHydrationWarning={true} />
  }

  return (
    <motion.div 
      className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
      layout
      transition={{ duration: 0.3, ease: "easeInOut" }}
      suppressHydrationWarning={true}
    >
      {/* Logo and collapse button */}
      <div className="p-4 flex items-center justify-between border-b">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="expanded-logo"
            >
              <ShoppingCart className="h-6 w-6 text-orange-500 mr-2" />
              <span className="font-semibold text-lg">Shopie-one Electronics</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="collapsed-logo"
              className="mx-auto"
            >
              <ShoppingCart className="h-6 w-6 text-orange-500" />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </Button>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 flex flex-col gap-1 px-2">
        <NavItem
          icon={<LayoutDashboard className="h-5 w-5" />}
          title="Overview"
          tabId="overview"
          isActive={activeTab === "overview"}
          isCollapsed={isCollapsed}
          onClick={onTabChange}
        />
        <NavItem
          icon={<Package className="h-5 w-5" />}
          title="Products"
          tabId="products"
          isActive={activeTab === "products"}
          isCollapsed={isCollapsed}
          onClick={onTabChange}
        />
        <NavItem
          icon={<ShoppingCart className="h-5 w-5" />}
          title="Orders"
          tabId="orders"
          isActive={activeTab === "orders"}
          isCollapsed={isCollapsed}
          onClick={onTabChange}
        />
        <NavItem
          icon={<TrendingUp className="h-5 w-5" />}
          title="Analytics"
          tabId="analytics"
          isActive={activeTab === "analytics"}
          isCollapsed={isCollapsed}
          onClick={onTabChange}
        />
        
        {/* Add New Product Button */}
        <div className="px-2 py-2">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative group"
            onClick={onAddProduct}
          >
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start gap-2 border-orange-500 text-orange-500 hover:bg-orange-50",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Plus className="h-5 w-5" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Add New Product
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
            {isCollapsed && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap shadow-lg">
                Add New Product
              </div>
            )}
          </motion.div>
        </div>
        
        <NavItem
          icon={<User className="h-5 w-5" />}
          title="Admins"
          tabId="admins"
          isActive={activeTab === "admins"}
          isCollapsed={isCollapsed}
          onClick={onTabChange}
        />
        <NavItem
          icon={<Settings className="h-5 w-5" />}
          title="Settings"
          tabId="settings"
          isActive={activeTab === "settings"}
          isCollapsed={isCollapsed}
          onClick={onTabChange}
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <a href="/">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <motion.div
                whileHover={{ rotate: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Home className="h-5 w-5" />
              </motion.div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Back to Store
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </a>
      </div>
    </motion.div>
  )
}
